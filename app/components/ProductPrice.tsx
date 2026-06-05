import {Money} from '@shopify/hydrogen';
import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';

export function ProductPrice({
  price,
  compareAtPrice,
  compact = false,
  className = '',
}: {
  price?: MoneyV2;
  compareAtPrice?: MoneyV2 | null;
  /** Smaller, single-line style for inline use (cart line items, etc). */
  compact?: boolean;
  className?: string;
}) {
  const sizeClass = compact
    ? 'text-sm font-medium text-fg1'
    : 'text-3xl font-light text-fg1 tracking-tight';

  return (
    <div
      aria-label="Price"
      className={`${sizeClass} ${className}`}
      role="group"
    >
      {compareAtPrice ? (
        <span className="flex items-baseline gap-2">
          {price ? <Money data={price} /> : null}
          <s className="text-fg4 text-base font-normal">
            <Money data={compareAtPrice} />
          </s>
        </span>
      ) : price ? (
        <Money data={price} />
      ) : (
        <span>&nbsp;</span>
      )}
    </div>
  );
}
