import {useRef} from 'react';
import {useGSAP} from '@gsap/react';
import {SplitLines} from '~/components/lumina/SplitLines';
import {textReveal} from '~/lib/motion';

/**
 * Scene 2 — Manifesto
 *
 * Full-viewport oversized type-as-graphic moment. The anti-category
 * statement: "Most brands hide their doses. We print ours in mono."
 * Oxblood gradient wash, hairline rule at the top + bottom for the
 * editorial frame.
 */
export function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      textReveal(ref.current?.querySelector('.manifesto-headline'), {
        stagger: 0.12,
        start: 'top 70%',
      });
      textReveal(ref.current?.querySelector('.manifesto-sub'), {
        stagger: 0.08,
        start: 'top 65%',
      });
    },
    {scope: ref},
  );

  return (
    <section
      ref={ref}
      className="relative isolate overflow-hidden border-y border-border bg-black"
      style={{minHeight: '90vh'}}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(58,6,12,0) 0%, rgba(58,6,12,0.35) 40%, rgba(110,11,20,0.4) 70%, rgba(11,11,12,1) 100%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          width: 1100,
          height: 800,
          left: '50%',
          top: '60%',
          transform: 'translate(-50%,-50%)',
          background: 'var(--glow-hero)',
          opacity: 0.4,
        }}
      />

      <div className="relative mx-auto flex max-w-[1320px] flex-col gap-12 px-6 py-32 md:px-10 md:py-44">
        <div
          className="t-mono text-[11px] uppercase tracking-[0.22em] text-crimson-hi"
        >
          Manifesto · 01
        </div>
        <SplitLines
          lines={[
            'Most brands',
            'hide their doses.',
            <span key="2" style={{color: 'var(--color-crimson-hi)'}}>
              We print ours in mono.
            </span>,
          ]}
          as="h2"
          className="manifesto-headline text-fg1"
          style={{
            font: '200 clamp(48px, 8.5vw, 132px)/0.95 var(--font-sans)',
            letterSpacing: '-0.025em',
          }}
        />
        <div
          className="manifesto-sub max-w-[640px] self-end text-fg2 md:self-end"
          style={{font: '300 19px/1.55 var(--font-sans)'}}
        >
          <SplitLines
            lines={[
              'Every active disclosed.',
              'Every lot independently tested.',
              'Every claim built on structure and function — not hype.',
            ]}
            as="p"
          />
        </div>
      </div>
    </section>
  );
}
