import {useEffect, useRef, useState} from 'react';
import {useGSAP} from '@gsap/react';
import {Link} from 'react-router';
import {Button} from '~/components/lumina/Button';
import {ProductVisual} from '~/components/ProductVisual';
import {gsap, prefersReducedMotion} from '~/lib/motion';

/** Bottle target. Brief asks for ~70vh tall and fully visible — we hit
 *  that on desktop (vh*0.70, ceiling 720) and let vw bind the size on
 *  narrow viewports so the bottle never goes edge-to-edge. */
function computeBottleSize(vw: number, vh: number) {
  if (vw >= 768) {
    return Math.round(Math.max(420, Math.min(720, vh * 0.70, vw * 0.50)));
  }
  return Math.round(Math.max(280, Math.min(520, vh * 0.55, vw * 0.78)));
}

/**
 * Scene 1 — Static premium hero
 *
 * One cohesive vertical composition: kicker · bottle · headline · sub ·
 * CTA · trust. Bottle sits inside a section-filling atmospheric bloom
 * (no bounded disc, no light rays, no watermark). The hero is allowed
 * to grow past 100vh — content scrolls in the normal flow once the
 * user moves past it.
 *
 * Motion budget (transform/opacity only, no ScrollTriggers):
 *   - Glow: opacity 0→1 over 700ms, then 6s sine-inOut opacity breath
 *   - Bottle: opacity 0→1, y 18→0 over 650ms
 *   - Text reveals: opacity 0→1, y 14→0, staggered 80ms
 *   - prefers-reduced-motion: skip the timeline, render final state
 *
 * Nav clearance: section paddingTop accounts for the sticky 76px
 * header + announcement bar + visible headroom above the bottle cap.
 */
export function Hero2() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [bottleSize, setBottleSize] = useState(560);

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

      const glow = scene.querySelector('.hero-glow');
      const bottle = scene.querySelector('.hero-bottle');
      const reveals = scene.querySelectorAll('.hero-fade');

      if (prefersReducedMotion()) {
        gsap.set([glow, bottle, ...Array.from(reveals)], {opacity: 1, y: 0});
        return;
      }

      gsap.set(glow, {opacity: 0});
      gsap.set(bottle, {opacity: 0, y: 18});
      gsap.set(reveals, {opacity: 0, y: 14});

      const tl = gsap.timeline({delay: 0.05});
      tl.to(
        glow,
        {opacity: 1, duration: 0.7, ease: 'power2.out'},
        0,
      )
        .to(
          bottle,
          {opacity: 1, y: 0, duration: 0.65, ease: 'power3.out'},
          0.05,
        )
        .to(
          reveals,
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: 'power3.out',
            stagger: 0.08,
          },
          0.2,
        )
        .add(() => {
          // Subtle 6s opacity breath on the glow. Opacity only — no scale,
          // no transform, so it can't reintroduce a visible edge.
          gsap.to(glow, {
            opacity: 0.86,
            duration: 3,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
          });
        }, '>0.1');
    },
    {scope: sceneRef},
  );

  return (
    <section
      ref={sceneRef}
      className="relative isolate overflow-hidden"
      style={{
        minHeight: '100vh',
        background: '#0B0B0C',
        paddingTop: 'clamp(112px, 13vh, 184px)',
        paddingBottom: 'clamp(96px, 12vh, 144px)',
        paddingLeft: 'clamp(24px, 5vw, 80px)',
        paddingRight: 'clamp(24px, 5vw, 80px)',
      }}
    >
      {/* === Atmospheric glow stack ===
          Every layer is bounded by the section (inset:0) with a
          percentage-based radial whose final stop is fully transparent
          well within the section bounds. That removes the hard "disc"
          edge of a closest-side / fixed-size container glow. */}

      {/* L1 — Wide ambient bloom. Fills most of the hero softly. */}
      <div
        aria-hidden
        className="hero-glow pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(78% 68% at 50% 44%, rgba(209,26,42,0.22) 0%, rgba(110,11,20,0.13) 28%, rgba(58,6,12,0.06) 52%, rgba(28,4,8,0.02) 74%, rgba(11,11,12,0) 92%)',
          filter: 'blur(56px)',
          willChange: 'opacity',
        }}
      />

      {/* L2 — Tighter warmth pooling around the bottle area. Lifts the
          centre temperature without ever drawing a ring. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(42% 38% at 50% 42%, rgba(230,49,67,0.16) 0%, rgba(209,26,42,0.08) 38%, rgba(110,11,20,0.03) 62%, rgba(28,4,8,0) 84%)',
          filter: 'blur(36px)',
        }}
      />

      {/* L3 — Floor wash. A wide, very soft oxblood bloom along the
          lower edge so the composition has gravity. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(130% 50% at 50% 102%, rgba(110,11,20,0.18) 0%, rgba(58,6,12,0.08) 35%, rgba(11,11,12,0) 65%)',
        }}
      />

      {/* === Content stack === */}
      <div className="relative z-[2] mx-auto flex w-full max-w-[920px] flex-col items-center text-center">
        <div
          className="hero-fade t-mono mb-9 text-[11px] uppercase tracking-[0.24em]"
          style={{color: 'var(--color-crimson-hi)'}}
        >
          Daily vitality, done properly
        </div>

        <div className="relative flex items-center justify-center">
          <div
            className="hero-bottle"
            style={{
              width: bottleSize,
              // 1:1 bottle + ~38% reflection - 10px overlap, + buffer so
              // the headline below can never collide.
              height: Math.round(bottleSize * 1.38) + 20,
            }}
          >
            <ProductVisual
              gender="male"
              width={bottleSize}
              pedestal={1.55}
              reflection
              rays={false}
              idleFloat={false}
              mouseTilt={false}
              parallax={0}
              priority
              ring={false}
              fallbackTitle="Lumina Male Enhancement"
            />
          </div>
        </div>

        <div style={{height: 'clamp(40px, 5vh, 72px)'}} />

        <h1
          className="hero-fade text-fg1"
          style={{
            font: '200 clamp(44px, 5.6vw, 84px)/1.02 var(--font-sans)',
            letterSpacing: '-0.02em',
            textWrap: 'balance',
            maxWidth: '14ch',
          }}
        >
          <span className="text-ember">Vitality,</span> formulated honestly.
        </h1>

        <p
          className="hero-fade mt-7 max-w-[520px] text-fg2"
          style={{
            font: '300 clamp(15px, 1.15vw, 18px)/1.65 var(--font-sans)',
          }}
        >
          Two daily formulas built from clinically-studied actives — dosed at
          the levels the studies actually used, third-party tested every lot,
          nothing hidden.
        </p>

        <div className="hero-fade mt-10">
          <Link to="/collections/all" prefetch="intent">
            <Button className="px-9 py-[18px] text-base">
              Start your protocol
            </Button>
          </Link>
        </div>

        <div
          className="hero-fade text-[11px] font-medium uppercase tracking-[0.2em] text-fg3"
          style={{marginTop: 'clamp(40px, 5vh, 72px)'}}
        >
          60-day guarantee · Ships from USA · Cancel anytime
        </div>
      </div>
    </section>
  );
}
