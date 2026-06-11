// PLACEHOLDER — replace with review-platform API (Okendo / Junip /
// Stamped) before launch. Every selector in this file lives behind
// the same shape so the site can be re-wired to a real source by
// swapping `REVIEWS` for an async fetcher.

export type ReviewFormula = 'male' | 'female' | 'both';
export type ReviewTier = '1-month' | '2-month' | '3-month' | '6-month' | '12-month';
export type ReviewKind = 'standard' | 'spotlight' | 'pull-quote' | 'stat';

export interface Review {
  id: string;
  rating: 1 | 2 | 3 | 4 | 5;
  formula: ReviewFormula;
  tier: ReviewTier;
  /** True when the order is verified on file. Most reviews are. */
  verified: boolean;
  /** Display name + initial (we never publish full names). */
  name: string;
  /** Region / state used as a subtle locality cue. Optional. */
  region?: string;
  /** Short headline shown on standard cards. Omit for pull-quotes
   *  and spotlights, which lead with the body. */
  headline?: string;
  /** The review body. Spotlight kind expects a longer story. Pull-
   *  quote kind expects a single sentence under ~16 words. */
  body: string;
  /** Card variant for the masonry wall. */
  kind: ReviewKind;
  /** Week the review references. Drives the "8-Week Pattern" band. */
  weekMark?: 2 | 5 | 8;
}

/** Stat-interrupt cards mixed into the masonry. */
export interface ReviewStatCard {
  id: string;
  /** Big mono numeral. */
  value: string;
  /** One-line context under the numeral. */
  caption: string;
  /** Smaller mono footnote. */
  footnote?: string;
}

export const REVIEW_STAT_CARDS: ReadonlyArray<ReviewStatCard> = [
  {
    id: 'stat-resubscribe',
    value: '74%',
    caption: 'Re-subscribe after their first protocol.',
    footnote: 'First-order customers, last 90 days.',
  },
  {
    id: 'stat-assessment',
    value: '8 wk',
    caption: 'Average self-reported assessment window.',
    footnote: 'Matches our recommended run.',
  },
  {
    id: 'stat-disclosed',
    value: '100%',
    caption: 'Of actives shown in milligrams. Every blend, by name.',
  },
  {
    id: 'stat-lots',
    value: '0',
    caption: 'Lots shipped without a Certificate of Analysis on file.',
  },
];

/* ====================================================================
   The placeholder dataset (~40 entries). Realistic mix:
     - ~85% 5★, ~12% 4★, ~3% 3★ (one)
     - male / female / both formulas
     - tiers leaning to 1-month + 6-month (matches the catalog ladder)
     - week marks let the 8-week pattern band pull excerpts
     - kind distribution: ~80% standard, ~12% spotlight, ~5% pull-quote
   ==================================================================== */

export const REVIEWS: ReadonlyArray<Review> = [
  {
    id: 'r-001',
    rating: 5,
    formula: 'male',
    tier: '6-month',
    verified: true,
    name: 'Marcus K.',
    region: 'CO',
    headline: 'Disclosed doses, finally',
    body: 'The first supplement I have run where the actives table actually says how many milligrams of tribulus. I switched away from a proprietary blend brand and the math made the decision.',
    kind: 'standard',
    weekMark: 2,
  },
  {
    id: 'r-002',
    rating: 5,
    formula: 'female',
    tier: '6-month',
    verified: true,
    name: 'Priya S.',
    region: 'TX',
    headline: 'A calmer baseline by week four',
    body: 'I expected energy. What I got was a steadier emotional baseline first. By the end of week four the mood floor lifted before the energy did. Both showed up — that order.',
    kind: 'standard',
    weekMark: 5,
  },
  {
    id: 'r-003',
    rating: 5,
    formula: 'male',
    tier: '12-month',
    verified: true,
    name: 'Daniel R.',
    region: 'NY',
    body: 'I am 18 weeks in. Energy through the workday is a different baseline now — I am not chasing it with coffee at 2 PM anymore. The 8-week assessment framing is the only honest way to run a daily formula and I think most brands do not understand that.',
    kind: 'spotlight',
    weekMark: 8,
  },
  {
    id: 'r-004',
    rating: 5,
    formula: 'female',
    tier: '1-month',
    verified: true,
    name: 'Ana M.',
    body: 'Not a stimulant — a settling.',
    kind: 'pull-quote',
  },
  {
    id: 'r-005',
    rating: 5,
    formula: 'male',
    tier: '6-month',
    verified: true,
    name: 'Jared L.',
    region: 'WA',
    headline: 'The nighttime serving works',
    body: 'Three caps before bed and I sleep through. Magnesium and zinc at the dose levels disclosed — you can tell the formula is built around the dosing schedule, not the other way round.',
    kind: 'standard',
    weekMark: 2,
  },
  {
    id: 'r-006',
    rating: 5,
    formula: 'both',
    tier: '6-month',
    verified: true,
    name: 'Elena & Tom',
    region: 'OR',
    headline: 'Running the pair together',
    body: 'We started on the same day, did the eight weeks side by side. Easier to stick when you are building the habit with someone. We are both on the 6-month supply now.',
    kind: 'standard',
    weekMark: 8,
  },
  {
    id: 'r-007',
    rating: 4,
    formula: 'male',
    tier: '1-month',
    verified: true,
    name: 'Brian P.',
    headline: 'Honest with one note',
    body: 'Real change at week six. Took the recommended dosing slowly the first week — the morning cap is potent on an empty stomach. Settled in fine after that.',
    kind: 'standard',
    weekMark: 5,
  },
  {
    id: 'r-008',
    rating: 5,
    formula: 'female',
    tier: '6-month',
    verified: true,
    name: 'Jenna W.',
    region: 'CA',
    headline: 'A daily habit that finally stuck',
    body: 'Two capsules with water in the morning. After 25 years of trying to make supplements stick, the routine itself ended up being the easiest part. The energy lift kept me going.',
    kind: 'standard',
    weekMark: 5,
  },
  {
    id: 'r-009',
    rating: 5,
    formula: 'female',
    tier: '12-month',
    verified: true,
    name: 'Carla D.',
    region: 'IL',
    body: 'I went in skeptical of the 8-week framing — most brands say six weeks because that is when their formula starts to slack off. Lumina actually keeps building. By week eight the daytime energy was different. By week twelve I knew. The disclosed blend is the reason I am here for 12 months.',
    kind: 'spotlight',
    weekMark: 8,
  },
  {
    id: 'r-010',
    rating: 5,
    formula: 'male',
    tier: '6-month',
    verified: true,
    name: 'Aaron G.',
    region: 'MI',
    headline: 'Customer service replied with the COA',
    body: 'Emailed for the Certificate of Analysis on my lot. Got it back in four hours, lot-stamped, third-party signed. That alone earned my second order.',
    kind: 'standard',
  },
  {
    id: 'r-011',
    rating: 5,
    formula: 'female',
    tier: '1-month',
    verified: true,
    name: 'Layla M.',
    body: 'My energy I used to have, back.',
    kind: 'pull-quote',
  },
  {
    id: 'r-012',
    rating: 5,
    formula: 'male',
    tier: '2-month',
    verified: true,
    name: 'Greg T.',
    region: 'GA',
    headline: 'Smoother training recovery',
    body: 'Five training days a week and I am not as wrecked the morning after. Zinc and magnesium at full disclosed doses — the recovery shift was real around week three.',
    kind: 'standard',
    weekMark: 2,
  },
  {
    id: 'r-013',
    rating: 5,
    formula: 'female',
    tier: '6-month',
    verified: true,
    name: 'Sasha K.',
    region: 'MA',
    headline: 'The B-complex lifts the floor',
    body: 'Not a caffeine hit. The floor is just higher. I noticed it most in the late-morning stretch when I usually crashed.',
    kind: 'standard',
    weekMark: 2,
  },
  {
    id: 'r-014',
    rating: 5,
    formula: 'male',
    tier: '6-month',
    verified: true,
    name: 'Henry B.',
    region: 'PA',
    headline: 'Switched from a $90 proprietary blend',
    body: 'They hid the doses. I was paying for a formula I could not verify. Lumina was cheaper per bottle and disclosed every milligram. Tribulus alone was double the dose of what I was on.',
    kind: 'standard',
  },
  {
    id: 'r-015',
    rating: 4,
    formula: 'female',
    tier: '1-month',
    verified: true,
    name: 'Mira J.',
    headline: 'Solid but slow start',
    body: 'First two weeks I felt nothing. Week three the energy lift started. By week six it was steady. Worth the patience but I wish I had known to expect the slow start.',
    kind: 'standard',
    weekMark: 5,
  },
  {
    id: 'r-016',
    rating: 5,
    formula: 'female',
    tier: '6-month',
    verified: true,
    name: 'Olivia F.',
    region: 'MN',
    body: 'I am eleven weeks in and I have stopped narrating my energy levels in my head. That used to be a constant background process. It is quiet now. The blend is disclosed by name and I trust what I am putting in. That mattered more than I expected.',
    kind: 'spotlight',
    weekMark: 8,
  },
  {
    id: 'r-017',
    rating: 5,
    formula: 'male',
    tier: '1-month',
    verified: true,
    name: 'Ravi P.',
    headline: 'Sleeping deeper at week six',
    body: 'The nighttime dose schedule is the part nobody talks about. Other formulas dump it all in the morning. Lumina splits the day and it shows in sleep quality.',
    kind: 'standard',
    weekMark: 5,
  },
  {
    id: 'r-018',
    rating: 5,
    formula: 'both',
    tier: '6-month',
    verified: true,
    name: 'Sam V.',
    body: 'Two formulas, one standard.',
    kind: 'pull-quote',
  },
  {
    id: 'r-019',
    rating: 5,
    formula: 'female',
    tier: '3-month',
    verified: true,
    name: 'Erika N.',
    region: 'AZ',
    headline: 'Energy without the kick',
    body: 'I am sensitive to stimulants. This formula does not feel like one — it feels like the energy I used to have, just back. The B-complex disclosed at full dose is doing the lifting.',
    kind: 'standard',
    weekMark: 2,
  },
  {
    id: 'r-020',
    rating: 5,
    formula: 'male',
    tier: '6-month',
    verified: true,
    name: 'Patrick S.',
    region: 'TX',
    headline: '60-day guarantee tested',
    body: 'I almost returned it at week three because I felt nothing. Customer service answered the same day, walked me through the assessment window, and I stayed in. Glad I did — week six was the turn.',
    kind: 'standard',
    weekMark: 5,
  },
  {
    id: 'r-021',
    rating: 5,
    formula: 'male',
    tier: '12-month',
    verified: true,
    name: 'Marco F.',
    region: 'FL',
    headline: 'The 12-month subscription is the move',
    body: 'Per-bottle drops to $34 and you stop thinking about it. The protocol becomes the default. After three months on it I cannot imagine going back to monthly orders.',
    kind: 'standard',
  },
  {
    id: 'r-022',
    rating: 5,
    formula: 'female',
    tier: '1-month',
    verified: true,
    name: 'Tanya R.',
    headline: 'Lot-stamped means a lot',
    body: 'I have been burned by supplement brands before. Knowing the lot number is on the bottle and tied to a real third-party COA is the trust I have been looking for in the category.',
    kind: 'standard',
  },
  {
    id: 'r-023',
    rating: 5,
    formula: 'male',
    tier: '6-month',
    verified: true,
    name: 'Liam D.',
    region: 'OH',
    headline: 'Subscribe and save is the play',
    body: 'I locked in the 6-month at the discount. Per-bottle is half what the 1-month is. The math is open on the catalog — no shell games. That alone is uncommon in this category.',
    kind: 'standard',
  },
  {
    id: 'r-024',
    rating: 5,
    formula: 'female',
    tier: '6-month',
    verified: true,
    name: 'Vanessa T.',
    region: 'NJ',
    headline: 'Customer service is a real person',
    body: 'Asked about pairing with my other supplement stack. Got a thoughtful, not-templated reply back from a person who clearly read what I wrote. The product would not matter as much without that.',
    kind: 'standard',
  },
  {
    id: 'r-025',
    rating: 5,
    formula: 'male',
    tier: '2-month',
    verified: true,
    name: 'Will A.',
    headline: 'Doses you can verify',
    body: 'I cross-checked the actives against published clinical doses. Lumina sits at or above the studied levels for every active. That is rare and the reason I am sticking with it.',
    kind: 'standard',
    weekMark: 2,
  },
  {
    id: 'r-026',
    rating: 5,
    formula: 'female',
    tier: '6-month',
    verified: true,
    name: 'Naomi W.',
    region: 'VA',
    headline: 'The honest 8-week assessment',
    body: 'I have done six weeks. The formula is settling in. The honest framing of the window — eight to twelve weeks, not three days — is the language I needed to actually commit.',
    kind: 'standard',
    weekMark: 5,
  },
  {
    id: 'r-027',
    rating: 5,
    formula: 'female',
    tier: '12-month',
    verified: true,
    name: 'Rachel K.',
    region: 'WA',
    body: 'I bought the 12-month because I wanted to actually run the protocol the way the brand recommends, not bail at week four because the bottle was empty. I am at week sixteen. The lift is there, the calm is there, the energy is mine again. The brand is not lying about the timeline.',
    kind: 'spotlight',
    weekMark: 8,
  },
  {
    id: 'r-028',
    rating: 4,
    formula: 'male',
    tier: '1-month',
    verified: true,
    name: 'Mike H.',
    headline: 'Worth the price tier I picked',
    body: 'Started on the 1-month. Honest assessment: I felt it. Switched to the 6-month because the per-bottle drop made the math undeniable. Wish I had started there.',
    kind: 'standard',
  },
  {
    id: 'r-029',
    rating: 5,
    formula: 'male',
    tier: '6-month',
    verified: true,
    name: 'Jorge V.',
    region: 'CA',
    headline: 'No proprietary blend, period',
    body: 'I will not buy a formula that hides the actives behind a "proprietary blend" anymore. Lumina was the first one I found that disclosed every milligram. Easy switch.',
    kind: 'standard',
  },
  {
    id: 'r-030',
    rating: 5,
    formula: 'female',
    tier: '6-month',
    verified: true,
    name: 'Dana O.',
    headline: 'Pair it with your morning routine',
    body: 'Two caps with my coffee. After eight weeks it is just the rhythm. The lift is steady through the morning and the late-afternoon crash is gone.',
    kind: 'standard',
    weekMark: 8,
  },
  {
    id: 'r-031',
    rating: 5,
    formula: 'male',
    tier: '6-month',
    verified: true,
    name: 'Steven B.',
    region: 'NC',
    headline: 'Daily check-in: still in',
    body: 'Week nine. Energy through the day, sleep quality up, training recovery up. I will run the next six months on the 6-month subscription. The 60-day guarantee gave me the runway to actually try it.',
    kind: 'standard',
    weekMark: 8,
  },
  {
    id: 'r-032',
    rating: 3,
    formula: 'male',
    tier: '1-month',
    verified: true,
    name: 'Drew F.',
    headline: 'Honest mid-tier review',
    body: 'I felt some lift around week three but nothing dramatic. Took the 60-day guarantee on the half-empty bottle. Refund was processed in two days with no script. I appreciate that. Might come back for the 6-month if my needs change.',
    kind: 'standard',
  },
  {
    id: 'r-033',
    rating: 5,
    formula: 'female',
    tier: '6-month',
    verified: true,
    name: 'Inez R.',
    region: 'AZ',
    headline: 'Real story, real timeline',
    body: 'I am 11 weeks in and I have stopped narrating my energy levels in my head. That constant background process is quiet. I forgot it was even there.',
    kind: 'standard',
    weekMark: 8,
  },
  {
    id: 'r-034',
    rating: 5,
    formula: 'male',
    tier: '6-month',
    verified: true,
    name: 'Bryan P.',
    region: 'TN',
    body: 'Disclosed milligrams. Lot-stamped COA on request. 60-day guarantee on empty bottles. The brand is just doing the things every other brand should be doing.',
    kind: 'pull-quote',
  },
  {
    id: 'r-035',
    rating: 5,
    formula: 'female',
    tier: '3-month',
    verified: true,
    name: 'Charlotte E.',
    region: 'MA',
    headline: 'The packaging actually delivers',
    body: 'Showed up in a serious-feeling kit. The bottle, the dosing card, the COA insert. It reads like medicine, not lifestyle. That set the tone for how I take it.',
    kind: 'standard',
  },
  {
    id: 'r-036',
    rating: 5,
    formula: 'female',
    tier: '6-month',
    verified: true,
    name: 'Yuki S.',
    headline: 'Routine is the easy part',
    body: 'Two caps with water in the morning. After six weeks it became automatic. The energy lift is the reward; the routine itself is the foundation.',
    kind: 'standard',
    weekMark: 5,
  },
  {
    id: 'r-037',
    rating: 5,
    formula: 'male',
    tier: '6-month',
    verified: true,
    name: 'Owen T.',
    region: 'CO',
    headline: 'Stack-friendly with my creatine',
    body: 'I asked customer service about running it alongside daily creatine. They walked me through the timing of the magnesium dose vs the creatine to avoid any GI overlap. Thoughtful answer, exact and useful.',
    kind: 'standard',
  },
  {
    id: 'r-038',
    rating: 5,
    formula: 'female',
    tier: '6-month',
    verified: true,
    name: 'Kimberly J.',
    region: 'IL',
    headline: 'Past the 60-day window, still here',
    body: 'Decision point was week eight. I knew. I stayed. Now on the 6-month subscription and the per-bottle math is doing the rest.',
    kind: 'standard',
    weekMark: 8,
  },
  {
    id: 'r-039',
    rating: 5,
    formula: 'female',
    tier: '12-month',
    verified: true,
    name: 'Anika G.',
    region: 'NY',
    headline: 'Brand voice matches the formula',
    body: 'They write like adults who respect adults. The product follows through on the same standard. Twelve months locked in because both halves of the brand actually align.',
    kind: 'standard',
  },
  {
    id: 'r-040',
    rating: 5,
    formula: 'male',
    tier: '6-month',
    verified: true,
    name: 'Trevor M.',
    body: 'Most honest supplement brand I have run with.',
    kind: 'pull-quote',
  },
] as const;

/* ====================================================================
   Selectors. Pure, derivable from REVIEWS so swapping in a real
   source (or filtering) just requires the same data shape.
   ==================================================================== */

export type ReviewFilter = 'all' | 'male' | 'female' | '6mo+' | 'verified';

export function filterReviews(filter: ReviewFilter): ReadonlyArray<Review> {
  switch (filter) {
    case 'all':
      return REVIEWS;
    case 'male':
      return REVIEWS.filter((r) => r.formula === 'male' || r.formula === 'both');
    case 'female':
      return REVIEWS.filter((r) => r.formula === 'female' || r.formula === 'both');
    case '6mo+':
      return REVIEWS.filter(
        (r) => r.tier === '6-month' || r.tier === '12-month',
      );
    case 'verified':
      return REVIEWS.filter((r) => r.verified);
  }
}

/** 1★ → 5★ counts. */
export function reviewDistribution(
  reviews: ReadonlyArray<Review> = REVIEWS,
): Record<1 | 2 | 3 | 4 | 5, number> {
  const dist: Record<1 | 2 | 3 | 4 | 5, number> = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0};
  for (const r of reviews) dist[r.rating]++;
  return dist;
}

/** Aggregate rating across a slice of reviews. Rounded to 1 decimal. */
export function reviewAverage(
  reviews: ReadonlyArray<Review> = REVIEWS,
): number {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}

/** Convenience aggregate, scoped to a formula side. */
export function reviewAggregate(formula: 'male' | 'female') {
  const list = REVIEWS.filter(
    (r) => r.formula === formula || r.formula === 'both',
  );
  return {
    average: reviewAverage(list),
    count: list.length,
    distribution: reviewDistribution(list),
  };
}

/** Sitewide aggregate used by the reviews hero. */
export function reviewSiteAggregate() {
  return {
    average: reviewAverage(REVIEWS),
    count: REVIEWS.length,
    distribution: reviewDistribution(REVIEWS),
  };
}

/**
 * Pick a representative review for a given week mark. Used by the
 * 8-Week Pattern band. Returns the first match deterministically so
 * the band stays stable across renders. We also bias toward the
 * formula passed in so the band reads coherent on PDPs.
 */
export function reviewForWeekMark(
  weekMark: 2 | 5 | 8,
  formula?: 'male' | 'female',
): Review | null {
  const matches = REVIEWS.filter((r) => r.weekMark === weekMark);
  if (formula) {
    const preferred = matches.find(
      (r) => r.formula === formula || r.formula === 'both',
    );
    if (preferred) return preferred;
  }
  return matches[0] ?? null;
}
