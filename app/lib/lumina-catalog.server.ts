import type {Storefront} from '@shopify/hydrogen';
import {toEntry, type LuminaProductEntry} from './savings';

/**
 * Fetches every Lumina product from the storefront in one query and
 * projects them into LuminaProductEntry rows for the savings engine.
 *
 * The query intentionally pulls a wide window (50 products) and filters
 * client-side to titles starting with "Lumina " — this keeps us robust
 * to messy handles set in admin (e.g. "alpha-energy", "life-changing-...").
 *
 * Cache: CacheLong (storefront-side) so a hot path PDP isn't hammering
 * the storefront API on every navigation. When admin changes prices,
 * the cache flushes on the next miss; on the rare occasion a stale price
 * is shown for a few seconds, the savings engine will still reconcile
 * because it derives everything off the same single API snapshot.
 */
export async function loadLuminaCatalog(
  storefront: Storefront,
): Promise<LuminaProductEntry[]> {
  const {products} = await storefront.query(LUMINA_CATALOG_QUERY, {
    cache: storefront.CacheShort(),
  });

  const nodes = products?.nodes ?? [];
  const entries: LuminaProductEntry[] = [];
  for (const p of nodes) {
    if (!p?.title?.toLowerCase().startsWith('lumina')) continue;
    const variant = p.variants?.nodes?.[0];
    if (!variant) continue;
    entries.push(
      toEntry({
        handle: p.handle,
        title: p.title,
        price: Number.parseFloat(variant.price.amount),
        compareAtPrice: variant.compareAtPrice
          ? Number.parseFloat(variant.compareAtPrice.amount)
          : null,
        variantId: variant.id,
        availableForSale: Boolean(variant.availableForSale),
        imageUrl:
          variant.image?.url ??
          p.featuredImage?.url ??
          null,
        imageAlt:
          variant.image?.altText ??
          p.featuredImage?.altText ??
          p.title,
      }),
    );
  }
  return entries;
}

/* Storefront query: pull title, handle, featured image, primary variant. */
const LUMINA_CATALOG_QUERY = `#graphql
  query LuminaCatalog($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    products(first: 50, sortKey: TITLE) {
      nodes {
        id
        handle
        title
        featuredImage { url altText width height }
        variants(first: 1) {
          nodes {
            id
            availableForSale
            price { amount currencyCode }
            compareAtPrice { amount currencyCode }
            image { url altText width height }
          }
        }
      }
    }
  }
` as const;
