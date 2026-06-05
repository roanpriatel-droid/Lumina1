import {Microscope, FileCheck2, Ban} from 'lucide-react';
import type {LucideIcon} from 'lucide-react';
import {Eyebrow} from '~/components/lumina/Eyebrow';
import type {LuminaActive} from '~/lib/lumina-data';

interface IngredientTransparencyProps {
  actives: LuminaActive[];
}

const PROMISES: ReadonlyArray<{Icon: LucideIcon; label: string}> = [
  {Icon: Microscope, label: 'Doses match the studies'},
  {Icon: FileCheck2, label: 'Third-party tested, every lot'},
  {Icon: Ban, label: 'No fillers, dyes, or proprietary blends'},
];

export function IngredientTransparency({actives}: IngredientTransparencyProps) {
  return (
    <section className="border-t border-border bg-black">
      <div className="mx-auto max-w-[1200px] px-6 pb-16 pt-20 md:px-8">
        <Eyebrow className="mb-4">Full transparency</Eyebrow>
        <div className="grid gap-14 md:grid-cols-[1fr_1.4fr] md:items-start">
          <div>
            <h2
              className="m-0 text-fg1"
              style={{
                font: '300 34px/1.1 var(--font-sans)',
                letterSpacing: '-0.01em',
              }}
            >
              What&rsquo;s inside, and why
            </h2>
            <p
              className="m-0 mt-5 max-w-[360px] text-fg2"
              style={{font: '300 17px/1.6 var(--font-sans)'}}
            >
              Every active, listed at its exact dose — no proprietary blends
              hiding the amounts. If it&rsquo;s in the bottle, it&rsquo;s on
              this page.
            </p>
            <div className="mt-7 flex flex-col gap-3">
              {PROMISES.map(({Icon, label}) => (
                <div key={label} className="flex items-center gap-3">
                  <Icon size={18} strokeWidth={2} className="text-crimson" />
                  <span className="text-sm leading-snug text-fg2">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            {actives.map((a, i) => (
              <div
                key={a.name}
                className="grid grid-cols-[1fr_auto] gap-x-6 gap-y-1.5 py-5"
                style={{
                  borderTop:
                    i === 0 ? 'none' : '1px solid var(--color-border)',
                }}
              >
                <span className="text-[17px] font-medium leading-snug text-fg1">
                  {a.name}
                </span>
                <span className="t-mono whitespace-nowrap text-right text-sm font-medium text-crimson-hi">
                  {a.amount}
                </span>
                <p
                  className="m-0 max-w-[520px] text-fg3"
                  style={{
                    font: '400 14px/1.55 var(--font-sans)',
                    gridColumn: '1 / 2',
                  }}
                >
                  {a.why}
                </p>
              </div>
            ))}
            <p className="mt-5 text-xs text-fg4">
              These statements have not been evaluated by the FDA. This product
              is not intended to diagnose, treat, cure, or prevent any disease.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
