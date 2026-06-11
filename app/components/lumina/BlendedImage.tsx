import type {CSSProperties} from 'react';
import {Image} from '@shopify/hydrogen';
import {
  resolveBlend,
  type BlendMode,
  type BlendStrategy,
} from '~/components/lumina/GlowPedestal';

/**
 * Lightweight, no-pedestal counterpart to GlowPedestal — for places
 * where a product image needs the same blend + mask treatment but the
 * surrounding card already provides its own background (cart line-item
 * thumbnails, search-result rows, His & Hers tiles).
 *
 * Mirrors GlowPedestal's blend strategy so behavior is consistent
 * sitewide:
 *  - JPEG / WEBP / unknown → mix-blend-mode: screen + radial mask
 *  - PNG or "cutout" token → render normally (transparent assets sit
 *    cleanly on any surface)
 *  - explicit blend="always" / "never" win
 */
export interface BlendedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes?: string;
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';
  className?: string;
  style?: CSSProperties;
  blend?: BlendStrategy;
  blendMode?: BlendMode;
  /** Mask radius percent where the image stays fully opaque before the
   *  outer feather. Default 85 (= outer 15% to transparent). */
  maskInner?: number;
}

export function BlendedImage({
  src,
  alt,
  width,
  height,
  sizes,
  loading = 'lazy',
  fetchPriority,
  className = '',
  style,
  blend = 'auto',
  blendMode = 'screen',
  maskInner = 85,
}: BlendedImageProps) {
  const shouldBlend = resolveBlend(blend, src);
  const composed: CSSProperties = {...style};
  if (shouldBlend) {
    composed.mixBlendMode = blendMode;
    const mask = `radial-gradient(closest-side at 50% 50%, #000 0%, #000 ${maskInner}%, transparent 100%)`;
    composed.maskImage = mask;
    composed.WebkitMaskImage = mask;
  }
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      loading={loading}
      className={className}
      style={composed}
      {...(fetchPriority ? {fetchPriority} : {})}
    />
  );
}
