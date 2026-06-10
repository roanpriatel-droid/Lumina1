import {useEffect} from 'react';
import Lenis from 'lenis';
import {ScrollTrigger, prefersReducedMotion} from '~/lib/motion';

/**
 * Mounts a single Lenis instance on the document scroller and ties it to
 * GSAP's ticker so any scrub-driven ScrollTrigger stays in sync with the
 * smooth-scrolled position. Renders nothing.
 *
 * Disabled entirely when the user prefers reduced motion (native scroll
 * is the right thing in that case).
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

    // Drive Lenis from a rAF loop; let ScrollTrigger update on the same frame.
    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    // Notify ScrollTrigger so scrub animations see the smoothed position.
    const onScroll = () => ScrollTrigger.update();
    lenis.on('scroll', onScroll);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.off('scroll', onScroll);
      lenis.destroy();
    };
  }, []);

  return null;
}
