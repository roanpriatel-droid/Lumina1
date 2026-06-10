import {useRef, useState} from 'react';
import {useGSAP} from '@gsap/react';
import {ChevronDown} from 'lucide-react';
import {Eyebrow} from '~/components/lumina/Eyebrow';
import {fadeRise, staggerChildren} from '~/lib/motion';
import type {LuminaDeepDive} from '~/lib/lumina-data';

export function DeepDiveCards({dives}: {dives: LuminaDeepDive[]}) {
  const [open, setOpen] = useState<number | null>(0);
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      fadeRise(ref.current?.querySelector('h2'));
      staggerChildren(ref.current?.querySelector('.deep-dive-list'), '.deep-dive-card', {
        start: 'top 75%',
        stagger: 0.07,
      });
    },
    {scope: ref},
  );

  return (
    <section ref={ref} className="border-t border-border bg-black">
      <div className="mx-auto max-w-[1200px] px-6 py-20 md:px-8">
        <Eyebrow className="mb-4">Ingredient deep dives</Eyebrow>
        <h2
          className="m-0 mb-3 max-w-[760px] text-fg1"
          style={{
            font: '300 38px/1.1 var(--font-sans)',
            letterSpacing: '-0.01em',
          }}
        >
          The stories behind the doses.
        </h2>
        <p
          className="m-0 mb-10 max-w-[640px] text-fg3"
          style={{font: '300 17px/1.65 var(--font-sans)'}}
        >
          Tap any ingredient to read why it&rsquo;s in the formula at the dose
          we chose.
        </p>
        <div className="deep-dive-list flex flex-col gap-3">
          {dives.map((dive, i) => {
            const isOpen = open === i;
            return (
              <div
                key={dive.ingredient}
                className="deep-dive-card rounded-lg border border-border bg-surface transition-[border-color,box-shadow] duration-200"
                style={{
                  borderColor: isOpen
                    ? 'var(--color-border-strong)'
                    : 'var(--color-border)',
                  boxShadow: isOpen ? 'var(--shadow-md)' : 'none',
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-start gap-5 px-6 py-5 text-left md:px-7"
                >
                  <div className="flex-1">
                    <h3 className="m-0 text-[17px] font-medium leading-snug text-fg1">
                      {dive.ingredient}
                    </h3>
                    <p
                      className="m-0 mt-1 text-fg3"
                      style={{font: '400 14px/1.5 var(--font-sans)'}}
                    >
                      {dive.hook}
                    </p>
                  </div>
                  <ChevronDown
                    size={20}
                    strokeWidth={2}
                    className="mt-1 flex-none text-fg3 transition-transform duration-200"
                    style={{
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  />
                </button>
                <div
                  className="grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out"
                  style={{
                    gridTemplateRows: isOpen ? '1fr' : '0fr',
                  }}
                >
                  <div className="overflow-hidden">
                    <div className="px-6 pb-6 md:px-7">
                      <div
                        className="border-t border-border pt-5 text-fg2"
                        style={{font: '400 15px/1.7 var(--font-sans)'}}
                      >
                        {dive.body}
                      </div>
                    </div>
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
