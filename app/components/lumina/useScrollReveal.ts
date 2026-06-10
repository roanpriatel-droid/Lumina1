import {useEffect, useRef, type MutableRefObject} from 'react';

/**
 * Intersection-observer hook that adds an `is-revealed` class to an
 * element the first time it enters the viewport. Pair with CSS to apply
 * an opacity/translate transition. Respects prefers-reduced-motion —
 * elements are simply marked revealed on mount when motion is reduced.
 *
 * Usage:
 *   const ref = useScrollReveal<HTMLDivElement>();
 *   return <div ref={ref} className="reveal-up">...</div>;
 */
export function useScrollReveal<T extends HTMLElement>({
  threshold = 0.12,
  rootMargin = '0px 0px -10% 0px',
}: {threshold?: number; rootMargin?: string} = {}): MutableRefObject<T | null> {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      el.classList.add('is-revealed');
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add('is-revealed');
            io.unobserve(e.target);
          }
        }
      },
      {threshold, rootMargin},
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, rootMargin]);

  return ref;
}
