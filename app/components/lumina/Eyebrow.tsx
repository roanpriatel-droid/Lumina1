import type {CSSProperties, ReactNode} from 'react';

interface EyebrowProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** When false, drops the leading hairline rule (use when the kicker
   *  appears inside a tight inline context, e.g. table headers). */
  rule?: boolean;
}

/**
 * Kicker label. Per the design system:
 *   - 0.7rem IBM Plex Mono
 *   - letter-spacing 0.25em
 *   - crimson by default
 *   - a 24px hairline rule extends left of the text (kill it with rule={false})
 */
export function Eyebrow({
  children,
  className = '',
  style,
  rule = true,
}: EyebrowProps) {
  return (
    <span
      className={`eyebrow inline-flex items-center gap-3 ${className}`}
      style={style}
    >
      {rule && (
        <span
          aria-hidden
          className="eyebrow-rule"
        />
      )}
      <span>{children}</span>
    </span>
  );
}
