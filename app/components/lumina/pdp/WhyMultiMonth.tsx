import {CalendarRange, Repeat, LineChart} from 'lucide-react';
import {Eyebrow} from '~/components/lumina/Eyebrow';

const REASONS = [
  {
    Icon: CalendarRange,
    title: 'Eight weeks is the assessment window',
    body: "Traditional botanicals and adaptogens are studied across consistent intake over weeks, not days. The supplier's own instruction is a minimum 8-week run — anything shorter doesn't tell you much.",
  },
  {
    Icon: Repeat,
    title: 'Consistency beats heroic dosing',
    body: 'A daily routine maintained for weeks is the variable that moves the needle, not a higher single dose. A multi-month supply removes the friction of re-ordering — fewer chances to break the habit.',
  },
  {
    Icon: LineChart,
    title: 'You compound the supplement math',
    body: 'A 6-month supply lands at a lower per-bottle price than a 1-month, with the same lot-by-lot testing and the same supplier. The commitment buys you the better unit economics.',
  },
];

/**
 * "Why the multi-month supply" micro-section rendered on supply (2/4/6/
 * 12-month) PDPs. Justifies the larger commitment by the 8-week
 * assessment logic — structure/function compliant, no medical claim.
 */
export function WhyMultiMonth({months}: {months: number}) {
  return (
    <section className="border-t border-border bg-surface">
      <div className="mx-auto max-w-[1200px] px-6 py-20 md:px-8">
        <Eyebrow className="mb-4">Why a {months}-month supply</Eyebrow>
        <h2
          className="m-0 mb-3 max-w-[760px] text-fg1"
          style={{
            font: '300 38px/1.1 var(--font-sans)',
            letterSpacing: '-0.01em',
          }}
        >
          The formula is dosed for the protocol, not the bottle.
        </h2>
        <p
          className="m-0 mb-12 max-w-[680px] text-fg3"
          style={{font: '300 17px/1.65 var(--font-sans)'}}
        >
          A monthly bottle is a quarter of an assessment cycle. Picking a
          multi-month supply isn&rsquo;t about hoarding — it&rsquo;s the
          cadence the actives are studied across.
        </p>
        <div className="grid gap-5 md:grid-cols-3">
          {REASONS.map(({Icon, title, body}) => (
            <article
              key={title}
              className="flex flex-col gap-4 rounded-xl border border-border bg-black px-7 py-7"
            >
              <div
                className="inline-flex h-11 w-11 items-center justify-center rounded-md"
                style={{
                  background:
                    'radial-gradient(closest-side, rgba(209,26,42,0.22), rgba(11,11,12,0))',
                }}
              >
                <Icon size={22} strokeWidth={1.75} className="text-crimson" />
              </div>
              <h3 className="m-0 text-[18px] font-medium leading-snug text-fg1">
                {title}
              </h3>
              <p
                className="m-0 text-fg3"
                style={{font: '400 14.5px/1.6 var(--font-sans)'}}
              >
                {body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
