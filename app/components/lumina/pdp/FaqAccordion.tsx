import {useState} from 'react';
import {Plus} from 'lucide-react';
import {Eyebrow} from '~/components/lumina/Eyebrow';
import type {LuminaFaq} from '~/lib/lumina-data';

export function FaqAccordion({faqs}: {faqs: LuminaFaq[]}) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="border-t border-border bg-surface">
      <div className="mx-auto max-w-[1000px] px-6 py-20 md:px-8">
        <Eyebrow className="mb-4">Frequently asked</Eyebrow>
        <h2
          className="m-0 mb-10 max-w-[760px] text-fg1"
          style={{
            font: '300 38px/1.1 var(--font-sans)',
            letterSpacing: '-0.01em',
          }}
        >
          The honest answers.
        </h2>
        <div className="flex flex-col">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div
                key={faq.q}
                className="border-b border-border"
                style={{borderTop: i === 0 ? '1px solid var(--color-border)' : 'none'}}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center gap-5 py-5 text-left transition-colors hover:text-fg1"
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
                    style={{
                      transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                    }}
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
      </div>
    </section>
  );
}
