import {useRef} from 'react';
import {useGSAP} from '@gsap/react';
import {Link} from 'react-router';
import {Button} from '~/components/lumina/Button';
import {SplitLines} from '~/components/lumina/SplitLines';
import {gsap, prefersReducedMotion} from '~/lib/motion';

/**
 * Scene 1 — Brand statement hero
 *
 * Pure typography on a layered red/black canvas. No product imagery,
 * no scroll triggers, no parallax — a single cohesive composition that
 * loads, settles, and stays still. The atmosphere does the heavy
 * lifting:
 *
 *   - Three section-filling crimson radials feathered to transparent
 *     (no bounded disc).
 *   - A second slower breath on the type-bed glow so the warmth behind
 *     the headline drifts at a different cadence to the ambient bloom.
 *   - Edge vignette pulling toward black at the corners.
 *   - Faint film grain is contributed by the global <FilmGrain /> layer
 *     in PageLayout — not re-emitted here.
 *
 * Motion budget (transform/opacity only):
 *   - Glow fades in over 700ms; immediately starts a 6s opacity breath.
 *   - Type-bed glow runs a slower 9s opacity drift.
 *   - Mono kicker fades in; hairline rule scales from 0 to 100% width.
 *   - Headline lines: SplitLines mask reveal, yPercent 110 → 0,
 *     staggered 120ms (the slowest, deliberate beat).
 *   - Subhead → supporting → CTAs → trust: opacity + y, stagger 80ms.
 *   - prefers-reduced-motion: snap everything to its final state.
 */
export function Hero2() {
  const sceneRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const scene = sceneRef.current;
      if (!scene) return;

      const ambientGlow = scene.querySelector('.hero-glow-ambient');
      const bedGlow = scene.querySelector('.hero-glow-bed');
      const kicker = scene.querySelector('.hero-kicker');
      const rule = scene.querySelector('.hero-kicker-rule');
      const lines = scene.querySelectorAll('.line-inner');
      const reveals = scene.querySelectorAll('.hero-fade');

      if (prefersReducedMotion()) {
        gsap.set(
          [
            ambientGlow,
            bedGlow,
            kicker,
            rule,
            ...Array.from(lines),
            ...Array.from(reveals),
          ],
          {opacity: 1, y: 0, yPercent: 0, scaleX: 1},
        );
        return;
      }

      gsap.set(ambientGlow, {opacity: 0});
      gsap.set(bedGlow, {opacity: 0});
      gsap.set(kicker, {opacity: 0, y: 8});
      gsap.set(rule, {scaleX: 0, transformOrigin: '50% 50%'});
      gsap.set(lines, {yPercent: 110});
      gsap.set(reveals, {opacity: 0, y: 14});

      const tl = gsap.timeline({delay: 0.05});
      tl.to(
        ambientGlow,
        {opacity: 1, duration: 0.75, ease: 'power2.out'},
        0,
      )
        .to(
          bedGlow,
          {opacity: 0.55, duration: 0.9, ease: 'power2.out'},
          0.05,
        )
        .to(
          kicker,
          {opacity: 1, y: 0, duration: 0.5, ease: 'power3.out'},
          0.2,
        )
        .to(
          rule,
          {scaleX: 1, duration: 0.7, ease: 'power3.out'},
          0.28,
        )
        .to(
          lines,
          {
            yPercent: 0,
            duration: 0.75,
            ease: 'power3.out',
            stagger: 0.12,
          },
          0.4,
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
          0.9,
        )
        .add(() => {
          // 6s opacity breath on the ambient bloom and 9s drift on the
          // type-bed glow — different cadences keep the warmth feeling
          // alive without ever drawing attention.
          gsap.to(ambientGlow, {
            opacity: 0.84,
            duration: 3,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
          });
          gsap.to(bedGlow, {
            opacity: 0.32,
            duration: 4.5,
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
        paddingTop: 'clamp(120px, 14vh, 200px)',
        paddingBottom: 'clamp(96px, 12vh, 144px)',
        paddingLeft: 'clamp(24px, 5vw, 80px)',
        paddingRight: 'clamp(24px, 5vw, 80px)',
      }}
    >
      {/* === Atmosphere stack ===
          Every layer is bounded by the section (inset:0) with a
          percentage-based radial whose final stop is fully transparent
          inside the section bounds — no hard edge possible. */}

      {/* L1 — Wide ambient bloom. */}
      <div
        aria-hidden
        className="hero-glow-ambient pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(80% 70% at 50% 46%, rgba(209,26,42,0.24) 0%, rgba(110,11,20,0.14) 28%, rgba(58,6,12,0.06) 52%, rgba(28,4,8,0.02) 74%, rgba(11,11,12,0) 92%)',
          filter: 'blur(56px)',
          willChange: 'opacity',
        }}
      />

      {/* L2 — Slower glow drift behind the type bed. Sits a touch lower
          and wider than the headline so the bloom radiates from where
          the eye lands. */}
      <div
        aria-hidden
        className="hero-glow-bed pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(55% 38% at 50% 48%, rgba(230,49,67,0.22) 0%, rgba(209,26,42,0.12) 38%, rgba(110,11,20,0.04) 65%, rgba(28,4,8,0) 88%)',
          filter: 'blur(44px)',
          willChange: 'opacity',
        }}
      />

      {/* L3 — Floor wash. Gravity, no spotlight. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(130% 55% at 50% 104%, rgba(110,11,20,0.18) 0%, rgba(58,6,12,0.08) 32%, rgba(11,11,12,0) 62%)',
        }}
      />

      {/* L4 — Edge vignette. Pulls the corners toward pure black so the
          composition feels held within the frame. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(140% 110% at 50% 50%, rgba(11,11,12,0) 55%, rgba(11,11,12,0.45) 85%, rgba(11,11,12,0.85) 100%)',
        }}
      />

      {/* === Content === */}
      <div className="relative z-[2] mx-auto flex w-full max-w-[1080px] flex-col items-center text-center">
        {/* Mono kicker + hairline rule */}
        <div className="hero-kicker flex flex-col items-center">
          <span
            className="t-mono text-[11px] uppercase tracking-[0.26em]"
            style={{color: 'var(--color-crimson-hi)'}}
          >
            Daily vitality, done properly
          </span>
          <span
            aria-hidden
            className="rule-ember hero-kicker-rule mt-5"
            style={{width: 96}}
          />
        </div>

        <div style={{height: 'clamp(36px, 5vh, 64px)'}} />

        {/* Massive headline — three lines, mask reveal. Last line is the
            ember word; the rest is calm fg-1 weight 300. */}
        <SplitLines
          lines={[
            'Vitality,',
            'formulated',
            <span key="3" className="text-ember">honestly.</span>,
          ]}
          as="h1"
          className="text-fg1"
          style={{
            font: '300 clamp(3.5rem, 9vw, 8rem)/0.94 var(--font-sans)',
            letterSpacing: '-0.025em',
          }}
        />

        <p
          className="hero-fade mt-9 max-w-[640px] text-fg2"
          style={{
            font: '300 clamp(16px, 1.25vw, 20px)/1.6 var(--font-sans)',
          }}
        >
          Two daily formulas — dosed at the levels the studies actually used,
          third-party tested every lot, nothing hidden.
        </p>

        <p
          className="hero-fade mt-4 text-fg3"
          style={{
            font: '300 clamp(13px, 1.05vw, 16px)/1.5 var(--font-sans)',
            letterSpacing: '-0.005em',
          }}
        >
          The protocol for people who read labels.
        </p>

        <div className="hero-fade mt-11 flex flex-col items-center gap-4 sm:flex-row sm:gap-5">
          <Link to="/collections/all" prefetch="intent">
            <Button className="px-9 py-[18px] text-base">
              Start your protocol
            </Button>
          </Link>
          <Link to="/#two-formulas" prefetch="intent">
            <Button variant="secondary" className="px-9 py-[17px] text-base">
              See the formulas
            </Button>
          </Link>
        </div>

        <div
          className="hero-fade text-[11px] font-medium uppercase tracking-[0.22em] text-fg3"
          style={{marginTop: 'clamp(48px, 6vh, 80px)'}}
        >
          60-day guarantee · Third-party tested every lot · Made in USA
        </div>
      </div>
    </section>
  );
}
