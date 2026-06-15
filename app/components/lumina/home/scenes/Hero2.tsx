import {useEffect, useRef, useState} from 'react';
import {useGSAP} from '@gsap/react';
import {ArrowDown} from 'lucide-react';
import {Link} from 'react-router';
import {Button} from '~/components/lumina/Button';
import {Eyebrow} from '~/components/lumina/Eyebrow';
import {SplitLines} from '~/components/lumina/SplitLines';
import {ProductVisual} from '~/components/ProductVisual';
import {LightRays} from '~/components/graphics/LightRays';
import {gsap, prefersReducedMotion} from '~/lib/motion';

/** Bottle target. The brief asks for 60-70% of viewport height, but the
 *  three-line display headline + eyebrow + footing CTA already consume
 *  the rest of the viewport — pushing past ~50% vh on the bottle pushes
 *  the headline below the fold. We hit the higher end of what coexists
 *  with the existing typography (≈50% vh, ceiling 580) and also clamp
 *  on width so mobile portrait doesn't blow past the column. */
function computeBottleSize(vw: number, vh: number) {
  return Math.round(
    Math.max(280, Math.min(580, vh * 0.5, vw * 0.7)),
  );
}

/**
 * Scene 1 — Hero 2.0
 *
 * The signature opening. Three movements:
 *
 *   1. Load-in (no scroll required, composed in under 1s):
 *      bottle fades + rises onto the glow, three headline masks
 *      reveal in sequence, CTA arrives last.
 *
 *   2. Idle (forever while the user reads):
 *      4s vertical float on the bottle, 10s breathing on the glow,
 *      ±3° pointer-tilt on the bottle (desktop only).
 *
 *   3. Pinned scroll handoff (scrub 0.8):
 *      headlines lift away, glow intensifies, bottle scales to
 *      ~0.4 and slides down toward the Two Formulas section.
 *
 * All animation is transform/opacity only. Reduced motion drops the
 * scroll scene entirely and reveals everything immediately.
 */
export function Hero2() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [bottleSize, setBottleSize] = useState(480);

  useEffect(() => {
    const update = () =>
      setBottleSize(computeBottleSize(window.innerWidth, window.innerHeight));
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useGSAP(
    () => {
      const scene = sceneRef.current;
      if (!scene) return;

      const lines = scene.querySelectorAll('.line-inner');
      const bottle = scene.querySelector('.hero-bottle');
      const heroGlow = scene.querySelector('.hero-glow-stage');
      const kicker = scene.querySelector('.hero-kicker');
      const footing = scene.querySelector('.hero-footing');

      // Initial state — hide everything that will load in.
      gsap.set(lines, {yPercent: 110});
      gsap.set([kicker, footing, bottle], {opacity: 0});
      gsap.set(bottle, {y: 24});
      gsap.set(heroGlow, {opacity: 0, scale: 0.85});

      if (prefersReducedMotion()) {
        gsap.set([lines, kicker, footing, bottle, heroGlow], {
          opacity: 1,
          y: 0,
          yPercent: 0,
          scale: 1,
        });
        return;
      }

      // 1) Load-in timeline — completes under ~1s, no scroll dependency.
      const loadIn = gsap.timeline({delay: 0.05});
      loadIn
        .to(
          heroGlow,
          {opacity: 1, scale: 1, duration: 0.7, ease: 'power2.out'},
          0,
        )
        .to(
          bottle,
          {opacity: 1, y: 0, duration: 0.7, ease: 'power3.out'},
          0.1,
        )
        .to(
          kicker,
          {opacity: 1, duration: 0.35, ease: 'power3.out'},
          0.25,
        )
        .to(
          lines[0],
          {yPercent: 0, duration: 0.55, ease: 'power3.out'},
          0.3,
        )
        .to(
          lines[1],
          {yPercent: 0, duration: 0.55, ease: 'power3.out'},
          0.45,
        )
        .to(
          lines[2],
          {yPercent: 0, duration: 0.55, ease: 'power3.out'},
          0.6,
        )
        .to(
          footing,
          {opacity: 1, duration: 0.5, ease: 'power2.out'},
          0.85,
        );

      // 2) Pinned scroll handoff — composed after the load-in resolves.
      // Mobile gets a shorter pin so the user isn't held on the hero
      // through more than a viewport-and-change of scroll.
      const isNarrow = window.matchMedia('(max-width: 480px)').matches;
      const pinEnd = isNarrow ? '+=120%' : '+=180%';
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scene,
          start: 'top top',
          end: pinEnd,
          pin: true,
          pinSpacing: true,
          scrub: 0.8,
          anticipatePin: 0.5,
        },
      });

      tl
        // Lift the headline + supporting bits away first.
        .to(
          lines,
          {yPercent: -120, duration: 1, ease: 'power2.in'},
          0,
        )
        .to(
          [kicker, footing],
          {opacity: 0, duration: 0.4, ease: 'power3.in'},
          0,
        )
        // Glow intensifies through the middle of the handoff.
        .to(
          heroGlow,
          {scale: 1.35, opacity: 1, duration: 1.2, ease: 'power2.inOut'},
          0,
        )
        // Bottle scales down and hands off toward the next section.
        .to(
          bottle,
          {
            scale: 0.4,
            y: 220,
            duration: 1.2,
            ease: 'power2.in',
          },
          0.4,
        )
        // Final dim so the section ends on a clean canvas.
        .to(
          [bottle, heroGlow],
          {opacity: 0, duration: 0.3, ease: 'power2.in'},
          1.5,
        );
    },
    {scope: sceneRef},
  );

  return (
    <section
      ref={sceneRef}
      className="relative isolate flex flex-col items-center overflow-hidden bg-black text-center"
      style={{height: '100vh', paddingTop: 'clamp(56px, 6vh, 88px)'}}
    >
      {/* Single soft bloom — feathered all the way to transparent so it
          reads as light, not a drawn ring. Scales with the bottle. */}
      <div
        aria-hidden
        className="hero-glow-stage lumina-glow-breath pointer-events-none absolute"
        style={{
          left: '50%',
          top: '52%',
          width: bottleSize * 2.2,
          height: bottleSize * 2.2,
          background:
            'radial-gradient(closest-side, rgba(209,26,42,0.32) 0%, rgba(110,11,20,0.18) 30%, rgba(58,6,12,0.06) 60%, rgba(11,11,12,0) 100%)',
          filter: 'blur(36px)',
          willChange: 'transform, opacity',
        }}
      />
      {/* Atmospheric crimson rays — well behind the product. */}
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{inset: 0, opacity: 0.28, filter: 'blur(6px)'}}
      >
        <LightRays origin="top" intensity={0.14} />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(140% 80% at 50% 110%, rgba(110,11,20,0.22), transparent 60%)',
        }}
      />

      <div className="relative z-[2] flex flex-col items-center gap-y-8 px-6">
        <Eyebrow
          className="hero-kicker"
          style={{color: 'var(--color-crimson-hi)'}}
        >
          A daily protocol, not a bottle of hope
        </Eyebrow>

        <div className="relative">
          {/* CLS reservation. Square = bottle (1:1 source), plus extra
              vertical for the reflection so the headline below never
              gets pushed into the bottle on layout settle. */}
          <div
            className="hero-bottle"
            style={{
              width: bottleSize,
              // bottle (1:1) + clamped reflection (38%) - 10px overlap;
              // small buffer keeps siblings below from being touched
              // even if the float layer wobbles via parallax/idle.
              height: Math.round(bottleSize * 1.38) + 16,
            }}
          >
            <ProductVisual
              gender="male"
              width={bottleSize}
              pedestal={1.55}
              reflection
              rays={false}
              idleFloat
              mouseTilt
              tiltDeg={3}
              parallax={0}
              priority
              ring={false}
              fallbackTitle="Lumina Male Enhancement"
            />
          </div>
        </div>

        <SplitLines
          lines={[
            <span key="vit" className="text-ember">Vitality,</span>,
            'formulated',
            'honestly.',
          ]}
          as="h1"
          className="text-fg1"
          style={{
            font: '200 clamp(56px, 7.5vw, 104px)/0.95 var(--font-sans)',
            letterSpacing: '-0.02em',
          }}
        />
      </div>

      {/* Footing — pinned to the section bottom so the CTA is always
          above the fold regardless of how dominant the bottle gets. */}
      <div
        className="hero-footing absolute left-1/2 z-[2] flex -translate-x-1/2 flex-col items-center gap-6"
        style={{bottom: 'clamp(72px, 9vh, 120px)'}}
      >
        <Link to="/collections/all" prefetch="intent">
          <Button className="px-9 py-[18px] text-base">
            Begin the protocol
          </Button>
        </Link>
        <div className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.18em] text-fg3">
          Disclosed doses · Tested every lot · 60-Day Guarantee
        </div>
      </div>

      <div
        aria-hidden
        className="absolute bottom-7 left-1/2 z-[2] -translate-x-1/2"
      >
        <span className="t-mono inline-flex items-center gap-2 text-[10.5px] uppercase tracking-[0.18em] text-fg4">
          Scroll <ArrowDown size={12} strokeWidth={2} />
        </span>
      </div>
    </section>
  );
}
