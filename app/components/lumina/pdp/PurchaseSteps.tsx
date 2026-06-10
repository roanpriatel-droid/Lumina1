import {StepNumber} from '~/components/lumina/StepNumber';
import {LUMINA_BUNDLES, type LuminaBundle} from '~/lib/lumina-data';
import {usePurchase} from './PurchaseContext';
import type {LuminaLiveTier} from '~/lib/lumina-tiers';

export function PurchaseSteps() {
  const {
    tiers,
    tier,
    setTierId,
    option,
    setOption,
    bundle,
    setBundleId,
    oneTimeTotal,
    subTotal,
    perBottle,
    savePct,
  } = usePurchase();

  return (
    <section className="mx-auto flex max-w-[1200px] flex-col gap-11 px-6 pb-10 md:px-8">
      <Step n={1} title="Choose Your Supply" hint="More months, lower per-bottle price">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          {tiers.map((t) => (
            <TierCard
              key={t.preset.id}
              tier={t}
              selected={t.preset.id === tier.preset.id}
              perBottle={perBottle(t)}
              savePct={savePct(t)}
              onSelect={() => setTierId(t.preset.id)}
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
            meta="15% off · free shipping · cancel anytime"
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
          * Subscribe &amp; Save discount is rendered statically; real selling
          plans land in a follow-up commit.
        </p>
      </Step>

      <Step n={3} title="Save More with Bundles" hint="Optional">
        <div className="grid gap-3.5 md:grid-cols-2">
          {LUMINA_BUNDLES.map((b) => (
            <BundleCard
              key={b.id}
              bundle={b}
              selected={b.id === bundle.id}
              onSelect={() => setBundleId(b.id)}
            />
          ))}
        </div>
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
        {hint && (
          <span className="ml-auto text-[13px] text-fg3">{hint}</span>
        )}
      </div>
      {children}
    </div>
  );
}

function TierCard({
  tier,
  selected,
  perBottle,
  savePct,
  onSelect,
}: {
  tier: LuminaLiveTier;
  selected: boolean;
  perBottle: number | null;
  savePct: number;
  onSelect: () => void;
}) {
  const {preset, variant} = tier;
  const unavailable = !variant;
  const perBottleDisplay = perBottle !== null ? Math.round(perBottle) : null;

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={unavailable}
      aria-pressed={selected}
      aria-label={
        unavailable
          ? `${preset.name} ${preset.months}-month supply (unavailable)`
          : `${preset.name} ${preset.months}-month supply`
      }
      className="relative flex cursor-pointer flex-col gap-1.5 rounded-lg bg-surface px-4 pb-4 pt-[18px] text-left transition-[border-color,box-shadow] duration-150 disabled:cursor-not-allowed disabled:opacity-50"
      style={{
        border: `1px solid ${selected ? 'var(--color-crimson)' : 'var(--color-border)'}`,
        boxShadow: selected
          ? '0 0 0 1px var(--color-crimson), var(--shadow-accent)'
          : 'none',
      }}
    >
      {preset.best && (
        <span
          className="absolute rounded-xs bg-crimson px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.13em] text-white"
          style={{top: -10, left: 16, boxShadow: 'var(--shadow-accent)'}}
        >
          Best Value
        </span>
      )}
      <div className="flex items-center justify-between">
        <span className="text-[17px] font-medium leading-none text-fg1">
          {preset.name}
        </span>
        <Radio selected={selected} />
      </div>
      <span className="text-xs leading-snug text-fg3">
        {preset.months} {preset.months === 1 ? 'Month' : 'Months'} ·{' '}
        {preset.bottles} {preset.bottles === 1 ? 'bottle' : 'bottles'}
      </span>
      <span
        className="mt-1.5 text-fg1"
        style={{font: '300 24px/1 var(--font-sans)'}}
      >
        {perBottleDisplay !== null ? `$${perBottleDisplay}` : '—'}
        <span className="t-mono text-[11px] text-fg3"> / btl</span>
      </span>
      <span
        className="text-[11px] font-semibold uppercase tracking-[0.12em]"
        style={{
          color: savePct
            ? 'var(--color-crimson-hi)'
            : 'var(--color-fg4)',
        }}
      >
        {unavailable
          ? 'Unavailable'
          : savePct
            ? `Save ${savePct}%`
            : 'Base price'}
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

function BundleCard({
  bundle,
  selected,
  onSelect,
}: {
  bundle: LuminaBundle;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className="relative flex cursor-pointer flex-col gap-1.5 rounded-md bg-surface px-5 py-4 text-left transition-[border-color,box-shadow] duration-150"
      style={{
        border: `1px solid ${selected ? 'var(--color-crimson)' : 'var(--color-border)'}`,
        boxShadow: selected ? '0 0 0 1px var(--color-crimson)' : 'none',
      }}
    >
      {bundle.popular && (
        <span
          className="absolute text-[10px] font-semibold uppercase tracking-[0.1em] text-crimson"
          style={{top: 14, right: 14}}
        >
          Popular
        </span>
      )}
      <span className="text-base font-medium leading-none text-fg1">
        {bundle.label}
      </span>
      <span className="text-[13px] leading-snug text-fg3">{bundle.note}</span>
      <span
        className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.1em]"
        style={{
          color: bundle.save ? 'var(--color-crimson-hi)' : 'var(--color-fg4)',
        }}
      >
        {bundle.save ? `Extra ${bundle.save}% off` : 'No bundle'}
      </span>
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
