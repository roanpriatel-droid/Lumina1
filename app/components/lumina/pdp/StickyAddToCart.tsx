import {useEffect, useState} from 'react';
import type {OptimisticCartLineInput} from '@shopify/hydrogen';
import {AddToCartButton} from '~/components/AddToCartButton';
import {useAside} from '~/components/Aside';
import {usePurchase} from './PurchaseContext';

interface StickyAddToCartProps {
  productName: string;
}

/**
 * Bottom-fixed add-to-cart bar that appears after the user scrolls past the
 * hero and hides as they reach the footer. Reads the live tier + variant
 * from PurchaseContext — one line, quantity 1, since each supply tier is
 * its own Shopify variant.
 */
export function StickyAddToCart({productName}: StickyAddToCartProps) {
  const {tier, option, bundle, price, selectedVariant} = usePurchase();
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
  const detail = `${tier.preset.name} · ${tier.preset.months}-month · ${optLabel}${
    bundle.id !== 'solo' ? ' · ' + bundle.label : ''
  }`;

  const lines: OptimisticCartLineInput[] = selectedVariant
    ? [
        {
          merchandiseId: selectedVariant.id,
          quantity: 1,
          selectedVariant,
          // TODO(selling-plan): attach `sellingPlanId` here once subs are
          // configured in Shopify Admin.
        },
      ]
    : [];

  const available = Boolean(selectedVariant?.availableForSale);

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border transition-transform duration-[320ms] ease-[cubic-bezier(.4,0,.2,1)]"
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
          </span>
        </div>
        <div className="ml-auto flex items-center gap-4 md:gap-5">
          {option === 'subscribe' && (
            <span className="hidden text-xs font-medium uppercase tracking-[0.1em] text-crimson-hi sm:inline">
              15% off applied
            </span>
          )}
          <span
            className="text-fg1"
            style={{font: '300 24px/1 var(--font-sans)'}}
          >
            ${price}
          </span>
          <AddToCartButton
            disabled={!selectedVariant || !available}
            lines={lines}
            onClick={() => open('cart')}
            className="min-w-[180px]"
          >
            {!selectedVariant
              ? 'Coming soon'
              : !available
                ? 'Sold out'
                : `Add to Cart — $${price}`}
          </AddToCartButton>
        </div>
      </div>
    </div>
  );
}
