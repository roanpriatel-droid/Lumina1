import {ShieldCheck, Truck, RotateCcw} from 'lucide-react';
import type {OptimisticCartLineInput} from '@shopify/hydrogen';
import type {ProductFragment} from 'storefrontapi.generated';
import {AddToCartButton} from '~/components/AddToCartButton';
import {useAside} from '~/components/Aside';
import {usePurchase} from './PurchaseContext';

interface PurchaseCtaProps {
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
}

/** In-flow primary CTA + summary, rendered between the steps and the
 *  ingredient table. Mirrors the sticky bar but stays anchored. */
export function PurchaseCta({selectedVariant}: PurchaseCtaProps) {
  const {tier, option, bundle, price, subTotal, oneTimeTotal} = usePurchase();
  const {open} = useAside();

  const optLabel = option === 'subscribe' ? 'Subscribe & Save' : 'One-Time';

  const lines: OptimisticCartLineInput[] = selectedVariant
    ? [
        {
          merchandiseId: selectedVariant.id,
          quantity: tier.bottles,
          selectedVariant,
        },
      ]
    : [];

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
            {option === 'subscribe' && (
              <span className="text-fg4 line-through">${oneTimeTotal}</span>
            )}
            {option === 'subscribe' && (
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-crimson-hi">
                15% off applied
              </span>
            )}
          </div>
          <p className="text-sm leading-snug text-fg3">
            {tier.name} · {tier.months}-month supply ·{' '}
            {tier.bottles === 1 ? '1 bottle' : `${tier.bottles} bottles`} · {optLabel}
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
          disabled={!selectedVariant || !selectedVariant.availableForSale}
          lines={lines}
          onClick={() => open('cart')}
          className="min-w-[220px] py-[18px] text-base"
        >
          {selectedVariant?.availableForSale
            ? `Add to Cart — $${price}`
            : 'Sold out'}
        </AddToCartButton>
      </div>
      <p className="t-mono mt-3 text-[11px] text-fg4">
        * Placeholder pricing. Real Shopify totals replace this once selling
        plans land — see TODO markers in lumina-data.ts.
      </p>
    </section>
  );
}

const INLINE_BENEFITS = [
  {Icon: Truck, label: 'Ships Free'},
  {Icon: ShieldCheck, label: '3rd-Party Tested'},
  {Icon: RotateCcw, label: '60-Day Guarantee'},
] as const;
