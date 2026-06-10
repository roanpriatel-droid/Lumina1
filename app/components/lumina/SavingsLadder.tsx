import {Link} from 'react-router';
import {ArrowRight, Crown, Award} from 'lucide-react';
import {Eyebrow} from '~/components/lumina/Eyebrow';
import {
  computeSavings,
  money,
  moneyCents,
  type LuminaProductEntry,
  type Gender,
} from '~/lib/savings';

/**
 * Compact "savings ladder" comparison table — every supply tier for one
 * gender, side by side. Shows price, per-bottle, per-day, and total saved.
 * Renders as a true table on md+ and as a card stack on mobile.
 *
 * Best-Value (6mo) and Maximum Savings (12mo) rows are highlighted with
 * crimson ribbons and a brighter row background.
 */
export function SavingsLadder({
  gender,
  entries,
  currentHandle,
  title = 'See the commitment math',
  eyebrow = 'Savings ladder',
}: {
  gender: Gender;
  /** All entries for the gender, ordered ascending by months. */
  entries: ReadonlyArray<LuminaProductEntry>;
  /** Optional: dim/highlight the row matching the currently-viewed PDP. */
  currentHandle?: string;
  title?: string;
  eyebrow?: string;
}) {
  const baseline =
    entries.find((e) => e.months === 1) ?? entries[0] ?? null;

  if (!baseline || entries.length === 0) return null;

  const rows = entries.map((entry) => ({
    entry,
    breakdown: computeSavings(entry, baseline),
    isBest: entry.months === 6,
    isMax: entry.months === 12,
  }));

  if (rows.length === 0) return null;

  return (
    <section
      className="border-t border-border bg-black"
      aria-label={`${gender === 'male' ? 'Male' : 'Female'} formula savings ladder`}
    >
      <div className="mx-auto max-w-[1200px] px-6 py-20 md:px-8">
        <Eyebrow className="mb-4">{eyebrow}</Eyebrow>
        <h2
          className="m-0 max-w-[760px] text-fg1"
          style={{
            font: '300 38px/1.1 var(--font-sans)',
            letterSpacing: '-0.01em',
          }}
        >
          {title}
        </h2>
        <p
          className="m-0 mt-5 max-w-[640px] text-fg3"
          style={{font: '300 17px/1.65 var(--font-sans)'}}
        >
          Every rung is cheaper than the one above it — calculated from the
          live storefront price, not from a baked-in marketing number.
        </p>

        <div className="mt-12 overflow-hidden rounded-xl border border-border">
          <div
            className="hidden grid-cols-[1.2fr_0.9fr_1fr_1fr_1.2fr_auto] gap-4 border-b border-border bg-surface px-6 py-4 md:grid"
            aria-hidden
          >
            <Head>Supply</Head>
            <Head>Total</Head>
            <Head>Per bottle</Head>
            <Head>Per day</Head>
            <Head>Saved vs 1-month</Head>
            <Head>{' '}</Head>
          </div>
          {rows.map(({entry, breakdown, isBest, isMax}) => (
            <Link
              key={entry.handle}
              to={`/products/${entry.handle}`}
              prefetch="intent"
              className="group relative grid grid-cols-2 gap-x-4 gap-y-2 bg-surface px-6 py-5 transition-colors hover:bg-surface-2 md:grid-cols-[1.2fr_0.9fr_1fr_1fr_1.2fr_auto] md:items-center md:gap-4"
              style={{
                borderTop: '1px solid var(--color-border)',
                background:
                  isBest || isMax
                    ? 'linear-gradient(180deg, rgba(209,26,42,0.06), rgba(11,11,12,0))'
                    : undefined,
                outline:
                  currentHandle === entry.handle
                    ? '1px solid var(--color-crimson)'
                    : 'none',
                outlineOffset: -1,
              }}
            >
              <div className="col-span-2 flex items-center gap-3 md:col-span-1">
                {isBest && (
                  <Ribbon Icon={Crown} label="Best value" />
                )}
                {isMax && (
                  <Ribbon Icon={Award} label="Maximum savings" />
                )}
                <span className="text-[16px] font-medium leading-snug text-fg1">
                  {entry.months}{' '}
                  {entry.months === 1 ? 'Month' : 'Months'}
                </span>
                <span className="text-[12px] text-fg3">
                  · {entry.bottles}{' '}
                  {entry.bottles === 1 ? 'bottle' : 'bottles'}
                </span>
              </div>
              <Cell label="Total">{money(breakdown.total)}</Cell>
              <Cell label="Per bottle" tone="accent">
                {moneyCents(breakdown.perBottle)}
              </Cell>
              <Cell label="Per day">{moneyCents(breakdown.perDay)}</Cell>
              <Cell label="Saved vs 1-mo" tone="save">
                {breakdown.saved && breakdown.saved > 0
                  ? `${money(breakdown.saved)} (${breakdown.savedPct}%)`
                  : '—'}
              </Cell>
              <span
                className="hidden items-center justify-end gap-1.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-fg3 md:flex"
                aria-hidden
              >
                View
                <ArrowRight
                  size={14}
                  strokeWidth={2}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function Head({children}: {children: React.ReactNode}) {
  return (
    <span className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-fg3">
      {children}
    </span>
  );
}

function Cell({
  label,
  children,
  tone = 'default',
}: {
  label: string;
  children: React.ReactNode;
  tone?: 'default' | 'accent' | 'save';
}) {
  const value =
    tone === 'save'
      ? 'text-crimson-hi'
      : tone === 'accent'
        ? 'text-fg1'
        : 'text-fg2';
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-fg4 md:hidden">
        {label}
      </span>
      <span className={`t-mono text-[14.5px] font-medium ${value}`}>
        {children}
      </span>
    </div>
  );
}

function Ribbon({
  Icon,
  label,
}: {
  Icon: typeof Crown;
  label: string;
}) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-pill border border-crimson bg-black px-2.5 py-1 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-crimson-hi"
      style={{boxShadow: 'var(--shadow-accent)'}}
    >
      <Icon size={11} strokeWidth={2.4} />
      {label}
    </span>
  );
}
