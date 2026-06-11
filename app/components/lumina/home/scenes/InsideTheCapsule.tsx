import {useRef} from 'react';
import {useGSAP} from '@gsap/react';
import {Eyebrow} from '~/components/lumina/Eyebrow';
import {BotanicalEngraving} from '~/components/graphics/BotanicalEngraving';
import {MonoWatermark} from '~/components/graphics/MonoWatermark';
import {gsap, prefersReducedMotion} from '~/lib/motion';

/**
 * Signature pinned scene — Inside the Capsule.
 *
 * A capsule outline sits centered. As the user scrolls, the two halves
 * of the capsule separate and ingredient nodes (botanical icon + mono
 * dose label) orbit outward into a constellation around it.
 *
 * The orbit positions are pre-calculated in absolute coordinates;
 * GSAP drives opacity + translate over the pinned scroll range.
 */

interface OrbitNode {
  ingredient: string;
  dose: string;
  illustration?: 'ashwagandha' | 'maca' | 'tribulus' | 'ginkgo' | 'epimedium' | 'ginger';
  angle: number; // degrees from top
  radius: number; // px from center
}

const NODES: ReadonlyArray<OrbitNode> = [
  {ingredient: 'Tribulus', dose: '750mg', illustration: 'tribulus', angle: 0, radius: 280},
  {ingredient: 'Zinc', dose: '30mg', angle: 45, radius: 320},
  {ingredient: 'Magnesium', dose: '200mg', angle: 90, radius: 260},
  {ingredient: 'Ashwagandha', dose: 'in blend', illustration: 'ashwagandha', angle: 135, radius: 320},
  {ingredient: 'Maca', dose: 'in blend', illustration: 'maca', angle: 180, radius: 280},
  {ingredient: 'B12', dose: '2,250% DV', angle: 225, radius: 320},
  {ingredient: 'Ginkgo', dose: 'in blend', illustration: 'ginkgo', angle: 270, radius: 260},
  {ingredient: 'Epimedium', dose: '50mg', illustration: 'epimedium', angle: 315, radius: 320},
];

export function InsideTheCapsule() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const scene = ref.current;
      if (!scene) return;
      const capsuleTop = scene.querySelector('.capsule-top') as HTMLElement | null;
      const capsuleBottom = scene.querySelector('.capsule-bottom') as HTMLElement | null;
      const nodes = scene.querySelectorAll('.orbit-node');
      if (!capsuleTop || !capsuleBottom || nodes.length === 0) return;

      gsap.set(nodes, {opacity: 0, x: 0, y: 0, scale: 0.85});

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

      // Capsule splits open
      tl.to(capsuleTop, {y: -60, duration: 0.5, ease: 'power2.out'}, 0);
      tl.to(capsuleBottom, {y: 60, duration: 0.5, ease: 'power2.out'}, 0);

      // Nodes orbit outward to their final positions
      nodes.forEach((node, i) => {
        const def = NODES[i];
        const rad = (def.angle * Math.PI) / 180;
        const tx = Math.sin(rad) * def.radius;
        const ty = -Math.cos(rad) * def.radius;
        tl.to(
          node,
          {
            x: tx,
            y: ty,
            opacity: 1,
            scale: 1,
            duration: 0.7,
            ease: 'power2.out',
          },
          0.2 + i * 0.04,
        );
      });
    },
    {scope: ref},
  );

  return (
    <section
      ref={ref}
      className="relative isolate overflow-hidden border-t border-border lumina-bg-2"
      style={{minHeight: '100vh'}}
    >
      <MonoWatermark position="top-right" size={300} opacity={0.04}>
        INSIDE
      </MonoWatermark>
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          width: 1500,
          height: 1500,
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'var(--glow-hero)',
          opacity: 0.3,
        }}
      />

      <div className="relative mx-auto flex h-screen max-w-[1320px] flex-col items-center justify-center px-6 md:px-10">
        <Eyebrow style={{color: 'var(--color-crimson-hi)'}}>The capsule</Eyebrow>
        <h2
          className="m-0 mt-5 text-center text-fg1"
          style={{
            font: '300 clamp(34px, 4vw, 48px)/1.05 var(--font-sans)',
            letterSpacing: '-0.015em',
          }}
        >
          Open the bottle. Out comes the work.
        </h2>

        {/* Capsule + orbit stage */}
        <div
          className="relative mt-12"
          style={{width: 240, height: 240, perspective: 800}}
        >
          {/* Top half */}
          <div
            className="capsule-top absolute"
            style={{
              top: '50%',
              left: '50%',
              width: 100,
              height: 70,
              transform: 'translate(-50%, calc(-100% + 6px))',
              borderRadius: '50px 50px 4px 4px',
              border: '1px solid var(--color-border-strong)',
              background:
                'linear-gradient(180deg, #6E0B14 0%, #3A060C 100%)',
              boxShadow:
                'inset 0 -10px 24px rgba(0,0,0,0.4), 0 6px 16px rgba(0,0,0,0.6)',
            }}
          />
          {/* Bottom half */}
          <div
            className="capsule-bottom absolute"
            style={{
              top: '50%',
              left: '50%',
              width: 100,
              height: 70,
              transform: 'translate(-50%, -6px)',
              borderRadius: '4px 4px 50px 50px',
              border: '1px solid var(--color-border-strong)',
              background:
                'linear-gradient(180deg, #1B1B1E 0%, #0D0D0F 100%)',
              boxShadow:
                'inset 0 10px 24px rgba(0,0,0,0.4), 0 6px 16px rgba(0,0,0,0.6)',
            }}
          />

          {/* Orbit nodes */}
          {NODES.map((node, i) => (
            <article
              key={node.ingredient}
              className="orbit-node absolute flex items-center gap-2.5 whitespace-nowrap rounded-md border border-border bg-surface px-3 py-2"
              style={{
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 5,
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              {node.illustration && (
                <BotanicalEngraving
                  name={node.illustration}
                  width={28}
                  strokeOpacity={0.7}
                  accentOpacity={0.4}
                />
              )}
              <div className="flex flex-col gap-0.5">
                <span className="text-[12.5px] font-medium leading-none text-fg1">
                  {node.ingredient}
                </span>
                <span className="t-mono text-[10px] uppercase tracking-[0.1em] text-crimson-hi">
                  {node.dose}
                </span>
              </div>
            </article>
          ))}
        </div>

        <p
          className="m-0 mt-12 max-w-[520px] text-center text-fg3"
          style={{font: '300 16px/1.65 var(--font-sans)'}}
        >
          Every active disclosed, every dose on the page, every botanical
          named. Scroll past the capsule and the formula becomes visible.
        </p>
      </div>
    </section>
  );
}
