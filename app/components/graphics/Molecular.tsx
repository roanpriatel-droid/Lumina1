import {useEffect, useRef, type CSSProperties} from 'react';
import {prefersReducedMotion} from '~/lib/motion';

/**
 * Hexagonal lattice — thin-line molecular grid, the clinical counterpart
 * to the botanical engravings. Used behind mineral and B-vitamin
 * sections, the ingredient table, and the testing page.
 *
 * Crimson accent dots at every other intersection at 25% opacity so the
 * pattern reads structured rather than wallpaper.
 */
export function HexLattice({
  className = '',
  rows = 6,
  cols = 9,
  size = 60,
  strokeOpacity = 0.55,
  style,
}: {
  className?: string;
  rows?: number;
  cols?: number;
  size?: number;
  strokeOpacity?: number;
  style?: CSSProperties;
}) {
  const h = size;
  const w = size * Math.sqrt(3);
  const hexes: Array<{x: number; y: number}> = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      hexes.push({
        x: c * w + (r % 2 ? w / 2 : 0),
        y: r * size * 1.5,
      });
    }
  }
  const totalW = cols * w + w / 2;
  const totalH = rows * size * 1.5 + size;

  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${totalW} ${totalH}`}
      preserveAspectRatio="xMidYMid slice"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      style={style}
    >
      <g
        fill="none"
        stroke="#2A2A2E"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
        opacity={strokeOpacity}
      >
        {hexes.map((h2, i) => (
          <polygon
            key={i}
            points={hexagonPoints(h2.x, h2.y, size)}
          />
        ))}
      </g>
      <g fill="#D11A2A" opacity="0.25">
        {hexes.map((h2, i) =>
          (h2.x + h2.y) % (size * 3) < size ? (
            <circle key={i} cx={h2.x + w / 2} cy={h2.y + h / 2} r="1.5" />
          ) : null,
        )}
      </g>
    </svg>
  );
}

function hexagonPoints(cx: number, cy: number, r: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i + Math.PI / 6;
    const x = cx + r * Math.cos(angle) + (r * Math.sqrt(3)) / 2;
    const y = cy + r * Math.sin(angle) + r / 2;
    pts.push(`${x.toFixed(2)},${y.toFixed(2)}`);
  }
  return pts.join(' ');
}

/**
 * Node-bond structure — a small molecular-bond style line drawing with
 * labeled nodes. Used inline next to mineral mentions and as a
 * decorative anchor in the science page hero.
 *
 * Pass `nodes` as small array of labels; bonds are drawn between
 * consecutive nodes in an organic zig-zag.
 */
export function NodeBond({
  nodes,
  className = '',
  height = 80,
}: {
  nodes: ReadonlyArray<string>;
  className?: string;
  height?: number;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const step = 90;
  const width = (nodes.length - 1) * step + 100;
  const centerY = height / 2;
  const positions = nodes.map((_, i) => ({
    x: 50 + i * step,
    y: centerY + (i % 2 === 0 ? -10 : 10),
  }));

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const lines = ref.current?.querySelectorAll('.bond-line');
    if (!lines) return;
    lines.forEach((line, i) => {
      const length = (line as SVGLineElement).getTotalLength?.() ?? 80;
      const node = line as SVGElement & {style: CSSStyleDeclaration};
      node.style.strokeDasharray = String(length);
      node.style.strokeDashoffset = String(length);
      node.style.transition = `stroke-dashoffset 800ms ease ${i * 80}ms`;
      requestAnimationFrame(() => {
        node.style.strokeDashoffset = '0';
      });
    });
  }, []);

  return (
    <svg
      ref={ref}
      aria-hidden
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      style={{height, maxWidth: width}}
    >
      {/* bonds */}
      <g stroke="#D11A2A" strokeWidth="1" fill="none">
        {positions.slice(0, -1).map((p, i) => {
          const next = positions[i + 1];
          return (
            <line
              key={i}
              className="bond-line"
              x1={p.x}
              y1={p.y}
              x2={next.x}
              y2={next.y}
            />
          );
        })}
      </g>
      {/* nodes */}
      <g>
        {positions.map((p, i) => (
          <g key={i}>
            <circle
              cx={p.x}
              cy={p.y}
              r="14"
              fill="#0B0B0C"
              stroke="#2A2A2E"
              strokeWidth="1"
            />
            <circle
              cx={p.x}
              cy={p.y}
              r="3"
              fill="#D11A2A"
              opacity="0.85"
            />
            <text
              x={p.x}
              y={p.y + 30}
              fill="#8A8A8A"
              fontSize="9"
              fontFamily="IBM Plex Mono, monospace"
              textAnchor="middle"
              letterSpacing="0.1em"
            >
              {nodes[i].toUpperCase()}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}
