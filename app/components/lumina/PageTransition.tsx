import {useEffect, useState} from 'react';
import {useNavigation} from 'react-router';
import {prefersReducedMotion} from '~/lib/motion';

/**
 * Slim fade-through-black between client navigations. Uses React
 * Router's navigation state; renders a fixed full-screen overlay that
 * fades in on `loading`/`submitting` and out on idle. Capped at 250ms
 * each direction so it never feels heavy.
 *
 * Skipped entirely when the user prefers reduced motion.
 */
export function PageTransition() {
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(prefersReducedMotion());
  }, []);

  useEffect(() => {
    if (reduced) return;
    if (navigation.state !== 'idle') {
      setVisible(true);
    } else {
      const t = setTimeout(() => setVisible(false), 60);
      return () => clearTimeout(t);
    }
  }, [navigation.state, reduced]);

  if (reduced) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[80]"
      style={{
        background: 'var(--color-bg)',
        opacity: visible ? 0.55 : 0,
        transition: 'opacity 220ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    />
  );
}
