import {Eyebrow} from '~/components/lumina/Eyebrow';
import type {LuminaResultStage} from '~/lib/lumina-data';

export function ResultsTimeline({stages}: {stages: LuminaResultStage[]}) {
  return (
    <section className="border-t border-border bg-black">
      <div className="mx-auto max-w-[1200px] px-6 py-20 md:px-8">
        <Eyebrow className="mb-4">What the journey looks like</Eyebrow>
        <h2
          className="m-0 mb-4 max-w-[760px] text-fg1"
          style={{
            font: '300 38px/1.1 var(--font-sans)',
            letterSpacing: '-0.01em',
          }}
        >
          A rhythm, not a guarantee.
        </h2>
        <p
          className="m-0 mb-12 max-w-[640px] text-fg3"
          style={{font: '300 17px/1.65 var(--font-sans)'}}
        >
          Bodies respond at their own pace. This is the shape consistency tends
          to take — not a promise of any specific outcome.
        </p>

        <div className="relative grid gap-6 md:grid-cols-3 md:gap-0">
          <div
            aria-hidden
            className="absolute hidden md:block"
            style={{
              left: '8.333%',
              right: '8.333%',
              top: 23,
              height: 1,
              background:
                'linear-gradient(90deg, transparent 0%, var(--color-border-strong) 18%, var(--color-border-strong) 82%, transparent 100%)',
            }}
          />
          {stages.map((stage, i) => (
            <div
              key={stage.range}
              className="relative flex flex-col gap-4 md:px-5"
            >
              <div className="flex items-center gap-4 md:flex-col md:items-start md:gap-3">
                <span
                  aria-hidden
                  className="relative z-10 flex h-12 w-12 flex-none items-center justify-center rounded-full bg-surface text-fg1"
                  style={{
                    border: '1px solid var(--color-crimson)',
                    boxShadow: '0 0 0 4px var(--color-black)',
                    font: '500 14px/1 var(--font-mono)',
                  }}
                >
                  0{i + 1}
                </span>
                <span className="t-mono text-[12px] uppercase tracking-[0.14em] text-crimson-hi">
                  {stage.range}
                </span>
              </div>
              <h3 className="m-0 text-[20px] font-medium leading-snug text-fg1">
                {stage.title}
              </h3>
              <p
                className="m-0 max-w-[320px] text-fg3"
                style={{font: '400 14.5px/1.6 var(--font-sans)'}}
              >
                {stage.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
