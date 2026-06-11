import {Link} from 'react-router';
import {ArrowUpRight} from 'lucide-react';
import {Eyebrow} from '~/components/lumina/Eyebrow';
import {Bottle} from '~/components/lumina/Bottle';
import {LUMINA_PRICE_FROM, LUMINA_PRODUCTS} from '~/lib/lumina-data';

interface PageCtaProps {
  eyebrow?: string;
  title?: string;
  body?: string;
}

/**
 * The crimson dual-product CTA pinned to the bottom of every trust/support
 * page. Mirrors brand voice — confident, specific, no urgency theatrics.
 */
export function PageCta({
  eyebrow = 'Ready when you are',
  title = 'Two daily formulas. Built honestly. Tested every lot.',
  body = `Run them one at a time, or together as a duo. Subscribe and save 15%. Free shipping, pause or cancel anytime. From $${LUMINA_PRICE_FROM} a bottle.`,
}: PageCtaProps) {
  const male = LUMINA_PRODUCTS.male;
  const female = LUMINA_PRODUCTS.female;
  return (
    <section className="relative overflow-hidden border-t border-border bg-black">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 100%, rgba(209,26,42,0.22), rgba(11,11,12,0) 60%)',
        }}
      />
      <div className="relative mx-auto max-w-[1200px] px-6 py-20 md:px-8 md:py-24">
        <div className="mb-12 flex flex-col items-center text-center">
          <Eyebrow style={{color: 'var(--color-crimson-hi)'}}>{eyebrow}</Eyebrow>
          <h2
            className="m-0 mt-5 max-w-[760px] text-fg1"
            style={{
              font: '300 clamp(34px, 4vw, 44px)/1.1 var(--font-sans)',
              letterSpacing: '-0.01em',
            }}
          >
            {title}
          </h2>
          <p
            className="m-0 mt-5 max-w-[640px] text-fg2"
            style={{font: '300 17px/1.65 var(--font-sans)'}}
          >
            {body}
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <PdpCard product={male} accent="ranked" />
          <PdpCard product={female} accent="ranked" />
        </div>
      </div>
    </section>
  );
}

function PdpCard({
  product,
  accent = 'ranked',
}: {
  product: (typeof LUMINA_PRODUCTS)[keyof typeof LUMINA_PRODUCTS];
  accent?: 'ranked' | 'flat';
}) {
  return (
    <Link
      to={`/products/${product.handle}`}
      prefetch="intent"
      className="glow-frame glow-frame-base glow-frame-active group relative flex gap-5 overflow-hidden rounded-xl px-6 py-7 md:px-8 md:py-8"
    >
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(closest-side at 0% 50%, rgba(209,26,42,0.22), rgba(11,11,12,0) 60%)',
        }}
      />
      <div className="relative flex h-28 w-16 flex-none items-center justify-center">
        <Bottle width={56} />
      </div>
      <div className="relative flex flex-1 flex-col gap-2">
        <Eyebrow style={{color: 'var(--color-crimson-hi)'}}>
          {product.tagline}
        </Eyebrow>
        <h3 className="m-0 text-[20px] font-medium leading-snug text-fg1">
          {product.name}
          <sup className="text-[10px] text-fg3">™</sup>
        </h3>
        <p
          className="m-0 max-w-[420px] text-fg3"
          style={{font: '400 14.5px/1.55 var(--font-sans)'}}
        >
          {product.benefit}
        </p>
        <span className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-crimson-hi">
          Shop the formula <ArrowUpRight size={14} strokeWidth={2} />
        </span>
      </div>
    </Link>
  );
}
