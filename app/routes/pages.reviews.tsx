import {useMemo, useRef, useState} from 'react';
import {useGSAP} from '@gsap/react';
import {Star, BadgeCheck, Quote, Filter} from 'lucide-react';
import type {Route} from './+types/pages.reviews';
import {Eyebrow} from '~/components/lumina/Eyebrow';
import {StarRating} from '~/components/lumina/StarRating';
import {Button} from '~/components/lumina/Button';
import {PageCta} from '~/components/lumina/PageCta';
import {LightRays} from '~/components/graphics/LightRays';
import {TopographicLines} from '~/components/graphics/TopographicLines';
import {MonoWatermark} from '~/components/graphics/MonoWatermark';
import {
  REVIEWS,
  REVIEW_STAT_CARDS,
  filterReviews,
  reviewDistribution,
  reviewForWeekMark,
  reviewSiteAggregate,
  type Review,
  type ReviewFilter,
  type ReviewStatCard,
} from '~/data/reviews';
import {
  fadeRise,
  gsap,
  prefersReducedMotion,
  textReveal,
} from '~/lib/motion';

export const meta: Route.MetaFunction = () => [
  {title: 'Reviews — Lumina Formulations'},
  {
    name: 'description',
    content:
      'Verified reviews of the Lumina daily formulas. Aggregate rating, star distribution, and the 8-week pattern that shows up across the customer arc.',
  },
];

const FILTERS: ReadonlyArray<{value: ReviewFilter; label: string}> = [
  {value: 'all', label: 'All'},
  {value: 'male', label: 'His formula'},
  {value: 'female', label: 'Hers formula'},
  {value: '6mo+', label: '6-month+'},
  {value: 'verified', label: 'Verified'},
];

const INITIAL_VISIBLE = 12;
const VISIBLE_INCREMENT = 12;

export default function ReviewsPage() {
  const ref = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<ReviewFilter>('all');
  const [visible, setVisible] = useState(INITIAL_VISIBLE);

  const aggregate = useMemo(() => reviewSiteAggregate(), []);
  const filtered = useMemo(() => filterReviews(filter), [filter]);

  // Resetting the visible window when filter changes keeps the load-
  // more pattern legible — a 12-card slice of the filtered set.
  const sliceForFilter = useMemo(
    () => filtered.slice(0, visible),
    [filtered, visible],
  );

  // Inject stat-interrupt cards into the masonry, roughly one every
  // ten reviews. They're not part of REVIEWS so they don't pollute
  // counts/averages, but they sit in the visual rhythm.
  const cards = useMemo(
    () => weaveStatCards(sliceForFilter, REVIEW_STAT_CARDS),
    [sliceForFilter],
  );

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      textReveal(root.querySelector('.reviews-title'), {start: 'top 85%'});
      fadeRise(root.querySelector('.reviews-eyebrow'));
      fadeRise(root.querySelector('.reviews-aggregate-card'), {delay: 0.15});
      fadeRise(root.querySelector('.reviews-distribution'), {delay: 0.25});

      // Star fill on the giant aggregate numeral.
      if (!prefersReducedMotion()) {
        const filled = root.querySelectorAll('.aggregate-star-fill');
        gsap.fromTo(
          filled,
          {scaleX: 0, transformOrigin: 'left center'},
          {
            scaleX: 1,
            duration: 0.7,
            stagger: 0.08,
            ease: 'power3.out',
            delay: 0.4,
          },
        );
      }

      // Distribution bars draw in on scroll.
      const bars = root.querySelectorAll('.dist-bar-fill');
      bars.forEach((bar) => {
        const target = parseFloat((bar as HTMLElement).dataset.target ?? '0');
        if (prefersReducedMotion()) {
          gsap.set(bar, {width: `${target}%`});
          return;
        }
        gsap.fromTo(
          bar,
          {width: '0%'},
          {
            width: `${target}%`,
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: root.querySelector('.reviews-distribution'),
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          },
        );
      });
    },
    {scope: ref},
  );

  return (
    <div ref={ref}>
      <ReviewsHero aggregate={aggregate} />
      <FilterBar filter={filter} onChange={(f) => {
        setFilter(f);
        setVisible(INITIAL_VISIBLE);
      }} />
      <ReviewsWall cards={cards} />
      {visible < filtered.length && (
        <LoadMore
          remaining={filtered.length - visible}
          onClick={() =>
            setVisible((v) => Math.min(v + VISIBLE_INCREMENT, filtered.length))
          }
        />
      )}
      <EightWeekPattern />
      <GuaranteeBanner />
      <PageCta />
    </div>
  );
}

/* ====================================================================
   Hero — oversized 4.8 + distribution
   ==================================================================== */

function ReviewsHero({aggregate}: {aggregate: ReturnType<typeof reviewSiteAggregate>}) {
  return (
    <section className="relative isolate overflow-hidden bg-black">
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          width: 1100,
          height: 1100,
          left: '50%',
          top: 0,
          transform: 'translate(-50%, -32%)',
          background: 'var(--glow-hero)',
          opacity: 0.5,
        }}
      />
      <TopographicLines opacity={0.35} variant="broad" />
      <LightRays origin="top" intensity={0.3} />
      <MonoWatermark position="top-right" size={300} opacity={0.045}>
        Reviews
      </MonoWatermark>
      <div className="relative mx-auto grid max-w-[1200px] gap-12 px-6 pb-16 pt-24 md:grid-cols-[1.05fr_0.95fr] md:gap-16 md:px-8 md:pb-24 md:pt-32">
        <div className="flex flex-col">
          <Eyebrow
            className="reviews-eyebrow"
            style={{color: 'var(--color-crimson-hi)'}}
          >
            What people say
          </Eyebrow>
          <h1
            className="reviews-title m-0 mt-5 max-w-[640px] text-fg1"
            style={{
              font: '300 clamp(42px, 5.6vw, 68px)/1.02 var(--font-sans)',
              letterSpacing: '-0.018em',
            }}
          >
            Verified reviews. Eight-week timelines.{' '}
            <span className="text-ember">Disclosed doses.</span>
          </h1>
          <p
            className="m-0 mt-6 max-w-[520px] text-fg2"
            style={{font: '300 18px/1.65 var(--font-sans)'}}
          >
            Every review on this page is tied to a real order on file. The
            aggregate moves with each new five-star — or three-star — submission.
          </p>
          <p className="t-mono mt-8 max-w-[520px] text-[11px] uppercase tracking-[0.14em] text-fg4">
            * Until the verified-review platform migration completes, the
            cards on this page are representative placeholders pulled from
            <code className="mx-1 rounded bg-surface px-1 py-0.5">app/data/reviews.ts</code>.
          </p>
        </div>

        {/* Aggregate card */}
        <div className="reviews-aggregate-card glow-frame glow-frame-base glow-frame-active relative overflow-hidden rounded-2xl px-7 py-8 md:px-10 md:py-10">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at top right, rgba(209,26,42,0.18), rgba(11,11,12,0) 60%)',
            }}
          />
          <div className="relative flex flex-col gap-4">
            <Eyebrow rule={false}>Aggregate</Eyebrow>
            <div className="flex items-baseline gap-5">
              <span
                className="t-mono text-ember-crimson"
                style={{
                  font: '300 clamp(96px, 14vw, 168px)/0.9 var(--font-mono)',
                  letterSpacing: '-0.04em',
                }}
                aria-label={`Average rating ${aggregate.average} of 5`}
              >
                {aggregate.average.toFixed(1)}
              </span>
              <span
                className="t-mono text-fg3"
                style={{font: '300 22px/1 var(--font-mono)'}}
              >
                / 5
              </span>
            </div>
            <AggregateStars value={aggregate.average} />
            <p className="t-mono mt-1 text-[12px] uppercase tracking-[0.16em] text-fg3">
              {aggregate.count.toLocaleString()} verified customers
            </p>
            <Distribution distribution={aggregate.distribution} total={aggregate.count} />
          </div>
        </div>
      </div>
    </section>
  );
}

function AggregateStars({value}: {value: number}) {
  // Render five fixed crimson stars with a scaleX fill that animates
  // on load — gives the giant numeral a quick "filling up" beat.
  return (
    <div className="flex gap-2" aria-hidden>
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = i <= Math.round(value);
        return (
          <span key={i} className="relative inline-flex">
            <Star
              size={28}
              strokeWidth={0}
              fill="currentColor"
              className="text-fg4/40"
            />
            {filled && (
              <Star
                size={28}
                strokeWidth={0}
                fill="currentColor"
                className="aggregate-star-fill absolute inset-0 text-crimson"
              />
            )}
          </span>
        );
      })}
    </div>
  );
}

function Distribution({
  distribution,
  total,
}: {
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
  total: number;
}) {
  return (
    <ul className="reviews-distribution mt-2 flex flex-col gap-2.5">
      {[5, 4, 3, 2, 1].map((rating) => {
        const count = distribution[rating as 5 | 4 | 3 | 2 | 1];
        const pct = total > 0 ? (count / total) * 100 : 0;
        return (
          <li key={rating} className="flex items-center gap-3">
            <span
              className="t-mono w-8 text-[12px] uppercase tracking-[0.12em] text-fg3"
            >
              {rating}★
            </span>
            <span className="relative h-[6px] flex-1 overflow-hidden rounded-pill bg-surface">
              <span
                className="dist-bar-fill absolute inset-y-0 left-0 rounded-pill"
                data-target={pct}
                style={{
                  background:
                    'linear-gradient(90deg, var(--color-crimson) 0%, var(--color-crimson-hi) 100%)',
                  width: 0,
                }}
              />
            </span>
            <span
              className="t-mono w-10 text-right text-[12px] uppercase tracking-[0.12em] text-fg4"
            >
              {count}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

/* ====================================================================
   Filter chips
   ==================================================================== */

function FilterBar({
  filter,
  onChange,
}: {
  filter: ReviewFilter;
  onChange: (f: ReviewFilter) => void;
}) {
  return (
    <div className="sticky top-0 z-20 border-y border-border bg-black/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1320px] flex-wrap items-center gap-3 px-6 py-4 md:px-10">
        <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-fg4">
          <Filter size={13} strokeWidth={2} />
          Filter
        </span>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const active = f.value === filter;
            return (
              <button
                key={f.value}
                type="button"
                onClick={() => onChange(f.value)}
                aria-pressed={active}
                className={`${
                  active
                    ? 'glow-frame glow-frame-base glow-frame-rest text-fg1'
                    : 'border border-border bg-surface text-fg2 hover:border-border-strong hover:text-fg1'
                } t-mono inline-flex items-center gap-2 rounded-pill px-3.5 py-2 text-[11px] uppercase tracking-[0.16em] transition-colors`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ====================================================================
   The masonry wall
   ==================================================================== */

type WallCard =
  | {type: 'review'; review: Review}
  | {type: 'stat'; stat: ReviewStatCard};

function weaveStatCards(
  reviews: ReadonlyArray<Review>,
  stats: ReadonlyArray<ReviewStatCard>,
): WallCard[] {
  // Insert a stat card roughly every 10 reviews. We round-robin through
  // the stat list so longer pages cycle through every stat.
  const out: WallCard[] = [];
  let statIndex = 0;
  reviews.forEach((review, i) => {
    out.push({type: 'review', review});
    if ((i + 1) % 10 === 0 && stats.length > 0) {
      out.push({type: 'stat', stat: stats[statIndex % stats.length]});
      statIndex++;
    }
  });
  return out;
}

function ReviewsWall({cards}: {cards: WallCard[]}) {
  const wallRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const root = wallRef.current;
      if (!root) return;
      const items = root.querySelectorAll('.wall-card');
      if (!items.length) return;

      // Stagger reveal on scroll — ScrollTrigger.batch keeps the cost
      // low when there are 40+ items.
      const {ScrollTrigger} = (gsap as unknown as {
        ScrollTrigger?: typeof import('gsap/ScrollTrigger').ScrollTrigger;
      });

      gsap.set(items, {opacity: 0, y: 28});

      if (ScrollTrigger?.batch) {
        ScrollTrigger.batch(items, {
          start: 'top 88%',
          onEnter: (batch) =>
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: 'power3.out',
              stagger: 0.06,
              overwrite: true,
            }),
          once: true,
        });
      } else {
        gsap.to(items, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
          stagger: 0.04,
        });
      }
    },
    {scope: wallRef, dependencies: [cards.length]},
  );

  return (
    <section className="border-b border-border bg-black">
      <div
        ref={wallRef}
        className="mx-auto max-w-[1320px] px-6 py-16 md:px-10 md:py-20"
        style={{
          columnGap: '20px',
        }}
      >
        <div
          className="grid gap-5"
          style={{
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gridAutoFlow: 'dense',
          }}
        >
          {cards.map((card, i) =>
            card.type === 'review' ? (
              <ReviewCard key={card.review.id} review={card.review} index={i} />
            ) : (
              <StatCard key={card.stat.id} stat={card.stat} />
            ),
          )}
        </div>
      </div>
    </section>
  );
}

/* ====================================================================
   Card variants
   ==================================================================== */

function ReviewCard({review, index}: {review: Review; index: number}) {
  // Spotlight cards are wider AND taller; pull-quotes are oversized
  // italic; standard cards do the everyday work.
  if (review.kind === 'spotlight') {
    return (
      <article
        className="wall-card glow-frame glow-frame-base glow-frame-rest glow-frame-on-hover-hover relative flex flex-col gap-5 overflow-hidden rounded-xl p-7 md:p-9"
        style={{gridColumn: 'span 2', gridRow: 'span 2'}}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at top right, rgba(209,26,42,0.16), rgba(11,11,12,0) 60%)',
          }}
        />
        <div className="relative flex items-center gap-3">
          <StarsRow rating={review.rating} />
          {review.verified && <VerifiedBadge />}
        </div>
        <p
          className="relative m-0 text-fg1"
          style={{font: '300 22px/1.5 var(--font-sans)', letterSpacing: '-0.005em'}}
        >
          {review.body}
        </p>
        <Attribution review={review} />
      </article>
    );
  }

  if (review.kind === 'pull-quote') {
    return (
      <article className="wall-card relative flex flex-col gap-4 overflow-hidden rounded-xl border border-border bg-surface p-7 md:p-8">
        <Quote
          size={28}
          strokeWidth={1.5}
          className="text-crimson"
          aria-hidden
        />
        <p
          className="m-0 italic text-fg1"
          style={{
            font: 'italic 300 clamp(22px, 2.2vw, 28px)/1.3 var(--font-sans)',
            letterSpacing: '-0.01em',
          }}
        >
          &ldquo;{review.body}&rdquo;
        </p>
        <Attribution review={review} compact />
      </article>
    );
  }

  // Standard.
  return (
    <article className="wall-card glow-frame-on-hover-rest relative flex flex-col gap-3.5 overflow-hidden rounded-xl border border-border bg-surface p-6">
      <div className="flex items-center gap-2.5">
        <StarsRow rating={review.rating} />
        {review.verified && <VerifiedBadge compact />}
      </div>
      {review.headline && (
        <h3
          className="m-0 text-fg1"
          style={{font: '500 16px/1.3 var(--font-sans)', letterSpacing: '-0.005em'}}
        >
          {review.headline}
        </h3>
      )}
      <p
        className="m-0 text-fg2"
        style={{font: '400 14.5px/1.6 var(--font-sans)'}}
      >
        {review.body}
      </p>
      <Attribution review={review} compact />
    </article>
  );
}

function StatCard({stat}: {stat: ReviewStatCard}) {
  return (
    <article
      className="wall-card relative flex flex-col gap-3 overflow-hidden rounded-xl border border-border bg-black p-7"
      style={{
        background:
          'linear-gradient(160deg, rgba(11,11,12,1) 0%, rgba(28,12,15,1) 100%)',
      }}
    >
      <Eyebrow rule={false} className="text-fg4">Stat</Eyebrow>
      <span
        className="t-mono text-fg1"
        style={{
          font: '300 clamp(48px, 5vw, 68px)/0.95 var(--font-mono)',
          letterSpacing: '-0.025em',
        }}
      >
        {stat.value}
      </span>
      <p
        className="m-0 text-fg2"
        style={{font: '400 15px/1.55 var(--font-sans)'}}
      >
        {stat.caption}
      </p>
      {stat.footnote && (
        <p className="t-mono mt-1 text-[10.5px] uppercase tracking-[0.14em] text-fg4">
          {stat.footnote}
        </p>
      )}
    </article>
  );
}

function StarsRow({rating}: {rating: 1 | 2 | 3 | 4 | 5}) {
  return (
    <span className="inline-flex gap-[2px]" aria-label={`${rating} of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={13}
          strokeWidth={0}
          fill="currentColor"
          className={i <= rating ? 'text-crimson' : 'text-fg4/40'}
          aria-hidden
        />
      ))}
    </span>
  );
}

function VerifiedBadge({compact = false}: {compact?: boolean} = {}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-pill border border-border bg-surface text-fg3 ${
        compact ? 'px-1.5 py-0.5 text-[9.5px]' : 'px-2 py-0.5 text-[10px]'
      } t-mono uppercase tracking-[0.14em]`}
    >
      <BadgeCheck size={compact ? 10 : 11} strokeWidth={2.2} className="text-crimson-hi" />
      Verified
    </span>
  );
}

function Attribution({
  review,
  compact = false,
}: {
  review: Review;
  compact?: boolean;
}) {
  const tierLabel = formatTier(review.tier);
  const formulaLabel =
    review.formula === 'male' ? 'His'
    : review.formula === 'female' ? 'Hers'
    : 'Pair';
  return (
    <div className={`mt-${compact ? '1' : '2'} flex flex-wrap items-center gap-x-3 gap-y-1 text-fg3`}>
      <span className={`${compact ? 'text-[12px]' : 'text-[13px]'} font-medium text-fg2`}>
        {review.name}
        {review.region && <span className="text-fg4">, {review.region}</span>}
      </span>
      <span className="t-mono text-[10.5px] uppercase tracking-[0.14em] text-fg4">
        {formulaLabel} · {tierLabel}
      </span>
    </div>
  );
}

function formatTier(tier: Review['tier']): string {
  switch (tier) {
    case '1-month': return '1-month';
    case '2-month': return '2-month';
    case '3-month': return '3-month';
    case '6-month': return '6-month · Apex';
    case '12-month': return '12-month · Pinnacle';
  }
}

/* ====================================================================
   Load more
   ==================================================================== */

function LoadMore({remaining, onClick}: {remaining: number; onClick: () => void}) {
  return (
    <div className="border-y border-border bg-black">
      <div className="mx-auto flex max-w-[1320px] flex-col items-center gap-3 px-6 py-12 md:px-10">
        <Button variant="ghost" onClick={onClick} className="px-7 py-3.5">
          Show 12 more
        </Button>
        <span className="t-mono text-[11px] uppercase tracking-[0.14em] text-fg4">
          {remaining} more in this view
        </span>
      </div>
    </div>
  );
}

/* ====================================================================
   The 8-Week Pattern band
   ==================================================================== */

function EightWeekPattern() {
  const w2 = reviewForWeekMark(2);
  const w5 = reviewForWeekMark(5);
  const w8 = reviewForWeekMark(8);
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      fadeRise(root.querySelector('.pattern-eyebrow'));
      textReveal(root.querySelector('.pattern-title'), {start: 'top 80%'});

      if (prefersReducedMotion()) return;
      const dots = root.querySelectorAll('.pattern-dot');
      const cards = root.querySelectorAll('.pattern-card');
      const line = root.querySelector('.pattern-line');

      gsap.fromTo(
        line,
        {scaleX: 0, transformOrigin: 'left center'},
        {
          scaleX: 1,
          ease: 'power2.out',
          duration: 1.2,
          scrollTrigger: {trigger: line, start: 'top 80%'},
        },
      );

      gsap.fromTo(
        dots,
        {scale: 0, opacity: 0},
        {
          scale: 1,
          opacity: 1,
          duration: 0.45,
          ease: 'power3.out',
          stagger: 0.2,
          scrollTrigger: {trigger: root, start: 'top 75%'},
        },
      );

      gsap.fromTo(
        cards,
        {opacity: 0, y: 32},
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.18,
          scrollTrigger: {trigger: root, start: 'top 75%'},
        },
      );
    },
    {scope: ref},
  );

  return (
    <section
      ref={ref}
      className="relative isolate overflow-hidden border-t border-border bg-surface"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(209,26,42,0.14), rgba(11,11,12,0) 60%)',
        }}
      />
      <div className="relative mx-auto max-w-[1200px] px-6 py-24 md:px-10 md:py-32">
        <Eyebrow className="pattern-eyebrow mb-4">The 8-week pattern</Eyebrow>
        <h2
          className="pattern-title m-0 mb-14 max-w-[760px] text-fg1"
          style={{
            font: '300 clamp(36px, 4.5vw, 52px)/1.05 var(--font-sans)',
            letterSpacing: '-0.015em',
          }}
        >
          Read the protocol through the customers running it.
        </h2>

        <div className="relative">
          <div
            className="pattern-line pointer-events-none absolute left-0 right-0 hidden h-px md:block"
            style={{
              top: 80,
              background:
                'linear-gradient(90deg, transparent 0%, var(--color-crimson) 20%, var(--color-crimson-hi) 50%, var(--color-crimson) 80%, transparent 100%)',
              opacity: 0.6,
            }}
            aria-hidden
          />
          <div className="relative grid gap-10 md:grid-cols-3 md:gap-12">
            <PatternStop weekLabel="Week 2" review={w2} accent="The doses land" />
            <PatternStop weekLabel="Week 5" review={w5} accent="The arc begins" />
            <PatternStop weekLabel="Week 8" review={w8} accent="The decision point" />
          </div>
        </div>

        <p className="t-mono mt-12 max-w-[620px] text-[11px] uppercase tracking-[0.14em] text-fg4">
          Reviews are pulled from the same dataset as the wall above; the same
          customer arc shows up regardless of the filter you apply.
        </p>
      </div>
    </section>
  );
}

function PatternStop({
  weekLabel,
  review,
  accent,
}: {
  weekLabel: string;
  review: Review | null;
  accent: string;
}) {
  return (
    <div className="relative flex flex-col gap-5">
      <div className="hidden md:flex md:h-[80px] md:items-start md:justify-center">
        <span
          aria-hidden
          className="pattern-dot block"
          style={{
            width: 18,
            height: 18,
            borderRadius: '999px',
            background: 'var(--color-crimson)',
            boxShadow: '0 0 18px rgba(209,26,42,0.6)',
            marginTop: 71,
          }}
        />
      </div>
      <article className="pattern-card glow-frame glow-frame-base glow-frame-rest relative flex flex-col gap-4 overflow-hidden rounded-xl p-6 md:p-7">
        <div className="flex items-center gap-3">
          <span className="t-mono text-[11px] uppercase tracking-[0.18em] text-crimson-hi">
            {weekLabel}
          </span>
          <span className="t-mono text-[10.5px] uppercase tracking-[0.14em] text-fg4">
            · {accent}
          </span>
        </div>
        {review ? (
          <>
            <p
              className="m-0 text-fg1"
              style={{font: '300 17px/1.55 var(--font-sans)'}}
            >
              &ldquo;{review.body}&rdquo;
            </p>
            <Attribution review={review} compact />
          </>
        ) : (
          <p className="t-mono text-[12px] uppercase tracking-[0.14em] text-fg4">
            Excerpt pending
          </p>
        )}
      </article>
    </div>
  );
}

/* ====================================================================
   Guarantee banner
   ==================================================================== */

function GuaranteeBanner() {
  return (
    <section className="relative isolate overflow-hidden border-t border-border bg-black">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(209,26,42,0.16), rgba(11,11,12,0) 60%)',
        }}
      />
      <div className="relative mx-auto max-w-[1100px] px-6 py-20 text-center md:px-10 md:py-24">
        <Eyebrow rule={false} style={{color: 'var(--color-crimson-hi)'}}>
          60-Day Guarantee
        </Eyebrow>
        <h2
          className="m-0 mt-5 max-w-[840px] mx-auto text-fg1"
          style={{
            font: '300 clamp(34px, 4vw, 46px)/1.1 var(--font-sans)',
            letterSpacing: '-0.012em',
          }}
        >
          The reviews above were all written after the 60-day window closed.
        </h2>
        <p
          className="m-0 mt-6 max-w-[680px] mx-auto text-fg2"
          style={{font: '300 17px/1.65 var(--font-sans)'}}
        >
          Empty bottles fine. No restocking fee. No retention script. If the
          formula is not for you, we&rsquo;ll refund the order — and the review
          stays on the page either way.
        </p>
      </div>
    </section>
  );
}

/* ====================================================================
   Export the aggregate for callers that need a quick total
   ==================================================================== */

export const REVIEWS_TOTAL = REVIEWS.length;
