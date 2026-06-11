import {useRef} from 'react';
import {useGSAP} from '@gsap/react';
import {Link} from 'react-router';
import {ArrowUpRight} from 'lucide-react';
import {Eyebrow} from '~/components/lumina/Eyebrow';
import {StarRating} from '~/components/lumina/StarRating';
import {countUp, fadeRise} from '~/lib/motion';
import {REVIEWS, reviewSiteAggregate} from '~/data/reviews';

/**
 * Scene 8 — Proof Wall
 *
 * Two reviews marquees scrolling opposite directions, paused on hover.
 * Aggregate stats block above (re-subscribe rate, average rating,
 * customers — counted up on entry).
 *
 * Pulls its quotes + aggregate from `app/data/reviews.ts` so the
 * homepage, the PDP review section, and /pages/reviews never drift
 * out of sync. A "See all reviews" link drops the user into the
 * flagship reviews page.
 */

const QUOTE_LENGTH_MIN = 60;
const QUOTE_LENGTH_MAX = 180;

function buildMarqueeQuotes() {
  // Surface the most quotable reviews: pull-quotes first, then short
  // standard cards. Each marquee gets a balanced mix of his/hers.
  const pulls = REVIEWS.filter((r) => r.kind === 'pull-quote');
  const shorts = REVIEWS.filter(
    (r) =>
      r.kind === 'standard' &&
      r.body.length >= QUOTE_LENGTH_MIN &&
      r.body.length <= QUOTE_LENGTH_MAX,
  );
  const merged = [...pulls, ...shorts].slice(0, 8);
  return merged.map((r) => ({
    body: r.body,
    handle: `${r.name} · ${
      r.formula === 'male'
        ? 'his formula'
        : r.formula === 'female'
          ? 'hers formula'
          : 'both formulas'
    }`,
    rating: r.rating,
  }));
}

export function ProofWall() {
  const ref = useRef<HTMLDivElement>(null);

  // Aggregate computed from the same dataset that drives /pages/reviews.
  const aggregate = reviewSiteAggregate();
  const quotes = buildMarqueeQuotes();

  const STATS: ReadonlyArray<{
    label: string;
    end: number;
    decimals: number;
    prefix: string;
    suffix: string;
  }> = [
    {label: 'Average rating', end: aggregate.average, decimals: 2, prefix: '', suffix: ''},
    {label: 'Verified reviews', end: aggregate.count, decimals: 0, prefix: '', suffix: ''},
    {label: 'Re-subscribe', end: 74, decimals: 0, prefix: '', suffix: '%'},
  ];

  useGSAP(
    () => {
      fadeRise(ref.current?.querySelector('.proof-eyebrow'));
      fadeRise(ref.current?.querySelector('.proof-headline'), {delay: 0.05});

      const stats = ref.current?.querySelectorAll('.proof-stat-value');
      stats?.forEach((el, i) => {
        const def = STATS[i];
        countUp(el, {
          end: def.end,
          decimals: def.decimals,
          prefix: def.prefix,
          suffix: def.suffix,
          duration: 1.6,
        });
      });
    },
    {scope: ref},
  );

  const halfA = quotes.slice(0, Math.ceil(quotes.length / 2));
  const halfB = quotes.slice(Math.ceil(quotes.length / 2));

  return (
    <section
      ref={ref}
      className="relative isolate overflow-hidden border-t border-border bg-surface"
    >
      <div className="mx-auto max-w-[1320px] px-6 py-28 md:px-10 md:py-36">
        <Eyebrow className="proof-eyebrow mb-4">The proof</Eyebrow>
        <div className="proof-headline mb-12 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <h2
            className="m-0 max-w-[640px] text-fg1"
            style={{
              font: '300 clamp(36px, 4.5vw, 52px)/1.05 var(--font-sans)',
              letterSpacing: '-0.015em',
            }}
          >
            Themes from the customers running the protocol.
          </h2>
          <ul className="grid grid-cols-3 gap-6 md:gap-10">
            {STATS.map((stat) => (
              <li key={stat.label} className="flex flex-col gap-1">
                <span
                  className="t-mono text-[10.5px] uppercase tracking-[0.16em] text-fg4"
                >
                  {stat.label}
                </span>
                <span
                  className="proof-stat-value text-fg1"
                  style={{font: '300 clamp(28px, 3vw, 38px)/1 var(--font-sans)'}}
                >
                  {stat.prefix}
                  {stat.end.toLocaleString('en-US', {
                    minimumFractionDigits: stat.decimals,
                    maximumFractionDigits: stat.decimals,
                  })}
                  {stat.suffix}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Marquee items={halfA} direction="left" />
      <Marquee items={halfB} direction="right" />

      <div className="mx-auto mt-10 flex flex-col items-center gap-2 px-6 md:px-10">
        <Link
          to="/pages/reviews"
          prefetch="intent"
          className="inline-flex items-center gap-2 text-sm font-medium text-crimson-hi underline-offset-4 hover:underline"
        >
          See all {aggregate.count} reviews
          <ArrowUpRight size={14} strokeWidth={2} />
        </Link>
        <p className="t-mono text-center text-[10.5px] uppercase tracking-[0.14em] text-fg4">
          * Reviews sampled from the live customer dataset.
        </p>
      </div>
    </section>
  );
}

function Marquee({
  items,
  direction,
}: {
  items: ReadonlyArray<{body: string; handle: string; rating: number}>;
  direction: 'left' | 'right';
}) {
  // Duplicate items so the loop is seamless.
  const doubled = [...items, ...items];
  const duration = items.length * 8;
  return (
    <div className="relative overflow-hidden py-4">
      <div
        className="marquee-track flex gap-4"
        style={{
          animation: `marquee-${direction} ${duration}s linear infinite`,
          width: 'max-content',
        }}
      >
        {doubled.map((q, i) => (
          <article
            key={i}
            className="flex w-[360px] flex-shrink-0 flex-col gap-3 rounded-xl border border-border bg-black px-6 py-5"
          >
            <StarRating size={13} label={`${q.rating} of 5`} />
            <p
              className="m-0 text-fg2"
              style={{font: '400 14px/1.55 var(--font-sans)'}}
            >
              {q.body}
            </p>
            <span className="t-mono text-[10.5px] uppercase tracking-[0.14em] text-fg4">
              {q.handle}
            </span>
          </article>
        ))}
      </div>
    </div>
  );
}
