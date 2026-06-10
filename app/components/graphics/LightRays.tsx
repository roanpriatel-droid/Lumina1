import type {CSSProperties} from 'react';

/**
 * Faint volumetric crimson light shafts, drawn as a fan of soft skewed
 * gradient stripes behind product imagery. Always behind content; never
 * dominant. Tuned to read as atmospheric, not graphic.
 */
export function LightRays({
  origin = 'top',
  intensity = 0.35,
  className = '',
  style,
}: {
  origin?: 'top' | 'bottom' | 'left' | 'right';
  intensity?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const rays = [
    {x: 22, w: 90, rotate: -14, alpha: 0.55},
    {x: 38, w: 60, rotate: -6, alpha: 0.75},
    {x: 50, w: 140, rotate: 0, alpha: 1},
    {x: 62, w: 60, rotate: 6, alpha: 0.75},
    {x: 78, w: 90, rotate: 14, alpha: 0.55},
  ];

  const baseTransform =
    origin === 'top'
      ? 'translate(-50%, 0)'
      : origin === 'bottom'
        ? 'translate(-50%, 0) scaleY(-1)'
        : origin === 'left'
          ? 'translate(0, -50%) rotate(-90deg)'
          : 'translate(0, -50%) rotate(90deg)';

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute ${className}`}
      style={{
        ...style,
        ...originStyle(origin),
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transform: baseTransform,
          transformOrigin: 'center top',
        }}
      >
        {rays.map((ray, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: 0,
              left: `${ray.x}%`,
              transform: `translateX(-50%) rotate(${ray.rotate}deg)`,
              transformOrigin: 'top center',
              width: ray.w,
              height: '120%',
              background: `linear-gradient(180deg, rgba(209,26,42,${
                intensity * ray.alpha
              }) 0%, rgba(209,26,42,0) 70%)`,
              filter: 'blur(8px)',
              mixBlendMode: 'screen',
            }}
          />
        ))}
      </div>
    </div>
  );
}

function originStyle(origin: 'top' | 'bottom' | 'left' | 'right'): CSSProperties {
  switch (origin) {
    case 'top':
      return {top: 0, left: '50%', width: '70%', height: '120%'};
    case 'bottom':
      return {bottom: 0, left: '50%', width: '70%', height: '120%'};
    case 'left':
      return {top: '50%', left: 0, width: '120%', height: '70%'};
    case 'right':
      return {top: '50%', right: 0, width: '120%', height: '70%'};
  }
}
