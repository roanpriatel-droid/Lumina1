/**
 * MOTION FOUNDATION
 *
 * The single import surface for every cinematic interaction on the site.
 * Wraps GSAP + ScrollTrigger + Lenis behind a small set of opinionated
 * primitives so scenes stay consistent.
 *
 * Rules (encoded as defaults — don't override these unless a scene
 * demands it):
 *   - durations 0.6–1.0s
 *   - ease "power3.out"
 *   - stagger 60–90ms
 *   - parallax max 12%
 *   - prefers-reduced-motion → primitives no-op (renders the final state
 *     instantly with a single tween of duration 0)
 *   - SSR-safe — every primitive is a no-op when run on the server (no
 *     window). Initialization happens inside useEffect / useGSAP.
 *
 * Don't import gsap directly anywhere else — go through this module so
 * we keep a single point of control over the cinematics.
 */
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';

let registered = false;
function ensureRegistered() {
  if (typeof window === 'undefined' || registered) return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

/** Honor the user's reduced-motion preference at call sites. */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

const DEFAULT_DURATION = 0.85;
const DEFAULT_EASE = 'power3.out';
const DEFAULT_STAGGER = 0.075;
const DEFAULT_DISTANCE = 24;

/* ───────────────────────── primitives ───────────────────────── */

export interface SceneOptions {
  start?: string;
  end?: string;
  scrub?: boolean | number;
  once?: boolean;
}

/**
 * Fade + rise reveal. Renders the element invisible/lowered before the
 * trigger fires; tweens to opacity 1 + y 0 when it enters the viewport.
 */
export function fadeRise(
  el: Element | null,
  {
    start = 'top 85%',
    distance = DEFAULT_DISTANCE,
    delay = 0,
  }: SceneOptions & {distance?: number; delay?: number} = {},
): gsap.core.Tween | ScrollTrigger | null {
  if (!el || typeof window === 'undefined') return null;
  ensureRegistered();
  if (prefersReducedMotion()) {
    gsap.set(el, {opacity: 1, y: 0});
    return null;
  }
  gsap.set(el, {opacity: 0, y: distance});
  return gsap.to(el, {
    opacity: 1,
    y: 0,
    duration: DEFAULT_DURATION,
    ease: DEFAULT_EASE,
    delay,
    scrollTrigger: {
      trigger: el,
      start,
      toggleActions: 'play none none none',
    },
  });
}

/**
 * Stagger child elements with the same fade/rise treatment. `children`
 * are the elements to animate; their parent is the trigger.
 */
export function staggerChildren(
  container: Element | null,
  selector: string,
  {
    start = 'top 80%',
    stagger = DEFAULT_STAGGER,
    distance = DEFAULT_DISTANCE,
  }: SceneOptions & {stagger?: number; distance?: number} = {},
): gsap.core.Tween | null {
  if (!container || typeof window === 'undefined') return null;
  ensureRegistered();
  const targets = container.querySelectorAll(selector);
  if (targets.length === 0) return null;
  if (prefersReducedMotion()) {
    gsap.set(targets, {opacity: 1, y: 0});
    return null;
  }
  gsap.set(targets, {opacity: 0, y: distance});
  return gsap.to(targets, {
    opacity: 1,
    y: 0,
    duration: DEFAULT_DURATION,
    ease: DEFAULT_EASE,
    stagger,
    scrollTrigger: {
      trigger: container,
      start,
      toggleActions: 'play none none none',
    },
  });
}

/**
 * Pin an element while a longer scroll window plays. Use for the hero
 * dock animation and the horizontal "Standard" sequence.
 */
export function pinScene(
  el: Element | null,
  {
    start = 'top top',
    end = '+=100%',
    anticipatePin = 0.5,
  }: SceneOptions & {anticipatePin?: number} = {},
): ScrollTrigger | null {
  if (!el || typeof window === 'undefined') return null;
  ensureRegistered();
  if (prefersReducedMotion()) return null;
  return ScrollTrigger.create({
    trigger: el,
    start,
    end,
    pin: true,
    pinSpacing: true,
    anticipatePin,
  });
}

/**
 * Subtle parallax on a layer. yPercent shifts as the trigger element
 * scrolls; capped at 12% by design rule.
 */
export function parallaxLayer(
  el: Element | null,
  {
    yPercent = -8,
    trigger,
    start = 'top bottom',
    end = 'bottom top',
  }: {yPercent?: number; trigger?: Element | null; start?: string; end?: string} = {},
): gsap.core.Tween | null {
  if (!el || typeof window === 'undefined') return null;
  ensureRegistered();
  if (prefersReducedMotion()) return null;
  const capped = Math.max(-12, Math.min(12, yPercent));
  return gsap.to(el, {
    yPercent: capped,
    ease: 'none',
    scrollTrigger: {
      trigger: trigger ?? el,
      start,
      end,
      scrub: true,
    },
  });
}

/**
 * Count a number up from 0 (or a given start) to a target when the
 * element enters the viewport. Writes to textContent — DOM must already
 * be present.
 */
export function countUp(
  el: Element | null,
  {
    end,
    start = 0,
    duration = 1.2,
    decimals = 0,
    prefix = '',
    suffix = '',
    triggerStart = 'top 85%',
    locale = 'en-US',
  }: {
    end: number;
    start?: number;
    duration?: number;
    decimals?: number;
    prefix?: string;
    suffix?: string;
    triggerStart?: string;
    locale?: string;
  },
): gsap.core.Tween | null {
  if (!el || typeof window === 'undefined') return null;
  ensureRegistered();
  const node = el as HTMLElement;
  const format = (v: number) =>
    `${prefix}${v.toLocaleString(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}${suffix}`;
  if (prefersReducedMotion()) {
    node.textContent = format(end);
    return null;
  }
  node.textContent = format(start);
  const state = {v: start};
  return gsap.to(state, {
    v: end,
    duration,
    ease: 'power2.out',
    onUpdate: () => {
      node.textContent = format(state.v);
    },
    scrollTrigger: {
      trigger: el,
      start: triggerStart,
      toggleActions: 'play none none none',
    },
  });
}

/**
 * Split-line text reveal — wraps each line in a clip-mask and reveals
 * sequentially. Caller is responsible for splitting text into <span>
 * lines first (so SSR markup matches client).
 *
 * Expects: <h1><span class="line-mask"><span class="line-inner">...</span></span>...</h1>
 */
export function textReveal(
  container: Element | null,
  {
    start = 'top 80%',
    stagger = 0.09,
    yPercent = 100,
  }: SceneOptions & {stagger?: number; yPercent?: number} = {},
): gsap.core.Tween | null {
  if (!container || typeof window === 'undefined') return null;
  ensureRegistered();
  const inners = container.querySelectorAll('.line-inner');
  if (inners.length === 0) return null;
  if (prefersReducedMotion()) {
    gsap.set(inners, {yPercent: 0});
    return null;
  }
  gsap.set(inners, {yPercent});
  return gsap.to(inners, {
    yPercent: 0,
    duration: 0.95,
    ease: DEFAULT_EASE,
    stagger,
    scrollTrigger: {
      trigger: container,
      start,
      toggleActions: 'play none none none',
    },
  });
}

/**
 * A scroll-progress signal between 0 and 1 over a trigger range. The
 * callback receives the value on every scrub. Use for things like the
 * header's bottom hairline progress.
 */
export function scrollProgress(
  triggerEl: Element | null,
  cb: (p: number) => void,
  {
    start = 'top top',
    end = 'bottom bottom',
  }: SceneOptions = {},
): ScrollTrigger | null {
  if (!triggerEl || typeof window === 'undefined') return null;
  ensureRegistered();
  return ScrollTrigger.create({
    trigger: triggerEl,
    start,
    end,
    onUpdate: (self) => cb(self.progress),
  });
}

/** Refresh ScrollTrigger after dynamic content changes. */
export function refreshScrollTriggers() {
  if (typeof window === 'undefined') return;
  ensureRegistered();
  ScrollTrigger.refresh();
}

export {gsap, ScrollTrigger};
