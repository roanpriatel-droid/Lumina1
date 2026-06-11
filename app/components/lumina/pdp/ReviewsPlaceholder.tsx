import {Link} from 'react-router';
import {ArrowUpRight} from 'lucide-react';
import {Eyebrow} from '~/components/lumina/Eyebrow';
import {StarRating} from '~/components/lumina/StarRating';
import type {LuminaProduct} from '~/lib/lumina-data';
import {REVIEWS, reviewAggregate, type Review} from '~/data/reviews';

interface ReviewsPlaceholderProps {
  product: LuminaProduct;
}

/**
 * PDP review band — pulled from the same dataset as /pages/reviews
 * and the homepage Proof Wall. We render 4 representative reviews
 * (one pull-quote + three standard) so the section reads like the
 * surface of a real wall of feedback rather than four hand-tuned
 * "themes."
 *
 * Aggregate (star avg + verified count) is derived from the dataset
 * for the matching formula. Until the verified-review platform
 * lands, this is single source of truth.
 */
export function ReviewsPlaceholder({product}: ReviewsPlaceholderProps) {
  const formula = product.key === 'male' ? 'male' : 'female';
  const aggregate = reviewAggregate(formula);

  // Pick 1 pull-quote + 3 standard cards for this formula. If the
  // pull-quote isn't there for the formula, fall back to a standard.
  const formulaReviews = REVIEWS.filter(
    (r) => r.formula === formula || r.formula === 'both',
  );
  const pull =
    formulaReviews.find((r) => r.kind === 'pull-quote') ?? null;
  const standards = formulaReviews
    .filter((r) => r.kind === 'standard' && Boolean(r.headline))
    .slice(0, 3);
  const cards: Review[] = pull ? [pull, ...standards] : standards.slice(0, 4);

  return (
    <section className="border-t border-border bg-black">
      <div className="mx-auto max-w-[1200px] px-6 py-20 md:px-8">
        <Eyebrow className="mb-4">What people are saying</Eyebrow>
        <div className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <h2
            className="m-0 max-w-[760px] text-fg1"
            style={{
              font: '300 38px/1.1 var(--font-sans)',
              letterSpacing: '-0.01em',
            }}
          >
            From customers running the {formula === 'male' ? 'male' : 'female'} formula.
          </h2>
          <div className="flex items-center gap-4 rounded-lg border border-border bg-surface px-5 py-4">
            <StarRating size={18} label={`${aggregate.average} of 5`} />
            <div className="flex items-baseline gap-2">
              <span
                className="text-fg1"
                style={{font: '400 22px/1 var(--font-sans)'}}
              >
                {aggregate.average.toFixed(1)}
              </span>
              <span className="text-xs uppercase tracking-[0.12em] text-fg3">
                / 5
              </span>
            </div>
            <span className="text-xs uppercase tracking-[0.12em] text-fg3">
              · {aggregate.count.toLocaleString()} reviewing this formula
            </span>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {cards.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/pages/reviews"
            prefetch="intent"
            className="inline-flex items-center gap-2 text-sm font-medium text-crimson-hi underline-offset-4 hover:underline"
          >
            See all reviews
            <ArrowUpRight size={14} strokeWidth={2} />
          </Link>
          <p className="t-mono text-[11px] uppercase tracking-[0.14em] text-fg4">
            * Until the platform migration completes, reviews are sourced from
            <code className="mx-1 rounded bg-surface px-1 py-0.5">app/data/reviews.ts</code>.
          </p>
        </div>
      </div>
    </section>
  );
}

function ReviewCard({review}: {review: Review}) {
  const isPullQuote = review.kind === 'pull-quote';
  if (isPullQuote) {
    return (
      <article className="glow-frame glow-frame-base glow-frame-rest relative flex flex-col gap-4 overflow-hidden rounded-xl px-7 py-7">
        <span className="text-crimson" aria-hidden>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 7h4v4H8c0 2 1 3 3 3v2c-3 0-5-2-5-5V7zm8 0h4v4h-3c0 2 1 3 3 3v2c-3 0-5-2-5-5V7z" />
          </svg>
        </span>
        <p
          className="m-0 italic text-fg1"
          style={{
            font: 'italic 300 24px/1.35 var(--font-sans)',
            letterSpacing: '-0.01em',
          }}
        >
          &ldquo;{review.body}&rdquo;
        </p>
        <span className="t-mono text-[11px] uppercase tracking-[0.14em] text-fg4">
          {review.name} · {review.tier}
        </span>
      </article>
    );
  }

  return (
    <div className="glow-frame-on-hover-rest rounded-xl border border-border bg-surface px-7 py-7">
      <StarRating size={15} label={`${review.rating} of 5 stars`} />
      {review.headline && (
        <h3 className="mt-4 text-[18px] font-medium leading-snug text-fg1">
          {review.headline}
        </h3>
      )}
      <p
        className="m-0 mt-3 text-fg3"
        style={{font: '400 15px/1.65 var(--font-sans)'}}
      >
        {review.body}
      </p>
      <span className="t-mono mt-4 inline-block text-[11px] uppercase tracking-[0.14em] text-fg4">
        {review.name}
        {review.region && <span className="text-fg4">, {review.region}</span>} ·{' '}
        {review.tier}
      </span>
    </div>
  );
}
