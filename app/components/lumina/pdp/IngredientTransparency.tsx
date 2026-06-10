import {Microscope, FileCheck2, Ban} from 'lucide-react';
import type {LucideIcon} from 'lucide-react';
import {Eyebrow} from '~/components/lumina/Eyebrow';
import type {LuminaActive, LuminaBlend} from '~/lib/lumina-data';

interface IngredientTransparencyProps {
  actives: LuminaActive[];
  blend?: LuminaBlend;
  otherIngredients?: string;
}

const PROMISES: ReadonlyArray<{Icon: LucideIcon; label: string}> = [
  {Icon: Microscope, label: 'Doses match the studies and traditional use'},
  {Icon: FileCheck2, label: 'Third-party tested, every lot'},
  {Icon: Ban, label: 'No proprietary blends on the doses we can disclose'},
];

export function IngredientTransparency({
  actives,
  blend,
  otherIngredients,
}: IngredientTransparencyProps) {
  return (
    <section id="ingredients" className="border-t border-border bg-black">
      <div className="mx-auto max-w-[1200px] px-6 pb-20 pt-20 md:px-8">
        <Eyebrow className="mb-4">Full transparency</Eyebrow>
        <div className="grid gap-14 md:grid-cols-[1fr_1.4fr] md:items-start">
          <div className="md:sticky md:top-24">
            <h2
              className="m-0 text-fg1"
              style={{
                font: '300 38px/1.1 var(--font-sans)',
                letterSpacing: '-0.01em',
              }}
            >
              What&rsquo;s inside, and why
            </h2>
            <p
              className="m-0 mt-5 max-w-[360px] text-fg2"
              style={{font: '300 17px/1.65 var(--font-sans)'}}
            >
              Every active, listed at its exact dose. If it&rsquo;s in the
              bottle, it&rsquo;s on this page.
            </p>
            <div className="mt-7 flex flex-col gap-3">
              {PROMISES.map(({Icon, label}) => (
                <div key={label} className="flex items-start gap-3">
                  <Icon
                    size={18}
                    strokeWidth={2}
                    className="mt-0.5 flex-none text-crimson"
                  />
                  <span className="text-sm leading-snug text-fg2">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div
              className="mb-5 flex items-baseline justify-between border-b border-border pb-3"
              aria-hidden
            >
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-fg3">
                Active
              </span>
              <span className="t-mono text-[11px] uppercase tracking-[0.14em] text-fg3">
                Per serving
              </span>
            </div>

            {actives.map((a, i) => (
              <ActiveRow key={a.name} active={a} isFirst={i === 0} />
            ))}

            {blend && <BlendBlock blend={blend} />}

            {otherIngredients && (
              <div className="mt-8 border-t border-border pt-6">
                <Eyebrow className="mb-2">Other ingredients</Eyebrow>
                <p
                  className="m-0 text-fg3"
                  style={{font: '400 14px/1.6 var(--font-sans)'}}
                >
                  {otherIngredients}
                </p>
              </div>
            )}

            <p className="mt-7 text-xs leading-relaxed text-fg4">
              * These statements have not been evaluated by the FDA. This
              product is not intended to diagnose, treat, cure, or prevent any
              disease.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ActiveRow({active, isFirst}: {active: LuminaActive; isFirst: boolean}) {
  return (
    <div
      className="grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-1.5 py-5"
      style={{borderTop: isFirst ? 'none' : '1px solid var(--color-border)'}}
    >
      <div className="flex flex-col">
        <span className="text-[17px] font-medium leading-snug text-fg1">
          {active.name}
        </span>
        {active.form && (
          <span className="text-[12px] leading-none text-fg4">
            {active.form}
          </span>
        )}
      </div>
      <div className="flex flex-col items-end gap-0.5">
        <span className="t-mono whitespace-nowrap text-right text-sm font-medium text-crimson-hi">
          {active.amount}
        </span>
        {active.dv && (
          <span className="t-mono text-[11px] text-fg3">{active.dv}</span>
        )}
      </div>
      <p
        className="m-0 max-w-[520px] text-fg3"
        style={{
          font: '400 14px/1.6 var(--font-sans)',
          gridColumn: '1 / -1',
        }}
      >
        {active.why}
      </p>
    </div>
  );
}

function BlendBlock({blend}: {blend: LuminaBlend}) {
  return (
    <div className="mt-3 border-t border-border pt-6">
      <div className="grid grid-cols-[1fr_auto] items-baseline gap-x-6 pb-4">
        <span className="text-[17px] font-medium leading-snug text-fg1">
          {blend.name}
        </span>
        <span className="t-mono whitespace-nowrap text-right text-sm font-medium text-crimson-hi">
          {blend.totalAmount}
        </span>
      </div>
      <ul className="-mx-0.5 mb-5 flex flex-wrap gap-1.5">
        {blend.ingredients.map((ing) => (
          <li
            key={ing}
            className="rounded-pill border border-border bg-surface px-3 py-1.5 text-[12px] font-medium leading-none text-fg2"
          >
            {ing}
          </li>
        ))}
      </ul>
      <div className="rounded-md border border-border bg-surface px-5 py-4">
        <Eyebrow className="mb-2">Honest disclosure</Eyebrow>
        <p
          className="m-0 text-fg2"
          style={{font: '400 13.5px/1.65 var(--font-sans)'}}
        >
          {blend.disclosure}
        </p>
      </div>
    </div>
  );
}
