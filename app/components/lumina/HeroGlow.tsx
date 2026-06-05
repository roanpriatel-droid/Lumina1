import type {CSSProperties} from 'react';

interface HeroGlowProps {
  /** Diameter of the bloom in px. */
  size?: number;
  /** Multiplier on the glow opacity (1 = full). */
  intensity?: number;
  className?: string;
  style?: CSSProperties;
}

/**
 * The signature crimson radial bloom. Render as a positioned (typically
 * absolute) element behind a product shot or hero content. The opacity
 * of the underlying gradient is already low — `intensity` lets cards
 * dim the glow at rest and brighten on hover.
 */
export function HeroGlow({
  size = 720,
  intensity = 1,
  className = '',
  style,
}: HeroGlowProps) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none ${className}`}
      style={{
        width: size,
        height: size,
        background: 'var(--glow-hero)',
        opacity: intensity,
        transition: 'opacity 0.3s ease',
        ...style,
      }}
    />
  );
}
