import {useEffect, useRef, useState} from 'react';
import {Image} from '@shopify/hydrogen';
import {BlendedImage} from '~/components/lumina/BlendedImage';
import {BrandFallback} from '~/components/lumina/BrandFallback';
import {LightRays} from '~/components/graphics/LightRays';
import {prefersReducedMotion} from '~/lib/motion';
import {
  getGallery,
  getHeroImage,
  getProductImage,
  type Gender,
  type GalleryEntry,
} from '~/lib/product-assets';

/**
 * Real-photography gallery for the hero PDPs.
 *
 * Reads the available variants for the gender via getGallery() and
 * builds:
 *   - a stacked main image area (every variant present at once, only
 *     the active one fully opaque — crossfades between variants
 *     compose on the GPU instead of swapping the DOM node)
 *   - a thumbnail rail down the left side, each thumb showing its own
 *     variant; active thumb carries the glow-frame treatment
 *   - a label strip below the main image with the active variant's
 *     short label ("Bottle", "In light", "Texture", ...)
 *
 * Falls back gracefully:
 *   - When no real photos are on disk: the imageUrl prop (typically
 *     the Shopify product image) renders as a single-frame gallery.
 *   - When even that's missing: the CSS Bottle mockup.
 *
 * A reserved aspect-ratio box prevents CLS while the assets stream
 * in. All transitions are opacity + transform only.
 */
export interface PdpGalleryProps {
  gender: Gender;
  /** Fallback (typically the Shopify product image) used when no
   *  real photography is present on disk yet. */
  fallbackImageUrl?: string | null;
  fallbackImageAlt?: string | null;
  /** Used for alt text and the title attribute on thumbnails. */
  productTitle: string;
}

export function PdpGallery({
  gender,
  fallbackImageUrl,
  fallbackImageAlt,
  productTitle,
}: PdpGalleryProps) {
  const realGallery = getGallery(gender);
  const [activeIndex, setActiveIndex] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);

  // Pick a stable thumb representation for the cutout / hero variant
  // used in the sticky-bar via getStickyThumb(); not needed here but
  // co-resident with the rest of the asset wiring.

  // Lock the active index to the available range — defensive in case
  // the gallery list changes between renders (it shouldn't in practice).
  useEffect(() => {
    if (activeIndex >= realGallery.length && realGallery.length > 0) {
      setActiveIndex(0);
    }
  }, [activeIndex, realGallery.length]);

  const useRealGallery = realGallery.length > 0;

  return (
    <div className="pdp-gallery flex gap-5">
      {/* Thumbnail rail */}
      <div className="flex flex-col gap-3 pt-2">
        {useRealGallery
          ? realGallery.map((entry, i) => (
              <ThumbnailButton
                key={entry.variant}
                entry={entry}
                productTitle={productTitle}
                active={activeIndex === i}
                onClick={() => setActiveIndex(i)}
              />
            ))
          : PLACEHOLDER_THUMBS.map((t, i) => (
              <PlaceholderThumb
                key={t}
                label={t}
                active={activeIndex === i}
                onClick={() => setActiveIndex(i)}
              />
            ))}
      </div>

      {/* Stage */}
      <div
        ref={stageRef}
        className="relative flex flex-1 items-center justify-center overflow-hidden rounded-xl border border-border bg-surface"
        style={{
          minHeight: 460,
          // Reserved aspect-ratio so the box doesn't shift while the
          // photo streams in.
          aspectRatio: '4 / 5',
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70"
        >
          <LightRays origin="top" intensity={0.45} />
        </div>

        {/* Real photo set — all images mounted, opacity-only crossfade
            between them with a subtle scale on the active one. */}
        {useRealGallery
          ? realGallery.map((entry, i) => (
              <GalleryFrame
                key={entry.variant}
                entry={entry}
                active={activeIndex === i}
                productTitle={productTitle}
                priority={i === 0}
              />
            ))
          : fallbackImageUrl ? (
              <BlendedImage
                src={fallbackImageUrl}
                sizes="(min-width: 768px) 50vw, 100vw"
                className="relative h-auto w-full max-w-[260px] object-contain"
                alt={fallbackImageAlt || productTitle}
                width={520}
                height={693}
                loading="eager"
                fetchPriority="high"
              />
            ) : (
              <BrandFallback width={170} caption={productTitle} />
            )}

        <span className="t-mono absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] uppercase tracking-[0.14em] text-fg4">
          {useRealGallery
            ? realGallery[activeIndex]?.label
            : fallbackImageUrl
              ? PLACEHOLDER_THUMBS[activeIndex] ?? 'Bottle'
              : `Product photography placeholder · ${
                  PLACEHOLDER_THUMBS[activeIndex] ?? 'Bottle'
                }`}
        </span>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */

function GalleryFrame({
  entry,
  active,
  productTitle,
  priority,
}: {
  entry: GalleryEntry;
  active: boolean;
  productTitle: string;
  priority: boolean;
}) {
  // Cutouts get rendered with no blend (transparent already); other
  // variants run through BlendedImage for the screen + radial mask.
  const isCutout = entry.variant === 'cutout';
  const reduced = prefersReducedMotion();
  const baseTransition = reduced
    ? 'none'
    : 'opacity 500ms cubic-bezier(0.4, 0, 0.2, 1), transform 700ms cubic-bezier(0.4, 0, 0.2, 1)';
  const style: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: active ? 1 : 0,
    transform: active ? 'scale(1)' : 'scale(1.04)',
    pointerEvents: active ? 'auto' : 'none',
    transition: baseTransition,
    willChange: active ? 'opacity, transform' : 'auto',
  };
  return (
    <div style={style} aria-hidden={!active}>
      {isCutout ? (
        <Image
          src={entry.src}
          sizes="(min-width: 768px) 50vw, 100vw"
          className="relative h-auto w-full max-w-[280px] object-contain"
          alt={`${productTitle} · ${entry.label}`}
          width={560}
          height={748}
          loading={priority ? 'eager' : 'lazy'}
          {...(priority ? {fetchPriority: 'high' as const} : {})}
        />
      ) : (
        <BlendedImage
          src={entry.src}
          sizes="(min-width: 768px) 50vw, 100vw"
          className="relative h-auto w-full max-w-[280px] object-contain"
          alt={`${productTitle} · ${entry.label}`}
          width={560}
          height={748}
          loading={priority ? 'eager' : 'lazy'}
          {...(priority ? {fetchPriority: 'high' as const} : {})}
        />
      )}
    </div>
  );
}

function ThumbnailButton({
  entry,
  productTitle,
  active,
  onClick,
}: {
  entry: GalleryEntry;
  productTitle: string;
  active: boolean;
  onClick: () => void;
}) {
  const isCutout = entry.variant === 'cutout';
  return (
    <button
      type="button"
      onClick={onClick}
      title={entry.label}
      aria-label={`View ${entry.label}`}
      aria-pressed={active}
      className={`${
        active
          ? 'glow-frame glow-frame-base glow-frame-rest'
          : 'border border-border bg-surface hover:border-border-strong'
      } relative flex h-[62px] w-[62px] items-center justify-center overflow-hidden rounded-sm transition-colors`}
    >
      <div
        aria-hidden
        className="absolute inset-0 rounded-sm"
        style={{background: 'var(--glow-hero)', opacity: 0.5}}
      />
      {isCutout ? (
        <Image
          src={entry.src}
          alt={`${productTitle} thumbnail`}
          width={124}
          height={124}
          loading="lazy"
          className="relative h-[80%] w-auto object-contain"
        />
      ) : (
        <BlendedImage
          src={entry.src}
          alt={`${productTitle} thumbnail`}
          width={124}
          height={124}
          loading="lazy"
          className="relative h-[80%] w-auto object-cover"
        />
      )}
    </button>
  );
}

function PlaceholderThumb({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={`View ${label}`}
      aria-pressed={active}
      className={`${
        active
          ? 'glow-frame glow-frame-base glow-frame-rest'
          : 'border border-border bg-surface'
      } relative flex h-[62px] w-[62px] items-center justify-center overflow-hidden rounded-sm`}
    >
      <div
        aria-hidden
        className="absolute inset-0 rounded-sm"
        style={{background: 'var(--glow-hero)', opacity: 0.5}}
      />
      <div
        aria-hidden
        style={{
          width: 12,
          height: 30,
          borderRadius: 3,
          background: 'linear-gradient(180deg,#232327,#0d0d0f)',
          border: '1px solid var(--color-border-strong)',
          position: 'relative',
        }}
      />
    </button>
  );
}

const PLACEHOLDER_THUMBS = ['Bottle', 'Supplement facts', 'In hand', 'Texture'];

/**
 * Sticky-bar thumbnail asset: prefer the cutout, fall back to hero
 * (still with blend treatment via the consumer), then null. The
 * StickyAddToCart component reads this directly.
 */
export function getStickyThumb(gender: Gender): {
  src: string | null;
  isCutout: boolean;
} {
  const cutout = getProductImage(gender, 'cutout');
  if (cutout) return {src: cutout, isCutout: true};
  return getHeroImage(gender);
}
