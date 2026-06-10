import {useEffect, useRef, type CSSProperties} from 'react';
import {useGSAP} from '@gsap/react';
import {Image} from '@shopify/hydrogen';
import {Bottle} from '~/components/lumina/Bottle';
import {LightRays} from '~/components/graphics/LightRays';
import {gsap, parallaxLayer, prefersReducedMotion} from '~/lib/motion';

/**
 * ProductVisual — the unified bottle renderer for every product visual
 * on the site. Renders a real PNG from /app/assets if present, falls
 * back to the CSS Bottle mockup if absent.
 *
 * Drop-in upgrade pipeline:
 *   1. Save your bottle PNGs at app/assets/male-bottle.png and/or
 *      app/assets/female-bottle.png (and "duo-bottle.png" if you have
 *      a duo bundle render later).
 *   2. import.meta.glob picks them up at build time — no other code
 *      changes anywhere on the site. Hero, cards, PDP, FinalCta all
 *      upgrade in lockstep.
 *
 * Treatments:
 *   - Glow pedestal (radial-gradient, behind the bottle)
 *   - Reflection (mirrored copy below, opacity-gradient mask)
 *   - Parallax float on scroll (capped at ±10%)
 *   - Idle float — sub-12px vertical oscillation, 4s ease loop
 *   - Mouse tilt on desktop pointers only, max ±4°
 *
 * All animation is opacity / transform only — zero CLS. Skipped under
 * prefers-reduced-motion (renders static centered bottle).
 */

const ASSETS = import.meta.glob<{default: string}>(
  '../assets/*-bottle.{png,jpg,jpeg,webp}',
  {eager: true},
);

/**
 * Look up the bottle asset for a given gender (or arbitrary slug).
 * Returns null when there's no matching PNG in /app/assets.
 */
export function getBottleAsset(slug: string): string | null {
  for (const [path, mod] of Object.entries(ASSETS)) {
    if (path.toLowerCase().includes(`/${slug}-bottle.`)) {
      return (mod as {default: string}).default ?? null;
    }
  }
  return null;
}

export interface ProductVisualProps {
  /** "male" / "female" — used to resolve the bottle asset slug. */
  gender?: 'male' | 'female' | 'duo';
  /** Override the asset URL directly (e.g. Shopify product image). */
  imageUrl?: string | null;
  imageAlt?: string | null;
  fallbackTitle?: string;
  /** Width of the bottle render in px. */
  width?: number;
  /** Pedestal scale (1 = same as bottle width). */
  pedestal?: number;
  /** Include reflection? */
  reflection?: boolean;
  /** Idle float loop on/off. */
  idleFloat?: boolean;
  /** Mouse tilt on desktop pointer. */
  mouseTilt?: boolean;
  /** Light rays behind the bottle. */
  rays?: boolean;
  /** Parallax yPercent. */
  parallax?: number;
  className?: string;
  style?: CSSProperties;
  /** Set true on above-the-fold uses so the asset loads eager. */
  priority?: boolean;
}

export function ProductVisual({
  gender,
  imageUrl,
  imageAlt,
  fallbackTitle = 'Lumina bottle',
  width = 200,
  pedestal = 1.6,
  reflection = true,
  idleFloat = true,
  mouseTilt = true,
  rays = true,
  parallax = -5,
  className = '',
  style,
  priority = false,
}: ProductVisualProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);

  // Resolve the asset URL. A drop-in PNG at /app/assets/<gender>-bottle.*
  // overrides any imageUrl prop — the explicit local asset is the brand-
  // owned hero photo and we want it to win across the whole site as soon
  // as it lands.
  const localAsset = gender ? getBottleAsset(gender) : null;
  const resolved = localAsset ?? imageUrl ?? null;

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const floater = floatRef.current;
      const wrap = wrapRef.current;
      if (!floater || !wrap) return;

      if (idleFloat) {
        gsap.to(floater, {
          y: -10,
          duration: 4,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        });
      }

      if (parallax !== 0) {
        parallaxLayer(wrap, {yPercent: parallax});
      }

      if (mouseTilt) {
        const fine = window.matchMedia('(pointer: fine)').matches;
        const noHover = window.matchMedia('(hover: none)').matches;
        if (fine && !noHover) {
          const onMove = (e: MouseEvent) => {
            const r = wrap.getBoundingClientRect();
            const cx = r.left + r.width / 2;
            const cy = r.top + r.height / 2;
            const dx = (e.clientX - cx) / (r.width / 2);
            const dy = (e.clientY - cy) / (r.height / 2);
            const rotateY = Math.max(-4, Math.min(4, dx * 4));
            const rotateX = Math.max(-4, Math.min(4, -dy * 4));
            gsap.to(floater, {
              rotateY,
              rotateX,
              duration: 0.6,
              ease: 'power2.out',
              overwrite: 'auto',
            });
          };
          const onLeave = () => {
            gsap.to(floater, {
              rotateY: 0,
              rotateX: 0,
              duration: 0.8,
              ease: 'power3.out',
              overwrite: 'auto',
            });
          };
          wrap.addEventListener('mousemove', onMove);
          wrap.addEventListener('mouseleave', onLeave);
          return () => {
            wrap.removeEventListener('mousemove', onMove);
            wrap.removeEventListener('mouseleave', onLeave);
          };
        }
      }
    },
    {scope: wrapRef},
  );

  return (
    <div
      ref={wrapRef}
      className={`relative inline-block ${className}`}
      style={{
        width,
        perspective: 1200,
        ...style,
      }}
    >
      {/* Pedestal glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2"
        style={{
          width: width * pedestal,
          height: width * pedestal,
          transform: 'translate(-50%, -50%)',
          background: 'var(--glow-hero)',
          opacity: 0.85,
          filter: 'blur(2px)',
        }}
      />
      {rays && (
        <div
          aria-hidden
          className="pointer-events-none absolute"
          style={{
            inset: '-30% -20% -40% -20%',
            opacity: 0.55,
          }}
        >
          <LightRays origin="top" intensity={0.4} />
        </div>
      )}

      {/* Float wrapper — receives idle float, mouse tilt, parallax */}
      <div
        ref={floatRef}
        className="relative"
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {resolved ? (
          <Image
            src={resolved}
            alt={imageAlt ?? fallbackTitle}
            width={width * 2}
            height={width * 2.7}
            loading={priority ? 'eager' : 'lazy'}
            sizes={`${width}px`}
            className="relative z-[2] mx-auto h-auto w-full max-w-full object-contain"
            {...(priority ? {fetchPriority: 'high' as const} : {})}
          />
        ) : (
          <div className="relative z-[2] mx-auto" style={{width}}>
            <Bottle width={width} />
          </div>
        )}

        {reflection && (
          <div
            aria-hidden
            className="pointer-events-none relative z-[1]"
            style={{
              marginTop: -10,
              transform: 'scaleY(-1)',
              maskImage:
                'linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 70%)',
              WebkitMaskImage:
                'linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 70%)',
              opacity: 0.6,
              filter: 'blur(0.5px)',
            }}
          >
            {resolved ? (
              <img
                src={resolved}
                alt=""
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                }}
              />
            ) : (
              <div style={{width}}>
                <Bottle width={width} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
