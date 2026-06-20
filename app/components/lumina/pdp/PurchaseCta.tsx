import {ShieldCheck, Truck, RotateCcw} from 'lucide-react';
import type {OptimisticCartLineInput} from '@shopify/hydrogen';
import {AddToCartButton} from '~/components/AddToCartButton';
import {useAside} from '~/components/Aside';
import {GuaranteeBar} from '~/components/lumina/GuaranteeBar';
import {usePurchase} from './PurchaseContext';
import {money, computeSavings} from '~/lib/savings';

/**
 * In-flow primary CTA + summary, rendered between the tier ladder and
 * the deeper content sections. Pulls the live tier-selected variant +
 * computed savings from PurchaseContext.
 */
export function PurchaseCta() {
  const {
    selected,
    option,
    price,
    oneTimeTotal,
    baseline,
    subscribeSellingPlanId,
  } = usePurchase();
  const {open} = useAside();

  const breakdown = computeSavings(selected, baseline);
  const showSubBadge = option === 'subscribe' && oneTimeTotal !== price;
  const showSavings = breakdown.saved !== null && breakdown.saved > 0;

  // Subscribe lines attach the product's first selling-plan id so
  // Shopify applies the plan-level price adjustment + recurring
  // schedule. When no plan is configured we fall through to a
  // one-time line so checkout never bills against a missing plan.
  const lines: OptimisticCartLineInput[] = selected.variantId
    ? [
        {
          merchandiseId: selected.variantId,
          quantity: 1,
          ...(option === 'subscribe' && subscribeSellingPlanId
            ? {sellingPlanId: subscribeSellingPlanId}
            : {}),
        },
      ]
    : [];

  const cta = !selected.variantId
    ? 'Coming soon'
    : !selected.availableForSale
      ? 'Sold out'
      : `Add ${selected.months === 1 ? '1-Month' : `${selected.months}-Month`} Supply — $${price}`;

  return (
    <section className="mx-auto max-w-[1200px] px-6 pb-16 md:px-8">
      <div
        className="grid items-center gap-8 rounded-xl border border-border bg-surface px-7 py-7 md:grid-cols-[1fr_auto]"
        style={{boxShadow: 'var(--shadow-md)'}}
      >
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-baseline gap-3">
            <span
              className="text-fg1"
              style={{font: '300 36px/1 var(--font-sans)'}}
            >
              ${price}
            </span>
            {showSubBadge && (
              <span className="text-fg4 line-through">${oneTimeTotal}</span>
            )}
            {option === 'subscribe' && (
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-crimson-hi">
                15% off applied
              </span>
            )}
          </div>
          <p className="text-sm leading-snug text-fg3">
            {selected.months === 1
              ? '1-month supply'
              : `${selected.months}-month supply`}{' '}
            · {selected.bottles}{' '}
            {selected.bottles === 1 ? 'bottle' : 'bottles'} ·{' '}
            {option === 'subscribe' ? 'Subscribe & Save' : 'One-Time'}
          </p>
          {showSavings && (
            <p className="text-[13px] font-medium text-crimson-hi">
              You save {money(breakdown.saved as number)} vs the 1-month price
              ({breakdown.savedPct}% off).
            </p>
          )}
          <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2">
            {INLINE_BENEFITS.map(({Icon, label}) => (
              <span
                key={label}
                className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.1em] text-fg3"
              >
                <Icon size={14} strokeWidth={2} className="text-crimson" />
                {label}
              </span>
            ))}
          </div>
        </div>
        <AddToCartButton
          disabled={!selected.variantId || !selected.availableForSale}
          lines={lines}
          onClick={() => open('cart')}
          className="min-w-[260px] py-[18px] text-base"
        >
          {cta}
        </AddToCartButton>
      </div>
      <div className="mt-5">
        <GuaranteeBar />
      </div>
    </section>
  );
}

const INLINE_BENEFITS = [
  {Icon: Truck, label: 'Ships Free on Subscriptions'},
  {Icon: ShieldCheck, label: '3rd-Party Tested'},
  {Icon: RotateCcw, label: '60-Day Guarantee'},
] as const;
