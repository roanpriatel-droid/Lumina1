import {type CSSProperties} from 'react';

interface BrandFallbackProps {
  /** Display width of the mark in px. Drives proportional sizing of
   *  the glow halo and the optional caption type. */
  width?: number;
  /** Optional short caption beneath the mark (e.g. "Lumina Male").
   *  Useful when the fallback stands in for a specific product. */
  caption?: string;
  /** Glow tint. Defaults to brand crimson; oxblood is reserved for
   *  the "coming soon" treatment. */
  accent?: 'crimson' | 'oxblood';
  className?: string;
  style?: CSSProperties;
}

/**
 * Branded empty state — the customer-facing replacement for the legacy
 * CSS Bottle mockup.
 *
 * Renders a soft crimson halo and the Lumina "L + ignition dot" mark
 * (same letterform as the favicon) instead of a fake bottle. Used in
 * every conditional fallback path (ProductVisual / GlowPedestal /
 * PdpGallery / cross-sells / pair cards) and in the legitimately
 * imageless contexts (Coming Soon products).
 *
 * No customer-facing surface should render <Bottle/> anymore.
 */
export function BrandFallback({
  width = 120,
  caption,
  accent = 'crimson',
  className = '',
  style,
}: BrandFallbackProps) {
  const markSize = Math.round(width * 0.62);
  return (
    <div
      aria-hidden
      className={`relative flex flex-col items-center justify-center ${className}`}
      style={{width, ...style}}
    >
      {/* Soft halo behind the mark. Fully feathered to transparent so it
          dissolves into whatever surface the fallback is placed on. */}
      <div
        className="pointer-events-none absolute"
        style={{
          width: width * 2.1,
          height: width * 2.1,
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          background:
            accent === 'crimson'
              ? 'radial-gradient(closest-side, rgba(209,26,42,0.32) 0%, rgba(110,11,20,0.16) 38%, rgba(58,6,12,0.06) 65%, rgba(11,11,12,0) 100%)'
              : 'radial-gradient(closest-side, rgba(110,11,20,0.42) 0%, rgba(58,6,12,0.22) 42%, rgba(11,11,12,0) 72%)',
          filter: 'blur(14px)',
        }}
      />

      {/* The mark — bold "L" + crimson ignition dot, same proportions
          as the favicon. SVG so it stays crisp at any size. */}
      <svg
        viewBox="0 0 100 100"
        style={{
          width: markSize,
          height: markSize,
          position: 'relative',
          opacity: 0.92,
        }}
      >
        <path
          d="M28 18 L40 18 L40 70 L74 70 L74 82 L28 82 Z"
          fill="rgba(245, 241, 234, 0.86)"
        />
        <circle cx="82" cy="76" r="4" fill="#D11A2A" />
      </svg>

      {caption && (
        <span
          className="t-mono relative mt-3 uppercase tracking-[0.22em] text-fg4"
          style={{
            fontSize: Math.max(9, Math.round(width * 0.075)),
            opacity: 0.55,
          }}
        >
          {caption}
        </span>
      )}
    </div>
  );
}
