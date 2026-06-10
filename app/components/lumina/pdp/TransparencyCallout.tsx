import {Link} from 'react-router';
import {FileSearch, ArrowDown} from 'lucide-react';
import {Eyebrow} from '~/components/lumina/Eyebrow';
import type {LuminaBlend} from '~/lib/lumina-data';

/**
 * A blend-aware transparency banner. Shown for formulas that carry a
 * disclosed proprietary blend (the female formula) — surfaces the disclosure
 * approach above the actives table so the user reads "we tell you the
 * names and the total weight; per-ingredient doses are proprietary at this
 * revision" before they encounter the blend row itself.
 */
export function TransparencyCallout({blend}: {blend: LuminaBlend}) {
  return (
    <section className="border-t border-border bg-black">
      <div className="mx-auto max-w-[1200px] px-6 py-16 md:px-8">
        <div
          className="relative grid gap-8 overflow-hidden rounded-2xl border border-border bg-surface px-7 py-9 md:grid-cols-[auto_1fr_auto] md:items-center md:gap-10 md:px-10 md:py-10"
          style={{boxShadow: 'var(--shadow-md)'}}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(closest-side at 0% 50%, rgba(209,26,42,0.14), transparent 60%)',
            }}
          />
          <div
            className="relative flex h-14 w-14 flex-none items-center justify-center rounded-lg"
            style={{
              background:
                'radial-gradient(closest-side, rgba(209,26,42,0.22), rgba(11,11,12,0))',
              border: '1px solid var(--color-border)',
            }}
          >
            <FileSearch
              size={26}
              strokeWidth={1.75}
              className="text-crimson"
            />
          </div>
          <div className="relative flex flex-col gap-2">
            <Eyebrow style={{color: 'var(--color-crimson-hi)'}}>
              Transparency over the category
            </Eyebrow>
            <h2
              className="m-0 text-fg1"
              style={{
                font: '300 26px/1.2 var(--font-sans)',
                letterSpacing: '-0.01em',
              }}
            >
              The blend is disclosed by name and by total weight.
            </h2>
            <p
              className="m-0 max-w-[640px] text-fg2"
              style={{font: '300 15.5px/1.6 var(--font-sans)'}}
            >
              Every vitamin, mineral, amino, and the absorption catalyst are
              dosed openly below. The {blend.name.toLowerCase()} is listed in
              full — all {blend.ingredients.length} botanicals, plus the exact
              total ({blend.totalAmount}). Per-ingredient doses inside the
              blend remain proprietary at this revision — more transparency
              than the category standard, less than where we want to be.
            </p>
          </div>
          <Link
            to="#ingredients"
            prefetch="intent"
            className="relative inline-flex items-center gap-2 self-start whitespace-nowrap rounded-pill border border-border bg-black px-5 py-3 text-[13px] font-medium tracking-[0.04em] text-fg1 transition-colors hover:border-crimson hover:text-crimson-hi md:self-center"
          >
            See the table
            <ArrowDown size={14} strokeWidth={2} />
          </Link>
        </div>
      </div>
    </section>
  );
}
