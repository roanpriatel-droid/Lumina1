import type {CSSProperties} from 'react';
import {Image} from '@shopify/hydrogen';
import {BrandFallback} from '~/components/lumina/BrandFallback';

/**
 * Shared crimson glow pedestal behind every product image on the site
 * (catalog card, PDP gallery fallback, cross-sell, cart thumbnail, His
 * & Hers band, search results, etc.).
 *
 * The component does three jobs in one:
 *
 *   1. Renders the standard radial glow pedestal (CSS .glow-pedestal::
 *      before pulls var(--glow-hero) so the glow stays identical
 *      across the entire storefront).
 *
 *   2. Blends near-black photo backgrounds into the card surface. JPEGs
 *      out of Shopify ship with their own dark backdrop; without
 *      treatment they show a visible rectangle on every dark card.
 *      The image is rendered with mix-blend-mode: screen so any
 *      black-on-black gets dissolved into the surface.
 *
 *   3. Feathers any residual edge — even a perfectly screen-blended
 *      photo can have a slight gradient at the corners. A radial mask
 *      keeps the inner 85% fully opaque and fades the outer 15% to
 *      transparent.
 *
 * Detection / opt-out: PNG assets are assumed cutout (transparent
 * background) and rendered without the blend or mask so they sit on the
 * pedestal cleanly. Other formats (jpg/jpeg/webp/avif) get the full
 * treatment. Callers can override with `blend="never"` or `blend=
 * "always"`. A filename token of `cutout` also forces blend="never".
 */
export type BlendMode = 'screen' | 'lighten';
export type BlendStrategy = 'auto' | 'always' | 'never';

export interface GlowPedestalProps {
  imageUrl?: string | null;
  imageAlt?: string | null;
  fallbackTitle: string;
  /** CSS aspect-ratio string for the pedestal box. */
  aspect?: string;
  className?: string;
  /** Width of the bottle fallback when no image is provided. */
  bottleWidth?: number;
  sizes?: string;
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';
  imgWidth?: number;
  imgHeight?: number;
  /** Image height inside the pedestal (CSS percent). Uniform across
   *  cards so every card aligns visually. */
  imageHeightPct?: number;
  /** When/how to blend. `auto` (default) infers from the asset URL —
   *  blend JPEG/WEBP, skip PNG. */
  blend?: BlendStrategy;
  blendMode?: BlendMode;
  /** Inner radius (0–100) where the mask stays fully opaque before
   *  fading to transparent. Default 85 (= outer 15% feathered). */
  maskInner?: number;
}

export function GlowPedestal({
  imageUrl,
  imageAlt,
  fallbackTitle,
  aspect = '5/4',
  className = '',
  bottleWidth = 86,
  sizes = '(min-width: 768px) 25vw, 50vw',
  loading = 'lazy',
  fetchPriority,
  imgWidth,
  imgHeight,
  imageHeightPct = 72,
  blend = 'auto',
  blendMode = 'screen',
  maskInner = 85,
}: GlowPedestalProps) {
  const shouldBlend = resolveBlend(blend, imageUrl);
  const containerStyle: CSSProperties = {aspectRatio: aspect};

  const imageStyle: CSSProperties = {
    height: `${imageHeightPct}%`,
    width: 'auto',
    objectFit: 'contain',
    objectPosition: 'center center',
  };

  if (shouldBlend) {
    imageStyle.mixBlendMode = blendMode;
    const mask = `radial-gradient(closest-side at 50% 50%, #000 0%, #000 ${maskInner}%, transparent 100%)`;
    imageStyle.maskImage = mask;
    imageStyle.WebkitMaskImage = mask;
  }

  return (
    <div className={`glow-pedestal ${className}`} style={containerStyle}>
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={imageAlt ?? fallbackTitle}
          sizes={sizes}
          className="relative"
          style={imageStyle}
          loading={loading}
          width={imgWidth ?? 320}
          height={imgHeight ?? 320}
          {...(fetchPriority ? {fetchPriority} : {})}
        />
      ) : (
        <div
          className="relative flex items-center justify-center"
          style={{height: `${imageHeightPct}%`}}
        >
          <BrandFallback width={bottleWidth} caption={fallbackTitle} />
        </div>
      )}
    </div>
  );
}

/**
 * Decide whether to apply the blend treatment based on the URL.
 *
 *  - explicit "always" / "never" win.
 *  - a "cutout" token anywhere in the path → never blend (this is the
 *    opt-in marker for genuinely-transparent cutout assets).
 *  - everything else → blend.
 *
 * Why not auto-skip PNGs? Most product PNGs in the wild — including the
 * ones Shopify CDN serves today — are exported with a flat dark
 * background rather than a true alpha channel. The blend treatment
 * fixes those. When you later swap in real cutouts, name them with
 * `cutout` in the file path (e.g. `male-bottle-cutout.png`) to skip
 * the blend.
 */
export function resolveBlend(
  strategy: BlendStrategy,
  imageUrl?: string | null,
): boolean {
  if (strategy === 'always') return true;
  if (strategy === 'never') return false;
  if (!imageUrl) return false;
  const path = imageUrl.split('?')[0]?.toLowerCase() ?? '';
  if (path.includes('cutout')) return false;
  return true;
}
