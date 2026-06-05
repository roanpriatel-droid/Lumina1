/**
 * Placeholder commerce data for the Lumina homepage + PDP.
 *
 * TODO(shopify-wiring): when the real Shopify products + selling plans land,
 * replace these with handle lookups + a selectedSellingPlan query. The shape
 * here mirrors what we'll eventually pull from the storefront API so the UI
 * components stay untouched.
 *
 *  - LuminaTier  ↔ Shopify product variant (one variant per supply size)
 *  - LuminaOption ↔ selling plan group (Subscribe & Save vs One-Time)
 *  - LuminaBundle ↔ product bundle / fixed-bundle add-on
 *
 * Real product handles to wire later:
 *   male   → 'lumina-male-enhancement'   (placeholder)
 *   female → 'lumina-female-enhancement' (placeholder)
 */

export type LuminaProductKey = 'male' | 'female';

export interface LuminaActive {
  name: string;
  amount: string;
  why: string;
}

export interface LuminaProduct {
  key: LuminaProductKey;
  /** Handle to look up in Shopify when the real product is set up. */
  handle: string;
  name: string;
  tagline: string;
  blurb: string;
  benefit: string;
  rating: number;
  reviews: number;
  actives: LuminaActive[];
}

export interface LuminaTier {
  id: string;
  name: string;
  months: number;
  bottles: number;
  /** Per-bottle price in dollars. */
  per: number;
  /** Savings percentage off the base per-bottle price. */
  save: number;
  best?: boolean;
}

export interface LuminaBundle {
  id: string;
  label: string;
  note: string;
  /** Multiplier on the base supply total. */
  mult: number;
  /** Extra percent off the bundled total. */
  save: number;
  popular?: boolean;
}

export type LuminaOption = 'subscribe' | 'onetime';

export const LUMINA_SUB_DISCOUNT = 0.15;

export const LUMINA_PRODUCTS: Record<LuminaProductKey, LuminaProduct> = {
  male: {
    key: 'male',
    handle: 'lumina-male-enhancement',
    name: 'Lumina Male Enhancement',
    tagline: 'Daily vitality formula',
    blurb:
      "A once-daily formula for blood flow, stamina, and hormonal balance — built from clinically-studied actives, dosed at the levels studies actually used.",
    benefit:
      'Blood flow, stamina, and hormonal balance — in one daily capsule.',
    rating: 4.8,
    reviews: 2417,
    actives: [
      {
        name: 'L-Citrulline',
        amount: '1,500 mg',
        why: 'Converts to arginine to support nitric-oxide production and blood flow.',
      },
      {
        name: 'Korean Red Ginseng (Panax)',
        amount: '500 mg',
        why: 'Studied for stamina, energy, and circulatory support.',
      },
      {
        name: 'Maca Root (6:1)',
        amount: '500 mg',
        why: 'Traditional adaptogen linked to libido and endurance.',
      },
      {
        name: 'Ashwagandha (KSM-66®)',
        amount: '300 mg',
        why: 'Helps the body manage stress that blunts drive and recovery.',
      },
      {
        name: 'Zinc (bisglycinate)',
        amount: '15 mg',
        why: 'Cofactor in testosterone synthesis and immune function.',
      },
      {
        name: 'Boron',
        amount: '6 mg',
        why: 'Supports free-testosterone availability.',
      },
      {
        name: 'Vitamin D3',
        amount: '50 mcg',
        why: 'Linked to healthy hormone levels; most adults run low.',
      },
    ],
  },
  female: {
    key: 'female',
    handle: 'lumina-female-enhancement',
    name: 'Lumina Female Enhancement',
    tagline: 'Daily vitality formula',
    blurb:
      'A once-daily formula for drive, hormonal balance, and energy — adaptogens and micronutrients at the doses studies used, nothing for show.',
    benefit:
      'Drive, hormonal balance, and steady energy — in one daily capsule.',
    rating: 4.9,
    reviews: 1862,
    actives: [
      {
        name: 'Maca Root (6:1)',
        amount: '750 mg',
        why: 'Traditional adaptogen linked to libido and mood balance.',
      },
      {
        name: 'Shatavari',
        amount: '500 mg',
        why: 'Ayurvedic herb used for hormonal and reproductive support.',
      },
      {
        name: 'Ashwagandha (KSM-66®)',
        amount: '300 mg',
        why: 'Helps the body manage stress that blunts drive and energy.',
      },
      {
        name: 'L-Arginine',
        amount: '500 mg',
        why: 'Supports nitric-oxide production and blood flow.',
      },
      {
        name: 'Iron (bisglycinate)',
        amount: '18 mg',
        why: 'Counters the fatigue of low iron, common in menstruating adults.',
      },
      {
        name: 'Folate (5-MTHF)',
        amount: '400 mcg',
        why: 'Active folate for energy metabolism and cellular health.',
      },
      {
        name: 'Vitamin B6 (P-5-P)',
        amount: '10 mg',
        why: 'Supports hormone regulation and mood through the cycle.',
      },
    ],
  },
};

export const LUMINA_TIERS: LuminaTier[] = [
  {id: 'ignite', name: 'Ignite', months: 1, bottles: 1, per: 69, save: 0},
  {id: 'momentum', name: 'Momentum', months: 2, bottles: 2, per: 64, save: 7},
  {id: 'ascent', name: 'Ascent', months: 4, bottles: 4, per: 59, save: 14},
  {
    id: 'apex',
    name: 'Apex',
    months: 6,
    bottles: 6,
    per: 49,
    save: 29,
    best: true,
  },
  {id: 'legacy', name: 'Legacy', months: 12, bottles: 12, per: 44, save: 36},
];

export const LUMINA_BUNDLES: LuminaBundle[] = [
  {
    id: 'solo',
    label: 'Single formula',
    note: 'Your selected supply',
    mult: 1,
    save: 0,
  },
  {
    id: 'duo',
    label: 'His & Hers duo',
    note: 'Both formulas, paired',
    mult: 2,
    save: 10,
    popular: true,
  },
  {
    id: 'plus',
    label: 'Formula + Sleep',
    note: 'Add nightly magnesium',
    mult: 1.6,
    save: 8,
  },
];

/**
 * Static placeholder pricing math. Swap this for real Shopify variant
 * prices + selling-plan adjustments once the products are wired.
 */
export function computeLuminaPrice(
  tier: LuminaTier,
  option: LuminaOption,
  bundle: LuminaBundle,
): number {
  let total = tier.per * tier.bottles;
  if (option === 'subscribe') total *= 1 - LUMINA_SUB_DISCOUNT;
  total *= bundle.mult;
  if (bundle.save) total *= 1 - bundle.save / 100;
  return Math.round(total);
}

/** Cheapest per-bottle price across the tier ladder. Used for "From $X / mo". */
export const LUMINA_PRICE_FROM = Math.min(...LUMINA_TIERS.map((t) => t.per));
