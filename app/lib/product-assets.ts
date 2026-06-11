/**
 * Real product-photography asset resolver.
 *
 * Vite's `import.meta.glob` scans /app/assets/products/* at build time
 * and emits a map from absolute path → URL. Components ask for a
 * (gender, variant) pair and get back the URL of the matching asset,
 * or `null` if the file isn't there yet. The site degrades gracefully
 * to the CSS bottle mockup when nothing is found.
 *
 * Naming convention (mirrors the README in the assets folder):
 *
 *   <gender>-<variant>.{png|jpg|jpeg|webp}
 *
 *   gender   = "male" | "female" | "duo"
 *   variant  = "hero" | "cutout" | "rays" | "rock" | "smoke" |
 *              "capsules" | "tilt"
 *
 * Examples:
 *   getProductImage('male', 'hero')      → '/assets/male-hero.[hash].jpg'
 *   getProductImage('female', 'cutout')  → '/assets/female-cutout.[hash].png'
 */

export type Gender = 'male' | 'female' | 'duo';
export type Variant =
  | 'hero'
  | 'cutout'
  | 'rays'
  | 'rock'
  | 'smoke'
  | 'capsules'
  | 'tilt';

const ASSETS = import.meta.glob<{default: string}>(
  '../assets/products/*-*.{png,jpg,jpeg,webp}',
  {eager: true},
);

/**
 * URL of the asset for a given (gender, variant), or null if not found.
 * Picks the first matching file in the import.meta.glob index. The
 * underlying file extension is irrelevant — drop in whatever format
 * you have and the resolver finds it.
 */
export function getProductImage(
  gender: Gender,
  variant: Variant,
): string | null {
  const needle = `/${gender}-${variant}.`;
  for (const [path, mod] of Object.entries(ASSETS)) {
    if (path.toLowerCase().includes(needle)) {
      return (mod as {default: string}).default ?? null;
    }
  }
  return null;
}

/**
 * Pick the best image for the hero context. Prefers a transparent
 * cutout (the site composites the 3-layer glow behind it perfectly);
 * falls back to the hero shot which still gets the screen-blend
 * treatment from BlendedImage when rendered.
 */
export function getHeroImage(gender: Gender): {
  src: string | null;
  /** true when the asset is a transparent cutout — skip blend treatment. */
  isCutout: boolean;
} {
  const cutout = getProductImage(gender, 'cutout');
  if (cutout) return {src: cutout, isCutout: true};
  const hero = getProductImage(gender, 'hero');
  return {src: hero, isCutout: false};
}

/**
 * Build the gallery image set for a PDP. Returns the variants that
 * actually exist on disk, in display order. Each entry includes a
 * human-readable label for the thumbnail tooltip / aria-label.
 */
export interface GalleryEntry {
  variant: Variant;
  src: string;
  label: string;
}

const GALLERY_ORDER: ReadonlyArray<{variant: Variant; label: string}> = [
  {variant: 'hero', label: 'Bottle'},
  {variant: 'rays', label: 'In light'},
  {variant: 'rock', label: 'On set'},
  {variant: 'smoke', label: 'In atmosphere'},
  {variant: 'tilt', label: 'Tilt'},
  {variant: 'capsules', label: 'Texture'},
];

export function getGallery(gender: Gender): GalleryEntry[] {
  const result: GalleryEntry[] = [];
  for (const {variant, label} of GALLERY_ORDER) {
    const src = getProductImage(gender, variant);
    if (src) result.push({variant, src, label});
  }
  return result;
}

/** Cheap predicate — does any product asset exist at all? */
export function hasAnyProductImages(): boolean {
  return Object.keys(ASSETS).length > 0;
}
