import type {CSSProperties, ElementType, ReactNode} from 'react';

export type GlowIntensity = 'rest' | 'hover' | 'active';

/**
 * Signature glow-frame — the brand's marker of IMPORTANT, INTERACTIVE,
 * or SELECTED. Crimson hairline border + layered crimson-core →
 * oxblood box-shadow bloom + slightly elevated surface.
 *
 *   - intensity="rest"   barely-there: review cards, FAQ-row hover
 *   - intensity="hover"  the standard lift on hover/group-hover
 *   - intensity="active" the spotlight: the one important element
 *                       per viewport
 *
 * RESTRAINT RULE: never let more than 2–3 frames bloom at the same
 * time in one viewport. If everything glows, nothing does.
 *
 * Renders as a flex column by default. Pass `as` to override the
 * underlying element (button, article, etc.).
 */
export function GlowFrame({
  intensity = 'rest',
  as: Component = 'div' as ElementType,
  className = '',
  style,
  children,
  ...rest
}: {
  intensity?: GlowIntensity;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  [key: string]: unknown;
}) {
  const intensityClass =
    intensity === 'active'
      ? 'glow-frame-active'
      : intensity === 'hover'
        ? 'glow-frame-hover'
        : 'glow-frame-rest';
  return (
    <Component
      className={`glow-frame glow-frame-base ${intensityClass} ${className}`}
      style={style}
      {...rest}
    >
      {children}
    </Component>
  );
}
