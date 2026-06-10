import type {ProductFragment, ProductVariantFragment} from 'storefrontapi.generated';
import {
  LUMINA_TIER_PRESETS,
  type LuminaTierPreset,
} from './lumina-data';

/**
 * A tier card paired with the live Shopify variant that backs it.
 * `variant` is null when no variant for that supply length exists on the
 * product (e.g. the merchant hasn't created a 12-month SKU yet) — the UI
 * renders those cards in a disabled state with no price.
 */
export interface LuminaLiveTier {
  preset: LuminaTierPreset;
  variant: ProductVariantFragment | null;
}

const SUPPLY_OPTION_NAMES = ['supply', 'size', 'pack', 'bottles', 'subscription'];

/**
 * Parses any supply-like option value into a month count.
 * Accepts "1 month", "6-Month Supply", "12 months", "6mo", etc.
 */
export function parseSupplyMonths(value: string): number | null {
  const m = value.match(/(\d+)/);
  return m ? Number.parseInt(m[1], 10) : null;
}

/**
 * Finds the option on a product whose name looks like a supply selector.
 * Tolerant of casing and synonyms.
 */
function findSupplyOption(product: ProductFragment) {
  return product.options.find((o) =>
    SUPPLY_OPTION_NAMES.includes(o.name.toLowerCase()),
  );
}

/**
 * Maps each tier preset (Ignite → Legacy) to the Shopify variant whose
 * Supply option matches that preset's month count. Returns the full preset
 * ladder even when some variants are missing, so the UI can render the
 * full set with disabled states for unavailable supplies.
 */
export function pairVariantsToTiers(
  product: ProductFragment,
): LuminaLiveTier[] {
  const supply = findSupplyOption(product);
  const byMonths = new Map<number, ProductVariantFragment>();

  if (supply) {
    for (const value of supply.optionValues) {
      const months = parseSupplyMonths(value.name);
      if (months !== null && value.firstSelectableVariant) {
        byMonths.set(months, value.firstSelectableVariant);
      }
    }
  }

  return LUMINA_TIER_PRESETS.map((preset) => ({
    preset,
    variant: byMonths.get(preset.months) ?? null,
  }));
}

/**
 * Pick the initial selected tier id given the loaded variants and the
 * URL-resolved variant. Prefers the variant currently reflected in the
 * URL; falls back to Apex (the "best value" preset) if that variant has
 * a Shopify backing; otherwise picks the first preset that has one.
 */
export function pickInitialTierId(
  tiers: LuminaLiveTier[],
  selectedVariantId?: string,
): string {
  if (selectedVariantId) {
    const match = tiers.find((t) => t.variant?.id === selectedVariantId);
    if (match) return match.preset.id;
  }
  const apex = tiers.find((t) => t.preset.id === 'apex' && t.variant);
  if (apex) return apex.preset.id;
  const firstAvailable = tiers.find((t) => t.variant);
  return firstAvailable?.preset.id ?? tiers[0].preset.id;
}

const moneyToNumber = (amount: string): number => Number.parseFloat(amount);

/**
 * Compute the per-bottle price for a tier's variant, given the variant
 * holds the price for the FULL supply (e.g. the 6-month variant's price
 * is the total for 6 bottles).
 */
export function perBottlePrice(tier: LuminaLiveTier): number | null {
  if (!tier.variant?.price) return null;
  const total = moneyToNumber(tier.variant.price.amount);
  return total / tier.preset.bottles;
}

/**
 * Compute savings percent from compareAtPrice if available.
 * Returns 0 when there's no compare-at, when the comparison is missing,
 * or when the math doesn't reflect a positive saving.
 */
export function computeSavePct(tier: LuminaLiveTier): number {
  const v = tier.variant;
  if (!v?.compareAtPrice || !v.price) return 0;
  const price = moneyToNumber(v.price.amount);
  const compare = moneyToNumber(v.compareAtPrice.amount);
  if (compare <= price) return 0;
  return Math.round((1 - price / compare) * 100);
}
