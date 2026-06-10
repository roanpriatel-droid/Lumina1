import type {CSSProperties, ElementType, ReactNode} from 'react';

/**
 * Splits text into per-line masked spans so motion.textReveal() can
 * tween each line from yPercent: 100 → 0. SSR markup matches the
 * client exactly so hydration is stable.
 *
 * Pass `lines` as an array of strings. Use `as` to swap the wrapper
 * element (h1 by default).
 */
export function SplitLines({
  lines,
  as: As = 'h1',
  className = '',
  style,
}: {
  lines: ReadonlyArray<string | ReactNode>;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <As className={className} style={style}>
      {lines.map((line, i) => (
        <span
          key={i}
          className="line-mask"
          style={{
            display: 'block',
            overflow: 'hidden',
            lineHeight: 'inherit',
          }}
        >
          <span
            className="line-inner"
            style={{display: 'block', willChange: 'transform'}}
          >
            {line}
          </span>
        </span>
      ))}
    </As>
  );
}
