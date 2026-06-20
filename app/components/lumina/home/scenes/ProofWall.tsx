import {useRef} from 'react';
import {useGSAP} from '@gsap/react';
import {Link} from 'react-router';
import {ArrowUpRight} from 'lucide-react';
import {Eyebrow} from '~/components/lumina/Eyebrow';
import {fadeRise} from '~/lib/motion';
import {REVIEWS} from '~/data/reviews';

/**
 * Scene — Proof Wall
 *
 * Until a real review-platform integration lands, REVIEWS is empty by
 * design (see app/data/reviews.ts). The scene renders an honest
 * "reviews coming" empty-state instead of fabricated aggregates and
 * marquees. As soon as REVIEWS has entries, this can be wired back to
 * the prior aggregate-plus-marquees layout.
 */
export function ProofWall() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      fadeRise(ref.current?.querySelector('.proof-eyebrow'));
      fadeRise(ref.current?.querySelector('.proof-headline'), {delay: 0.05});
      fadeRise(ref.current?.querySelector('.proof-body'), {delay: 0.1});
      fadeRise(ref.current?.querySelector('.proof-link'), {delay: 0.18});
    },
    {scope: ref},
  );

  // Defensive: when the real dataset arrives, ProofWall can branch on
  // REVIEWS.length and reinstate the marquees. For now, the empty-state
  // is the only render path so nothing fabricated ever ships.
  const hasReviews = REVIEWS.length > 0;
  if (hasReviews) {
    // Placeholder until the real-data render path is wired through the
    // review-platform integration. Leaving the branch declared keeps
    // the intent obvious in code review.
  }

  return (
    <section
      ref={ref}
      className="relative isolate overflow-hidden border-t border-border bg-surface"
    >
      <div className="mx-auto max-w-[920px] px-6 py-28 text-center md:px-10 md:py-36">
        <Eyebrow className="proof-eyebrow mb-5">The proof</Eyebrow>
        <h2
          className="proof-headline m-0 max-w-[760px] mx-auto text-fg1"
          style={{
            font: '300 clamp(34px, 4.2vw, 48px)/1.08 var(--font-sans)',
            letterSpacing: '-0.015em',
          }}
        >
          Reviews are coming as our first customers complete their protocols.
        </h2>
        <p
          className="proof-body m-0 mt-6 max-w-[640px] mx-auto text-fg2"
          style={{font: '300 17px/1.65 var(--font-sans)'}}
        >
          Verified reviews — tied to real orders, written after the 60-day
          guarantee window — will appear here as the protocols land. We
          don&rsquo;t seed the wall with anything else.
        </p>
        <Link
          to="/pages/reviews"
          prefetch="intent"
          className="proof-link mt-9 inline-flex items-center gap-2 text-sm font-medium text-crimson-hi underline-offset-4 hover:underline"
        >
          The reviews page
          <ArrowUpRight size={14} strokeWidth={2} />
        </Link>
      </div>
    </section>
  );
}
