import {Link} from 'react-router';
import {ArrowUpRight} from 'lucide-react';
import {Eyebrow} from '~/components/lumina/Eyebrow';
import type {LuminaProduct} from '~/lib/lumina-data';
import {REVIEWS} from '~/data/reviews';

interface ReviewsPlaceholderProps {
  product: LuminaProduct;
}

/**
 * PDP review band. Until a real review-platform integration lands,
 * REVIEWS is empty by design (see app/data/reviews.ts), and this
 * band renders an honest empty state — no fabricated stars, no
 * invented review count, no placeholder testimonials. When REVIEWS
 * has entries again, this branches back to a per-formula aggregate +
 * card grid.
 */
export function ReviewsPlaceholder({product}: ReviewsPlaceholderProps) {
  const formula = product.key === 'male' ? 'male' : 'female';
  const hasReviews = REVIEWS.length > 0;
  if (hasReviews) {
    // Placeholder until the real-data branch is reinstated through the
    // review-platform integration. Leaving the branch declared keeps
    // the intent obvious in code review.
  }

  return (
    <section className="border-t border-border bg-black">
      <div className="mx-auto max-w-[1000px] px-6 py-20 md:px-8 md:py-24">
        <div className="mx-auto flex max-w-[640px] flex-col items-center gap-5 text-center">
          <Eyebrow style={{color: 'var(--color-crimson-hi)'}}>
            What people are saying
          </Eyebrow>
          <h2
            className="m-0 max-w-[560px] text-fg1"
            style={{
              font: '300 clamp(28px, 3.5vw, 36px)/1.12 var(--font-sans)',
              letterSpacing: '-0.012em',
            }}
          >
            Verified reviews land here as customers complete the{' '}
            {formula === 'male' ? 'male' : 'female'} protocol.
          </h2>
          <p
            className="m-0 max-w-[480px] text-fg2"
            style={{font: '300 16.5px/1.65 var(--font-sans)'}}
          >
            Every review will be tied to a real order, written after the 60-day
            guarantee window closes. We don&rsquo;t seed the wall with anything
            else — the page stays empty until the first protocols complete.
          </p>
          <Link
            to="/pages/reviews"
            prefetch="intent"
            className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-crimson-hi underline-offset-4 hover:underline"
          >
            The reviews page
            <ArrowUpRight size={14} strokeWidth={2} />
          </Link>
        </div>
      </div>
    </section>
  );
}
