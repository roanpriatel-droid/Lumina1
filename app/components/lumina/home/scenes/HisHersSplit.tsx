import {useRef, useState} from 'react';
import {useGSAP} from '@gsap/react';
import {Link} from 'react-router';
import {ArrowUpRight, Moon, Sun} from 'lucide-react';
import {Eyebrow} from '~/components/lumina/Eyebrow';
import {ProductVisual} from '~/components/ProductVisual';
import {LightRays} from '~/components/graphics/LightRays';
import {MonoWatermark} from '~/components/graphics/MonoWatermark';
import {fadeRise} from '~/lib/motion';
import {findBaseline, money, type LuminaProductEntry} from '~/lib/savings';

/**
 * New homepage scene — full-viewport vertical split (black / oxblood),
 * each half with bottle, three-word promise, CTA. Hover expands one
 * side to 60/40. The brand's two-formula identity made physical.
 *
 * Replaces the existing Ritual scene with a more cinematic treatment.
 */
export function HisHersSplit({
  entries,
}: {
  entries: ReadonlyArray<LuminaProductEntry>;
}) {
  const ref = useRef<HTMLElement>(null);
  const [hovered, setHovered] = useState<'his' | 'hers' | null>(null);

  const male = findBaseline(entries, 'male');
  const female = findBaseline(entries, 'female');

  useGSAP(
    () => {
      fadeRise(ref.current?.querySelector('.his-content'), {start: 'top 80%'});
      fadeRise(ref.current?.querySelector('.hers-content'), {start: 'top 80%', delay: 0.1});
    },
    {scope: ref},
  );

  if (!male || !female) return null;

  return (
    <section
      ref={ref}
      className="relative isolate overflow-hidden border-t border-border lumina-bg-3"
      style={{minHeight: '90vh'}}
    >
      <MonoWatermark position="top-right" size={300} opacity={0.04}>
        TWO · DAILY
      </MonoWatermark>

      <div
        className="relative grid h-full min-h-[90vh] grid-cols-1 md:grid-cols-[1fr_1fr]"
        onMouseLeave={() => setHovered(null)}
        style={{
          gridTemplateColumns:
            hovered === 'his'
              ? '60fr 40fr'
              : hovered === 'hers'
                ? '40fr 60fr'
                : '50fr 50fr',
          transition: 'grid-template-columns 600ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <Side
          side="his"
          active={hovered === 'his'}
          dimmed={hovered === 'hers'}
          onEnter={() => setHovered('his')}
          entry={male}
          eyebrow="His · Nightly"
          promise={['Energy.', 'Recovery.', 'Drive.']}
          body="Three capsules. Before bed. Tribulus 750mg, zinc 30mg, magnesium 200mg, plus a stack of traditional botanicals — built for the male body's recovery window."
          accentBg="linear-gradient(180deg, rgba(58,6,12,0.4) 0%, rgba(11,11,12,1) 100%)"
          icon={Moon}
        />
        <Side
          side="hers"
          active={hovered === 'hers'}
          dimmed={hovered === 'his'}
          onEnter={() => setHovered('hers')}
          entry={female}
          eyebrow="Hers · Daily"
          promise={['Energy.', 'Balance.', 'Vitality.']}
          body="Two capsules. With water. B-complex backbone (B12 at 2,250% DV), zinc, BioPerine®, plus a disclosed botanical blend — built for daily life and 8-week assessment."
          accentBg="linear-gradient(180deg, rgba(110,11,20,0.32) 0%, rgba(11,11,12,1) 100%)"
          icon={Sun}
        />
      </div>
    </section>
  );
}

function Side({
  side,
  active,
  dimmed,
  onEnter,
  entry,
  eyebrow,
  promise,
  body,
  accentBg,
  icon: Icon,
}: {
  side: 'his' | 'hers';
  active: boolean;
  dimmed: boolean;
  onEnter: () => void;
  entry: LuminaProductEntry;
  eyebrow: string;
  promise: ReadonlyArray<string>;
  body: string;
  accentBg: string;
  icon: typeof Moon;
}) {
  return (
    <div
      onMouseEnter={onEnter}
      className={`${side === 'his' ? 'his-content' : 'hers-content'} relative isolate flex items-center justify-center overflow-hidden px-6 py-20 md:px-12 md:py-32`}
      style={{
        background: accentBg,
        transition: 'opacity 400ms cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: dimmed ? 0.45 : 1,
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{opacity: active ? 0.9 : 0.5, transition: 'opacity 400ms ease'}}
      >
        <LightRays
          origin={side === 'his' ? 'top' : 'bottom'}
          intensity={side === 'his' ? 0.3 : 0.5}
        />
      </div>

      <div className="relative grid items-center gap-10 md:grid-cols-[auto_1fr]">
        <ProductVisual
          gender={side === 'his' ? 'male' : 'female'}
          width={active ? 180 : 150}
          pedestal={2}
          reflection
          rays={false}
          idleFloat
          mouseTilt={false}
          parallax={0}
          fallbackTitle={`Lumina ${side === 'his' ? 'Male' : 'Female'} Enhancement`}
          style={{transition: 'width 400ms cubic-bezier(0.4, 0, 0.2, 1)'}}
        />
        <div className="flex flex-col gap-5 md:max-w-[420px]">
          <div className="flex items-center gap-3">
            <Icon size={18} strokeWidth={1.75} className="text-crimson-hi" />
            <Eyebrow style={{color: 'var(--color-crimson-hi)'}}>
              {eyebrow}
            </Eyebrow>
          </div>
          <h2
            className="m-0 text-fg1"
            style={{
              font: '200 clamp(44px, 6vw, 80px)/0.95 var(--font-sans)',
              letterSpacing: '-0.025em',
            }}
          >
            {promise.map((word, i) => (
              <span
                key={word}
                className="block"
                style={{
                  color:
                    i === promise.length - 1
                      ? 'var(--color-crimson-hi)'
                      : undefined,
                }}
              >
                {word}
              </span>
            ))}
          </h2>
          <p
            className="m-0 max-w-[440px] text-fg2"
            style={{font: '300 16px/1.6 var(--font-sans)'}}
          >
            {body}
          </p>
          <Link
            to={`/products/${entry.handle}`}
            prefetch="intent"
            className="inline-flex items-center gap-2 self-start rounded-pill border border-crimson bg-black px-6 py-3 text-[13.5px] font-medium text-fg1 transition-[background,transform] hover:bg-surface hover:-translate-y-0.5"
            style={{
              boxShadow: active ? 'var(--shadow-accent)' : 'none',
              transition: 'box-shadow 300ms ease, transform 200ms ease',
            }}
          >
            From {money(entry.price)}
            <ArrowUpRight size={14} strokeWidth={2} />
          </Link>
        </div>
      </div>
    </div>
  );
}
