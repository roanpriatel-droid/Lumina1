/**
 * Soft edge vignette layered over dark scenes. Tightens visual focus
 * toward the center without a hard frame. Default tuned for full-
 * viewport; pass `compact` for in-section use.
 */
export function Vignette({
  intensity = 0.55,
  size = 'page',
}: {
  intensity?: number;
  size?: 'page' | 'section';
}) {
  const radius = size === 'page' ? '120% 80%' : '80% 70%';
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[1]"
      style={{
        background: `radial-gradient(ellipse ${radius} at 50% 50%, transparent 40%, rgba(0,0,0,${intensity}) 100%)`,
      }}
    />
  );
}
