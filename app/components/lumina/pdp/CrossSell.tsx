import {Link, useRouteLoaderData} from 'react-router';
import {Image} from '@shopify/hydrogen';
import {ArrowUpRight} from 'lucide-react';
import {BrandFallback} from '~/components/lumina/BrandFallback';
import {BlendedImage} from '~/components/lumina/BlendedImage';
import {Eyebrow} from '~/components/lumina/Eyebrow';
import {LUMINA_PRODUCTS} from '~/lib/lumina-data';
import type {LuminaProductKey} from '~/lib/lumina-data';
import {getHeroImage, getProductImage} from '~/lib/product-assets';
import {lowestPerBottlePrice} from '~/lib/savings';
import type {RootLoader} from '~/root';

export function CrossSell({currentKey}: {currentKey: LuminaProductKey}) {
  const otherKey: LuminaProductKey = currentKey === 'male' ? 'female' : 'male';
  const other = LUMINA_PRODUCTS[otherKey];
  const rootData = useRouteLoaderData<RootLoader>('root');
  const priceFrom = lowestPerBottlePrice(rootData?.luminaCatalog ?? []);

  return (
    <section className="border-t border-border bg-surface">
      <div className="mx-auto max-w-[1200px] px-6 py-20 md:px-8">
        <Eyebrow className="mb-4">Pair it</Eyebrow>
        <h2
          className="m-0 mb-12 max-w-[760px] text-fg1"
          style={{
            font: '300 38px/1.1 var(--font-sans)',
            letterSpacing: '-0.01em',
          }}
        >
          The other half of the protocol.
        </h2>

        <div className="grid gap-5 md:grid-cols-2">
          <Link
            to={`/products/${other.handle}`}
            prefetch="intent"
            className="group relative flex gap-6 overflow-hidden rounded-xl border border-border bg-black px-6 py-7 transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-border-strong md:px-8 md:py-8"
          >
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background: 'var(--glow-hero)',
                opacity: 0.18,
              }}
            />
            <div className="relative flex h-32 w-20 flex-none items-center justify-center">
              <CrossSellBottle gender={otherKey} alt={other.name} />
            </div>
            <div className="relative flex flex-1 flex-col gap-2">
              <Eyebrow>The other formula</Eyebrow>
              <h3 className="m-0 text-[20px] font-medium leading-snug text-fg1">
                {other.name}
                <sup className="text-[10px] text-fg3">™</sup>
              </h3>
              <p
                className="m-0 max-w-[420px] text-fg3"
                style={{font: '400 14.5px/1.55 var(--font-sans)'}}
              >
                {other.benefit}
              </p>
              <span className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-crimson-hi">
                View formula <ArrowUpRight size={14} strokeWidth={2} />
              </span>
            </div>
          </Link>

          <Link
            to="/pages/subscriptions"
            prefetch="intent"
            className="group relative flex gap-6 overflow-hidden rounded-xl border border-crimson bg-black px-6 py-7 transition-transform duration-200 hover:-translate-y-0.5 md:px-8 md:py-8"
            style={{boxShadow: 'var(--shadow-accent)'}}
          >
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(ellipse at top right, rgba(209,26,42,0.25), rgba(11,11,12,0) 60%)',
              }}
            />
            <div className="relative flex flex-1 flex-col gap-2">
              <Eyebrow style={{color: 'var(--color-crimson-hi)'}}>
                His &amp; Hers Duo
              </Eyebrow>
              <h3 className="m-0 text-[20px] font-medium leading-snug text-fg1">
                Run them together, save more.
              </h3>
              <p
                className="m-0 max-w-[420px] text-fg3"
                style={{font: '400 14.5px/1.55 var(--font-sans)'}}
              >
                Stack the male and female formulas on subscription — pause,
                skip, or cancel from your account anytime
                {priceFrom !== null
                  ? `. From $${priceFrom} per bottle.`
                  : '.'}
              </p>
              <span className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-crimson-hi">
                See how subscriptions work{' '}
                <ArrowUpRight size={14} strokeWidth={2} />
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}

function CrossSellBottle({
  gender,
  alt,
}: {
  gender: LuminaProductKey;
  alt: string;
}) {
  const cutout = getProductImage(gender, 'cutout');
  if (cutout) {
    return (
      <Image
        src={cutout}
        alt={alt}
        sizes="100px"
        className="relative h-full w-auto object-contain"
        loading="lazy"
        width={140}
        height={186}
      />
    );
  }
  const hero = getHeroImage(gender);
  if (hero.src) {
    return (
      <BlendedImage
        src={hero.src}
        alt={alt}
        sizes="100px"
        className="relative h-full w-auto object-contain"
        loading="lazy"
        width={140}
        height={186}
      />
    );
  }
  return <BrandFallback width={70} />;
}
