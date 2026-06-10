import {useState} from 'react';
import {Image} from '@shopify/hydrogen';
import {FlaskConical, ShieldCheck, MapPin, Sprout} from 'lucide-react';
import type {LucideIcon} from 'lucide-react';
import {Bottle} from '~/components/lumina/Bottle';
import {Eyebrow} from '~/components/lumina/Eyebrow';
import {StarRating} from '~/components/lumina/StarRating';
import type {LuminaProduct} from '~/lib/lumina-data';

interface PdpHeroProps {
  title: string;
  lumina: LuminaProduct | undefined;
  imageUrl?: string | null;
  imageAlt?: string | null;
}

const TRUST: ReadonlyArray<{Icon: LucideIcon; label: string}> = [
  {Icon: FlaskConical, label: 'Clinically-Studied Ingredients'},
  {Icon: ShieldCheck, label: 'Third-Party Tested Every Lot'},
  {Icon: MapPin, label: 'Made in USA'},
  {Icon: Sprout, label: 'Non-GMO'},
];

export function PdpHero({title, lumina, imageUrl, imageAlt}: PdpHeroProps) {
  const [activeThumb, setActiveThumb] = useState(0);
  const thumbs = ['Bottle', 'Supplement facts', 'In hand', 'Texture'];
  const tagline = lumina?.tagline ?? 'Daily vitality formula';
  const blurb = lumina?.blurb;
  const rating = lumina?.rating ?? 4.8;
  const reviews = lumina?.reviews ?? 0;

  return (
    <section className="mx-auto grid max-w-[1200px] items-center gap-12 px-6 pb-10 pt-14 md:grid-cols-[1.05fr_0.95fr] md:px-8 md:pt-20">
      {/* Gallery */}
      <div className="flex gap-5">
        <div className="flex flex-col gap-3 pt-2">
          {thumbs.map((t, i) => (
            <button
              key={t}
              type="button"
              onClick={() => setActiveThumb(i)}
              title={t}
              className="relative flex h-[62px] w-[62px] items-center justify-center overflow-hidden rounded-sm bg-surface transition-[border-color] duration-150"
              style={{
                border: `1px solid ${
                  activeThumb === i
                    ? 'var(--color-crimson)'
                    : 'var(--color-border)'
                }`,
                boxShadow:
                  activeThumb === i
                    ? '0 0 0 1px var(--color-crimson)'
                    : 'none',
              }}
              aria-label={`View ${t}`}
              aria-pressed={activeThumb === i}
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
          ))}
        </div>
        <div
          className="relative flex flex-1 items-center justify-center overflow-hidden rounded-xl border border-border bg-surface"
          style={{minHeight: 460}}
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              aspectRatio="3/4"
              sizes="(min-width: 768px) 50vw, 100vw"
              className="h-auto w-full max-w-[260px] object-contain"
              alt={imageAlt || title}
              width={520}
              height={693}
            />
          ) : (
            <Bottle width={150} />
          )}
          <span
            className="t-mono absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] uppercase tracking-[0.14em] text-fg4"
          >
            {imageUrl
              ? thumbs[activeThumb]
              : `Product photography placeholder · ${thumbs[activeThumb]}`}
          </span>
        </div>
      </div>

      {/* Summary */}
      <div className="flex flex-col gap-5">
        <Eyebrow>{tagline}</Eyebrow>
        <h1
          className="m-0 text-fg1"
          style={{
            font: '300 clamp(34px,3.4vw,48px)/1.05 var(--font-sans)',
            letterSpacing: '-0.01em',
          }}
        >
          {title}
          {lumina && (
            <sup
              className="text-fg3"
              style={{
                font: '300 0.34em/1 var(--font-sans)',
                verticalAlign: 'super',
                marginLeft: 4,
              }}
            >
              ™
            </sup>
          )}
        </h1>
        <div className="flex flex-wrap items-center gap-3">
          <StarRating size={17} label={`${rating} of 5 stars`} />
          <span className="text-sm font-medium text-fg1">
            {rating.toFixed(1)}
          </span>
          {reviews > 0 && (
            <span className="text-sm text-fg3">
              · {reviews.toLocaleString()} verified reviews
            </span>
          )}
        </div>
        {blurb && (
          <p
            className="m-0 max-w-[460px] text-fg2"
            style={{font: '300 18px/1.6 var(--font-sans)'}}
          >
            {blurb}
          </p>
        )}
        <div className="mt-1 flex flex-wrap gap-2.5">
          {TRUST.map(({Icon, label}) => (
            <div
              key={label}
              className="inline-flex items-center gap-2 rounded-pill border border-border bg-surface px-3.5 py-2.5"
            >
              <Icon size={15} strokeWidth={2} className="text-crimson" />
              <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-fg2">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
