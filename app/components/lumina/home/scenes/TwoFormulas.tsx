import {useRef} from 'react';
import {useGSAP} from '@gsap/react';
import {Link} from 'react-router';
import {ArrowUpRight} from 'lucide-react';
import {Eyebrow} from '~/components/lumina/Eyebrow';
import {GlowPedestal} from '~/components/lumina/GlowPedestal';
import {parallaxLayer, fadeRise} from '~/lib/motion';
import {
  findBaseline,
  money,
  type LuminaProductEntry,
} from '~/lib/savings';

/**
 * Scene 3 — The Two Formulas
 *
 * Two cards, parallax-in from opposite sides as the user scrolls into
 * the section. Live "from" prices for each hero baseline. Glow blooms
 * on hover.
 */
export function TwoFormulas({
  entries,
}: {
  entries: ReadonlyArray<LuminaProductEntry>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const male = findBaseline(entries, 'male');
  const female = findBaseline(entries, 'female');

  useGSAP(
    () => {
      const eyebrow = ref.current?.querySelector('.scene-eyebrow');
      const headline = ref.current?.querySelector('.scene-headline');
      const cards = ref.current?.querySelectorAll('.formula-card');
      fadeRise(eyebrow, {start: 'top 80%'});
      fadeRise(headline, {start: 'top 80%', delay: 0.05});

      if (cards && cards.length === 2) {
        parallaxLayer(cards[0], {
          yPercent: 5,
          trigger: ref.current,
        });
        parallaxLayer(cards[1], {
          yPercent: -5,
          trigger: ref.current,
        });
        fadeRise(cards[0], {start: 'top 75%'});
        fadeRise(cards[1], {start: 'top 75%', delay: 0.15});
      }
    },
    {scope: ref},
  );

  return (
    <section
      ref={ref}
      className="relative border-t border-border bg-surface"
    >
      <div className="mx-auto max-w-[1320px] px-6 py-28 md:px-10 md:py-36">
        <Eyebrow className="scene-eyebrow mb-4">The matched pair</Eyebrow>
        <h2
          className="scene-headline m-0 mb-16 max-w-[840px] text-fg1"
          style={{
            font: '300 clamp(36px, 4.5vw, 52px)/1.05 var(--font-sans)',
            letterSpacing: '-0.015em',
          }}
        >
          Two daily formulas. Same standard. Different biology.
        </h2>

        <div className="grid gap-6 md:grid-cols-2 md:gap-8">
          {male && (
            <FormulaCard
              entry={male}
              label="His"
              tagline="3 capsules nightly"
              blurb="Tribulus 750mg, zinc 30mg, magnesium 200mg — the mineral foundation plus traditional botanicals for energy, drive, and recovery."
            />
          )}
          {female && (
            <FormulaCard
              entry={female}
              label="Hers"
              tagline="2 capsules daily"
              blurb="B-complex backbone (B12 at 2,250% DV) with ashwagandha, maca, and a disclosed botanical blend for daily energy, balance, and vitality."
            />
          )}
        </div>
      </div>
    </section>
  );
}

function FormulaCard({
  entry,
  label,
  tagline,
  blurb,
}: {
  entry: LuminaProductEntry;
  label: 'His' | 'Hers';
  tagline: string;
  blurb: string;
}) {
  return (
    <Link
      to={`/products/${entry.handle}`}
      prefetch="intent"
      className="formula-card group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-black transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-crimson"
      style={{boxShadow: 'var(--shadow-md)'}}
    >
      <GlowPedestal
        imageUrl={entry.imageUrl}
        imageAlt={entry.imageAlt}
        fallbackTitle={entry.title}
        aspect="4/3"
        sizes="(min-width: 768px) 40vw, 90vw"
        imgWidth={520}
        imgHeight={390}
      />
      <div className="flex flex-1 flex-col gap-3 p-7 md:p-9">
        <div className="flex items-center gap-3">
          <Eyebrow style={{color: 'var(--color-crimson-hi)'}}>{label}</Eyebrow>
          <span className="t-mono text-[11px] uppercase tracking-[0.14em] text-fg4">
            · {tagline}
          </span>
        </div>
        <h3
          className="m-0 text-fg1"
          style={{
            font: '300 28px/1.15 var(--font-sans)',
            letterSpacing: '-0.01em',
          }}
        >
          {entry.title.replace(/™/g, '')}
          <sup className="text-[10px] text-fg3">™</sup>
        </h3>
        <p
          className="m-0 max-w-[480px] text-fg3"
          style={{font: '400 14.5px/1.6 var(--font-sans)'}}
        >
          {blurb}
        </p>
        <div className="mt-4 flex items-baseline justify-between border-t border-border pt-5">
          <span
            className="text-fg1"
            style={{font: '300 24px/1 var(--font-sans)'}}
          >
            From {money(entry.price)}
          </span>
          <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-crimson-hi">
            View formula
            <ArrowUpRight
              size={13}
              strokeWidth={2}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </span>
        </div>
      </div>
    </Link>
  );
}
