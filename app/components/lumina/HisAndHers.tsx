import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import {Heart, ArrowUpRight} from 'lucide-react';
import {Eyebrow} from '~/components/lumina/Eyebrow';
import {Bottle} from '~/components/lumina/Bottle';
import {
  findBaseline,
  money,
  type LuminaProductEntry,
} from '~/lib/savings';

/**
 * His & Hers pairing section. When the storefront grows a dedicated Duo
 * product, the loader can pass it in and we'll feature it. Until then we
 * surface the two hero baselines side by side with a combined price
 * computed from live entries.
 *
 * TODO(duo-bundle): replace the synthesized "pair" CTA with a real
 * bundle product once admin creates one.
 */
export function HisAndHers({
  entries,
  duoEntry,
}: {
  entries: ReadonlyArray<LuminaProductEntry>;
  duoEntry?: LuminaProductEntry | null;
}) {
  const male = findBaseline(entries, 'male');
  const female = findBaseline(entries, 'female');
  if (!male || !female) return null;

  const combined = male.price + female.price;

  return (
    <section className="border-t border-border bg-black">
      <div className="mx-auto max-w-[1200px] px-6 py-20 md:px-8">
        <Eyebrow className="mb-4" style={{color: 'var(--color-crimson-hi)'}}>
          His &amp; Hers
        </Eyebrow>
        <h2
          className="m-0 mb-3 max-w-[760px] text-fg1"
          style={{
            font: '300 38px/1.1 var(--font-sans)',
            letterSpacing: '-0.01em',
          }}
        >
          Run them together.
        </h2>
        <p
          className="m-0 mb-12 max-w-[680px] text-fg3"
          style={{font: '300 17px/1.65 var(--font-sans)'}}
        >
          Same standard, both bodies. Pair the two daily formulas and assess
          on the same 8-week window — the protocol is easier to stick when
          you build it with someone.
        </p>

        <div
          className="relative grid gap-0 overflow-hidden rounded-2xl border border-crimson md:grid-cols-[1fr_auto_1fr]"
          style={{boxShadow: 'var(--shadow-accent)'}}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at top, rgba(209,26,42,0.18), rgba(11,11,12,0) 60%)',
            }}
          />
          <PairCard entry={male} label="His" />
          <div
            aria-hidden
            className="hidden h-full w-px bg-border md:block"
          />
          <PairCard entry={female} label="Hers" />
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border bg-surface px-6 py-5">
          <div className="flex items-center gap-3">
            <Heart size={18} strokeWidth={2} className="text-crimson" />
            <p
              className="m-0 text-fg2"
              style={{font: '400 14.5px/1.5 var(--font-sans)'}}
            >
              {duoEntry ? (
                <>
                  Run as a duo for {money(duoEntry.price)} —{' '}
                  <span className="text-crimson-hi">
                    save {money(Math.max(0, combined - duoEntry.price))}
                  </span>{' '}
                  vs two separate orders.
                </>
              ) : (
                <>
                  Two separate orders today, {money(combined)} combined. A
                  dedicated duo bundle is coming;{' '}
                  <span className="text-crimson-hi">
                    join the list at the bottom of the page
                  </span>{' '}
                  to be told.
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function PairCard({entry, label}: {entry: LuminaProductEntry; label: 'His' | 'Hers'}) {
  return (
    <Link
      to={`/products/${entry.handle}`}
      prefetch="intent"
      className="group relative flex items-center gap-5 px-7 py-7 transition-colors hover:bg-surface md:px-9 md:py-9"
    >
      <div className="flex h-24 w-16 flex-none items-center justify-center">
        {entry.imageUrl ? (
          <Image
            src={entry.imageUrl}
            alt={entry.imageAlt ?? entry.title}
            sizes="100px"
            className="h-full w-auto object-contain"
            loading="lazy"
            width={120}
            height={160}
          />
        ) : (
          <Bottle width={56} />
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <Eyebrow style={{color: 'var(--color-crimson-hi)'}}>{label}</Eyebrow>
        <h3 className="m-0 text-[18px] font-medium leading-snug text-fg1">
          {label === 'His'
            ? 'Lumina Male Enhancement'
            : 'Lumina Female Enhancement'}
          <sup className="text-[9px] text-fg3">™</sup>
        </h3>
        <span className="t-mono text-[13px] text-fg3">
          From {money(entry.price)} · 30 days
        </span>
        <span className="mt-1 inline-flex items-center gap-1.5 text-[12px] font-medium text-crimson-hi">
          View formula
          <ArrowUpRight
            size={12}
            strokeWidth={2}
            className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </span>
      </div>
    </Link>
  );
}
