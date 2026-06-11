import {useRef, useState} from 'react';
import {useGSAP} from '@gsap/react';
import {Link} from 'react-router';
import {Plus, ArrowUpRight} from 'lucide-react';
import {Eyebrow} from '~/components/lumina/Eyebrow';
import {fadeRise, staggerChildren} from '~/lib/motion';

const TOP_QUESTIONS = [
  {
    q: 'How long until I notice anything?',
    a: "The mineral and B-complex pieces can register inside the first one or two weeks. Botanicals and adaptogens — tribulus, ashwagandha, maca — are traditionally used over weeks. We dose for an 8–12 week assessment window, which is the supplier's own instruction.",
  },
  {
    q: 'Why disclose every dose openly?',
    a: 'Because the alternative is hiding behind a proprietary blend, and that has earned the supplement category its reputation. We print every mg so you can compare us to anything on the shelf.',
  },
  {
    q: 'How does the subscription work?',
    a: "Subscribe and you save 15% on every bottle, ship free, and can pause or cancel from your account in two clicks. The cadence matches the supply length you chose — a 6-month supply ships every six months, not monthly.",
  },
  {
    q: "What's the guarantee?",
    a: '60-Day Money-Back Guarantee on every order. Empty bottles fine. We refund the original payment method — no store credit, no restocking fee.',
  },
];

/**
 * Scene 9 — FAQ Teaser
 *
 * Four most-asked questions as an accordion. Each opens locally; the
 * full FAQ page is one click away.
 */
export function FaqTeaser() {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<number | null>(0);

  useGSAP(
    () => {
      fadeRise(ref.current?.querySelector('.faq-eyebrow'));
      fadeRise(ref.current?.querySelector('.faq-headline'), {delay: 0.05});
      fadeRise(ref.current?.querySelector('.faq-lede'), {delay: 0.1});
      staggerChildren(ref.current?.querySelector('.faq-list'), '.faq-item', {
        start: 'top 75%',
        stagger: 0.07,
      });
    },
    {scope: ref},
  );

  return (
    <section
      ref={ref}
      className="border-t border-border bg-black"
    >
      <div className="mx-auto max-w-[1000px] px-6 py-28 md:px-10 md:py-36">
        <Eyebrow className="faq-eyebrow mb-4">Top questions</Eyebrow>
        <h2
          className="faq-headline m-0 max-w-[680px] text-fg1"
          style={{
            font: '300 clamp(2.5rem, 5vw, 4.5rem)/1.05 var(--font-sans)',
            letterSpacing: '-0.015em',
          }}
        >
          The four most-asked, answered honestly.
        </h2>
        <p
          className="faq-lede m-0 mt-5 max-w-[600px] text-fg3"
          style={{font: '300 16px/1.65 var(--font-sans)'}}
        >
          The complete FAQ lives at <Link to="/pages/faq" className="text-crimson-hi hover:text-fg1">/pages/faq</Link> with 20+ grouped questions and a search filter.
        </p>

        <div className="faq-list mt-12 flex flex-col">
          {TOP_QUESTIONS.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div
                key={faq.q}
                className="faq-item border-b border-border"
                style={{
                  borderTop: i === 0 ? '1px solid var(--color-border)' : 'none',
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center gap-5 py-5 text-left"
                >
                  <span
                    className="flex-1 text-fg1"
                    style={{font: '400 18px/1.4 var(--font-sans)'}}
                  >
                    {faq.q}
                  </span>
                  <Plus
                    size={20}
                    strokeWidth={2}
                    className="flex-none text-fg3 transition-transform duration-200"
                    style={{transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)'}}
                  />
                </button>
                <div
                  className="grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out"
                  style={{gridTemplateRows: isOpen ? '1fr' : '0fr'}}
                >
                  <div className="overflow-hidden">
                    <p
                      className="m-0 max-w-[760px] pb-6 text-fg3"
                      style={{font: '400 15.5px/1.7 var(--font-sans)'}}
                    >
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <Link
          to="/pages/faq"
          prefetch="intent"
          className="mt-10 inline-flex items-center gap-2 text-sm font-medium text-crimson-hi transition-colors hover:text-fg1"
        >
          See every question
          <ArrowUpRight size={14} strokeWidth={2} />
        </Link>
      </div>
    </section>
  );
}
