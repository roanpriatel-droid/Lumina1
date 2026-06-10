import {useRef} from 'react';
import {useGSAP} from '@gsap/react';
import {Coins} from 'lucide-react';
import {Eyebrow} from '~/components/lumina/Eyebrow';
import {countUp, fadeRise} from '~/lib/motion';
import {
  money,
  moneyCents,
  type SavingsBreakdown as SB,
} from '~/lib/savings';

/**
 * "Your Savings" breakdown card. Renders the math behind the price:
 * months, bottles, per-bottle, per-day, baseline cost, total saved.
 *
 * The card is used on every supply (multi-month) PDP near the price block.
 * If `breakdown.saved` is null (no baseline could be resolved), the
 * savings rows are hidden — the card stays useful as a per-bottle / per-
 * day breakdown.
 */
export function SavingsBreakdown({breakdown}: {breakdown: SB}) {
  const hasBaseline =
    breakdown.baselinePerBottle !== null && breakdown.baselineCost !== null;
  const positiveSavings =
    breakdown.saved !== null && breakdown.saved > 0;
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      fadeRise(ref.current, {start: 'top 85%'});
      // Tween each dollar/cent value up from 0 when the card enters.
      const targets = ref.current?.querySelectorAll('[data-countup]');
      targets?.forEach((el) => {
        const target = el as HTMLElement;
        const value = Number.parseFloat(target.dataset.countup ?? '0');
        const decimals = Number.parseInt(target.dataset.decimals ?? '0', 10);
        const prefix = target.dataset.prefix ?? '';
        const suffix = target.dataset.suffix ?? '';
        countUp(target, {
          end: value,
          decimals,
          prefix,
          suffix,
          duration: 1.1,
          triggerStart: 'top 85%',
        });
      });
    },
    {scope: ref},
  );

  return (
    <aside
      ref={ref}
      className="rounded-xl border border-border bg-surface px-6 py-6 md:px-7 md:py-7"
      style={{boxShadow: 'var(--shadow-md)'}}
      aria-label="Your savings"
    >
      <div className="mb-5 flex items-center gap-2.5">
        <Coins size={16} strokeWidth={2} className="text-crimson" />
        <Eyebrow>Your savings</Eyebrow>
      </div>

      <dl className="m-0 flex flex-col gap-3">
        <Row
          label={`Total · ${breakdown.bottles} ${
            breakdown.bottles === 1 ? 'bottle' : 'bottles'
          }`}
          value={money(breakdown.total)}
          countUpValue={breakdown.total}
          countUpDecimals={0}
          countUpPrefix="$"
        />
        <Row
          label="Per bottle"
          value={moneyCents(breakdown.perBottle)}
          tone="accent"
          countUpValue={breakdown.perBottle}
          countUpDecimals={2}
          countUpPrefix="$"
        />
        <Row
          label="Per day"
          value={moneyCents(breakdown.perDay)}
          tone="muted"
          countUpValue={breakdown.perDay}
          countUpDecimals={2}
          countUpPrefix="$"
        />

        {hasBaseline && (
          <>
            <Divider />
            <Row
              label={`If bought as ${breakdown.bottles} × 1-month`}
              value={money(breakdown.baselineCost as number)}
              tone="muted"
              strike
            />
            {positiveSavings && (
              <Row
                label={`You save · ${breakdown.savedPct}%`}
                value={`− ${money(breakdown.saved as number)}`}
                tone="save"
                bold
                countUpValue={breakdown.saved as number}
                countUpDecimals={0}
                countUpPrefix="− $"
              />
            )}
          </>
        )}
      </dl>

      <p
        className="t-mono mt-5 text-[10.5px] uppercase tracking-[0.14em] text-fg4"
        aria-hidden
      >
        Numbers reconcile to the live storefront price.
      </p>
    </aside>
  );
}

function Row({
  label,
  value,
  tone = 'default',
  strike = false,
  bold = false,
  countUpValue,
  countUpDecimals,
  countUpPrefix,
  countUpSuffix,
}: {
  label: string;
  value: string;
  tone?: 'default' | 'accent' | 'muted' | 'save';
  strike?: boolean;
  bold?: boolean;
  countUpValue?: number;
  countUpDecimals?: number;
  countUpPrefix?: string;
  countUpSuffix?: string;
}) {
  const labelColor =
    tone === 'muted'
      ? 'text-fg3'
      : tone === 'save'
        ? 'text-crimson-hi'
        : 'text-fg2';
  const valueColor =
    tone === 'accent'
      ? 'text-fg1'
      : tone === 'save'
        ? 'text-crimson-hi'
        : tone === 'muted'
          ? 'text-fg4'
          : 'text-fg1';
  const ddProps =
    countUpValue !== undefined
      ? {
          'data-countup': String(countUpValue),
          'data-decimals': String(countUpDecimals ?? 0),
          'data-prefix': countUpPrefix ?? '',
          'data-suffix': countUpSuffix ?? '',
        }
      : {};
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className={`text-[13.5px] leading-tight ${labelColor}`}>{label}</dt>
      <dd
        {...ddProps}
        className={`t-mono leading-none ${valueColor} ${
          bold ? 'text-[18px] font-semibold' : 'text-[15px] font-medium'
        } ${strike ? 'line-through opacity-70' : ''}`}
      >
        {value}
      </dd>
    </div>
  );
}

function Divider() {
  return (
    <div
      aria-hidden
      className="my-1 h-px"
      style={{background: 'var(--color-border)'}}
    />
  );
}
