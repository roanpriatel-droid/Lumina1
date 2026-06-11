import {useEffect, useState} from 'react';
import type {OptimisticCartLineInput} from '@shopify/hydrogen';
import {AddToCartButton} from '~/components/AddToCartButton';
import {useAside} from '~/components/Aside';
import {usePurchase} from './PurchaseContext';
import {money} from '~/lib/savings';

/**
 * Bottom-fixed Add to Cart bar that appears after the user scrolls past
 * the hero and hides as they reach the footer. Reads the live tier
 * selection + savings breakdown from PurchaseContext.
 */
export function StickyAddToCart({productName}: {productName: string}) {
  const {selected, option, price, breakdown} = usePurchase();
  const {open} = useAside();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const nearBottom =
        window.innerHeight + y > document.body.scrollHeight - 560;
      setVisible(y > 420 && !nearBottom);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, {passive: true});
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const optLabel = option === 'subscribe' ? 'Subscribe & Save' : 'One-Time';
  const supply =
    selected.months === 1 ? '1-month' : `${selected.months}-month`;
  const detail = `${supply} · ${optLabel}`;
  const savings =
    breakdown.saved && breakdown.saved > 0
      ? `Saving ${money(breakdown.saved)}`
      : null;

  const lines: OptimisticCartLineInput[] = selected.variantId
    ? [
        {
          merchandiseId: selected.variantId,
          quantity: 1,
          // TODO(selling-plan): sellingPlanId on subscribe lines.
        },
      ]
    : [];

  const available = Boolean(selected.variantId && selected.availableForSale);

  const cta = !selected.variantId
    ? 'Coming soon'
    : !selected.availableForSale
      ? 'Sold out'
      : `Add ${selected.months === 1 ? '1-Month' : `${selected.months}-Month`} — $${price}`;

  return (
    <div
      className="glow-frame-edge-top fixed inset-x-0 bottom-0 z-30 border-t border-border transition-transform duration-[320ms] ease-[cubic-bezier(.4,0,.2,1)]"
      style={{
        background: 'rgba(11,11,12,0.9)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        transform: visible ? 'translateY(0)' : 'translateY(110%)',
        pointerEvents: visible ? 'auto' : 'none',
      }}
      aria-hidden={!visible}
    >
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-4 px-6 py-3.5 md:flex-nowrap md:gap-6 md:px-8">
        <div className="flex min-w-0 flex-col gap-1">
          <span className="truncate text-[15px] font-medium leading-tight text-fg1">
            {productName}
            <sup className="text-[9px] text-fg3">™</sup>
          </span>
          <span className="truncate text-xs leading-none text-fg3">
            {detail}
            {savings && (
              <span className="ml-2 text-crimson-hi">· {savings}</span>
            )}
          </span>
        </div>
        <div className="ml-auto flex items-center gap-4 md:gap-5">
          <span
            className="text-fg1"
            style={{font: '300 24px/1 var(--font-sans)'}}
          >
            ${price}
          </span>
          <AddToCartButton
            disabled={!available}
            lines={lines}
            onClick={() => open('cart')}
            className="min-w-[200px]"
          >
            {cta}
          </AddToCartButton>
        </div>
      </div>
    </div>
  );
}
