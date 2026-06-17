import {useRef} from 'react';
import {useGSAP} from '@gsap/react';
import {Link} from 'react-router';
import {Button} from '~/components/lumina/Button';
import {SplitLines} from '~/components/lumina/SplitLines';
import {HexLattice} from '~/components/graphics/Molecular';
import {gsap, prefersReducedMotion} from '~/lib/motion';

// ─── Vertical rhythm — a single 1.5× scale governs every gap ─────────
// 12 → 24 → 40 → 56 → 80 (each step ~1.5×). Each clamp tracks the
// vh-driven mid value but pins floor + ceiling for stability.
const GAP = {
  tight: 'clamp(12px, 1.4vh, 18px)',
  standard: 'clamp(24px, 3vh, 36px)',
  wide: 'clamp(40px, 4.8vh, 56px)',
  wider: 'clamp(56px, 6.5vh, 80px)',
} as const;

// ─── COPY PLACEHOLDERS — verify before production launch ─────────────
// Per the brief, the structure ships now (so design + IA review can
// land) but every figure below is unverified. Grep for "TODO(brand)"
// before any production promotion of this branch.

// TODO(brand): replace with verified customer / order count from
// Shopify analytics. Appears in the kicker and the trust microline. If
// the number can't be substantiated, drop both references and fall
// back to a neutral kicker like "THIRD-PARTY TESTED · 60-DAY GUARANTEE".
const TRUSTED_BY_COUNT = '12,000+';

// TODO(brand): confirm 750mg is the actual clinical-trial dose for the
// male protocol's tribulus extract. The dose claim appears in the
// subhead and as a decorative mono micro-label. Regulatory risk if
// inaccurate.
const TRIBULUS_DOSE = '750mg';

// TODO(brand): decorative lot number for editorial texture only.
// Either auto-inject the current production lot from inventory or
// remove the "LOT #…" micro-label entirely before launch.
const SAMPLE_LOT = 'LM-0824';

/**
 * Scene 1 — Brand statement hero (atmospheric, no product)
 *
 * Static composition. The layout is the previous pass; this iteration
 * upgrades copy (more specific, more confrontational) and richens the
 * canvas (offset secondary glow for dimensionality, faint molecular
 * lattice behind the type, editorial mono micro-labels, a tasteful
 * scroll cue at the bottom).
 *
 * Motion budget — transform/opacity only, zero ScrollTriggers:
 *   - Atmosphere fades in
 *   - Kicker + rule come up, headline lines mask-reveal (stagger 120ms)
 *   - Subhead → supporting → CTAs → trust (stagger 80ms)
 *   - Mono micro-labels + scroll indicator fade in last
 *   - Three breath cycles + a slow molecular drift run forever
 *   - prefers-reduced-motion: snap everything to final state
 */
export function Hero2() {
  const sceneRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const scene = sceneRef.current;
      if (!scene) return;

      const ambientGlow = scene.querySelector('.hero-glow-ambient');
      const highlight = scene.querySelector('.hero-glow-highlight');
      const offsetGlow = scene.querySelector('.hero-glow-offset');
      const bedGlow = scene.querySelector('.hero-glow-bed');
      const molecular = scene.querySelector('.hero-molecular');
      const corners = scene.querySelectorAll('.hero-corner');
      const kicker = scene.querySelector('.hero-kicker');
      const rule = scene.querySelector('.hero-kicker-rule');
      const lines = scene.querySelectorAll('.line-inner');
      const reveals = scene.querySelectorAll('.hero-fade');
      const microLabels = scene.querySelectorAll('.hero-micro-label');
      const scrollCue = scene.querySelector('.hero-scroll-cue');
      const scrollCueLine = scene.querySelector('.hero-scroll-cue-line');

      const allOpacityTargets = [
        ambientGlow,
        highlight,
        offsetGlow,
        bedGlow,
        molecular,
        kicker,
        rule,
        ...Array.from(corners),
        ...Array.from(lines),
        ...Array.from(reveals),
        ...Array.from(microLabels),
        scrollCue,
        scrollCueLine,
      ];

      if (prefersReducedMotion()) {
        gsap.set(allOpacityTargets, {
          opacity: 1,
          y: 0,
          yPercent: 0,
          scaleX: 1,
          scaleY: 1,
        });
        return;
      }

      gsap.set(ambientGlow, {opacity: 0});
      gsap.set(highlight, {opacity: 0});
      gsap.set(offsetGlow, {opacity: 0});
      gsap.set(bedGlow, {opacity: 0});
      gsap.set(molecular, {opacity: 0});
      gsap.set(corners, {opacity: 0});
      gsap.set(kicker, {opacity: 0, y: 8});
      gsap.set(rule, {scaleX: 0, transformOrigin: '50% 50%'});
      gsap.set(lines, {yPercent: 110});
      gsap.set(reveals, {opacity: 0, y: 14});
      gsap.set(microLabels, {opacity: 0});
      gsap.set(scrollCue, {opacity: 0});
      gsap.set(scrollCueLine, {
        scaleY: 0,
        transformOrigin: '50% 0%',
      });

      const tl = gsap.timeline({delay: 0.05});
      tl.to(
        ambientGlow,
        {opacity: 1, duration: 0.85, ease: 'power2.out'},
        0,
      )
        .to(
          highlight,
          {opacity: 1, duration: 1.0, ease: 'power2.out'},
          0.1,
        )
        .to(
          offsetGlow,
          {opacity: 1, duration: 0.9, ease: 'power2.out'},
          0.08,
        )
        .to(
          bedGlow,
          {opacity: 0.55, duration: 0.95, ease: 'power2.out'},
          0.12,
        )
        .to(
          molecular,
          {opacity: 1, duration: 1.2, ease: 'power2.out'},
          0.28,
        )
        .to(
          corners,
          {opacity: 1, duration: 0.9, ease: 'power2.out', stagger: 0.04},
          0.35,
        )
        .to(
          kicker,
          {opacity: 1, y: 0, duration: 0.5, ease: 'power3.out'},
          0.25,
        )
        .to(
          rule,
          {scaleX: 1, duration: 0.7, ease: 'power3.out'},
          0.33,
        )
        .to(
          lines,
          {
            yPercent: 0,
            duration: 0.75,
            ease: 'power3.out',
            stagger: 0.12,
          },
          0.45,
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
          0.95,
        )
        .to(
          microLabels,
          {opacity: 1, duration: 0.8, ease: 'power2.out', stagger: 0.08},
          1.25,
        )
        .to(
          scrollCueLine,
          {scaleY: 1, duration: 0.9, ease: 'power3.out'},
          1.55,
        )
        .to(
          scrollCue,
          {opacity: 1, duration: 0.45, ease: 'power2.out'},
          1.55,
        )
        .add(() => {
          // ─── Idle breaths ───
          // Slow, layered cadences — barely perceptible individually,
          // collectively keep the warmth alive. Opacity / transform
          // only; nothing reintroduces a hard edge.
          gsap.to(ambientGlow, {
            opacity: 0.86,
            duration: 4,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
          });
          gsap.to(highlight, {
            opacity: 0.6,
            duration: 5.5,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
          });
          gsap.to(offsetGlow, {
            opacity: 0.72,
            duration: 4.75,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
          });
          gsap.to(bedGlow, {
            opacity: 0.34,
            duration: 6,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
          });
          // Slowest plane — molecular grid drifts on transform only.
          gsap.to(molecular, {
            x: 24,
            y: -10,
            duration: 18,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
          });
          // Scroll cue hairline — gentle scaleY pulse, ~3.4s.
          gsap.to(scrollCueLine, {
            scaleY: 0.55,
            duration: 1.7,
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
        paddingBottom: 'clamp(112px, 14vh, 168px)',
        paddingLeft: 'clamp(24px, 5vw, 80px)',
        paddingRight: 'clamp(24px, 5vw, 80px)',
      }}
    >
      {/* ═══ Atmosphere stack ═══
          Every layer is section-filling on inset:0 with a percentage
          radial whose final stop is fully transparent well within the
          section — no bounded disc anywhere. */}

      {/* L1 — Wide ambient bloom. Brighter crimson core that grades
          through oxblood to deep oxblood and finally near-black —
          light with weight, not a flat wash. */}
      <div
        aria-hidden
        className="hero-glow-ambient pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(84% 74% at 50% 52%, rgba(230,49,67,0.30) 0%, rgba(209,26,42,0.20) 18%, rgba(110,11,20,0.12) 38%, rgba(58,6,12,0.05) 62%, rgba(28,4,8,0.015) 80%, rgba(11,11,12,0) 94%)',
          filter: 'blur(60px)',
          willChange: 'opacity',
        }}
      />

      {/* L1b — Soft highlight catch near the top. The single light
          source the rest of the bloom is reacting to. */}
      <div
        aria-hidden
        className="hero-glow-highlight pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(20% 16% at 50% 16%, rgba(230,49,67,0.22) 0%, rgba(209,26,42,0.10) 40%, rgba(110,11,20,0.02) 75%, rgba(11,11,12,0) 92%)',
          filter: 'blur(34px)',
          willChange: 'opacity',
        }}
      />

      {/* L2 — Offset secondary glow (smaller, higher-right). The
          off-axis source breaks the single-radial flatness and gives
          the light a direction. */}
      <div
        aria-hidden
        className="hero-glow-offset pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(46% 40% at 72% 30%, rgba(230,49,67,0.18) 0%, rgba(209,26,42,0.09) 36%, rgba(110,11,20,0.035) 62%, rgba(28,4,8,0) 86%)',
          filter: 'blur(46px)',
          willChange: 'opacity',
        }}
      />

      {/* L3 — Type-bed glow (slower drift behind the headline). */}
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

      {/* L4 — Molecular lattice. A barely-there crimson hex grid behind
          the headline, masked to fade out at the edges. Drifts slowly
          on transform only. */}
      <div
        aria-hidden
        className="hero-molecular pointer-events-none absolute"
        style={{
          inset: '8% 4%',
          opacity: 0.065,
          maskImage:
            'radial-gradient(closest-side, #000 35%, transparent 78%)',
          WebkitMaskImage:
            'radial-gradient(closest-side, #000 35%, transparent 78%)',
          willChange: 'transform, opacity',
        }}
      >
        <HexLattice rows={5} cols={9} size={72} strokeOpacity={1} />
      </div>

      {/* L5 — Floor wash (gravity, no spotlight). */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(130% 55% at 50% 104%, rgba(110,11,20,0.18) 0%, rgba(58,6,12,0.08) 32%, rgba(11,11,12,0) 62%)',
        }}
      />

      {/* L6 — Edge vignette. Pulls corners toward pure black so the
          composition feels held inside the frame and the centre
          naturally sits slightly brighter. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(140% 110% at 50% 50%, rgba(11,11,12,0) 52%, rgba(11,11,12,0.40) 82%, rgba(11,11,12,0.85) 100%)',
        }}
      />

      {/* ═══ Editorial mono micro-labels ═══
          Decorative details aligned to a single y-rail at the top and
          another at the bottom. Two sit at 5% so they're almost an
          afterthought; NW is bumped to 10% as the intentional focal
          accent — the reason your eye wants to look there. Hidden
          below md so the mobile composition stays clean. */}
      <div aria-hidden className="pointer-events-none hidden md:block">
        <span
          className="hero-micro-label t-mono absolute uppercase text-fg3"
          style={{
            top: 'clamp(132px, 16vh, 220px)',
            left: 'clamp(32px, 3.5vw, 88px)',
            fontSize: 10,
            letterSpacing: '0.24em',
            opacity: 0.1,
          }}
        >
          {TRIBULUS_DOSE.toUpperCase()} TRIBULUS
        </span>
        <span
          className="hero-micro-label t-mono absolute uppercase text-fg3"
          style={{
            top: 'clamp(132px, 16vh, 220px)',
            right: 'clamp(32px, 3.5vw, 88px)',
            fontSize: 10,
            letterSpacing: '0.24em',
            opacity: 0.05,
          }}
        >
          LOT #{SAMPLE_LOT}
        </span>
        <span
          className="hero-micro-label t-mono absolute uppercase text-fg3"
          style={{
            bottom: 'clamp(124px, 15vh, 188px)',
            right: 'clamp(32px, 3.5vw, 88px)',
            fontSize: 10,
            letterSpacing: '0.24em',
            opacity: 0.05,
          }}
        >
          60-DAY · LOT-TESTED
        </span>
      </div>

      {/* ═══ Corner accents ═══
          Four 18px L-shapes inset from the section corners. 1px crimson
          hairlines at 8% opacity — viewfinder marks that subconsciously
          signal "framed, designed". Hidden below sm so the mobile
          composition stays pure. */}
      <div aria-hidden className="pointer-events-none hidden sm:block">
        {[
          {top: 24, left: 24, borders: 'border-t border-l'},
          {top: 24, right: 24, borders: 'border-t border-r'},
          {bottom: 24, left: 24, borders: 'border-b border-l'},
          {bottom: 24, right: 24, borders: 'border-b border-r'},
        ].map((pos, i) => (
          <div
            key={i}
            className={`hero-corner absolute ${pos.borders}`}
            style={{
              width: 18,
              height: 18,
              top: pos.top,
              bottom: pos.bottom,
              left: pos.left,
              right: pos.right,
              borderColor: 'rgba(209,26,42,0.08)',
            }}
          />
        ))}
      </div>

      {/* ═══ Content ═══ */}
      <div className="relative z-[2] mx-auto flex w-full max-w-[1080px] flex-col items-center text-center">
        {/* Kicker — confrontational trust signal */}
        <div className="hero-kicker flex flex-col items-center">
          <span
            className="t-mono text-[11px] uppercase tracking-[0.26em]"
            style={{color: 'var(--color-crimson-hi)'}}
          >
            Trusted by {TRUSTED_BY_COUNT} · Third-party tested
          </span>
          <span
            aria-hidden
            className="rule-ember hero-kicker-rule mt-5"
            style={{width: 112}}
          />
        </div>

        <div style={{height: GAP.wide}} />

        {/* Massive headline — three lines, mask reveal, ember on the
            brand-promise word. Tighter leading (0.92) + slightly more
            open tracking (-0.02em) gives the lockup a sculpted feel. */}
        <SplitLines
          lines={[
            'Vitality,',
            'formulated',
            <span key="3" className="text-ember">honestly.</span>,
          ]}
          as="h1"
          className="text-fg1"
          style={{
            font: '300 clamp(3.5rem, 9vw, 8rem)/0.92 var(--font-sans)',
            letterSpacing: '-0.02em',
          }}
        />

        {/* Subhead — specific, confrontational, dose-named. */}
        <p
          className="hero-fade max-w-[680px] text-fg2"
          style={{
            font: '300 clamp(16px, 1.25vw, 20px)/1.6 var(--font-sans)',
            marginTop: GAP.standard,
          }}
        >
          Two daily formulas dosed at the levels studies actually used —{' '}
          {TRIBULUS_DOSE} tribulus, not fairy dust. Third-party tested every
          lot. Every dose printed on the label.
        </p>

        {/* Supporting line — the hook that picks a fight. */}
        <p
          className="hero-fade text-fg3"
          style={{
            font: '300 clamp(13px, 1.05vw, 16px)/1.5 var(--font-sans)',
            letterSpacing: '-0.005em',
            marginTop: GAP.tight,
          }}
        >
          Built for people who read the label before they buy.
        </p>

        {/* CTAs — primary (lower-commitment "Find") + curiosity secondary */}
        <div
          className="hero-fade flex flex-col items-center gap-4 sm:flex-row sm:gap-5"
          style={{marginTop: GAP.wide}}
        >
          <Link to="/collections/all" prefetch="intent">
            <Button className="px-9 py-[18px] text-base">
              Find your formula
            </Button>
          </Link>
          <Link to="/#two-formulas" prefetch="intent">
            <Button variant="secondary" className="px-9 py-[17px] text-base">
              See what&apos;s inside
            </Button>
          </Link>
        </div>

        {/* Trust microline — specific, multi-claim */}
        <div
          className="hero-fade text-[11px] font-medium uppercase tracking-[0.22em] text-fg3"
          style={{marginTop: GAP.wider}}
        >
          60-day money-back guarantee · Tested every lot · Made in USA ·{' '}
          {TRUSTED_BY_COUNT} protocols started
        </div>
      </div>

      {/* ═══ Scroll cue ═══
          A single thin hairline — gradient from transparent → fg4 →
          transparent — with a gentle scaleY breath. No chevron, no
          label. Just the suggestion of "there's more below." */}
      <div
        aria-hidden
        className="hero-scroll-cue pointer-events-none absolute left-1/2 -translate-x-1/2"
        style={{
          bottom: 'clamp(28px, 5vh, 56px)',
          willChange: 'opacity',
        }}
      >
        <div
          className="hero-scroll-cue-line"
          style={{
            width: 1,
            height: 36,
            background:
              'linear-gradient(180deg, rgba(160,160,168,0) 0%, rgba(160,160,168,0.55) 50%, rgba(160,160,168,0) 100%)',
            willChange: 'transform',
          }}
        />
      </div>
    </section>
  );
}
