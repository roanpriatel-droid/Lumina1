import {X} from 'lucide-react';
import {Eyebrow} from '~/components/lumina/Eyebrow';

export function FormulatedWithout({items}: {items: string[]}) {
  return (
    <section className="border-t border-border bg-surface">
      <div className="mx-auto max-w-[1200px] px-6 py-20 md:px-8">
        <Eyebrow className="mb-4">Formulated without</Eyebrow>
        <h2
          className="m-0 mb-12 max-w-[760px] text-fg1"
          style={{
            font: '300 38px/1.1 var(--font-sans)',
            letterSpacing: '-0.01em',
          }}
        >
          What we left out, on purpose.
        </h2>
        <div className="grid gap-3 md:grid-cols-2">
          {items.map((item) => (
            <div
              key={item}
              className="flex items-start gap-4 rounded-md border border-border bg-black px-5 py-4"
            >
              <span
                aria-hidden
                className="mt-0.5 inline-flex h-7 w-7 flex-none items-center justify-center rounded-full"
                style={{
                  border: '1px solid var(--color-crimson)',
                  background:
                    'radial-gradient(closest-side, rgba(209,26,42,0.18), rgba(11,11,12,0))',
                }}
              >
                <X size={14} strokeWidth={2.4} className="text-crimson" />
              </span>
              <span
                className="text-fg2"
                style={{font: '400 15px/1.55 var(--font-sans)'}}
              >
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
