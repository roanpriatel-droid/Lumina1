import {useRef} from 'react';
import {useGSAP} from '@gsap/react';
import {Eyebrow} from '~/components/lumina/Eyebrow';
import {BotanicalEngraving} from '~/components/graphics/BotanicalEngraving';
import {MonoWatermark} from '~/components/graphics/MonoWatermark';
import {countUp, fadeRise} from '~/lib/motion';

/**
 * New homepage scene — full-width stat band. Four oversized mono
 * numerals counted up as the band enters viewport. Botanical
 * engravings sit behind each numeral (ashwagandha, tribulus, ginkgo,
 * ginger) at low opacity for editorial texture.
 *
 * Designed to feel like a magazine pull-quote spread — facts, not
 * marketing claims. Every number reconciles to something on the label.
 */

interface Stat {
  end: number;
  decimals?: number;
  suffix?: string;
  label: string;
  body: string;
  illustration: 'ashwagandha' | 'tribulus' | 'ginkgo' | 'ginger';
}

const STATS: ReadonlyArray<Stat> = [
  {
    end: 17,
    suffix: '',
    label: 'Actives',
    body: 'Across both formulas, each with a disclosed dose and reasoning.',
    illustration: 'ashwagandha',
  },
  {
    end: 750,
    suffix: 'mg',
    label: 'Tribulus, anchored',
    body: "Where the category sprinkles, we anchor — the male formula's signature dose.",
    illustration: 'tribulus',
  },
  {
    end: 100,
    suffix: '%',
    label: 'Lots tested',
    body: 'Identity, potency, heavy metals, microbials. Independent lab. Every batch.',
    illustration: 'ginkgo',
  },
  {
    end: 60,
    suffix: '-day',
    label: 'Guarantee',
    body: "Empty bottles fine. Refund — not store credit — on every order.",
    illustration: 'ginger',
  },
];

export function ByTheNumbers() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      fadeRise(ref.current?.querySelector('.numbers-eyebrow'));
      fadeRise(ref.current?.querySelector('.numbers-headline'), {delay: 0.05});
      const cells = ref.current?.querySelectorAll('.numbers-cell');
      cells?.forEach((cell, i) => {
        fadeRise(cell, {start: 'top 80%', delay: i * 0.07});
        const valueEl = cell.querySelector('.numbers-value');
        if (valueEl) {
          const def = STATS[i];
          countUp(valueEl, {
            end: def.end,
            decimals: def.decimals ?? 0,
            suffix: def.suffix ?? '',
            duration: 1.6,
            triggerStart: 'top 80%',
          });
        }
      });
    },
    {scope: ref},
  );

  return (
    <section
      ref={ref}
      className="relative isolate overflow-hidden border-t border-border bg-surface"
    >
      <MonoWatermark position="left" size={420} opacity={0.045}>
        BY THE NUMBERS
      </MonoWatermark>
      <div className="relative mx-auto max-w-[1320px] px-6 py-28 md:px-10 md:py-36">
        <Eyebrow className="numbers-eyebrow mb-4">By the numbers</Eyebrow>
        <h2
          className="numbers-headline m-0 mb-16 max-w-[760px] text-fg1"
          style={{
            font: '300 clamp(36px, 4.5vw, 52px)/1.05 var(--font-sans)',
            letterSpacing: '-0.015em',
          }}
        >
          What the labels read. Nothing inflated.
        </h2>

        <div className="grid gap-x-12 gap-y-14 md:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat) => (
            <article
              key={stat.label}
              className="numbers-cell relative"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute"
                style={{
                  left: -32,
                  top: -40,
                  opacity: 0.16,
                  width: 200,
                }}
              >
                <BotanicalEngraving
                  name={stat.illustration}
                  width={220}
                  strokeOpacity={0.7}
                  accentOpacity={0.25}
                />
              </div>
              <div className="relative">
                <span
                  className="numbers-value block text-ember"
                  style={{
                    font: '300 clamp(64px, 7.5vw, 108px)/0.95 var(--font-mono)',
                    letterSpacing: '-0.03em',
                    fontFeatureSettings: '"tnum" 1',
                  }}
                >
                  {stat.end}
                  {stat.suffix}
                </span>
                <div
                  className="t-mono mt-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-crimson-hi"
                >
                  {stat.label}
                </div>
                <p
                  className="m-0 mt-3 max-w-[260px] text-fg3"
                  style={{font: '400 14.5px/1.6 var(--font-sans)'}}
                >
                  {stat.body}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
