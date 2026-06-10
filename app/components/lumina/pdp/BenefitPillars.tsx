import {
  Flame,
  Heart,
  Scale,
  Activity,
  Zap,
  Wind,
  Sparkles,
  Sun,
} from 'lucide-react';
import type {LucideIcon} from 'lucide-react';
import {Eyebrow} from '~/components/lumina/Eyebrow';
import type {LuminaBenefitPillar} from '~/lib/lumina-data';

const ICONS: Record<string, LucideIcon> = {
  Flame,
  Heart,
  Scale,
  Activity,
  Zap,
  Wind,
  Sparkles,
  Sun,
};

export function BenefitPillars({pillars}: {pillars: LuminaBenefitPillar[]}) {
  return (
    <section className="border-t border-border bg-surface">
      <div className="mx-auto max-w-[1200px] px-6 py-20 md:px-8">
        <Eyebrow className="mb-4">What it supports</Eyebrow>
        <h2
          className="m-0 mb-12 max-w-[760px] text-fg1"
          style={{
            font: '300 38px/1.1 var(--font-sans)',
            letterSpacing: '-0.01em',
          }}
        >
          Four pillars, one daily formula.
        </h2>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p) => {
            const Icon = ICONS[p.icon] ?? Sparkles;
            return (
              <div
                key={p.title}
                className="flex flex-col gap-4 rounded-lg border border-border bg-black px-6 py-7 transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-border-strong"
              >
                <div
                  className="inline-flex h-11 w-11 items-center justify-center rounded-md"
                  style={{
                    background:
                      'radial-gradient(closest-side, rgba(209,26,42,0.22), rgba(11,11,12,0))',
                  }}
                >
                  <Icon size={22} strokeWidth={1.75} className="text-crimson" />
                </div>
                <h3 className="m-0 text-[17px] font-medium leading-snug text-fg1">
                  {p.title}
                </h3>
                <p
                  className="m-0 text-fg3"
                  style={{font: '400 14.5px/1.6 var(--font-sans)'}}
                >
                  {p.body}
                </p>
              </div>
            );
          })}
        </div>
        <p className="mt-7 text-xs text-fg4">
          These statements have not been evaluated by the FDA. This product is
          not intended to diagnose, treat, cure, or prevent any disease.
        </p>
      </div>
    </section>
  );
}
