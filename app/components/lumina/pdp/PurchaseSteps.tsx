import {StepNumber} from '~/components/lumina/StepNumber';
import {usePurchase} from './PurchaseContext';
import {
  computeSavings,
  money,
  moneyCents,
  type LuminaProductEntry,
} from '~/lib/savings';

/**
 * The "Choose Your Supply / Option" purchase steps. Tier ladder cards
 * are mapped to live Lumina products — selecting one updates the cart
 * line + price summary. Subscribe & Save is rendered statically as a
 * placeholder until selling plans are wired in Shopify Admin.
 */
export function PurchaseSteps() {
  const {
    entries,
    selected,
    setSelectedHandle,
    baseline,
    option,
    setOption,
    oneTimeTotal,
    subTotal,
  } = usePurchase();

  return (
    <section className="mx-auto flex max-w-[1200px] flex-col gap-11 px-6 pb-10 md:px-8">
      <Step n={1} title="Choose Your Supply" hint="More months, lower per-bottle price">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          {entries.map((entry) => (
            <TierCard
              key={entry.handle}
              entry={entry}
              baseline={baseline}
              selected={entry.handle === selected.handle}
              onSelect={() => setSelectedHandle(entry.handle)}
            />
          ))}
        </div>
      </Step>

      <Step n={2} title="Choose Your Option">
        <div className="flex flex-col gap-3.5 md:flex-row">
          <OptionCard
            id="subscribe"
            selected={option === 'subscribe'}
            onSelect={() => setOption('subscribe')}
            popular
            title="Subscribe & Save"
            price={subTotal}
            oldPrice={oneTimeTotal}
            meta="15% off · free shipping · pause or cancel anytime"
          />
          <OptionCard
            id="onetime"
            selected={option === 'onetime'}
            onSelect={() => setOption('onetime')}
            title="One-Time"
            price={oneTimeTotal}
            meta="Single purchase · ships once"
          />
        </div>
        <p className="t-mono mt-3 text-[11px] text-fg4">
          * Subscribe &amp; Save is rendered statically at 15% off; real
          selling plans land in a follow-up commit.
        </p>
      </Step>
    </section>
  );
}

function Step({
  n,
  title,
  hint,
  children,
}: {
  n: number;
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        <StepNumber n={n} />
        <h2 className="m-0 text-[19px] font-medium leading-none text-fg1">
          {title}
        </h2>
        {hint && <span className="ml-auto text-[13px] text-fg3">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function TierCard({
  entry,
  baseline,
  selected,
  onSelect,
}: {
  entry: LuminaProductEntry;
  baseline: LuminaProductEntry | null;
  selected: boolean;
  onSelect: () => void;
}) {
  const breakdown = computeSavings(entry, baseline);
  const isBest = entry.months === 6;
  const isMax = entry.months === 12;
  const ribbon = isMax
    ? 'Maximum savings'
    : isBest
      ? 'Best value'
      : null;

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      aria-label={`${entry.months}-month supply, ${moneyCents(breakdown.perBottle)} per bottle`}
      className="relative flex cursor-pointer flex-col gap-1.5 rounded-lg bg-surface px-4 pb-4 pt-[18px] text-left transition-[border-color,box-shadow] duration-150"
      style={{
        border: `1px solid ${selected ? 'var(--color-crimson)' : 'var(--color-border)'}`,
        boxShadow: selected
          ? '0 0 0 1px var(--color-crimson), var(--shadow-accent)'
          : 'none',
      }}
    >
      {ribbon && (
        <span
          className="absolute rounded-xs bg-crimson px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.13em] text-white"
          style={{top: -10, left: 16, boxShadow: 'var(--shadow-accent)'}}
        >
          {ribbon}
        </span>
      )}
      <div className="flex items-center justify-between">
        <span className="text-[17px] font-medium leading-none text-fg1">
          {entry.months === 1 ? '1 Month' : `${entry.months} Months`}
        </span>
        <Radio selected={selected} />
      </div>
      <span className="text-xs leading-snug text-fg3">
        {entry.bottles} {entry.bottles === 1 ? 'bottle' : 'bottles'} ·{' '}
        {money(entry.price)}
      </span>
      <span
        className="mt-1.5 text-fg1"
        style={{font: '300 24px/1 var(--font-sans)'}}
      >
        {moneyCents(breakdown.perBottle)}
        <span className="t-mono text-[11px] text-fg3"> / btl</span>
      </span>
      <span
        className="text-[11px] font-semibold uppercase tracking-[0.12em]"
        style={{
          color:
            breakdown.savedPct && breakdown.savedPct > 0
              ? 'var(--color-crimson-hi)'
              : 'var(--color-fg4)',
        }}
      >
        {breakdown.savedPct && breakdown.savedPct > 0
          ? `Save ${breakdown.savedPct}% · ${money(breakdown.saved ?? 0)}`
          : 'Baseline'}
      </span>
    </button>
  );
}

function OptionCard({
  id,
  selected,
  onSelect,
  title,
  price,
  oldPrice,
  meta,
  popular,
}: {
  id: string;
  selected: boolean;
  onSelect: () => void;
  title: string;
  price: number;
  oldPrice?: number;
  meta: string;
  popular?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      data-option={id}
      className="relative flex flex-1 cursor-pointer flex-col gap-2 rounded-md bg-surface px-5 py-[18px] text-left transition-[border-color,box-shadow] duration-150"
      style={{
        border: `1px solid ${selected ? 'var(--color-crimson)' : 'var(--color-border)'}`,
        boxShadow: selected ? '0 0 0 1px var(--color-crimson)' : 'none',
      }}
    >
      {popular && (
        <span
          className="absolute rounded-xs border border-crimson bg-black px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-crimson"
          style={{top: -10, right: 16}}
        >
          Most Popular
        </span>
      )}
      <div className="flex items-center gap-2.5">
        <Radio selected={selected} />
        <span className="text-base font-medium leading-none text-fg1">
          {title}
        </span>
        <span className="ml-auto inline-flex items-baseline gap-1.5 text-base font-medium text-fg1">
          {oldPrice && oldPrice !== price ? (
            <span className="text-fg4 line-through font-normal">
              ${oldPrice}
            </span>
          ) : null}
          ${price}
        </span>
      </div>
      <span className="pl-7 text-[13px] leading-snug text-fg3">{meta}</span>
    </button>
  );
}

function Radio({selected}: {selected: boolean}) {
  return (
    <span
      aria-hidden
      className="inline-flex h-[18px] w-[18px] flex-none rounded-full"
      style={{
        border: `1px solid ${selected ? 'var(--color-crimson)' : 'var(--color-border-strong)'}`,
        background: selected ? 'var(--color-crimson)' : 'transparent',
        boxShadow: selected ? 'inset 0 0 0 3px var(--color-surface)' : 'none',
      }}
    />
  );
}
