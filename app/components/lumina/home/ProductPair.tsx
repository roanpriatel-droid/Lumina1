import {Link} from 'react-router';
import {useState} from 'react';
import {Image} from '@shopify/hydrogen';
import {ArrowRight} from 'lucide-react';
import {BrandFallback} from '~/components/lumina/BrandFallback';
import {BlendedImage} from '~/components/lumina/BlendedImage';
import {Eyebrow} from '~/components/lumina/Eyebrow';
import {
  LUMINA_PRODUCTS,
  LUMINA_PRICE_FROM,
  type LuminaProduct,
} from '~/lib/lumina-data';
import {getHeroImage, getProductImage} from '~/lib/product-assets';

export function ProductPair() {
  return (
    <section className="mx-auto max-w-[1100px] px-6 pb-[110px] pt-10 md:px-10">
      <div className="mb-14 text-center">
        <Eyebrow className="mb-4">Two formulas, one standard</Eyebrow>
        <h2
          className="m-0 text-fg1"
          style={{
            font: '300 clamp(30px,3.4vw,44px)/1.1 var(--font-sans)',
            letterSpacing: '-0.01em',
          }}
        >
          Made as a matched pair
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
        <ProductCard product={LUMINA_PRODUCTS.male} priceFrom={LUMINA_PRICE_FROM} />
        <ProductCard product={LUMINA_PRODUCTS.female} priceFrom={LUMINA_PRICE_FROM} />
      </div>
    </section>
  );
}

function ProductCard({
  product,
  priceFrom,
}: {
  product: LuminaProduct;
  priceFrom: number;
}) {
  const [hover, setHover] = useState(false);
  return (
    <Link
      // TODO(shopify-wiring): once the real product handles exist in Shopify,
      // these already resolve to the real PDP. Until then they 404 on the
      // live storefront — the link still renders for hover/visual fidelity.
      to={`/products/${product.handle}`}
      prefetch="intent"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="relative flex flex-col items-center overflow-hidden rounded-xl border bg-surface px-10 pb-10 pt-[52px] no-underline transition-[border-color,transform] duration-[250ms] ease-out"
      style={{
        borderColor: hover ? 'var(--color-hairline-2)' : 'var(--color-border)',
        transform: hover ? 'translateY(-4px)' : 'none',
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute transition-opacity duration-300"
        style={{
          width: 460,
          height: 460,
          left: '50%',
          top: 120,
          transform: 'translateX(-50%)',
          background: 'var(--glow-hero)',
          opacity: hover ? 1 : 0.55,
        }}
      />
      <div className="relative z-[2] flex flex-col items-center text-center">
        <PairCardBottle gender={product.key} alt={product.name} />
        <h3
          className="m-0 mt-[34px] text-fg1"
          style={{font: '300 26px/1.2 var(--font-sans)'}}
        >
          {product.name}
          <sup className="text-[11px] text-fg3">™</sup>
        </h3>
        <p
          className="m-0 mt-3 max-w-[300px] text-fg3"
          style={{font: '400 15px/1.5 var(--font-sans)'}}
        >
          {product.benefit}
        </p>
        <div className="mt-[22px] flex items-baseline gap-2">
          <span className="text-xs uppercase tracking-[0.14em] text-fg4">
            From
          </span>
          <span
            className="text-fg1"
            style={{font: '300 28px/1 var(--font-sans)'}}
          >
            ${priceFrom}
          </span>
          <span className="t-mono text-[13px] text-fg3">/ mo</span>
        </div>
        <span
          className="mt-[22px] inline-flex items-center gap-2 whitespace-nowrap text-[13px] font-medium tracking-[0.04em] transition-colors duration-200"
          style={{color: hover ? 'var(--color-crimson-hi)' : 'var(--color-fg2)'}}
        >
          Explore formula
          <ArrowRight size={15} strokeWidth={2} />
        </span>
      </div>
    </Link>
  );
}

function PairCardBottle({
  gender,
  alt,
}: {
  gender: 'male' | 'female';
  alt: string;
}) {
  const cutout = getProductImage(gender, 'cutout');
  if (cutout) {
    return (
      <Image
        src={cutout}
        alt={alt}
        sizes="(min-width: 768px) 240px, 50vw"
        className="relative h-auto w-[140px] max-w-full object-contain md:w-[160px]"
        loading="lazy"
        width={320}
        height={320}
      />
    );
  }
  const hero = getHeroImage(gender);
  if (hero.src) {
    return (
      <BlendedImage
        src={hero.src}
        alt={alt}
        sizes="(min-width: 768px) 240px, 50vw"
        className="relative h-auto w-[140px] max-w-full object-contain md:w-[160px]"
        loading="lazy"
        width={320}
        height={320}
      />
    );
  }
  return <BrandFallback width={104} />;
}
