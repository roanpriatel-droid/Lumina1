/**
 * Subtle SVG turbulence noise overlay. Renders as a fixed full-viewport
 * layer once at the root and is referenced for free by every page.
 *
 * Tuned for ~3% opacity over matte black so it kills the "flat" feeling
 * without ever competing with content. Pointer-events disabled.
 *
 * Performance: a single static SVG, no animation, fully cacheable, GPU-
 * composited via opacity + position: fixed. The cost is one full-screen
 * raster layer (~free on any modern GPU).
 */
export function FilmGrain({
  opacity = 0.045,
  blendMode = 'overlay',
}: {
  opacity?: number;
  blendMode?: 'overlay' | 'soft-light' | 'multiply';
}) {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[60]"
      style={{
        opacity,
        mixBlendMode: blendMode,
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.92' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.92 0 0 0 0 0.92 0 0 0 0 0.92 0 0 0 0.45 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        backgroundSize: '200px 200px',
      }}
    />
  );
}
