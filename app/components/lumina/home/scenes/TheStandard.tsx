import {useRef} from 'react';
import {useGSAP} from '@gsap/react';
import {FlaskConical, ListChecks, ShieldCheck} from 'lucide-react';
import {Eyebrow} from '~/components/lumina/Eyebrow';
import {HexLattice} from '~/components/graphics/Molecular';
import {gsap, prefersReducedMotion} from '~/lib/motion';
import {getProductImage} from '~/lib/product-assets';

/**
 * Scene 5 — The Standard
 *
 * Pinned horizontal sequence — three panels slide past while the section
 * stays pinned to the viewport. Each panel is a single, confident
 * statement of our standard: testing, doses, guarantee. Big type,
 * mono small-caps labels, minimal chrome.
 */

const PANELS = [
  {
    label: 'Pillar 01',
    Icon: FlaskConical,
    headline: 'Every lot, third-party tested.',
    body: "Identity, potency, heavy metals, microbial contamination. Independent lab — not us, not the manufacturer. Certificate of Analysis on request.",
  },
  {
    label: 'Pillar 02',
    Icon: ListChecks,
    headline: 'Every dose, disclosed in mono.',
    body: 'Every milligram on every active. Botanical blends listed in full with their total weight. Proprietary doses are the category default — they are not ours.',
  },
  {
    label: 'Pillar 03',
    Icon: ShieldCheck,
    headline: '60 days. Empty bottles fine.',
    body: "If the formula isn't right for you — even after the full 8-week assessment — email us. We refund the order. No restocking, no retention script.",
  },
];

export function TheStandard() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const scene = ref.current;
      if (!scene) return;
      const track = scene.querySelector('.standard-track') as HTMLElement | null;
      const panels = scene.querySelectorAll('.standard-panel');
      if (!track || panels.length === 0) return;

      const totalWidth = track.scrollWidth - window.innerWidth;
      if (totalWidth <= 0) return;

      // Mobile gets a shorter pin so the scroll commitment stays
      // proportional to the screen — desktop runs the full track +
      // 40% buffer, mobile cuts that buffer.
      const isNarrow = window.matchMedia('(max-width: 480px)').matches;
      const tailBuffer = isNarrow ? 0.1 : 0.4;
      gsap.to(track, {
        x: -totalWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: scene,
          start: 'top top',
          end: () => `+=${totalWidth + window.innerHeight * tailBuffer}`,
          pin: true,
          pinSpacing: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      // Panel-1 + panel-3 photographic backdrops drift horizontally
      // at 88% of the track speed (i.e. 12% slower) — the photograph
      // appears to sit behind the type, creating depth without
      // breaking the pinned horizontal rhythm.
      const backdrops = scene.querySelectorAll('.standard-panel-bg');
      backdrops.forEach((bg) => {
        gsap.to(bg, {
          x: () => totalWidth * 0.12,
          ease: 'none',
          scrollTrigger: {
            trigger: scene,
            start: 'top top',
            end: () => `+=${totalWidth + window.innerHeight * tailBuffer}`,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
      });
    },
    {scope: ref},
  );

  return (
    <section
      ref={ref}
      className="relative isolate overflow-hidden bg-black"
      aria-label="The Lumina standard"
    >
      <div className="pointer-events-none absolute inset-0" style={{opacity: 0.4}}>
        <HexLattice rows={8} cols={14} size={56} strokeOpacity={0.5} />
      </div>
      <div className="standard-overlay border-y border-border">
        <div className="standard-track flex">
          <div className="flex flex-shrink-0 items-center justify-center px-10 py-24 md:px-16 md:py-32" style={{width: '60vw', minWidth: 360}}>
            <div className="max-w-[420px]">
              <Eyebrow style={{color: 'var(--color-crimson-hi)'}}>
                The standard
              </Eyebrow>
              <h2
                className="m-0 mt-5 text-fg1"
                style={{
                  font: '300 clamp(38px, 5vw, 60px)/1.05 var(--font-sans)',
                  letterSpacing: '-0.018em',
                }}
              >
                Three pillars. No shortcuts.
              </h2>
              <p
                className="m-0 mt-5 text-fg3"
                style={{font: '300 17px/1.65 var(--font-sans)'}}
              >
                The non-negotiables every Lumina product is held to —
                regardless of formula or price.
              </p>
            </div>
          </div>
          {PANELS.map(({label, Icon, headline, body}, idx) => {
            // Panel backdrops: male-rock behind panel 1 (idx 0),
            // female-smoke behind panel 3 (idx 2).
            const backdropSrc =
              idx === 0
                ? getProductImage('male', 'rock') ??
                  getProductImage('male', 'hero')
                : idx === 2
                  ? getProductImage('female', 'smoke') ??
                    getProductImage('female', 'hero')
                  : null;
            return (
            <article
              key={label}
              className={`standard-panel ${idx === 1 ? 'glow-frame glow-frame-base glow-frame-rest mx-6 rounded-2xl md:mx-10' : 'border-l border-border'} relative isolate flex flex-shrink-0 flex-col justify-center overflow-hidden px-10 py-24 md:px-16 md:py-32`}
              style={{width: '70vw', minWidth: 420}}
            >
              {backdropSrc && (
                <div
                  aria-hidden
                  className="standard-panel-bg pointer-events-none absolute inset-0 z-0"
                  style={{
                    backgroundImage: `url(${backdropSrc})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    willChange: 'transform',
                  }}
                />
              )}
              {/* Edge-darken so type stays readable over the
                  photograph. 70% black at the corners. */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 z-[1]"
                style={{
                  background:
                    'radial-gradient(ellipse 110% 80% at 50% 50%, transparent 30%, rgba(11,11,12,0.72) 90%)',
                }}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 z-[1]"
                style={{
                  background:
                    'radial-gradient(closest-side at 0% 50%, rgba(209,26,42,0.15), transparent 65%)',
                }}
              />
              <div className="relative z-[2] flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <div
                    className="inline-flex h-12 w-12 items-center justify-center rounded-lg border border-border"
                    style={{
                      background:
                        'radial-gradient(closest-side, rgba(209,26,42,0.22), rgba(11,11,12,0))',
                    }}
                  >
                    <Icon
                      size={22}
                      strokeWidth={1.75}
                      className="text-crimson"
                    />
                  </div>
                  <Eyebrow>{label}</Eyebrow>
                </div>
                <h3
                  className="m-0 max-w-[640px] text-fg1"
                  style={{
                    font: '300 clamp(34px, 4.4vw, 54px)/1.05 var(--font-sans)',
                    letterSpacing: '-0.018em',
                  }}
                >
                  {headline}
                </h3>
                <p
                  className="m-0 max-w-[520px] text-fg3"
                  style={{font: '300 17px/1.65 var(--font-sans)'}}
                >
                  {body}
                </p>
              </div>
            </article>
            );
          })}
          <div className="flex flex-shrink-0 px-20" aria-hidden style={{width: '15vw'}} />
        </div>
      </div>
    </section>
  );
}
