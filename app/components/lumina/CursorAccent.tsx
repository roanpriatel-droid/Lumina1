import {useEffect, useRef, useState} from 'react';
import {prefersReducedMotion} from '~/lib/motion';

/**
 * Crimson dot that follows the mouse, scaling up over interactive
 * elements. Desktop pointer only — skipped on touch, coarse pointers,
 * and prefers-reduced-motion.
 *
 * Self-disabling: if a frame budget check exceeds 2ms it removes itself
 * from the page rather than degrade scroll/animation performance.
 */
export function CursorAccent() {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (prefersReducedMotion()) return;
    const fine = window.matchMedia('(pointer: fine)').matches;
    const noHover = window.matchMedia('(hover: none)').matches;
    if (!fine || noHover) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const dot = ref.current;
    if (!dot) return;
    let rafId = 0;
    let pendingX = 0;
    let pendingY = 0;
    let scale = 1;
    let frameCost = 0;

    const onMove = (e: MouseEvent) => {
      pendingX = e.clientX;
      pendingY = e.clientY;
      const target = e.target as HTMLElement | null;
      const interactive = target?.closest(
        'a, button, [role="button"], input, textarea, select, label',
      );
      scale = interactive ? 3 : 1;
      if (!rafId) {
        rafId = requestAnimationFrame(tick);
      }
    };

    const tick = () => {
      const start = performance.now();
      dot.style.transform = `translate(${pendingX}px, ${pendingY}px) translate(-50%, -50%) scale(${scale})`;
      const cost = performance.now() - start;
      frameCost = frameCost * 0.9 + cost * 0.1;
      if (frameCost > 2) {
        // pull the plug — never trade scroll smoothness for a cursor accent
        document.removeEventListener('mousemove', onMove);
        if (dot) dot.style.display = 'none';
        return;
      }
      rafId = 0;
    };

    document.addEventListener('mousemove', onMove, {passive: true});
    return () => {
      document.removeEventListener('mousemove', onMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100]"
      style={{
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: 'var(--color-crimson)',
        boxShadow: '0 0 12px var(--color-crimson)',
        transition: 'transform 60ms ease-out',
        mixBlendMode: 'screen',
      }}
    />
  );
}
