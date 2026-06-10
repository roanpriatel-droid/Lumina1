import {Image} from '@shopify/hydrogen';
import {Bottle} from '~/components/lumina/Bottle';

/**
 * Shared crimson glow pedestal behind every product image on the site.
 * Pulls the radial-gradient from CSS (.glow-pedestal::before) so the
 * exact glow stays consistent — catalog card, PDP hero, cross-sell, cart
 * thumbnail, His & Hers band.
 *
 * Image is lazy-loaded by default and slots into a fixed aspect-ratio
 * container so there is no layout shift while the asset streams in.
 */
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
}: {
  imageUrl?: string | null;
  imageAlt?: string | null;
  fallbackTitle: string;
  aspect?: string;
  className?: string;
  bottleWidth?: number;
  sizes?: string;
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';
  imgWidth?: number;
  imgHeight?: number;
}) {
  const style: React.CSSProperties = {aspectRatio: aspect};
  return (
    <div className={`glow-pedestal ${className}`} style={style}>
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={imageAlt ?? fallbackTitle}
          sizes={sizes}
          className="relative h-[72%] w-auto object-contain"
          loading={loading}
          width={imgWidth ?? 320}
          height={imgHeight ?? 320}
          {...(fetchPriority ? {fetchPriority} : {})}
        />
      ) : (
        <div className="relative">
          <Bottle width={bottleWidth} />
        </div>
      )}
    </div>
  );
}
