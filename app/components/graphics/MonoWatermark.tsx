import {useEffect, useRef, type CSSProperties} from 'react';
import {parallaxLayer} from '~/lib/motion';

/**
 * Oversized IBM Plex Mono ghost text behind a section. Parallaxes slower
 * than content so the layer breathes underneath the foreground.
 *
 * Used as: huge dose labels behind ingredient sections ("750MG"),
 * protocol markers behind editorial chapters ("EST. 8 WEEKS"), trust
 * stamps behind testing copy ("LOT-TESTED"). Always 4–6% opacity, never
 * legible, always atmospheric.
 */
export function MonoWatermark({
  children,
  position = 'right',
  size = 320,
  opacity = 0.05,
  rotate = 0,
  parallax = -4,
  style,
}: {
  children: React.ReactNode;
  /** Anchor corner. */
  position?: 'left' | 'right' | 'center' | 'top-right' | 'bottom-left' | 'bottom-right';
  /** Approximate font-size in px (will be clamped responsively). */
  size?: number;
  /** Visual opacity. Keep ≤ 0.07. */
  opacity?: number;
  /** Degrees of rotation. Use sparingly. */
  rotate?: number;
  /** Parallax yPercent (negative = slower). Defaults to -4. */
  parallax?: number;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    parallaxLayer(ref.current, {yPercent: parallax});
  }, [parallax]);

  const positionStyle = positionMap[position];

  return (
    <span
      ref={ref}
      aria-hidden
      className="t-mono pointer-events-none absolute select-none whitespace-nowrap"
      style={{
        font: `500 clamp(120px, ${size / 14}vw, ${size}px)/1 var(--font-mono)`,
        letterSpacing: '-0.04em',
        color: 'var(--color-fg1)',
        opacity,
        transform: `${positionStyle.transform ?? ''} rotate(${rotate}deg)`,
        ...positionStyle.placement,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

const positionMap: Record<
  string,
  {placement: CSSProperties; transform?: string}
> = {
  left: {placement: {left: '-4%', top: '50%'}, transform: 'translateY(-50%)'},
  right: {placement: {right: '-4%', top: '50%'}, transform: 'translateY(-50%)'},
  center: {
    placement: {left: '50%', top: '50%'},
    transform: 'translate(-50%, -50%)',
  },
  'top-right': {placement: {right: '-3%', top: '4%'}},
  'bottom-left': {placement: {left: '-3%', bottom: '4%'}},
  'bottom-right': {placement: {right: '-3%', bottom: '4%'}},
};
