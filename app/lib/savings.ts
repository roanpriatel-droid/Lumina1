/**
 * SAVINGS ENGINE
 *
 * The single source of truth for all per-bottle, savings, and cost-per-day
 * calculations across the storefront. Every UI surface that displays
 * pricing math (catalog cards, PDP price block, savings ladder, cart line
 * items, cart summary) MUST consume these helpers — never hard-code or
 * re-derive numbers locally, because admin pricing changes would silently
 * drift the UI off the source of truth.
 *
 * The engine is pure: it doesn't fetch. The route loader is responsible
 * for pulling Lumina products from the storefront, and passes the entries
 * into these functions. If a baseline can't be resolved, every helper
 * returns null/undefined so the UI can gracefully omit savings rather than
 * print wrong math.
 */

export type Gender = 'male' | 'female';

export interface LuminaProductEntry {
  /** Live Shopify product handle. */
  handle: string;
  /** Title as set in Shopify admin (e.g. "Lumina Male Enhancement™ — 6-Month Supply"). */
  title: string;
  /** Parsed gender from the title — null if not a Lumina formula. */
  gender: Gender | null;
  /** Parsed months of supply from the title. The bare hero product
   *  ("Lumina Male Enhancement™") is treated as 1-month. */
  months: number;
  /** Number of bottles in this supply — currently equals months (1/mo). */
  bottles: number;
  /** Live total price for this product (dollars, with cents). */
  price: number;
  /** Live compare-at price, when set in admin. */
  compareAtPrice: number | null;
  /** Primary salable variant id, used for AddToCart lines. */
  variantId: string | null;
  /** Whether the variant is available for sale right now. */
  availableForSale: boolean;
  /** First subscription selling-plan id on the product, when one is
   *  configured in Shopify Admin. Attached to cart lines when the
   *  customer picks Subscribe & Save so Shopify can apply the
   *  selling-plan price adjustment + recurring schedule. Null when no
   *  selling plan is configured. */
  sellingPlanId: string | null;
  /** featuredImage url for cards / pdp gallery. */
  imageUrl: string | null;
  imageAlt: string | null;
}

/* ───────────────────────── parsing ───────────────────────── */

/**
 * Pulls a month count from a Lumina product title. Returns 1 when the
 * title contains "Lumina (Male|Female) Enhancement" with no supply
 * qualifier (the hero/baseline product).
 */
export function parseMonthsFromTitle(title: string): number {
  const m = title.match(/(\d+)[\s-]?[Mm]onth/);
  if (m) return Number.parseInt(m[1], 10);
  return 1;
}

/** Detect male/female from the product title. */
export function parseGenderFromTitle(title: string): Gender | null {
  const lower = title.toLowerCase();
  if (lower.includes('female enhancement')) return 'female';
  if (lower.includes('male enhancement')) return 'male';
  return null;
}

/* ───────────────────────── lookups ───────────────────────── */

/** Find the 1-month baseline product for a gender. */
export function findBaseline(
  entries: ReadonlyArray<LuminaProductEntry>,
  gender: Gender,
): LuminaProductEntry | null {
  return (
    entries.find((e) => e.gender === gender && e.months === 1) ?? null
  );
}

/** All entries for a gender, sorted ascending by months. */
export function entriesForGender(
  entries: ReadonlyArray<LuminaProductEntry>,
  gender: Gender,
): LuminaProductEntry[] {
  return entries
    .filter((e) => e.gender === gender)
    .sort((a, b) => a.months - b.months);
}

/**
 * Cheapest per-bottle price across a slice of entries. Drives "From $X
 * a bottle" copy on cards / cross-sells / page CTAs. Returns null for
 * an empty slice so the UI omits the price line rather than printing
 * "From $0" or anything similarly broken.
 */
export function lowestPerBottlePrice(
  entries: ReadonlyArray<LuminaProductEntry>,
): number | null {
  if (entries.length === 0) return null;
  let lowest = Infinity;
  for (const e of entries) {
    if (e.bottles < 1) continue;
    const perBottle = e.price / e.bottles;
    if (perBottle < lowest) lowest = perBottle;
  }
  return Number.isFinite(lowest) ? Math.round(lowest) : null;
}

/* ───────────────────────── math ───────────────────────── */

export interface SavingsBreakdown {
  /** months of supply for the product. */
  months: number;
  /** bottles in the supply. */
  bottles: number;
  /** Total price for the product (dollars). */
  total: number;
  /** Per-bottle price (dollars, possibly fractional). */
  perBottle: number;
  /** Per-day price assuming 30-day months (dollars). */
  perDay: number;
  /** Baseline 1-month price (dollars). Null when no baseline available. */
  baselinePerBottle: number | null;
  /** What this customer would have paid buying the same supply at the
   *  baseline 1-month price, in dollars. */
  baselineCost: number | null;
  /** Total dollars saved versus the baseline. Null when no baseline; 0
   *  when this is the baseline itself or savings would be negative. */
  saved: number | null;
  /** Percent saved versus baseline, rounded. Null when no baseline. */
  savedPct: number | null;
}

/**
 * Build a SavingsBreakdown for one product against an explicit baseline.
 * Pass `baseline` as null to get a breakdown with the savings fields
 * omitted (used for the 1-month hero itself, where there's nothing to
 * compare against).
 */
export function computeSavings(
  product: LuminaProductEntry,
  baseline: LuminaProductEntry | null,
): SavingsBreakdown {
  const months = Math.max(1, product.months);
  const bottles = Math.max(1, product.bottles);
  const total = product.price;
  const perBottle = total / bottles;
  const perDay = total / (months * 30);

  let baselinePerBottle: number | null = null;
  let baselineCost: number | null = null;
  let saved: number | null = null;
  let savedPct: number | null = null;

  if (baseline && baseline.handle !== product.handle) {
    baselinePerBottle = baseline.price / Math.max(1, baseline.bottles);
    baselineCost = baselinePerBottle * bottles;
    const diff = baselineCost - total;
    if (diff > 0) {
      saved = diff;
      savedPct = Math.round((diff / baselineCost) * 100);
    } else {
      saved = 0;
      savedPct = 0;
    }
  }

  return {
    months,
    bottles,
    total,
    perBottle,
    perDay,
    baselinePerBottle,
    baselineCost,
    saved,
    savedPct,
  };
}

/* ───────────────────────── formatting ───────────────────────── */

const USD = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const USDc = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Whole-dollar formatter, e.g. $360 or $4.50 (drops .00). */
export const money = (n: number): string => USD.format(n);

/** Always-2-decimal formatter, e.g. $59.99, $1.40. */
export const moneyCents = (n: number): string => USDc.format(n);

/* ───────────────────────── building the registry from API ───────────────────────── */

/**
 * Shape we project a Shopify Product/Variant pair into for the engine.
 * The route loader queries the storefront, then maps the GraphQL response
 * through this builder so the rest of the app stays decoupled from the
 * GraphQL types and from compareAtPrice details that don't matter here.
 */
export function toEntry(input: {
  handle: string;
  title: string;
  price: number;
  compareAtPrice: number | null;
  variantId: string | null;
  availableForSale: boolean;
  sellingPlanId: string | null;
  imageUrl: string | null;
  imageAlt: string | null;
}): LuminaProductEntry {
  const gender = parseGenderFromTitle(input.title);
  const months = parseMonthsFromTitle(input.title);
  return {
    handle: input.handle,
    title: input.title,
    gender,
    months,
    bottles: months,
    price: input.price,
    compareAtPrice: input.compareAtPrice,
    variantId: input.variantId,
    availableForSale: input.availableForSale,
    sellingPlanId: input.sellingPlanId,
    imageUrl: input.imageUrl,
    imageAlt: input.imageAlt,
  };
}
