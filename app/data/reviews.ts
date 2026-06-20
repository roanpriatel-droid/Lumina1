// Real customer reviews go here once the review-platform integration
// (Okendo / Junip / Stamped) is live. Until then the dataset is empty —
// no fabricated entries, no placeholder testimonials, no aggregates.
//
// The shape + selectors stay so the consuming components can be re-
// wired to a real source by swapping `REVIEWS` for an async fetcher
// without touching the homepage / PDP / reviews-page render paths.

export type ReviewFormula = 'male' | 'female' | 'both';
export type ReviewTier = '1-month' | '2-month' | '3-month' | '6-month' | '12-month';
export type ReviewKind = 'standard' | 'spotlight' | 'pull-quote';

export interface Review {
  id: string;
  rating: 1 | 2 | 3 | 4 | 5;
  formula: ReviewFormula;
  tier: ReviewTier;
  /** True when the order is verified on file. */
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

export const REVIEWS: ReadonlyArray<Review> = [];

/* ====================================================================
   Selectors. Pure, derivable from REVIEWS so swapping in a real
   source (or filtering) just requires the same data shape. All
   handle the empty-state by returning empty / zeroed results.
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

/** Aggregate rating across a slice of reviews. Returns 0 for an empty set. */
export function reviewAverage(
  reviews: ReadonlyArray<Review> = REVIEWS,
): number {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
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
 * Pick a representative review for a given week mark. Returns null for
 * an empty dataset so the consuming UI can render an honest empty card.
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
