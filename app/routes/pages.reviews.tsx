import type {Route} from './+types/pages.reviews';
import {PageHero} from '~/components/lumina/PageChrome';
import {PageCta} from '~/components/lumina/PageCta';
import {Eyebrow} from '~/components/lumina/Eyebrow';
import {REVIEWS} from '~/data/reviews';

export const meta: Route.MetaFunction = () => [
  {title: 'Reviews — Lumina Formulations'},
  {
    name: 'description',
    content:
      'Verified reviews of the Lumina daily formulas — appearing here as our first customers complete their 8-week protocols. No seeded testimonials, no inflated counts.',
  },
];

/**
 * Until a real review-platform integration lands, the dataset at
 * app/data/reviews.ts is empty by design and this page renders an
 * honest empty state. When REVIEWS gains entries, this route can
 * branch on REVIEWS.length and re-introduce the aggregate, the
 * masonry wall, and the 8-Week Pattern band (all of which live in
 * git history).
 */
export default function ReviewsPage() {
  return (
    <div>
      <PageHero
        eyebrow="What people say"
        title="Verified reviews are on the way."
        lede="The Lumina formulas are built around an 8–12 week assessment window. We don't seed the reviews wall with synthetic quotes or invented counts — verified reviews will appear here as the first protocols complete."
      />
      <ReviewsEmptyState count={REVIEWS.length} />
      <PageCta />
    </div>
  );
}

function ReviewsEmptyState({count}: {count: number}) {
  return (
    <section className="border-t border-border bg-black">
      <div className="mx-auto max-w-[1000px] px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto flex max-w-[640px] flex-col items-center gap-6 text-center">
          <Eyebrow rule={false} style={{color: 'var(--color-crimson-hi)'}}>
            Coming
          </Eyebrow>
          <h2
            className="m-0 text-fg1"
            style={{
              font: '300 clamp(30px, 3.8vw, 42px)/1.1 var(--font-sans)',
              letterSpacing: '-0.012em',
            }}
          >
            Reviews are coming as our first customers complete their protocols.
          </h2>
          <p
            className="m-0 max-w-[520px] text-fg2"
            style={{font: '300 17px/1.65 var(--font-sans)'}}
          >
            Verified reviews — tied to a real order, written after the 60-day
            guarantee window closes — will appear here as they land. Until
            then this page stays empty rather than seeded.
          </p>
          <p className="t-mono mt-2 text-[10.5px] uppercase tracking-[0.18em] text-fg4">
            {count.toLocaleString()} verified reviews on file
          </p>
        </div>
      </div>
    </section>
  );
}
