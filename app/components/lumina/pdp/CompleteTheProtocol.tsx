import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import {ArrowUpRight, Crown} from 'lucide-react';
import {Eyebrow} from '~/components/lumina/Eyebrow';
import {BrandFallback} from '~/components/lumina/BrandFallback';
import {BlendedImage} from '~/components/lumina/BlendedImage';
import {getProductImage, getHeroImage} from '~/lib/product-assets';
import {
  computeSavings,
  entriesForGender,
  findBaseline,
  money,
  moneyCents,
  type Gender,
  type LuminaProductEntry,
} from '~/lib/savings';

/**
 * "Complete the Protocol" cross-sell band, computed from the live catalog
 * and the current product. Renders two cards:
 *
 *   1. Opposite-gender formula (His & Hers cross-sell). When viewing the
 *      male formula, shows the female hero, and vice versa.
 *
 *   2. Next-tier-up upgrade row — calculates how much more you save by
 *      stepping up from the current supply length to the next one. Hidden
 *      when the current product is already the 12-month max.
 *
 * Both savings numbers come from the live storefront prices via the
 * savings engine — never hardcoded.
 */
export function CompleteTheProtocol({
  entries,
  currentHandle,
  currentGender,
}: {
  entries: LuminaProductEntry[];
  currentHandle: string;
  currentGender: Gender;
}) {
  const oppositeGender: Gender =
    currentGender === 'male' ? 'female' : 'male';
  const oppositeBaseline = findBaseline(entries, oppositeGender);

  const sameGenderEntries = entriesForGender(entries, currentGender);
  const sameGenderBaseline = findBaseline(entries, currentGender);
  const currentEntry = sameGenderEntries.find(
    (e) => e.handle === currentHandle,
  );

  // Find the next supply step up the ladder, if any.
  const sortedAvailable = sameGenderEntries
    .filter((e) => e.availableForSale || e.variantId)
    .sort((a, b) => a.months - b.months);
  const upgradeEntry = currentEntry
    ? sortedAvailable.find((e) => e.months > currentEntry.months) ?? null
    : null;

  return (
    <section className="border-t border-border bg-surface">
      <div className="mx-auto max-w-[1200px] px-6 py-20 md:px-8">
        <Eyebrow className="mb-4">Complete the protocol</Eyebrow>
        <h2
          className="m-0 mb-12 max-w-[760px] text-fg1"
          style={{
            font: '300 38px/1.1 var(--font-sans)',
            letterSpacing: '-0.01em',
          }}
        >
          Two ways to make the formula go further.
        </h2>
        <div className="grid gap-5 md:grid-cols-2">
          {oppositeBaseline && (
            <OppositeFormulaCard
              opposite={oppositeBaseline}
              currentGender={currentGender}
            />
          )}
          {upgradeEntry && sameGenderBaseline && currentEntry && (
            <UpgradeCard
              from={currentEntry}
              to={upgradeEntry}
              baseline={sameGenderBaseline}
            />
          )}
        </div>
      </div>
    </section>
  );
}

function OppositeFormulaCard({
  opposite,
  currentGender,
}: {
  opposite: LuminaProductEntry;
  currentGender: Gender;
}) {
  const partner = currentGender === 'male' ? 'Lumina Female' : 'Lumina Male';
  return (
    <Link
      to={`/products/${opposite.handle}`}
      prefetch="intent"
      className="group relative flex gap-6 overflow-hidden rounded-xl border border-border bg-black px-6 py-7 transition-[transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-border-strong md:px-8 md:py-8"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{background: 'var(--glow-hero)', opacity: 0.22}}
      />
      <div className="glow-pedestal relative flex h-32 w-20 flex-none items-center justify-center overflow-hidden rounded-md">
        <OppositeBottle opposite={opposite} />
      </div>
      <div className="relative flex flex-1 flex-col gap-2">
        <Eyebrow>For the other half</Eyebrow>
        <h3 className="m-0 text-[20px] font-medium leading-snug text-fg1">
          {partner} Enhancement<sup className="text-[10px] text-fg3">™</sup>
        </h3>
        <p
          className="m-0 max-w-[420px] text-fg3"
          style={{font: '400 14.5px/1.55 var(--font-sans)'}}
        >
          The same standard — disclosed doses, third-party tested every lot
          — engineered for the {currentGender === 'male' ? 'female' : 'male'}{' '}
          body. Starts at {moneyCents(opposite.price)}.
        </p>
        <span className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-crimson-hi">
          View the {currentGender === 'male' ? 'female' : 'male'} formula
          <ArrowUpRight size={14} strokeWidth={2} />
        </span>
      </div>
    </Link>
  );
}

function OppositeBottle({opposite}: {opposite: LuminaProductEntry}) {
  if (opposite.gender === 'male' || opposite.gender === 'female') {
    const cutout = getProductImage(opposite.gender, 'cutout');
    if (cutout) {
      return (
        <Image
          src={cutout}
          alt={opposite.imageAlt ?? opposite.title}
          sizes="120px"
          className="relative h-full w-auto object-contain"
          loading="lazy"
          width={140}
          height={186}
        />
      );
    }
    const hero = getHeroImage(opposite.gender);
    if (hero.src) {
      return (
        <BlendedImage
          src={hero.src}
          alt={opposite.imageAlt ?? opposite.title}
          sizes="120px"
          className="relative h-full w-auto object-contain"
          loading="lazy"
          width={140}
          height={186}
        />
      );
    }
  }
  if (opposite.imageUrl) {
    return (
      <BlendedImage
        src={opposite.imageUrl}
        alt={opposite.imageAlt ?? opposite.title}
        sizes="120px"
        className="relative h-full w-auto object-contain"
        loading="lazy"
        width={140}
        height={186}
      />
    );
  }
  return <BrandFallback width={70} />;
}

function UpgradeCard({
  from,
  to,
  baseline,
}: {
  from: LuminaProductEntry;
  to: LuminaProductEntry;
  baseline: LuminaProductEntry;
}) {
  const fromBreakdown = computeSavings(from, baseline);
  const toBreakdown = computeSavings(to, baseline);
  const extraSaved =
    (toBreakdown.saved ?? 0) - (fromBreakdown.saved ?? 0);
  const showExtra = extraSaved > 0;

  return (
    <Link
      to={`/products/${to.handle}`}
      prefetch="intent"
      className="glow-frame glow-frame-base glow-frame-active group relative flex flex-col gap-4 overflow-hidden rounded-xl px-6 py-7 md:px-8 md:py-8"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at top right, rgba(209,26,42,0.25), rgba(11,11,12,0) 60%)',
        }}
      />
      <span className="relative inline-flex w-fit items-center gap-1.5 rounded-pill border border-crimson bg-black px-2.5 py-1 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-crimson-hi">
        <Crown size={11} strokeWidth={2.4} />
        Step up
      </span>
      <div className="relative">
        <h3
          className="m-0 text-fg1"
          style={{
            font: '300 24px/1.15 var(--font-sans)',
            letterSpacing: '-0.01em',
          }}
        >
          Switch to {to.months}-month supply{' '}
          {showExtra && (
            <span className="text-crimson-hi">
              and save {money(extraSaved)} more.
            </span>
          )}
        </h3>
        <p
          className="m-0 mt-3 max-w-[420px] text-fg3"
          style={{font: '400 14.5px/1.6 var(--font-sans)'}}
        >
          One delivery, the full {to.months}-month run. Per-bottle drops to{' '}
          {moneyCents(toBreakdown.perBottle)} ({moneyCents(toBreakdown.perDay)}/
          day) — designed for the 8–12 week assessment window.
        </p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-crimson-hi">
          View {to.months}-month supply
          <ArrowUpRight size={14} strokeWidth={2} />
        </span>
      </div>
    </Link>
  );
}
