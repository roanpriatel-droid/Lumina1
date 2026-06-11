import {useRef} from 'react';
import {useGSAP} from '@gsap/react';
import {SplitLines} from '~/components/lumina/SplitLines';
import {TopographicLines} from '~/components/graphics/TopographicLines';
import {MonoWatermark} from '~/components/graphics/MonoWatermark';
import {textReveal} from '~/lib/motion';

/**
 * Scene 2 — Manifesto, stretched.
 *
 * Three viewport-height statements, each its own scroll moment, each
 * with its own line-mask reveal and ghost watermark in the corner.
 * The category critique unfolds over the scroll — same anti-category
 * argument, made three times in three different keys.
 */

const STATEMENTS = [
  {
    index: '01',
    label: 'Manifesto · Dose',
    headline: ['Most brands', 'hide their doses.', 'We print ours in mono.'],
    sub: [
      'Every active disclosed in milligrams.',
      'Every blend listed by name and total weight.',
      'No proprietary blanks. No sprinkles dressed up as anchors.',
    ],
    watermark: 'TRANSPARENCY',
  },
  {
    index: '02',
    label: 'Manifesto · Bench',
    headline: ['Most brands', 'test selectively.', 'We test every lot.'],
    sub: [
      'Identity, potency, heavy metals, microbials.',
      'Independent third-party lab. Pass or it doesn’t ship.',
      'COA on request. One email, no portal, no friction.',
    ],
    watermark: 'LOT-TESTED',
  },
  {
    index: '03',
    label: 'Manifesto · Time',
    headline: ['Most brands', 'sell impatience.', 'We sell eight weeks.'],
    sub: [
      'The protocol is daily. The assessment is at week eight.',
      'A multi-month supply matches the formula’s own clock.',
      'Refund anyway, empty bottles fine — that part is the floor.',
    ],
    watermark: 'EST. 8 WEEKS',
  },
];

export function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const panels = ref.current?.querySelectorAll('.manifesto-panel');
      panels?.forEach((panel) => {
        textReveal(panel.querySelector('.manifesto-headline'), {
          stagger: 0.12,
          start: 'top 70%',
        });
        textReveal(panel.querySelector('.manifesto-sub'), {
          stagger: 0.08,
          start: 'top 65%',
        });
      });
    },
    {scope: ref},
  );

  return (
    <div ref={ref} className="relative isolate border-y border-border bg-black">
      {STATEMENTS.map((statement, i) => (
        <section
          key={statement.index}
          className="manifesto-panel relative isolate overflow-hidden"
          style={{
            minHeight: '90vh',
            borderTop:
              i > 0 ? '1px solid var(--color-border)' : 'none',
            background: i % 2 === 0 ? '#0B0B0C' : 'var(--color-surface)',
          }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                i === 0
                  ? 'linear-gradient(180deg, rgba(58,6,12,0) 0%, rgba(58,6,12,0.32) 60%, rgba(110,11,20,0.36) 100%)'
                  : i === 1
                    ? 'linear-gradient(180deg, rgba(110,11,20,0.18) 0%, rgba(11,11,12,0) 100%)'
                    : 'linear-gradient(180deg, rgba(11,11,12,0) 0%, rgba(58,6,12,0.32) 100%)',
            }}
          />
          <TopographicLines opacity={0.45} variant={i === 1 ? 'tight' : 'broad'} />
          <MonoWatermark
            position={i === 0 ? 'bottom-right' : i === 1 ? 'top-right' : 'bottom-left'}
            size={420}
            opacity={0.05}
            rotate={i % 2 === 0 ? -2 : 3}
          >
            {statement.watermark}
          </MonoWatermark>

          <div className="relative mx-auto flex max-w-[1320px] flex-col justify-center gap-10 px-6 py-32 md:px-10 md:py-40" style={{minHeight: '90vh'}}>
            <div className="t-mono text-[11px] uppercase tracking-[0.22em] text-crimson-hi">
              {statement.label}
            </div>
            <SplitLines
              lines={[
                statement.headline[0],
                statement.headline[1],
                <span key="3" style={{color: 'var(--color-crimson-hi)'}}>
                  {statement.headline[2]}
                </span>,
              ]}
              as="h2"
              className="manifesto-headline lumina-h2"
              style={{
                fontSize: 'clamp(2.75rem, 7.4vw, 7rem)',
                fontWeight: 300,
                lineHeight: 0.95,
                letterSpacing: '-0.025em',
              }}
            />
            <div
              className="manifesto-sub max-w-[620px] self-end text-fg2"
              style={{font: '300 19px/1.55 var(--font-sans)'}}
            >
              <SplitLines lines={statement.sub} as="p" />
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
