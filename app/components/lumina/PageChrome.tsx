import type {ReactNode} from 'react';
import {Eyebrow} from '~/components/lumina/Eyebrow';

/**
 * Shared content-page hero. Crimson eyebrow, dropped headline, optional lede.
 * Used across /pages/the-science, /pages/about, /pages/sourcing, etc.
 */
export function PageHero({
  eyebrow,
  title,
  lede,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-black">
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          width: 900,
          height: 900,
          left: '50%',
          top: 0,
          transform: 'translate(-50%,-30%)',
          background: 'var(--glow-hero)',
          opacity: 0.45,
        }}
      />
      <div className="relative mx-auto max-w-[1100px] px-6 pb-12 pt-24 md:px-8 md:pb-16 md:pt-32">
        <Eyebrow style={{color: 'var(--color-crimson-hi)'}}>{eyebrow}</Eyebrow>
        <h1
          className="m-0 mt-5 max-w-[820px] text-fg1"
          style={{
            font: '300 clamp(40px, 5vw, 60px)/1.05 var(--font-sans)',
            letterSpacing: '-0.015em',
          }}
        >
          {title}
        </h1>
        {lede && (
          <p
            className="m-0 mt-6 max-w-[680px] text-fg2"
            style={{font: '300 19px/1.6 var(--font-sans)'}}
          >
            {lede}
          </p>
        )}
      </div>
    </section>
  );
}

/**
 * Standard content section with eyebrow, heading, optional lede, and slot.
 * `tone="dark"` swaps to the matte-black surface; default sits on the elev
 * surface so consecutive sections alternate visual rhythm.
 */
export function Section({
  eyebrow,
  title,
  lede,
  tone = 'light',
  id,
  children,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  tone?: 'light' | 'dark';
  id?: string;
  children: ReactNode;
}) {
  const bg = tone === 'dark' ? 'bg-black' : 'bg-surface';
  return (
    <section id={id} className={`border-t border-border ${bg}`}>
      <div className="mx-auto max-w-[1200px] px-6 py-20 md:px-8">
        <Eyebrow className="mb-4">{eyebrow}</Eyebrow>
        <h2
          className="m-0 max-w-[760px] text-fg1"
          style={{
            font: '300 38px/1.1 var(--font-sans)',
            letterSpacing: '-0.01em',
          }}
        >
          {title}
        </h2>
        {lede && (
          <p
            className="m-0 mt-5 max-w-[680px] text-fg3"
            style={{font: '300 17px/1.65 var(--font-sans)'}}
          >
            {lede}
          </p>
        )}
        <div className="mt-12">{children}</div>
      </div>
    </section>
  );
}
