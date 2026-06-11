import {useRef} from 'react';
import {useGSAP} from '@gsap/react';
import {Eyebrow} from '~/components/lumina/Eyebrow';
import {TopographicLines} from '~/components/graphics/TopographicLines';
import {MonoWatermark} from '~/components/graphics/MonoWatermark';
import {gsap, prefersReducedMotion} from '~/lib/motion';

/**
 * New homepage scene — The 8-Week Arc, cinematic version.
 *
 * Horizontal pinned timeline. As the user scrolls, the section stays
 * pinned and a drawing line extends from left to right, lighting up
 * milestone nodes in sequence. Each milestone has a week label and a
 * single sentence about what's happening biologically.
 *
 * The PDP has a smaller version of this beat (ResultsTimeline). This
 * one is meant to feel like a Swiss editorial pull-out.
 */

const MILESTONES = [
  {
    week: 'Week 1',
    title: 'Routine sets.',
    body: "The habit gets built. Minerals and B-vitamins reach working levels. No dramatic shift yet — that's the right read.",
  },
  {
    week: 'Week 2',
    title: 'Body adapts.',
    body: 'The protocol settles into the day. Most customers find the cadence becomes easier than skipping it.',
  },
  {
    week: 'Week 4',
    title: 'Baseline shifts.',
    body: 'Steadier daytime energy, smoother recovery, calmer baseline. The adaptogens have begun their slower build.',
  },
  {
    week: 'Week 6',
    title: 'Compounding.',
    body: 'Botanicals at working concentrations, sleep and recovery rhythms reinforced. The protocol is doing its work.',
  },
  {
    week: 'Week 8',
    title: 'Assessment.',
    body: "The supplier's instruction. The point at which you decide: keep going, or refund. Either is fine with us.",
  },
];

export function EightWeekArc() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        // Final-state markup is correct on its own — nothing to do.
        return;
      }
      const scene = ref.current;
      if (!scene) return;
      const track = scene.querySelector('.arc-track') as HTMLElement | null;
      const line = scene.querySelector('.arc-line') as HTMLElement | null;
      const dots = scene.querySelectorAll('.arc-dot');
      const cards = scene.querySelectorAll('.arc-card');
      if (!track || !line) return;

      // initial states
      gsap.set(line, {scaleX: 0, transformOrigin: 'left center'});
      gsap.set(dots, {scale: 0, opacity: 0.4});
      gsap.set(cards, {opacity: 0, y: 16});

      const totalWidth = track.scrollWidth - window.innerWidth;
      if (totalWidth <= 0) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scene,
          start: 'top top',
          end: () => `+=${totalWidth + window.innerHeight * 0.4}`,
          pin: true,
          pinSpacing: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(track, {x: -totalWidth, ease: 'none'}, 0);
      tl.to(line, {scaleX: 1, ease: 'none'}, 0);

      MILESTONES.forEach((_, i) => {
        const at = (i / (MILESTONES.length - 1)) * 0.95;
        tl.to(
          dots[i],
          {scale: 1, opacity: 1, duration: 0.2, ease: 'power2.out'},
          at,
        );
        tl.to(
          cards[i],
          {opacity: 1, y: 0, duration: 0.3, ease: 'power3.out'},
          at,
        );
      });
    },
    {scope: ref},
  );

  return (
    <section
      ref={ref}
      className="relative isolate overflow-hidden border-t border-border bg-black"
      aria-label="The 8-week assessment arc"
    >
      <TopographicLines opacity={0.4} variant="broad" />
      <MonoWatermark position="bottom-left" size={420} opacity={0.045}>
        EST. 8 WEEKS
      </MonoWatermark>

      {/* Static intro panel (sits at left edge of the horizontal track) */}
      <div className="arc-track relative flex" style={{willChange: 'transform'}}>
        <div
          className="flex flex-shrink-0 flex-col justify-center px-10 py-24 md:px-16 md:py-32"
          style={{width: '70vw', minWidth: 360}}
        >
          <Eyebrow style={{color: 'var(--color-crimson-hi)'}}>The arc</Eyebrow>
          <h2
            className="m-0 mt-5 text-fg1"
            style={{
              font: '300 clamp(38px, 5vw, 64px)/1.05 var(--font-sans)',
              letterSpacing: '-0.02em',
            }}
          >
            Eight weeks, week by week.
          </h2>
          <p
            className="m-0 mt-5 max-w-[440px] text-fg3"
            style={{font: '300 17px/1.65 var(--font-sans)'}}
          >
            The shape we expect consistency to take. Not a promise of an
            outcome — the cadence the formula is engineered around.
          </p>
        </div>

        {/* The timeline rail itself */}
        <div
          className="relative flex flex-shrink-0 items-center px-10 py-24 md:py-32"
          style={{width: `${MILESTONES.length * 50}vw`, minWidth: MILESTONES.length * 360}}
        >
          {/* Background track + drawing line */}
          <div
            aria-hidden
            className="absolute left-0 right-10 top-1/2 h-px -translate-y-1/2"
            style={{background: 'var(--color-border)'}}
          />
          <div
            aria-hidden
            className="arc-line absolute left-0 right-10 top-1/2 h-px -translate-y-1/2"
            style={{
              background:
                'linear-gradient(90deg, var(--color-crimson) 0%, var(--color-crimson-hi) 100%)',
              boxShadow: '0 0 24px rgba(209,26,42,0.4)',
            }}
          />

          {MILESTONES.map((m, i) => (
            <article
              key={m.week}
              className="relative flex flex-shrink-0 items-center justify-center"
              style={{
                width: `${100 / MILESTONES.length}%`,
                minWidth: 360,
              }}
            >
              <div className="flex flex-col items-center gap-5 text-center">
                <span
                  className="arc-dot inline-flex h-5 w-5 items-center justify-center rounded-full"
                  style={{
                    background: 'var(--color-crimson)',
                    boxShadow:
                      '0 0 0 4px var(--color-black), 0 0 18px var(--color-crimson)',
                  }}
                />
                <div className="arc-card flex flex-col items-center gap-3 rounded-xl border border-border bg-surface px-6 py-6 md:max-w-[300px]">
                  <span className="t-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-crimson-hi">
                    {m.week}
                  </span>
                  <h3
                    className="m-0 text-fg1"
                    style={{
                      font: '300 22px/1.15 var(--font-sans)',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {m.title}
                  </h3>
                  <p
                    className="m-0 text-fg3"
                    style={{font: '400 13.5px/1.6 var(--font-sans)'}}
                  >
                    {m.body}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* trailing breath room */}
        <div aria-hidden className="flex-shrink-0" style={{width: '15vw'}} />
      </div>
    </section>
  );
}
