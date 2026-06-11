import {useRef, useState} from 'react';
import {useGSAP} from '@gsap/react';
import {Link} from 'react-router';
import {ArrowUpRight, Moon, Sun} from 'lucide-react';
import {Eyebrow} from '~/components/lumina/Eyebrow';
import {LightRays} from '~/components/graphics/LightRays';
import {MonoWatermark} from '~/components/graphics/MonoWatermark';
import {gsap, prefersReducedMotion} from '~/lib/motion';
import {getProductImage} from '~/lib/product-assets';
import {findBaseline, money, type LuminaProductEntry} from '~/lib/savings';

/**
 * Scene 7 — His/Hers Split
 *
 * Full-viewport vertical split:
 *   - His  ← male-rays.png  (or -hero / -smoke fallback)
 *   - Hers → female-smoke.png  (or -hero / -rays fallback)
 *
 * Each side runs a slow Ken Burns drift (scale 1.0 → 1.06 over the
 * scene) in opposite directions — left side drifts to the right, right
 * side drifts to the left, so the matched pair feels like it leans
 * inward toward the user.
 *
 * Hover (desktop pointer only) expands a side to 60/40 with the other
 * side dimming. A short headline ("Energy. / Recovery. / Drive.") and
 * a single CTA per side sit over a dark mask so the type stays
 * readable against the photography.
 *
 * Reduced motion: Ken Burns disabled (final still frame), hover-expand
 * still works (a discrete state change, not motion).
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

  // Pick the best photo for each side. Asset filenames per the
  // resolver convention; nulls fall through to a CSS-only background.
  const hisImage =
    getProductImage('male', 'rays') ??
    getProductImage('male', 'hero') ??
    getProductImage('male', 'smoke');
  const hersImage =
    getProductImage('female', 'smoke') ??
    getProductImage('female', 'hero') ??
    getProductImage('female', 'rays');

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const hisBg = ref.current?.querySelector('.his-bg');
      const hersBg = ref.current?.querySelector('.hers-bg');
      if (!hisBg || !hersBg) return;

      // Ken Burns drift — scale 1 → 1.06 over the scene's scroll
      // window, opposite x-translate per side. Transform-only so it
      // composites on the GPU.
      gsap.fromTo(
        hisBg,
        {scale: 1, x: '0%'},
        {
          scale: 1.06,
          x: '2.5%',
          ease: 'none',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.7,
          },
        },
      );
      gsap.fromTo(
        hersBg,
        {scale: 1, x: '0%'},
        {
          scale: 1.06,
          x: '-2.5%',
          ease: 'none',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.7,
          },
        },
      );
    },
    {scope: ref},
  );

  if (!male || !female) return null;

  return (
    <section
      ref={ref}
      className="relative isolate overflow-hidden border-t border-border bg-black"
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
          backgroundUrl={hisImage}
          eyebrow="His · Nightly"
          promise={['Energy.', 'Recovery.', 'Drive.']}
          body="Three capsules. Before bed. Tribulus 750mg, zinc 30mg, magnesium 200mg, plus a stack of traditional botanicals — built for the male body's recovery window."
          icon={Moon}
        />
        <Side
          side="hers"
          active={hovered === 'hers'}
          dimmed={hovered === 'his'}
          onEnter={() => setHovered('hers')}
          entry={female}
          backgroundUrl={hersImage}
          eyebrow="Hers · Daily"
          promise={['Energy.', 'Balance.', 'Vitality.']}
          body="Two capsules. With water. B-complex backbone (B12 at 2,250% DV), zinc, BioPerine®, plus a disclosed botanical blend — built for daily life and 8-week assessment."
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
  backgroundUrl,
  eyebrow,
  promise,
  body,
  icon: Icon,
}: {
  side: 'his' | 'hers';
  active: boolean;
  dimmed: boolean;
  onEnter: () => void;
  entry: LuminaProductEntry;
  backgroundUrl: string | null;
  eyebrow: string;
  promise: ReadonlyArray<string>;
  body: string;
  icon: typeof Moon;
}) {
  // Per-side dark wash so the type stays readable over photography.
  const overlay =
    side === 'his'
      ? 'linear-gradient(180deg, rgba(11,11,12,0.55) 0%, rgba(58,6,12,0.30) 60%, rgba(11,11,12,0.78) 100%)'
      : 'linear-gradient(180deg, rgba(11,11,12,0.45) 0%, rgba(110,11,20,0.22) 60%, rgba(11,11,12,0.78) 100%)';

  return (
    <div
      onMouseEnter={onEnter}
      className={`${side === 'his' ? 'his-content' : 'hers-content'} relative isolate flex items-center overflow-hidden px-6 py-20 md:px-12 md:py-32`}
      style={{
        transition:
          'opacity 400ms cubic-bezier(0.4, 0, 0.2, 1), filter 400ms cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: dimmed ? 0.55 : 1,
        filter: dimmed ? 'saturate(0.7)' : 'none',
        minHeight: '90vh',
      }}
    >
      {/* Background photograph — Ken Burns drift driven by GSAP. */}
      {backgroundUrl ? (
        <div
          aria-hidden
          className={`${side === 'his' ? 'his-bg' : 'hers-bg'} pointer-events-none absolute inset-0 z-0`}
          style={{
            backgroundImage: `url(${backgroundUrl})`,
            backgroundSize: 'cover',
            backgroundPosition:
              side === 'his' ? 'right center' : 'left center',
            willChange: 'transform',
            transformOrigin:
              side === 'his' ? 'right center' : 'left center',
          }}
        />
      ) : (
        // Fallback when no photograph is on disk yet: tinted gradient.
        <div
          aria-hidden
          className={`${side === 'his' ? 'his-bg' : 'hers-bg'} pointer-events-none absolute inset-0 z-0`}
          style={{
            background:
              side === 'his'
                ? 'linear-gradient(180deg, rgba(58,6,12,0.5) 0%, rgba(11,11,12,1) 100%)'
                : 'linear-gradient(180deg, rgba(110,11,20,0.4) 0%, rgba(11,11,12,1) 100%)',
          }}
        />
      )}

      {/* Dark wash for legibility. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{background: overlay}}
      />

      {/* Crimson light rays per side. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{
          opacity: active ? 0.95 : 0.55,
          transition: 'opacity 400ms ease',
        }}
      >
        <LightRays
          origin={side === 'his' ? 'top' : 'bottom'}
          intensity={side === 'his' ? 0.3 : 0.45}
        />
      </div>

      {/* Content stack. */}
      <div className="relative z-[3] flex max-w-[480px] flex-col gap-5">
        <div className="flex items-center gap-3">
          <Icon size={18} strokeWidth={1.75} className="text-crimson-hi" />
          <Eyebrow style={{color: 'var(--color-crimson-hi)'}}>{eyebrow}</Eyebrow>
        </div>
        <h2
          className="m-0 text-fg1"
          style={{
            font: '200 clamp(44px, 6vw, 80px)/0.95 var(--font-sans)',
            letterSpacing: '-0.025em',
            textShadow: '0 2px 24px rgba(0,0,0,0.55)',
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
          style={{
            font: '300 16px/1.6 var(--font-sans)',
            textShadow: '0 1px 12px rgba(0,0,0,0.6)',
          }}
        >
          {body}
        </p>
        <Link
          to={`/products/${entry.handle}`}
          prefetch="intent"
          className="inline-flex items-center gap-2 self-start rounded-pill border border-crimson bg-black/65 px-6 py-3 text-[13.5px] font-medium text-fg1 backdrop-blur-sm transition-[background,transform] hover:-translate-y-0.5 hover:bg-surface"
          style={{
            boxShadow: active
              ? '0 8px 24px rgba(209, 26, 42, 0.28)'
              : '0 4px 12px rgba(0, 0, 0, 0.4)',
          }}
        >
          From {money(entry.price)}
          <ArrowUpRight size={14} strokeWidth={2} />
        </Link>
      </div>
    </div>
  );
}
