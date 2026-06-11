import {useRef} from 'react';
import {useGSAP} from '@gsap/react';
import {ArrowDown} from 'lucide-react';
import {Link} from 'react-router';
import {Button} from '~/components/lumina/Button';
import {Eyebrow} from '~/components/lumina/Eyebrow';
import {SplitLines} from '~/components/lumina/SplitLines';
import {ProductVisual} from '~/components/ProductVisual';
import {Glow} from '~/components/graphics/Glow';
import {LightRays} from '~/components/graphics/LightRays';
import {MonoWatermark} from '~/components/graphics/MonoWatermark';
import {gsap, prefersReducedMotion} from '~/lib/motion';

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
      className="relative isolate flex flex-col items-center justify-center overflow-hidden bg-black text-center"
      style={{height: '100vh'}}
    >
      {/* 3-layer composite glow, breathing forever. */}
      <div
        aria-hidden
        className="hero-glow-stage absolute"
        style={{
          left: '50%',
          top: '52%',
          transform: 'translate(-50%, -50%)',
          willChange: 'transform, opacity',
        }}
      >
        <Glow size="hero" animate />
      </div>
      <LightRays origin="top" intensity={0.4} />
      <MonoWatermark
        position="center"
        size={520}
        opacity={0.035}
        parallax={-3}
        style={{top: '85%'}}
      >
        LUMINA · 01
      </MonoWatermark>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(140% 80% at 50% 110%, rgba(110,11,20,0.3), transparent 60%)',
        }}
      />

      <div className="relative z-[2] flex flex-col items-center gap-8 px-6">
        <Eyebrow
          className="hero-kicker"
          style={{color: 'var(--color-crimson-hi)'}}
        >
          A daily protocol, not a bottle of hope
        </Eyebrow>

        <div className="relative">
          {/* The reserved box prevents CLS while the asset streams in. */}
          <div className="hero-bottle" style={{width: 200, height: 270}}>
            <ProductVisual
              gender="male"
              width={180}
              pedestal={2.2}
              reflection
              rays={false}
              idleFloat
              mouseTilt
              tiltDeg={3}
              parallax={0}
              priority
              ring
              fallbackTitle="Lumina Male Enhancement"
            />
          </div>
        </div>

        <SplitLines
          lines={['Vitality,', 'formulated', 'honestly.']}
          as="h1"
          className="text-fg1"
          style={{
            font: '200 clamp(60px, 9vw, 128px)/0.95 var(--font-sans)',
            letterSpacing: '-0.02em',
          }}
        />

        <div className="hero-footing flex flex-col items-center gap-6">
          <Link to="/collections/all" prefetch="intent">
            <Button className="px-9 py-[18px] text-base">
              Begin the protocol
            </Button>
          </Link>
          <div className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.18em] text-fg3">
            Disclosed doses · Tested every lot · 60-Day Guarantee
          </div>
        </div>
      </div>

      <div
        aria-hidden
        className="absolute bottom-7 left-1/2 -translate-x-1/2"
      >
        <span className="t-mono inline-flex items-center gap-2 text-[10.5px] uppercase tracking-[0.18em] text-fg4">
          Scroll <ArrowDown size={12} strokeWidth={2} />
        </span>
      </div>
    </section>
  );
}
