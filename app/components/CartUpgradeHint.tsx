import {CartForm, type OptimisticCart} from '@shopify/hydrogen';
import {ArrowUpRight, TrendingUp} from 'lucide-react';
import {useRouteLoaderData} from 'react-router';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {RootLoader} from '~/root';
import {
  computeSavings,
  findBaseline,
  money,
  parseGenderFromTitle,
  parseMonthsFromTitle,
} from '~/lib/savings';

/**
 * Quiet one-click upgrade row shown in the cart drawer when any line in
 * the cart is a 1-month or 2-month Lumina supply. Suggests stepping up
 * to the 6-month tier for the same gender, with the exact additional
 * dollars saved.
 *
 * Submitting the form swaps the smaller line for the 6-month variant
 * (LinesUpdate). When more than one upgradeable line exists, we surface
 * the first; the user can repeat by re-opening the drawer.
 */
export function CartUpgradeHint({
  cart,
}: {
  cart: OptimisticCart<CartApiQueryFragment | null>;
}) {
  const root = useRouteLoaderData<RootLoader>('root');
  const catalog = root?.luminaCatalog ?? [];
  if (!cart?.lines?.nodes?.length) return null;

  // Find the first upgradeable line.
  for (const node of cart.lines.nodes) {
    const handle = node.merchandise?.product?.handle;
    const title = node.merchandise?.product?.title ?? '';
    if (!handle) continue;
    const months = parseMonthsFromTitle(title);
    const gender = parseGenderFromTitle(title);
    if (!gender || months >= 6) continue;

    const six = catalog.find(
      (e) => e.gender === gender && e.months === 6 && e.variantId,
    );
    if (!six) continue;
    const baseline = findBaseline(catalog, gender);
    if (!baseline) continue;

    const current = catalog.find((e) => e.handle === handle);
    const currentBreakdown = current
      ? computeSavings(current, baseline)
      : null;
    const sixBreakdown = computeSavings(six, baseline);
    const extraSaved =
      (sixBreakdown.saved ?? 0) - (currentBreakdown?.saved ?? 0);

    if (extraSaved <= 0) continue;

    return (
      <CartForm
        route="/cart"
        action={CartForm.ACTIONS.LinesUpdate}
        inputs={{
          lines: [
            {
              id: node.id,
              merchandiseId: six.variantId as string,
              quantity: 1,
            },
          ],
        }}
      >
        <div
          className="mx-6 my-4 rounded-lg border border-crimson bg-black px-4 py-3.5"
          style={{boxShadow: 'var(--shadow-accent)'}}
          role="status"
          aria-label="Upgrade suggestion"
        >
          <div className="mb-3 flex items-start gap-3">
            <TrendingUp
              size={16}
              strokeWidth={2}
              className="mt-0.5 flex-none text-crimson-hi"
            />
            <div>
              <p className="m-0 text-[13px] font-medium leading-tight text-fg1">
                Switch to 6-month — save {money(extraSaved)} more.
              </p>
              <p className="m-0 mt-1 text-[12px] leading-snug text-fg3">
                One delivery, the full assessment window, lower per-bottle.
              </p>
            </div>
          </div>
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-pill border border-crimson bg-black px-4 py-2.5 text-[12px] font-medium uppercase tracking-[0.1em] text-crimson-hi transition-colors hover:bg-surface"
          >
            Upgrade this line
            <ArrowUpRight size={13} strokeWidth={2.2} />
          </button>
        </div>
      </CartForm>
    );
  }

  return null;
}
