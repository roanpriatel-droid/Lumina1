import {ShieldCheck, Truck, RotateCcw} from 'lucide-react';
import type {OptimisticCartLineInput} from '@shopify/hydrogen';
import {AddToCartButton} from '~/components/AddToCartButton';
import {useAside} from '~/components/Aside';
import {usePurchase} from './PurchaseContext';

/**
 * In-flow primary CTA + summary, rendered between the steps and the
 * ingredient table. Uses the live Shopify variant from PurchaseContext —
 * one line per add, quantity 1, since each supply tier is its own variant.
 */
export function PurchaseCta() {
  const {tier, option, bundle, price, selectedVariant, oneTimeTotal} =
    usePurchase();
  const {open} = useAside();

  const optLabel = option === 'subscribe' ? 'Subscribe & Save' : 'One-Time';
  const showSubBadge = option === 'subscribe' && oneTimeTotal !== price;

  const lines: OptimisticCartLineInput[] = selectedVariant
    ? [
        {
          merchandiseId: selectedVariant.id,
          quantity: 1,
          selectedVariant,
          // TODO(selling-plan): once selling plans exist for the formulas,
          // attach `sellingPlanId` here for the subscribe-and-save line.
        },
      ]
    : [];

  const available = Boolean(selectedVariant?.availableForSale);

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
            {tier.preset.name} · {tier.preset.months}-month supply ·{' '}
            {tier.preset.bottles === 1
              ? '1 bottle'
              : `${tier.preset.bottles} bottles`}{' '}
            · {optLabel}
            {bundle.id !== 'solo' && ` · ${bundle.label}`}
          </p>
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
          disabled={!selectedVariant || !available}
          lines={lines}
          onClick={() => open('cart')}
          className="min-w-[220px] py-[18px] text-base"
        >
          {!selectedVariant
            ? 'Coming soon'
            : !available
              ? 'Sold out'
              : `Add to Cart — $${price}`}
        </AddToCartButton>
      </div>
    </section>
  );
}

const INLINE_BENEFITS = [
  {Icon: Truck, label: 'Ships Free'},
  {Icon: ShieldCheck, label: '3rd-Party Tested'},
  {Icon: RotateCcw, label: '60-Day Guarantee'},
] as const;
