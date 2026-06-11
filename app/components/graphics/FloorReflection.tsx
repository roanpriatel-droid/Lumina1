import type {CSSProperties} from 'react';

/**
 * Soft floor reflection gradient. Sits at the bottom of a dark scene,
 * directly under product imagery, to ground the object instead of
 * leaving it floating on the surface.
 *
 * Default: white 3% → transparent over 120px. Pointer disabled.
 */
export function FloorReflection({
  className = '',
  style,
  height = 120,
  opacity = 0.03,
}: {
  className?: string;
  style?: CSSProperties;
  height?: number;
  opacity?: number;
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 bottom-0 ${className}`}
      style={{
        height,
        background: `linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,${opacity}) 100%)`,
        ...style,
      }}
    />
  );
}
