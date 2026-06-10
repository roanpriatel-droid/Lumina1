import {useEffect, useRef, type CSSProperties} from 'react';
import {prefersReducedMotion} from '~/lib/motion';
import {gsap, ScrollTrigger} from '~/lib/motion';

/**
 * Fine-line vintage-engraving-style SVG illustrations of our actual
 * ingredients. Hairline strokes in #2A2A2E with crimson #D11A2A
 * accents at 20–40% opacity. Each ingredient is a self-contained SVG
 * that can be:
 *
 *   - Cropped as an oversized section background (bleeding off-edge)
 *   - Used as a small inline icon next to its ingredient name
 *   - Tiled into a faint repeating pattern band
 *   - "Drawn on" with stroke-dashoffset animation as it enters viewport
 *
 * Render via <BotanicalEngraving name="ashwagandha" ... />.
 * Pass `drawOnScroll` to enable the entrance animation.
 */

export type BotanicalName =
  | 'ashwagandha'
  | 'maca'
  | 'tribulus'
  | 'ginkgo'
  | 'epimedium'
  | 'ginger';

export interface BotanicalProps {
  name: BotanicalName;
  /** Width / height behave per the SVG's natural aspect. */
  width?: number;
  /** Hairline opacity. */
  strokeOpacity?: number;
  /** Crimson accent opacity (caps, fruits, glow). 0–1. */
  accentOpacity?: number;
  /** Animate stroke-dashoffset on scroll entry. */
  drawOnScroll?: boolean;
  className?: string;
  style?: CSSProperties;
  /** Stroke color override. */
  stroke?: string;
  /** Accent color override. */
  accent?: string;
}

export function BotanicalEngraving({
  name,
  width = 200,
  strokeOpacity = 1,
  accentOpacity = 0.3,
  drawOnScroll = false,
  className = '',
  style,
  stroke = '#2A2A2E',
  accent = '#D11A2A',
}: BotanicalProps) {
  const ref = useRef<SVGSVGElement>(null);
  const def = ENGRAVINGS[name];

  useEffect(() => {
    if (!drawOnScroll || prefersReducedMotion()) return;
    const svg = ref.current;
    if (!svg) return;
    const paths = svg.querySelectorAll<SVGGeometryElement>('.draw');
    if (paths.length === 0) return;
    paths.forEach((p) => {
      const length = p.getTotalLength?.() ?? 1000;
      gsap.set(p, {strokeDasharray: length, strokeDashoffset: length});
    });
    gsap.to(paths, {
      strokeDashoffset: 0,
      duration: 1.6,
      ease: 'power2.out',
      stagger: 0.06,
      scrollTrigger: {
        trigger: svg,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });
    return () => {
      ScrollTrigger.getAll()
        .filter((t) => t.trigger === svg)
        .forEach((t) => t.kill());
    };
  }, [drawOnScroll]);

  return (
    <svg
      ref={ref}
      aria-hidden
      viewBox={def.viewBox}
      className={className}
      style={{
        width,
        height: 'auto',
        overflow: 'visible',
        ...style,
      }}
    >
      <g
        fill="none"
        stroke={stroke}
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        opacity={strokeOpacity}
      >
        {def.lines.map((d, i) => (
          <path key={i} className="draw" d={d} />
        ))}
      </g>
      {def.accents && (
        <g
          fill={accent}
          opacity={accentOpacity}
          stroke={accent}
          strokeOpacity={accentOpacity}
        >
          {def.accents.map((a, i) => (
            <circle key={i} cx={a.cx} cy={a.cy} r={a.r} />
          ))}
        </g>
      )}
    </svg>
  );
}

/* ---------------------------------------------------------------- */
/* Hand-curated stylized engravings. Each is intentionally simple — */
/* fine lines, not photoreal — so the brand reads clinical-vintage. */
/* ---------------------------------------------------------------- */

interface Engraving {
  viewBox: string;
  lines: ReadonlyArray<string>;
  accents?: ReadonlyArray<{cx: number; cy: number; r: number}>;
}

const ENGRAVINGS: Record<BotanicalName, Engraving> = {
  ashwagandha: {
    // root with a few overlapping berry clusters at the top
    viewBox: '0 0 200 320',
    lines: [
      // main taproot
      'M 100 60 C 95 110, 110 160, 100 220 C 95 250, 90 280, 95 310',
      // side roots
      'M 100 130 C 80 150, 70 175, 65 205',
      'M 100 160 C 120 180, 130 205, 132 235',
      'M 100 200 C 85 215, 78 235, 75 260',
      'M 100 235 C 115 250, 122 270, 122 290',
      // fine root hairs
      'M 75 260 L 60 275',
      'M 78 235 L 60 240',
      'M 122 290 L 138 305',
      'M 122 270 L 138 270',
      // crown leaves
      'M 100 60 C 80 40, 60 50, 60 30',
      'M 100 60 C 90 38, 80 30, 80 12',
      'M 100 60 C 110 40, 120 30, 122 14',
      'M 100 60 C 120 42, 138 50, 142 32',
      // berries
      'M 92 50 C 86 48, 82 52, 86 56 C 90 58, 96 56, 92 50 Z',
      'M 110 48 C 116 46, 120 50, 116 54 C 112 56, 106 54, 110 48 Z',
      'M 100 40 C 96 36, 104 36, 104 40 C 104 44, 96 44, 100 40 Z',
    ],
    accents: [
      {cx: 91, cy: 52, r: 2.5},
      {cx: 113, cy: 50, r: 2.5},
      {cx: 100, cy: 40, r: 2},
    ],
  },
  maca: {
    // round tuber with crown leaves
    viewBox: '0 0 200 280',
    lines: [
      // tuber body
      'M 60 160 C 50 130, 60 100, 100 100 C 145 100, 150 135, 145 160 C 142 195, 130 215, 100 215 C 70 215, 58 195, 60 160 Z',
      // tuber surface lines
      'M 75 130 C 85 135, 95 132, 105 138',
      'M 70 155 C 90 158, 110 152, 130 158',
      'M 75 180 C 95 184, 115 180, 130 186',
      // taproot
      'M 100 215 C 95 240, 90 260, 80 275',
      'M 100 215 C 105 245, 110 270, 120 280',
      // crown leaves
      'M 100 100 C 80 80, 60 70, 55 50',
      'M 100 100 C 90 75, 80 55, 70 30',
      'M 100 100 C 100 70, 100 45, 96 18',
      'M 100 100 C 110 75, 120 55, 128 28',
      'M 100 100 C 120 80, 140 70, 142 50',
    ],
    accents: [],
  },
  tribulus: {
    // five-pointed fruit (signature tribulus shape) + leaves
    viewBox: '0 0 240 240',
    lines: [
      // central seed pod
      'M 120 120 C 100 100, 100 80, 120 70 C 140 80, 140 100, 120 120',
      'M 120 120 C 145 115, 165 130, 165 150 C 145 160, 130 145, 120 120',
      'M 120 120 C 145 140, 145 170, 120 175 C 95 170, 95 140, 120 120',
      'M 120 120 C 95 130, 75 145, 75 165 C 95 165, 110 145, 120 120',
      'M 120 120 C 95 115, 75 95, 80 75 C 100 80, 115 100, 120 120',
      // thorny points
      'M 122 68 L 124 50',
      'M 75 100 L 60 90',
      'M 70 158 L 55 165',
      'M 124 178 L 125 195',
      'M 168 152 L 185 155',
      // leaves
      'M 30 30 C 50 60, 75 70, 100 70',
      'M 30 30 L 45 45',
      'M 30 30 L 50 25',
      'M 210 30 C 190 60, 165 70, 140 70',
      'M 210 30 L 195 45',
      'M 210 30 L 190 25',
    ],
    accents: [
      {cx: 120, cy: 95, r: 3},
      {cx: 145, cy: 130, r: 3},
      {cx: 120, cy: 158, r: 3},
      {cx: 95, cy: 145, r: 3},
      {cx: 95, cy: 95, r: 3},
    ],
  },
  ginkgo: {
    // single fan-shaped leaf with central vein and radiating veins
    viewBox: '0 0 240 220',
    lines: [
      // outer leaf outline
      'M 120 200 C 60 180, 40 130, 50 70 C 80 50, 160 50, 190 70 C 200 130, 180 180, 120 200 Z',
      // central notch
      'M 120 200 C 118 170, 120 130, 120 90',
      // radiating veins
      'M 120 200 C 110 170, 95 140, 75 95',
      'M 120 200 C 102 175, 85 145, 60 110',
      'M 120 200 C 130 170, 145 140, 165 95',
      'M 120 200 C 138 175, 155 145, 180 110',
      'M 120 200 C 100 175, 80 150, 55 130',
      'M 120 200 C 140 175, 160 150, 185 130',
      // stem
      'M 120 200 L 120 220',
    ],
    accents: [{cx: 120, cy: 210, r: 2.5}],
  },
  epimedium: {
    // heart-shaped leaf trio (signature epimedium)
    viewBox: '0 0 240 240',
    lines: [
      // central leaf
      'M 120 200 C 90 170, 80 140, 95 110 C 110 95, 130 95, 145 110 C 160 140, 150 170, 120 200 Z',
      // central leaf vein
      'M 120 200 C 118 175, 120 145, 120 115',
      'M 120 150 C 110 145, 105 142, 100 140',
      'M 120 150 C 130 145, 135 142, 140 140',
      // left leaf
      'M 60 175 C 35 155, 30 130, 45 100 C 60 90, 80 95, 90 110 C 95 130, 88 158, 60 175 Z',
      'M 60 175 C 60 155, 62 130, 70 110',
      // right leaf
      'M 180 175 C 205 155, 210 130, 195 100 C 180 90, 160 95, 150 110 C 145 130, 152 158, 180 175 Z',
      'M 180 175 C 180 155, 178 130, 170 110',
      // stems
      'M 120 200 L 120 230',
      'M 60 175 C 80 200, 110 215, 120 230',
      'M 180 175 C 160 200, 130 215, 120 230',
    ],
    accents: [{cx: 100, cy: 92, r: 2.5}, {cx: 140, cy: 92, r: 2.5}],
  },
  ginger: {
    // rhizome (root) with finger-like nodes
    viewBox: '0 0 240 200',
    lines: [
      // main horizontal rhizome
      'M 30 110 C 60 100, 100 100, 130 105 C 160 110, 195 110, 215 105',
      'M 30 130 C 60 138, 100 140, 130 135 C 160 132, 195 132, 215 130',
      'M 30 110 C 28 122, 28 128, 30 130',
      'M 215 105 C 218 115, 218 125, 215 130',
      // finger nodes
      'M 60 100 C 55 75, 65 60, 75 50',
      'M 75 50 C 80 65, 75 85, 65 95',
      'M 110 100 C 105 70, 115 50, 130 40',
      'M 130 40 C 135 60, 128 80, 118 95',
      'M 160 105 C 158 75, 170 55, 185 45',
      'M 185 45 C 190 65, 182 85, 172 100',
      // surface joint lines
      'M 90 110 C 90 118, 90 125, 90 130',
      'M 140 105 C 140 115, 140 125, 140 132',
      'M 180 108 C 180 118, 180 125, 180 132',
    ],
    accents: [
      {cx: 75, cy: 52, r: 2},
      {cx: 130, cy: 42, r: 2},
      {cx: 185, cy: 48, r: 2},
    ],
  },
};
