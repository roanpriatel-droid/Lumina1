import {useRef} from 'react';
import {useGSAP} from '@gsap/react';
import {SavingsLadder} from '~/components/lumina/SavingsLadder';
import {fadeRise, staggerChildren} from '~/lib/motion';
import type {LuminaProductEntry} from '~/lib/savings';

/**
 * Scene 6 — Supply Ladder
 *
 * Reuses the production SavingsLadder component (which is conversion-
 * critical and untouched) and wraps it with stagger motion. The "longer
 * you commit, the cheaper it gets" beat lives here.
 *
 * We only animate the wrapper — the table rows, savings math, and links
 * are the same engine used on the catalog page and PDPs.
 */
export function SupplyLadderScene({
  entries,
  gender,
}: {
  entries: LuminaProductEntry[];
  gender: 'male' | 'female';
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      fadeRise(ref.current?.querySelector('h2'), {start: 'top 80%'});
      fadeRise(ref.current?.querySelector('p'), {start: 'top 78%', delay: 0.1});
      staggerChildren(ref.current, 'a[href^="/products/"]', {
        start: 'top 75%',
        stagger: 0.06,
      });
    },
    {scope: ref},
  );

  return (
    <div ref={ref}>
      <SavingsLadder
        gender={gender}
        entries={entries}
        title={
          gender === 'male'
            ? 'Commit further. Pay less per bottle.'
            : 'The math on a longer protocol.'
        }
        eyebrow="Supply ladder"
      />
    </div>
  );
}
