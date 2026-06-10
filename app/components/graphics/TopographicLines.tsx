import {useEffect, useRef} from 'react';
import {parallaxLayer, prefersReducedMotion} from '~/lib/motion';

/**
 * Drifting contour-line backdrop — concentric blob shapes layered into a
 * topographic map, hairline #2A2A2E with crimson tinted center rings.
 *
 * Animates with a very slow yPercent parallax so the layer "drifts"
 * as you scroll. Pointer disabled, atmospheric only.
 */
export function TopographicLines({
  className = '',
  opacity = 0.45,
  variant = 'broad',
}: {
  className?: string;
  opacity?: number;
  variant?: 'broad' | 'tight';
}) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    parallaxLayer(ref.current, {yPercent: -6});
  }, []);

  const lines = variant === 'broad' ? RINGS_BROAD : RINGS_TIGHT;

  return (
    <svg
      ref={ref}
      aria-hidden
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      style={{opacity}}
    >
      <defs>
        <radialGradient id="topo-tint" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#D11A2A" stopOpacity="0.35" />
          <stop offset="40%" stopColor="#D11A2A" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#D11A2A" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* center tint */}
      <ellipse cx="600" cy="400" rx="500" ry="320" fill="url(#topo-tint)" />
      {/* contour rings */}
      <g
        fill="none"
        stroke="#2A2A2E"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      >
        {lines.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
    </svg>
  );
}

// Broad concentric "blob" rings — hand-tuned for an organic feel.
const RINGS_BROAD = [
  'M 100 400 Q 300 200 600 220 T 1100 380 Q 1080 560 800 600 T 200 540 Q 90 480 100 400 Z',
  'M 180 400 Q 350 250 600 270 T 1020 390 Q 1000 540 780 580 T 260 520 Q 170 470 180 400 Z',
  'M 260 400 Q 400 290 600 310 T 940 400 Q 920 520 740 550 T 320 500 Q 250 460 260 400 Z',
  'M 340 400 Q 450 320 600 340 T 860 410 Q 840 500 700 525 T 380 485 Q 330 450 340 400 Z',
  'M 420 400 Q 500 350 600 365 T 780 410 Q 770 470 660 490 T 440 470 Q 410 440 420 400 Z',
  'M 500 400 Q 550 375 600 380 T 700 405 Q 695 440 640 450 T 510 445 Q 490 425 500 400 Z',
];

const RINGS_TIGHT = [
  'M 200 400 C 200 250, 400 200, 600 200 S 1000 250, 1000 400 S 800 600, 600 600 S 200 550, 200 400 Z',
  'M 270 400 C 270 280, 430 240, 600 240 S 930 280, 930 400 S 770 560, 600 560 S 270 520, 270 400 Z',
  'M 340 400 C 340 310, 460 280, 600 280 S 860 310, 860 400 S 740 520, 600 520 S 340 490, 340 400 Z',
  'M 410 400 C 410 340, 490 320, 600 320 S 790 340, 790 400 S 710 480, 600 480 S 410 460, 410 400 Z',
  'M 480 400 C 480 370, 520 360, 600 360 S 720 370, 720 400 S 680 440, 600 440 S 480 430, 480 400 Z',
];
