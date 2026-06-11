import {useRef} from 'react';
import {useGSAP} from '@gsap/react';
import {ArrowDown} from 'lucide-react';
import {Link} from 'react-router';
import {Button} from '~/components/lumina/Button';
import {Eyebrow} from '~/components/lumina/Eyebrow';
import {SplitLines} from '~/components/lumina/SplitLines';
import {ProductVisual} from '~/components/ProductVisual';
import {LightRays} from '~/components/graphics/LightRays';
import {MonoWatermark} from '~/components/graphics/MonoWatermark';
import {gsap, prefersReducedMotion} from '~/lib/motion';

/**
 * Scene 1 — Hero 2.0
 *
 * Pinned cinematic intro. Bottle stays centered while three headline
 * lines reveal sequentially. Crimson glow intensifies as the scene
 * progresses. At the end, the bottle scales down and the scroll
 * releases naturally into the manifesto.
 */
export function Hero2() {
  const sceneRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const scene = sceneRef.current;
      if (!scene) return;

      const lines = scene.querySelectorAll('.line-inner');
      const bottle = scene.querySelector('.hero-bottle');
      const glow = scene.querySelector('.hero-glow');
      const kicker = scene.querySelector('.hero-kicker');
      const footing = scene.querySelector('.hero-footing');

      gsap.set(lines, {yPercent: 110});
      gsap.set([kicker, footing], {opacity: 0, y: 20});

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scene,
          start: 'top top',
          end: '+=180%',
          pin: true,
          pinSpacing: true,
          scrub: 0.8,
          anticipatePin: 0.5,
        },
      });

      tl.to(kicker, {opacity: 1, y: 0, duration: 0.4, ease: 'power3.out'}, 0)
        .to(
          lines[0],
          {yPercent: 0, duration: 0.7, ease: 'power3.out'},
          0.05,
        )
        .to(
          lines[1],
          {yPercent: 0, duration: 0.7, ease: 'power3.out'},
          0.45,
        )
        .to(
          lines[2],
          {yPercent: 0, duration: 0.7, ease: 'power3.out'},
          0.85,
        )
        .to(
          footing,
          {opacity: 1, y: 0, duration: 0.5, ease: 'power3.out'},
          1.1,
        )
        .to(
          glow,
          {scale: 1.25, opacity: 0.95, duration: 1.6, ease: 'power2.inOut'},
          0,
        )
        .to(
          bottle,
          {scale: 0.7, y: 80, duration: 1.2, ease: 'power2.in'},
          1.2,
        )
        .to(
          [kicker, lines, footing],
          {opacity: 0, duration: 0.5, ease: 'power3.in'},
          1.4,
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
      <div
        aria-hidden
        className="hero-glow pointer-events-none absolute"
        style={{
          width: 1300,
          height: 1300,
          left: '50%',
          top: '52%',
          transform: 'translate(-50%,-50%)',
          background: 'var(--glow-hero)',
          opacity: 0.6,
        }}
      />
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
          <div className="hero-bottle">
            <ProductVisual
              gender="male"
              width={160}
              pedestal={2.2}
              reflection
              rays={false}
              idleFloat
              mouseTilt
              parallax={0}
              priority
              fallbackTitle="Lumina formula"
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
