import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import {ArrowUpRight, Crown, Award} from 'lucide-react';
import {Eyebrow} from '~/components/lumina/Eyebrow';
import {Bottle} from '~/components/lumina/Bottle';
import {
  money,
  moneyCents,
  computeSavings,
  type LuminaProductEntry,
} from '~/lib/savings';

/**
 * Catalog product card with live pricing + savings.
 *
 * - Per-bottle line in mono
 * - Crimson savings badge when there's a real $ saved vs 1-month baseline
 * - "Best Value" (6mo) and "Maximum Savings" (12mo) ribbons
 * - Glow pedestal behind the bottle image
 */
export function CatalogCard({
  product,
  baseline,
}: {
  product: LuminaProductEntry;
  baseline: LuminaProductEntry | null;
}) {
  const breakdown = computeSavings(product, baseline);
  const showSavings = breakdown.saved !== null && breakdown.saved > 0;
  const isBest = product.months === 6;
  const isMax = product.months === 12;
  const ribbon = isMax
    ? {Icon: Award, label: 'Maximum Savings'}
    : isBest
      ? {Icon: Crown, label: 'Best Value'}
      : null;

  return (
    <Link
      to={`/products/${product.handle}`}
      prefetch="intent"
      aria-label={`${product.title} — ${money(breakdown.total)}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface transition-[transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-border-strong"
    >
      {ribbon && (
        <span
          className="absolute z-10 inline-flex items-center gap-1.5 rounded-pill border border-crimson bg-black px-2.5 py-1 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-crimson-hi"
          style={{
            top: 14,
            left: 14,
            boxShadow: 'var(--shadow-accent)',
          }}
        >
          <ribbon.Icon size={11} strokeWidth={2.4} />
          {ribbon.label}
        </span>
      )}

      <div
        className="relative flex aspect-[5/4] items-center justify-center"
        style={{background: 'var(--color-bg)'}}
      >
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: 'var(--glow-hero)',
            opacity: 0.55,
          }}
        />
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.imageAlt ?? product.title}
            sizes="(min-width: 768px) 25vw, 50vw"
            className="relative h-[68%] w-auto object-contain"
            loading="lazy"
            width={240}
            height={240}
          />
        ) : (
          <div className="relative">
            <Bottle width={86} />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 border-t border-border p-6">
        <Eyebrow style={{color: 'var(--color-crimson-hi)'}}>
          {product.months === 1
            ? 'Monthly · entry'
            : `${product.months}-month supply`}
        </Eyebrow>
        <h3
          className="m-0 text-fg1"
          style={{
            font: '300 22px/1.2 var(--font-sans)',
            letterSpacing: '-0.01em',
          }}
        >
          {product.title.replace(/™/g, '')}
          <sup className="text-[10px] text-fg3">™</sup>
        </h3>

        <div className="mt-1 flex items-baseline justify-between border-b border-border pb-3">
          <span
            className="text-fg1"
            style={{font: '300 28px/1 var(--font-sans)'}}
          >
            {money(breakdown.total)}
          </span>
          <span className="t-mono text-[12px] text-fg3">
            {moneyCents(breakdown.perBottle)} / bottle
          </span>
        </div>

        <div className="flex items-center justify-between gap-3">
          {showSavings ? (
            <span className="inline-flex items-center gap-2 rounded-pill border border-crimson bg-black px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.13em] text-crimson-hi">
              Save {breakdown.savedPct}% · {money(breakdown.saved as number)}
            </span>
          ) : (
            <span className="text-[11px] uppercase tracking-[0.12em] text-fg4">
              Baseline price
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-fg2">
            View formula
            <ArrowUpRight
              size={13}
              strokeWidth={2}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </span>
        </div>
      </div>
    </Link>
  );
}
