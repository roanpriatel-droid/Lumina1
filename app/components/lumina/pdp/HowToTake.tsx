import {Pill, Clock, CalendarCheck, LinkIcon} from 'lucide-react';
import {Eyebrow} from '~/components/lumina/Eyebrow';
import type {LuminaProduct} from '~/lib/lumina-data';

export function HowToTake({product}: {product: LuminaProduct}) {
  return (
    <section className="border-t border-border bg-surface">
      <div className="mx-auto max-w-[1200px] px-6 py-20 md:px-8">
        <Eyebrow className="mb-4">How to take it</Eyebrow>
        <h2
          className="m-0 mb-12 max-w-[760px] text-fg1"
          style={{
            font: '300 38px/1.1 var(--font-sans)',
            letterSpacing: '-0.01em',
          }}
        >
          The protocol is simple. The consistency is the point.
        </h2>

        <div className="grid gap-5 md:grid-cols-3">
          <Tile
            Icon={Pill}
            eyebrow="Dosage"
            title={product.dailyServing}
            body={`Each bottle contains ${product.bottleCount} capsules — a full ${product.supplyDays}-day supply at the recommended serving.`}
          />
          <Tile
            Icon={Clock}
            eyebrow="Timing"
            title={`Take ${product.takingTime}`}
            body={product.suggestedUse}
          />
          <Tile
            Icon={CalendarCheck}
            eyebrow="Consistency"
            title="8–12 weeks for best assessment"
            body={product.consistencyMessage}
          />
        </div>

        <div className="mt-10 rounded-xl border border-border bg-black px-7 py-8 md:px-9 md:py-10">
          <div className="flex items-start gap-4">
            <LinkIcon
              size={20}
              strokeWidth={1.75}
              className="mt-1 flex-none text-crimson"
            />
            <div>
              <h3
                className="m-0 text-[19px] font-medium leading-snug text-fg1"
              >
                Pair it with the basics. The formula isn&rsquo;t a shortcut.
              </h3>
              <ul className="mt-5 grid gap-2.5 md:grid-cols-2">
                {product.pairWith.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-fg2"
                    style={{font: '400 15px/1.55 var(--font-sans)'}}
                  >
                    <span
                      className="mt-2 inline-block h-1 w-1 flex-none rounded-full bg-crimson"
                      aria-hidden
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Tile({
  Icon,
  eyebrow,
  title,
  body,
}: {
  Icon: typeof Pill;
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-black px-7 py-7">
      <div
        className="inline-flex h-11 w-11 items-center justify-center rounded-md"
        style={{
          background:
            'radial-gradient(closest-side, rgba(209,26,42,0.22), rgba(11,11,12,0))',
        }}
      >
        <Icon size={22} strokeWidth={1.75} className="text-crimson" />
      </div>
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-fg3">
        {eyebrow}
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
    </div>
  );
}
