import type {CSSProperties} from 'react';

/**
 * Three-layer composite glow. Replaces the previous single-radial-
 * gradient treatment with a stack that reads expensive instead of flat:
 *
 *   - core: crimson #D11A2A, 18% opacity, tight radius
 *   - mid:  oxblood #6E0B14, 12% opacity, 2× radius
 *   - halo: deep oxblood #3A0810, 8% opacity, 4× radius, blur 80px
 *
 * Three pre-tuned sizes:
 *   - sm   = 200px core
 *   - md   = 360px core
 *   - hero = 560px core (with optional breathing animation)
 *
 * Position the glow with `style={{left, top, transform}}` like any other
 * absolutely-positioned layer. Set `animate` for hero glows — adds a
 * slow 10s breathing scale and a conic highlight rotation underneath.
 */
export type GlowSize = 'sm' | 'md' | 'hero';

export function Glow({
  size = 'md',
  className = '',
  style,
  animate = false,
}: {
  size?: GlowSize;
  className?: string;
  style?: CSSProperties;
  animate?: boolean;
}) {
  const core = SIZE[size];
  const mid = core * 2;
  const halo = core * 4;
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute ${className}`}
      style={{
        width: halo,
        height: halo,
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        ...style,
      }}
    >
      <div className="absolute inset-0 lumina-glow-stack">
        {/* halo */}
        <span
          aria-hidden
          className="absolute"
          style={{
            inset: 0,
            background:
              'radial-gradient(closest-side, rgba(58,8,16,0.08) 0%, rgba(58,8,16,0) 70%)',
            filter: 'blur(80px)',
          }}
        />
        {/* mid */}
        <span
          aria-hidden
          className="absolute"
          style={{
            left: '50%',
            top: '50%',
            width: mid,
            height: mid,
            transform: 'translate(-50%, -50%)',
            background:
              'radial-gradient(closest-side, rgba(110,11,20,0.12) 0%, rgba(110,11,20,0) 70%)',
          }}
        />
        {/* core */}
        <span
          aria-hidden
          className={`absolute ${animate ? 'lumina-glow-breath' : ''}`}
          style={{
            left: '50%',
            top: '50%',
            width: core,
            height: core,
            transform: 'translate(-50%, -50%)',
            background:
              'radial-gradient(closest-side, rgba(209,26,42,0.18) 0%, rgba(209,26,42,0) 70%)',
          }}
        />
        {animate && (
          <span
            aria-hidden
            className="absolute lumina-glow-conic"
            style={{
              left: '50%',
              top: '50%',
              width: mid,
              height: mid,
              transform: 'translate(-50%, -50%)',
              opacity: 0.18,
              borderRadius: '50%',
              background:
                'conic-gradient(from 0deg, transparent 0deg, rgba(209,26,42,0.5) 60deg, transparent 120deg, transparent 360deg)',
              filter: 'blur(28px)',
              mixBlendMode: 'screen',
            }}
          />
        )}
      </div>
    </div>
  );
}

const SIZE: Record<GlowSize, number> = {
  sm: 200,
  md: 360,
  hero: 560,
};
