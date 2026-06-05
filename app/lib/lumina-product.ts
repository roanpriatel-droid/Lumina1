import {LUMINA_PRODUCTS, type LuminaProduct} from './lumina-data';

/**
 * Map a Shopify product handle to its Lumina placeholder copy + actives.
 * Returns undefined when the handle isn't one of our two hero formulas —
 * routes can fall back to a generic PDP layout in that case.
 *
 * TODO(shopify-wiring): replace this lookup with a real source — e.g. a
 * `product.metafield(namespace: "lumina", key: "actives")` query — so that
 * the ingredient table comes from Shopify, not this file.
 */
export function getLuminaProductByHandle(
  handle: string | undefined,
): LuminaProduct | undefined {
  if (!handle) return undefined;
  for (const p of Object.values(LUMINA_PRODUCTS)) {
    if (p.handle === handle) return p;
  }
  // Loose matching for the demo: anything containing "female" → female,
  // anything containing "male" → male. Lets unrelated placeholder products
  // in the connected dev store still render with Lumina chrome.
  const lower = handle.toLowerCase();
  if (lower.includes('female')) return LUMINA_PRODUCTS.female;
  if (lower.includes('male')) return LUMINA_PRODUCTS.male;
  return undefined;
}
