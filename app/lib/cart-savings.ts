import {
  computeSavings,
  toEntry,
  type LuminaProductEntry,
} from './savings';
import type {LuminaProductEntry as Entry} from './savings';

/**
 * Compute the per-line savings for a cart line item, against the
 * already-loaded Lumina catalog snapshot. Returns null when the line's
 * product isn't a recognized Lumina formula, when no baseline can be
 * resolved for its gender, or when the math nets out to zero.
 */
export function lineSavings({
  productHandle,
  productTitle,
  lineQuantity,
  lineTotalDollars,
  catalog,
}: {
  productHandle: string;
  productTitle: string;
  lineQuantity: number;
  lineTotalDollars: number;
  catalog: ReadonlyArray<Entry>;
}): number | null {
  const entry = catalog.find((e) => e.handle === productHandle);
  let projected: LuminaProductEntry;
  if (entry) {
    projected = entry;
  } else {
    projected = toEntry({
      handle: productHandle,
      title: productTitle,
      price: lineTotalDollars / Math.max(1, lineQuantity),
      compareAtPrice: null,
      variantId: null,
      availableForSale: true,
      imageUrl: null,
      imageAlt: null,
    });
  }
  if (!projected.gender) return null;
  const baseline = catalog.find(
    (e) => e.gender === projected.gender && e.months === 1,
  );
  if (!baseline) return null;
  const breakdown = computeSavings(projected, baseline);
  const perUnit = breakdown.saved ?? 0;
  if (perUnit <= 0) return null;
  return perUnit * lineQuantity;
}
