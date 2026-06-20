/**
 * Commerce + content data for the Lumina formulas.
 *
 * TODO(shopify-wiring): when the real Shopify products + selling plans land,
 * replace these with handle lookups + a selectedSellingPlan query. The shape
 * here mirrors what we'll eventually pull from the storefront API so the UI
 * components stay untouched.
 */

export type LuminaProductKey = 'male' | 'female';

export interface LuminaActive {
  name: string;
  /** Dose with unit, e.g. "200 mg" or "50 mcg RAE". */
  amount: string;
  /** Optional form/source, e.g. "as Magnesium Oxide". */
  form?: string;
  /** Percent of daily value, e.g. "48% DV". */
  dv?: string;
  /** Short rationale rendered under the row. */
  why: string;
}

/**
 * A proprietary blend disclosed at total weight + per-ingredient names,
 * but without per-ingredient doses. Used by the female formula.
 */
export interface LuminaBlend {
  name: string;
  totalAmount: string;
  ingredients: string[];
  /** Honest note shown under the table. */
  disclosure: string;
}

export interface LuminaDeepDive {
  ingredient: string;
  hook: string;
  body: string;
}

export interface LuminaResultStage {
  range: string;
  title: string;
  body: string;
}

export interface LuminaFaq {
  q: string;
  a: string;
}

export interface LuminaBenefitPillar {
  /** lucide-react icon name (Pascal). */
  icon: string;
  title: string;
  body: string;
}

export interface LuminaProduct {
  key: LuminaProductKey;
  /** Shopify product handle. */
  handle: string;
  name: string;
  tagline: string;
  blurb: string;
  benefit: string;

  /** Bottle facts shown in the hero meta strip. */
  bottleCount: number;
  dailyServing: string;
  supplyDays: number;
  /** When to take it ("nightly", "morning + midday"). */
  takingTime: string;

  /** Vitamin/mineral/amino/herb actives with disclosed doses. */
  actives: LuminaActive[];
  /** Inactive ingredients line, exactly as it appears on the SF panel. */
  otherIngredients: string;
  /** Optional disclosed proprietary blend. */
  blend?: LuminaBlend;

  benefitPillars: LuminaBenefitPillar[];
  deepDives: LuminaDeepDive[];
  resultStages: LuminaResultStage[];

  suggestedUse: string;
  consistencyMessage: string;
  pairWith: string[];
  formulatedWithout: string[];
  warning: string;
  faqs: LuminaFaq[];
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
    handle: 'alpha-energy-3',
    name: 'Lumina Male Enhancement',
    tagline: '90 capsules · 30-day supply · made in USA',
    blurb:
      "A comprehensive nightly formula for energy, stamina, drive, and hormonal balance — built on tribulus, zinc, magnesium, and a stack of traditional botanicals dosed for men who actually train.",
    benefit:
      'Energy, stamina, drive, and hormonal balance — in three capsules before bed.',
    bottleCount: 90,
    dailyServing: '3 capsules nightly',
    supplyDays: 30,
    takingTime: 'before bedtime',

    actives: [
      {
        name: 'Magnesium',
        form: 'as Magnesium Oxide',
        amount: '200 mg',
        dv: '48% DV',
        why: 'The mineral behind 300+ enzymatic processes; supports muscle function, energy metabolism, and restful sleep — why this formula is taken at night.',
      },
      {
        name: 'Zinc',
        form: 'as Zinc Oxide',
        amount: '30 mg',
        dv: '273% DV',
        why: 'Essential for normal testosterone metabolism, immune function, and recovery. Most men under-consume it.',
      },
      {
        name: 'Tribulus Terrestris',
        form: 'fruit',
        amount: '750 mg',
        why: "The formula's anchor botanical. Used for generations in Ayurvedic and traditional practice to support male vitality, stamina, and drive.",
      },
      {
        name: 'Chrysin',
        form: 'seed',
        amount: '75 mg',
        why: 'A flavonoid studied for its role in supporting normal hormonal balance.',
      },
      {
        name: 'Horny Goat Weed (Epimedium)',
        form: 'aerial',
        amount: '50 mg',
        why: 'Traditional botanical long used to support libido and healthy circulation.',
      },
      {
        name: 'Longjack (Tongkat Ali)',
        form: 'root',
        amount: '50 mg',
        why: 'Southeast Asian root traditionally used to support male performance, energy, and stress resilience.',
      },
      {
        name: 'Saw Palmetto Berries',
        amount: '50 mg',
        why: 'Best known for supporting normal prostate health as men age.',
      },
      {
        name: 'Hawthorn Berries',
        amount: '50 mg',
        why: 'Traditional European botanical that supports healthy circulation and cardiovascular wellness.',
      },
      {
        name: 'Cissus Quadrangularis',
        form: 'stem',
        amount: '50 mg',
        why: 'Used in traditional practice to support joint comfort, recovery, and an active lifestyle.',
      },
    ],
    otherIngredients:
      'Vegetable cellulose capsule, rice flour, magnesium stearate.',

    benefitPillars: [
      {
        icon: 'Flame',
        title: 'Energy & Stamina',
        body: 'Supports healthy energy levels through the day and in training.',
      },
      {
        icon: 'Heart',
        title: 'Drive & Vitality',
        body: 'Supports healthy libido and male vitality.',
      },
      {
        icon: 'Scale',
        title: 'Hormonal Balance',
        body: 'Supports normal hormonal balance with zinc, magnesium, and traditional botanicals.',
      },
      {
        icon: 'Activity',
        title: 'Active Recovery',
        body: 'Supports muscle function, circulation, and an active lifestyle.',
      },
    ],

    deepDives: [
      {
        ingredient: 'Tribulus Terrestris — 750 mg',
        hook: 'The dose that matters.',
        body: "750 mg is a real dose, not a sprinkle. Where most men's formulas list tribulus inside a 50 mg \"proprietary blend\" and call it support, ours puts the anchor botanical front and center at the level traditional practice has used for generations to support vitality, stamina, and drive.",
      },
      {
        ingredient: 'Tongkat Ali (Longjack) — 50 mg',
        hook: "Southeast Asia's traditional men's root.",
        body: 'Tongkat Ali has been used for centuries across Indonesia and Malaysia to support male performance, energy under load, and stress resilience. We use the root extract — the part of the plant that traditional preparations actually call for.',
      },
      {
        ingredient: 'Zinc + Magnesium — the classic mineral duo',
        hook: 'Why we dose them at the level training men need.',
        body: "30 mg of zinc and 200 mg of magnesium together support muscle function, recovery, and normal testosterone metabolism — the mineral foundation most active men are quietly low on. Taken at night, magnesium also supports the restful sleep that's part of how the body actually recovers.",
      },
      {
        ingredient: 'Saw Palmetto — 50 mg',
        hook: 'The long-game prostate play.',
        body: 'Saw palmetto berries are the best-known botanical for supporting normal prostate health as men age — included here because a daily men\'s formula that ignores prostate support is missing half the assignment.',
      },
    ],

    resultStages: [
      {
        range: 'Week 1–2',
        title: 'Routine established',
        body: "Three capsules a night becomes second nature. You're not chasing a feeling yet — you're building the habit that everything else stacks on.",
      },
      {
        range: 'Week 4',
        title: 'Energy rhythm',
        body: "Most people start to notice their daily energy and recovery feel steadier. The minerals have built up to working levels and you're sleeping into the formula instead of fighting against it.",
      },
      {
        range: 'Week 8+',
        title: 'Full assessment point',
        body: "This is when you should actually judge the formula. Botanicals like tribulus and tongkat ali are traditionally used over weeks, not days. Most men assess at 8–12 weeks of consistent daily use.",
      },
    ],

    suggestedUse:
      'Take 3 capsules before bedtime. Use daily for best assessment at 8–12 weeks.',
    consistencyMessage:
      "Formulated for daily use. Traditional botanicals don't work on a one-night timeline — most men assess this formula at 8–12 weeks of consistent intake.",
    pairWith: [
      'Resistance training 3–5x per week',
      'Protein-forward diet with whole foods',
      'Consistent 7–9 hour sleep window',
      'Sunlight or supplemental D3 if you run low',
    ],
    formulatedWithout: [
      'Proprietary blends hiding the doses',
      'Gluten · GMO · Artificial colors',
      'Synthetic fillers or dyes',
      'Banned substances on the WADA list',
    ],
    warning:
      'Consult with a physician before use if you have any medical conditions. Do not use if pregnant or lactating. For Adult Use Only.',

    faqs: [
      {
        q: 'How long until I notice anything?',
        a: 'Some people feel the mineral support in the first 1–2 weeks. The botanicals — tribulus, tongkat ali, epimedium — are traditionally used over weeks, and most men assess the full formula at 8–12 weeks of daily use. We built it for that timeline, not for next Tuesday.',
      },
      {
        q: 'Why do you take it at night?',
        a: '200 mg of magnesium supports restful sleep and muscle recovery — the body does its actual rebuild while you sleep. Taking the formula before bed lines up the dose with when your body is using it.',
      },
      {
        q: 'Can I take this with other supplements?',
        a: "Most stacks are fine. If you're already taking a high-zinc or high-magnesium supplement, account for the 30 mg / 200 mg in this formula so you don't double up unintentionally. Talk to your doctor about any prescription interactions.",
      },
      {
        q: "Who shouldn't take this?",
        a: "Men with hormone-sensitive conditions, men on blood-pressure or cardiac medications, anyone preparing for surgery, and anyone under 18 should consult their physician first. Don't use if you're pregnant or lactating.",
      },
      {
        q: 'Why these doses?',
        a: "We dosed each active at the levels supported by either traditional practice or clinical research — not at sprinkle-level token amounts. Tribulus at 750 mg, zinc at 30 mg, magnesium at 200 mg. We disclose every milligram so you can compare us to anything on the shelf.",
      },
      {
        q: 'How do subscriptions work?',
        a: "Subscribe and you save 15% on every bottle, ship free, and can pause, skip, or cancel any time from your account — no calls, no friction. Most customers run Apex (6-month supply) and re-up automatically.",
      },
      {
        q: 'Where is it made and tested?',
        a: 'Manufactured in the United States in cGMP-certified facilities. Every lot is third-party tested for identity, potency, and contaminants. Certificates of analysis are available on request.',
      },
      {
        q: "What's the guarantee?",
        a: "60-Day Money-Back Guarantee on every order. If the formula isn't right for you, email us and we'll refund you — even if the bottles are empty.",
      },
    ],
  },

  female: {
    key: 'female',
    handle: 'female-enhancement-3',
    name: 'Lumina Female Enhancement',
    tagline: '60 capsules · 30-day supply · made in USA',
    blurb:
      "A complete daily vitality formula for women — built on a B-complex backbone with 15 traditional botanicals, an absorption catalyst, and minerals dosed for the way modern women actually live.",
    benefit:
      'Daily energy, balance, vitality, and circulation — in two capsules a day.',
    bottleCount: 60,
    dailyServing: '2 capsules daily (do not exceed 4)',
    supplyDays: 30,
    takingTime: 'with water, any time of day',

    actives: [
      {
        name: 'Vitamin A',
        form: 'as Beta-Carotene',
        amount: '50 mcg RAE',
        why: 'Antioxidant support and normal immune function.',
      },
      {
        name: 'Thiamin (B1)',
        amount: '1.25 mg',
        why: 'Converts food to fuel; supports energy metabolism.',
      },
      {
        name: 'Niacin (B3)',
        amount: '1 mg',
        why: 'Supports energy metabolism and healthy circulation.',
      },
      {
        name: 'Vitamin B6',
        amount: '3.8 mg',
        dv: '224% DV',
        why: 'Supports energy, normal hormonal activity regulation, and neurotransmitter synthesis.',
      },
      {
        name: 'Vitamin B12',
        amount: '54 mcg',
        dv: '2,250% DV',
        why: 'The energy vitamin — supports red blood cell formation and reduced tiredness.',
      },
      {
        name: 'Pantothenic Acid (B5)',
        amount: '2.5 mg',
        why: 'Supports energy metabolism and normal mental performance.',
      },
      {
        name: 'Zinc',
        form: 'as Zinc Oxide',
        amount: '26 mg',
        dv: '236% DV',
        why: 'Immune function, skin health, and normal hormonal balance.',
      },
      {
        name: 'L-Arginine',
        amount: '100 mg',
        why: 'Amino acid that supports normal circulation via nitric oxide pathways.',
      },
      {
        name: 'BioPerine® Black Pepper Extract',
        amount: '1 mg',
        why: 'Patented absorption enhancer — helps the rest of the formula actually get absorbed.',
      },
    ],
    blend: {
      name: 'Lumina Botanical Vitality Blend',
      totalAmount: '802 mg',
      ingredients: [
        'Epimedium',
        'Tribulus',
        'Catuaba',
        'Dong Quai',
        'Ginkgo',
        'Asian Ginseng',
        'Damiana',
        'Ashwagandha',
        'Ginger',
        'Maca',
        'Muira Puama',
        'L-Phenylalanine',
        'Asparagus Extract',
        'Chinese Smilax',
      ],
      disclosure:
        "We disclose every botanical in the blend by name and the exact total weight. Per-ingredient doses inside the blend are proprietary — but the vitamins, minerals, amino acids, and absorption catalyst above are all dosed openly. This is more transparency than the category standard, but less than we'd like; we're working with the formulator on a future fully open-dose revision.",
    },
    otherIngredients:
      'Rice flour, vegetable cellulose capsule, magnesium stearate, silicon dioxide.',

    benefitPillars: [
      {
        icon: 'Zap',
        title: 'Daily Energy',
        body: 'B-complex supports energy metabolism and reduced fatigue.',
      },
      {
        icon: 'Wind',
        title: 'Balance & Calm',
        body: 'Ashwagandha, damiana, and dong quai traditionally used to support balance and relaxation.',
      },
      {
        icon: 'Sparkles',
        title: 'Vitality & Drive',
        body: 'Maca, epimedium, and tribulus support healthy libido and vitality.',
      },
      {
        icon: 'Sun',
        title: 'Circulation & Glow',
        body: 'L-arginine and ginkgo support normal circulation.',
      },
    ],

    deepDives: [
      {
        ingredient: 'Ashwagandha — the adaptogen',
        hook: 'For the women who carry it all.',
        body: 'Ashwagandha has been used in Ayurvedic practice for thousands of years to support the body\'s response to stress, restore steady energy, and bring the nervous system back to baseline. It\'s the foundational adaptogen in this formula — included because balance is the first thing modern life takes from you.',
      },
      {
        ingredient: 'Maca — the Peruvian root',
        hook: 'Energy, mood, and libido support — traditionally.',
        body: 'Grown above 13,000 feet in the Peruvian Andes, maca has been used for centuries by Indigenous communities for energy, mood support, and libido. It\'s adaptogenic, mineral-rich, and one of the most well-known botanicals for female vitality.',
      },
      {
        ingredient: 'Dong Quai — the women\'s herb of TCM',
        hook: 'The classic botanical of traditional Chinese practice.',
        body: 'Sometimes called "female ginseng," dong quai has been the most prescribed women\'s tonic in Traditional Chinese Medicine for over 2,000 years — traditionally used to support balance, circulation, and cycle wellness.',
      },
      {
        ingredient: 'B6 + B12 + B5 — the energy complex',
        hook: 'Why high-dose B12 is the difference.',
        body: 'The B-vitamins are how your body converts food into usable energy. B12 supports red blood cell formation and reduced tiredness — and at 2,250% DV, this formula delivers it at a level designed to actually move the needle for women running low. B6 supports normal hormonal activity regulation; B5 supports normal mental performance.',
      },
      {
        ingredient: 'BioPerine® — the absorption catalyst',
        hook: 'The sophistication you usually don\'t get in this category.',
        body: 'BioPerine® is a patented black pepper extract clinically studied to enhance the bioavailability of nutrients it\'s formulated with. 1 mg is the studied dose — enough to do the job, included so the rest of the formula actually gets absorbed instead of passing through.',
      },
    ],

    resultStages: [
      {
        range: 'Week 1–2',
        title: 'Routine established',
        body: 'Two capsules a day, with water. Light exercise and a sensible diet make everything else work harder. You\'re building the consistency the formula is designed for.',
      },
      {
        range: 'Week 4',
        title: 'Energy rhythm',
        body: 'Most people start to notice steadier daytime energy and a calmer baseline. The B-vitamins are at working levels and the adaptogens have begun their slower build.',
      },
      {
        range: 'Week 8+',
        title: 'Full assessment point',
        body: 'The supplier recommends a minimum 8-week run for best assessment. Traditional adaptogens like ashwagandha and maca compound with consistency — this is when you should judge the formula.',
      },
    ],

    suggestedUse:
      '2 capsules daily with water. Light exercise and sensible diet recommended. Use no less than 8 weeks for maximum results. Do not exceed 4 capsules daily.',
    consistencyMessage:
      'Use no less than 8 weeks for maximum results — the formula\'s own instructions. Adaptogens compound with consistency.',
    pairWith: [
      'Light to moderate movement daily',
      'Sensible whole-food diet',
      'Hydration — water with each dose',
      'A consistent sleep window',
    ],
    formulatedWithout: [
      'Proprietary blends hiding the vitamin, mineral, and amino doses',
      'Gluten · GMO · Artificial colors',
      'Synthetic fillers or dyes',
      'Caffeine or stimulants',
    ],
    warning:
      'Do not exceed recommended dose. Pregnant or nursing mothers, children under the age of 18, and individuals with a known medical condition should consult a physician before using this or any dietary supplement. For Adult Use Only.',

    faqs: [
      {
        q: 'How long until I notice anything?',
        a: 'The B-complex can support energy in the first 1–2 weeks, but the adaptogenic botanicals — ashwagandha, maca, dong quai — are traditionally used over weeks of consistent intake. The supplier recommends a minimum 8-week run for best assessment.',
      },
      {
        q: 'Why is the botanical blend not fully dosed?',
        a: 'We disclose every botanical in the blend by name and the exact total weight (802 mg), plus the full doses on every vitamin, mineral, amino acid, and the absorption catalyst. Per-ingredient blend doses are proprietary at this revision — more transparency than the category standard, but less than we want long-term. We\'re working with the formulator on a future fully open-dose version.',
      },
      {
        q: 'Can I take this with other supplements?',
        a: 'Most stacks are fine. If you\'re already taking a high-zinc or B-complex supplement, account for what\'s already in this formula. Talk to your doctor about any prescription interactions — especially with thyroid medication, blood thinners, or hormonal therapies.',
      },
      {
        q: "Who shouldn't take this?",
        a: "Pregnant or nursing mothers, anyone under 18, and individuals with a known medical condition should consult a physician before using this or any dietary supplement.",
      },
      {
        q: 'Does this contain caffeine or stimulants?',
        a: 'No. The energy comes from the B-vitamin complex and the adaptogenic botanicals — not from a stimulant kick. Some women take it in the morning, some prefer midday; there is no wrong time.',
      },
      {
        q: 'How do subscriptions work?',
        a: 'Subscribe and you save 15% on every bottle, ship free, and can pause, skip, or cancel any time from your account — no calls, no friction. Most customers run Apex (6-month supply) and re-up automatically.',
      },
      {
        q: 'Where is it made and tested?',
        a: 'Manufactured in the United States in cGMP-certified facilities. Every lot is third-party tested for identity, potency, and contaminants. Certificates of analysis are available on request.',
      },
      {
        q: "What's the guarantee?",
        a: "60-Day Money-Back Guarantee on every order. If the formula isn't right for you, email us and we'll refund you — even if the bottles are empty.",
      },
    ],
  },
};

/**
 * Display presets for the supply tier ladder. Each preset is paired at
 * runtime with the matching Shopify variant on the "Supply" option — see
 * pairVariantsToTiers() in lumina-product.ts. The `per` / `save` fields
 * are static fallbacks used by preview mode (no Shopify product wired)
 * and by the homepage TiersTeaser.
 */
export interface LuminaTierPreset {
  id: string;
  name: string;
  months: number;
  bottles: number;
  best?: boolean;
}

export const LUMINA_TIER_PRESETS: ReadonlyArray<LuminaTierPreset> = [
  {id: 'ignite', name: 'Ignite', months: 1, bottles: 1},
  {id: 'momentum', name: 'Momentum', months: 2, bottles: 2},
  {id: 'ascent', name: 'Ascent', months: 4, bottles: 4},
  {id: 'apex', name: 'Apex', months: 6, bottles: 6, best: true},
  {id: 'legacy', name: 'Legacy', months: 12, bottles: 12},
];

export const LUMINA_TIERS: LuminaTier[] = [
  {id: 'ignite', name: 'Ignite', months: 1, bottles: 1, per: 69, save: 0},
  {id: 'momentum', name: 'Momentum', months: 2, bottles: 2, per: 64, save: 7},
  {id: 'ascent', name: 'Ascent', months: 4, bottles: 4, per: 59, save: 15},
  {
    id: 'apex',
    name: 'Apex',
    months: 6,
    bottles: 6,
    per: 55,
    save: 20,
    best: true,
  },
  {id: 'legacy', name: 'Legacy', months: 12, bottles: 12, per: 52, save: 25},
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
    label: 'His & Hers Duo',
    note: 'Both formulas, paired',
    mult: 2,
    save: 10,
    popular: true,
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
