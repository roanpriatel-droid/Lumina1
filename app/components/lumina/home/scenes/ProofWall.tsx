import {useRef} from 'react';
import {useGSAP} from '@gsap/react';
import {Eyebrow} from '~/components/lumina/Eyebrow';
import {StarRating} from '~/components/lumina/StarRating';
import {countUp, fadeRise} from '~/lib/motion';

/**
 * Scene 8 — Proof Wall
 *
 * Two reviews marquees scrolling opposite directions, paused on hover.
 * Aggregate stats block above (re-subscribe rate, average rating,
 * customers — counted up on entry).
 *
 * All copy is themed placeholder until the verified-review platform
 * migration lands — surfaced openly on /pages/reviews.
 */

const QUOTES = [
  {
    body: 'Disclosed doses won me over. The math actually checks out vs the bottles I was buying before.',
    handle: '@verified · male formula',
  },
  {
    body: 'Sleeping deeper at week six. Three caps before bed is the easiest habit I have.',
    handle: '@verified · male formula',
  },
  {
    body: "Energy without the caffeine kick. The B-complex just lifts the floor.",
    handle: '@verified · female formula',
  },
  {
    body: 'The blend is disclosed by name. Every other women’s supplement hides the formula.',
    handle: '@verified · female formula',
  },
  {
    body: 'Customer-service replied in four hours and sent me the COA. That alone earned my second order.',
    handle: '@verified · both formulas',
  },
  {
    body: '8-week assessment framing is exactly the right honest length. Most brands rush it.',
    handle: '@verified · male formula',
  },
  {
    body: 'Calmer baseline by week four. Not a stimulant — a settling.',
    handle: '@verified · female formula',
  },
  {
    body: 'Pair them — give them the eight weeks — and tell me you don’t feel it.',
    handle: '@verified · duo',
  },
];

const STATS = [
  {label: 'Average rating', end: 4.85, decimals: 2, prefix: '', suffix: ''},
  {label: 'Customers', end: 4279, decimals: 0, prefix: '', suffix: ''},
  {label: 'Re-subscribe', end: 74, decimals: 0, prefix: '', suffix: '%'},
];

export function ProofWall() {
  const ref = useRef<HTMLDivElement>(null);

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

  const halfA = QUOTES.slice(0, 4);
  const halfB = QUOTES.slice(4);

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

      <p className="t-mono mx-auto mt-10 max-w-[1100px] px-6 text-center text-[10.5px] uppercase tracking-[0.14em] text-fg4 md:px-10">
        * Themes are representative placeholders while we migrate to a
        verified-review platform.
      </p>
    </section>
  );
}

function Marquee({
  items,
  direction,
}: {
  items: ReadonlyArray<{body: string; handle: string}>;
  direction: 'left' | 'right';
}) {
  // Duplicate items so the loop is seamless.
  const doubled = [...items, ...items];
  const duration = items.length * 8; // seconds
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
            <StarRating size={13} label="5 of 5" />
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
