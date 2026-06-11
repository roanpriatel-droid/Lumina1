import {useRef} from 'react';
import {useGSAP} from '@gsap/react';
import {Link} from 'react-router';
import {ArrowUpRight, ShieldCheck} from 'lucide-react';
import {ProductVisual} from '~/components/ProductVisual';
import {Button} from '~/components/lumina/Button';
import {Eyebrow} from '~/components/lumina/Eyebrow';
import {SplitLines} from '~/components/lumina/SplitLines';
import {LightRays} from '~/components/graphics/LightRays';
import {TopographicLines} from '~/components/graphics/TopographicLines';
import {MonoWatermark} from '~/components/graphics/MonoWatermark';
import {fadeRise, gsap, prefersReducedMotion, textReveal} from '~/lib/motion';
import {findBaseline, money, type LuminaProductEntry} from '~/lib/savings';

/**
 * Scene 10 — Final CTA
 *
 * The closing chord. Crimson glow swells with scroll progress, the
 * "Begin the protocol." headline reveals line-by-line, both product
 * CTAs sit beneath, and the 60-Day Guarantee microline closes the
 * shot. Footer follows naturally.
 */
export function FinalCta({
  entries,
}: {
  entries: ReadonlyArray<LuminaProductEntry>;
}) {
  const ref = useRef<HTMLElement>(null);
  const male = findBaseline(entries, 'male');
  const female = findBaseline(entries, 'female');

  useGSAP(
    () => {
      textReveal(ref.current?.querySelector('.final-headline'), {
        stagger: 0.12,
        start: 'top 75%',
      });
      fadeRise(ref.current?.querySelector('.final-lede'), {
        start: 'top 70%',
        delay: 0.4,
      });
      fadeRise(ref.current?.querySelector('.final-ctas'), {
        start: 'top 70%',
        delay: 0.55,
      });
      fadeRise(ref.current?.querySelector('.final-guarantee'), {
        start: 'top 70%',
        delay: 0.7,
      });
      if (!prefersReducedMotion()) {
        const glow = ref.current?.querySelector('.final-glow');
        if (glow) {
          gsap.to(glow, {
            scale: 1.3,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: ref.current,
              start: 'top bottom',
              end: 'bottom bottom',
              scrub: true,
            },
          });
        }
      }
    },
    {scope: ref},
  );

  return (
    <section
      ref={ref}
      className="relative isolate overflow-hidden border-t border-border bg-black"
    >
      <div
        aria-hidden
        className="final-glow pointer-events-none absolute"
        style={{
          width: 1600,
          height: 1600,
          left: '50%',
          top: '60%',
          transform: 'translate(-50%, -50%) scale(0.6)',
          background: 'var(--glow-hero)',
          opacity: 0.4,
        }}
      />
      <TopographicLines opacity={0.5} variant="tight" />
      <LightRays origin="bottom" intensity={0.45} />
      <MonoWatermark position="center" size={520} opacity={0.04} style={{top: '15%'}}>
        BEGIN
      </MonoWatermark>
      <div className="relative mx-auto flex max-w-[1200px] flex-col items-center px-6 py-32 text-center md:px-10 md:py-44">
        <div className="mb-8 inline-block">
          <ProductVisual
            gender="female"
            width={100}
            pedestal={2}
            reflection
            rays={false}
            idleFloat
            mouseTilt={false}
            parallax={0}
            fallbackTitle="Lumina formula"
          />
        </div>
        <Eyebrow style={{color: 'var(--color-crimson-hi)'}}>
          The protocol begins
        </Eyebrow>
        <SplitLines
          lines={['Begin', 'the protocol.']}
          as="h2"
          className="final-headline mt-6 text-fg1"
          style={{
            font: '200 clamp(54px, 8vw, 116px)/0.95 var(--font-sans)',
            letterSpacing: '-0.025em',
          }}
        />
        <p
          className="final-lede m-0 mt-8 max-w-[640px] text-fg2"
          style={{font: '300 18px/1.65 var(--font-sans)'}}
        >
          Pick a formula. Pick a supply. Run it for eight weeks. Either
          assessment outcome — keep going or refund — is fine with us.
        </p>

        <div className="glow-frame glow-frame-base glow-frame-active final-ctas mt-10 inline-flex flex-wrap items-center justify-center gap-3 rounded-pill px-4 py-3">
          {male && (
            <Link to={`/products/${male.handle}`} prefetch="intent">
              <Button className="px-7 py-4 text-base">
                <span className="t-mono text-[11px] uppercase tracking-[0.14em] text-white/80 mr-2">
                  His
                </span>
                from {money(male.price)}
                <ArrowUpRight size={15} strokeWidth={2} />
              </Button>
            </Link>
          )}
          {female && (
            <Link to={`/products/${female.handle}`} prefetch="intent">
              <Button variant="ghost" className="px-7 py-4 text-base">
                <span className="t-mono text-[11px] uppercase tracking-[0.14em] text-crimson-hi mr-2">
                  Hers
                </span>
                from {money(female.price)}
                <ArrowUpRight size={15} strokeWidth={2} />
              </Button>
            </Link>
          )}
        </div>

        <div
          className="final-guarantee mt-10 inline-flex items-center gap-2 text-[11.5px] font-medium uppercase tracking-[0.18em] text-fg3"
        >
          <ShieldCheck size={13} strokeWidth={2.2} className="text-crimson-hi" />
          60-Day Money-Back · Empty Bottles Fine · No Restocking
        </div>
      </div>
    </section>
  );
}
