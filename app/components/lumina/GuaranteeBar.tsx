import {ShieldCheck, FlaskConical, MapPin} from 'lucide-react';
import type {LucideIcon} from 'lucide-react';

const ITEMS: ReadonlyArray<{Icon: LucideIcon; label: string}> = [
  {Icon: ShieldCheck, label: '60-Day Money-Back'},
  {Icon: FlaskConical, label: 'Third-Party Tested'},
  {Icon: MapPin, label: 'Ships from USA'},
];

/**
 * Slim trust strip placed directly under every Add to Cart surface on the
 * PDP and cart drawer. Three icons, mono small-caps — the brand's
 * baseline promises distilled to the smallest possible commitment.
 *
 * Variant: `compact` strips horizontal padding so the bar fits inside a
 * cart drawer or stacked layout.
 */
export function GuaranteeBar({
  variant = 'default',
}: {
  variant?: 'default' | 'compact';
}) {
  const wrap =
    variant === 'compact'
      ? 'flex flex-wrap items-center justify-center gap-x-5 gap-y-2'
      : 'flex flex-wrap items-center justify-center gap-x-7 gap-y-3 rounded-lg border border-border bg-surface px-5 py-3';
  return (
    <div className={wrap} role="contentinfo" aria-label="Brand guarantees">
      {ITEMS.map(({Icon, label}) => (
        <span
          key={label}
          className="t-mono inline-flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-fg3"
        >
          <Icon
            size={13}
            strokeWidth={2.2}
            className="text-crimson-hi"
            aria-hidden
          />
          {label}
        </span>
      ))}
    </div>
  );
}
