import {useEffect} from 'react';
import Lenis from 'lenis';
import {ScrollTrigger, gsap, prefersReducedMotion} from '~/lib/motion';

/**
 * Mounts a single Lenis instance on the document scroller and ties it
 * to GSAP's ticker so scrub-driven ScrollTrigger animations stay in
 * sync with the smooth-scrolled position. Renders nothing.
 *
 * Integration pattern (the official one from the Lenis docs):
 *   - lenis.on('scroll', ScrollTrigger.update) so any layout-tied
 *     ScrollTrigger sees the smoothed position immediately.
 *   - gsap.ticker.add(t => lenis.raf(t * 1000)) so Lenis is driven by
 *     the same ticker as GSAP — single source of truth for frame time.
 *   - gsap.ticker.lagSmoothing(0) so Lenis can run at the real frame
 *     rate without the ticker smoothing over the long frames; Lenis
 *     already smooths position itself, so an additional lag-smoothing
 *     layer just decouples the two.
 *
 * Disabled entirely when the user prefers reduced motion.
 */
export function LenisProvider() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    const onScroll = () => ScrollTrigger.update();
    lenis.on('scroll', onScroll);

    const tick = (time: number) => {
      // gsap.ticker passes seconds; lenis.raf expects ms.
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off('scroll', onScroll);
      gsap.ticker.remove(tick);
      // Restore GSAP's default lag smoothing (500ms / 33fps recovery)
      // so anything else that uses the ticker keeps its smoothing.
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
    };
  }, []);

  return null;
}
