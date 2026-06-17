import {useEffect, useRef, useState} from 'react';
import {useGSAP} from '@gsap/react';
import {Link} from 'react-router';
import {Button} from '~/components/lumina/Button';
import {ProductVisual} from '~/components/ProductVisual';
import {gsap, prefersReducedMotion} from '~/lib/motion';

/** Bottle target. Side-by-side on desktop (column ≈ half the viewport
 *  width), stacked on mobile (column ≈ full width). Stays inside the
 *  brief's 65–75% vh target on desktop; on mobile, vw becomes the
 *  binding constraint and keeps the bottle from going edge-to-edge. */
function computeBottleSize(vw: number, vh: number) {
  if (vw >= 768) {
    return Math.round(Math.max(360, Math.min(640, vh * 0.72, vw * 0.42)));
  }
  return Math.round(Math.max(280, Math.min(540, vh * 0.55, vw * 0.78)));
}

/**
 * Scene 1 — Static premium hero
 *
 * A finished banner that loads, settles, and stays still. One ~600ms
 * fade/rise sequence on mount, then composition does the work. No
 * scroll triggers, no pinned handoff — the rest of the homepage's
 * scroll choreography kicks in once the user moves past this section.
 *
 * Motion budget (transform/opacity only):
 *   - Bottle: opacity 0→1, y 18→0 over 650ms
 *   - Text reveals: opacity 0→1, y 14→0, staggered 80ms
 *   - Glow: opacity 0→1 over 700ms + a tasteful 6s opacity-only breath
 *   - prefers-reduced-motion: skip the timeline, render final state
 */
export function Hero2() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [bottleSize, setBottleSize] = useState(520);

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
        );
    },
    {scope: sceneRef},
  );

  return (
    <section
      ref={sceneRef}
      className="relative isolate overflow-hidden"
      style={{minHeight: '100vh', background: '#0B0B0C'}}
    >
      {/* Single soft bloom — feathered to fully transparent at the edges.
          Reads as light, not a drawn ring. 6s opacity-only breath. */}
      <div
        aria-hidden
        className="hero-glow lumina-glow-breath pointer-events-none absolute left-1/2 top-1/2"
        style={{
          width: 'clamp(540px, 82vh, 1180px)',
          height: 'clamp(540px, 82vh, 1180px)',
          transform: 'translate(-50%, -50%)',
          background:
            'radial-gradient(closest-side, rgba(209,26,42,0.28) 0%, rgba(110,11,20,0.16) 32%, rgba(58,6,12,0.06) 62%, rgba(11,11,12,0) 100%)',
          filter: 'blur(40px)',
          willChange: 'opacity',
        }}
      />
      {/* Subtle floor wash — grounds the bottle in the lower third. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(140% 80% at 50% 112%, rgba(110,11,20,0.18), transparent 60%)',
        }}
      />

      <div className="relative z-[2] mx-auto flex w-full max-w-[1320px] flex-col items-center justify-center gap-12 px-6 py-[clamp(80px,10vh,140px)] md:min-h-screen md:flex-row md:items-center md:justify-between md:gap-16">
        {/* Bottle column */}
        <div className="relative flex shrink-0 items-center justify-center">
          <div
            className="hero-bottle"
            style={{
              width: bottleSize,
              // bottle (1:1) + clamped reflection (38%) - 10px overlap +
              // small buffer so neighbours below never get pushed into
              // the bottle on layout settle.
              height: Math.round(bottleSize * 1.38) + 16,
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

        {/* Text column */}
        <div className="relative flex max-w-[520px] flex-col items-center text-center md:items-start md:text-left">
          <div
            className="hero-fade t-mono mb-6 text-[11px] uppercase tracking-[0.22em] text-fg3"
            style={{color: 'var(--color-crimson-hi)'}}
          >
            Daily vitality, done properly
          </div>

          <h1
            className="hero-fade text-fg1"
            style={{
              font: '200 clamp(48px, 6.4vw, 92px)/0.98 var(--font-sans)',
              letterSpacing: '-0.02em',
              textWrap: 'balance',
            }}
          >
            <span className="text-ember">Vitality,</span> formulated honestly.
          </h1>

          <p
            className="hero-fade mt-7 max-w-[440px] text-fg2"
            style={{
              font: '300 clamp(15px, 1.15vw, 18px)/1.6 var(--font-sans)',
            }}
          >
            Two daily formulas built from clinically-studied actives — dosed at
            the levels the studies actually used, third-party tested every lot,
            nothing hidden.
          </p>

          <div className="hero-fade mt-9">
            <Link to="/collections/all" prefetch="intent">
              <Button className="px-9 py-[18px] text-base">
                Start your protocol
              </Button>
            </Link>
          </div>

          <div className="hero-fade mt-7 text-[11px] font-medium uppercase tracking-[0.18em] text-fg3">
            60-day guarantee · Ships from USA · Cancel anytime
          </div>
        </div>
      </div>
    </section>
  );
}
