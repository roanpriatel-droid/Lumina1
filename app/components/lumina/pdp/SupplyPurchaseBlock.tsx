import {ShieldCheck, Truck, RotateCcw} from 'lucide-react';
import type {OptimisticCartLineInput} from '@shopify/hydrogen';
import {AddToCartButton} from '~/components/AddToCartButton';
import {useAside} from '~/components/Aside';
import {Eyebrow} from '~/components/lumina/Eyebrow';
import {GuaranteeBar} from '~/components/lumina/GuaranteeBar';
import {SavingsBreakdown} from '~/components/lumina/SavingsBreakdown';
import {usePurchase} from './PurchaseContext';
import {money} from '~/lib/savings';

/**
 * Multi-month PDP price block — pairs the SavingsBreakdown card with a
 * single, specific Add to Cart. Used in place of PurchaseSteps/PurchaseCta
 * on /products/<2/4/6/12-month> routes, where the tier choice has already
 * been made by URL — the user picked the supply by landing here, and we
 * surface the math instead of forcing another selector.
 */
export function SupplyPurchaseBlock() {
  const {
    selected,
    breakdown,
    price,
    oneTimeTotal,
    option,
    setOption,
    subscribeSellingPlanId,
  } = usePurchase();
  const {open} = useAside();

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
      : `Add ${selected.months}-Month Supply — $${price}`;

  return (
    <section className="mx-auto max-w-[1200px] px-6 pb-16 md:px-8">
      <div className="grid gap-6 md:grid-cols-[1.15fr_0.85fr] md:items-start">
        <div className="flex flex-col gap-6 rounded-xl border border-border bg-surface px-7 py-7 md:px-8 md:py-8">
          <div>
            <Eyebrow>The protocol you&rsquo;re building</Eyebrow>
            <h2
              className="m-0 mt-3 text-fg1"
              style={{
                font: '300 30px/1.15 var(--font-sans)',
                letterSpacing: '-0.01em',
              }}
            >
              {selected.months}-month supply ·{' '}
              <span className="text-fg2">{selected.bottles} bottles</span>
            </h2>
            <p
              className="m-0 mt-3 max-w-[460px] text-fg3"
              style={{font: '300 16px/1.65 var(--font-sans)'}}
            >
              One delivery, the full run of the formula. Designed for the
              8–12 week assessment window the actives are studied across.
            </p>
          </div>

          <div className="flex flex-col gap-3 rounded-md border border-border bg-black px-5 py-4">
            <Toggle
              left={{
                key: 'subscribe',
                title: 'Subscribe & Save',
                meta: '15% off · free shipping · cancel anytime',
                price: price,
                old: oneTimeTotal !== price ? oneTimeTotal : undefined,
              }}
              right={{
                key: 'onetime',
                title: 'One-Time',
                meta: 'Single purchase · ships once',
                price: oneTimeTotal,
              }}
              value={option}
              onChange={setOption}
            />
            <p className="t-mono text-[10.5px] uppercase tracking-[0.12em] text-fg4">
              * Subscribe &amp; Save price is finalised by Shopify once the
              line lands in the cart, using the selling plan attached in
              admin.
            </p>
          </div>

          <AddToCartButton
            disabled={!selected.variantId || !selected.availableForSale}
            lines={lines}
            onClick={() => open('cart')}
            fullWidth
            className="py-[18px] text-base"
          >
            {cta}
          </AddToCartButton>

          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {INLINE_BENEFITS.map(({Icon, label}) => (
              <li
                key={label}
                className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.1em] text-fg3"
              >
                <Icon size={14} strokeWidth={2} className="text-crimson" />
                {label}
              </li>
            ))}
          </ul>

          <GuaranteeBar />
        </div>

        <SavingsBreakdown breakdown={breakdown} />
      </div>

      {breakdown.saved !== null && breakdown.saved > 0 && (
        <p className="t-mono mt-5 text-center text-[12px] uppercase tracking-[0.14em] text-crimson-hi">
          Saving {money(breakdown.saved)} on this supply vs the 1-month
          baseline.
        </p>
      )}
    </section>
  );
}

function Toggle({
  left,
  right,
  value,
  onChange,
}: {
  left: {key: 'subscribe' | 'onetime'; title: string; meta: string; price: number; old?: number};
  right: {key: 'subscribe' | 'onetime'; title: string; meta: string; price: number; old?: number};
  value: 'subscribe' | 'onetime';
  onChange: (v: 'subscribe' | 'onetime') => void;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {[left, right].map((opt) => {
        const isSelected = value === opt.key;
        return (
          <button
            key={opt.key}
            type="button"
            onClick={() => onChange(opt.key)}
            aria-pressed={isSelected}
            className="relative flex flex-col gap-2 rounded-md bg-surface px-4 py-3 text-left transition-[border-color,box-shadow] duration-150"
            style={{
              border: `1px solid ${isSelected ? 'var(--color-crimson)' : 'var(--color-border)'}`,
              boxShadow: isSelected ? '0 0 0 1px var(--color-crimson)' : 'none',
            }}
          >
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-[14px] font-medium text-fg1">
                {opt.title}
              </span>
              <span className="flex items-baseline gap-1.5 text-[14px] font-medium text-fg1">
                {opt.old && opt.old !== opt.price && (
                  <span className="text-fg4 line-through font-normal">
                    ${opt.old}
                  </span>
                )}
                ${opt.price}
              </span>
            </div>
            <span className="text-[11.5px] text-fg3">{opt.meta}</span>
          </button>
        );
      })}
    </div>
  );
}

const INLINE_BENEFITS = [
  {Icon: Truck, label: 'Ships Free on Subscriptions'},
  {Icon: ShieldCheck, label: '3rd-Party Tested'},
  {Icon: RotateCcw, label: '60-Day Guarantee'},
] as const;
