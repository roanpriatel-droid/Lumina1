import {useLoaderData} from 'react-router';
import type {Route} from './+types/products.$handle';
import {Analytics} from '@shopify/hydrogen';
import {PdpHero} from '~/components/lumina/pdp/PdpHero';
import {HeroMeta} from '~/components/lumina/pdp/HeroMeta';
import {IngredientTransparency} from '~/components/lumina/pdp/IngredientTransparency';
import {PurchaseProvider} from '~/components/lumina/pdp/PurchaseContext';
import {PurchaseSteps} from '~/components/lumina/pdp/PurchaseSteps';
import {PurchaseCta} from '~/components/lumina/pdp/PurchaseCta';
import {SupplyPurchaseBlock} from '~/components/lumina/pdp/SupplyPurchaseBlock';
import {StickyAddToCart} from '~/components/lumina/pdp/StickyAddToCart';
import {BenefitPillars} from '~/components/lumina/pdp/BenefitPillars';
import {DeepDiveCards} from '~/components/lumina/pdp/DeepDiveCards';
import {HowToTake} from '~/components/lumina/pdp/HowToTake';
import {ResultsTimeline} from '~/components/lumina/pdp/ResultsTimeline';
import {FormulatedWithout} from '~/components/lumina/pdp/FormulatedWithout';
import {QualityTesting} from '~/components/lumina/pdp/QualityTesting';
import {FaqAccordion} from '~/components/lumina/pdp/FaqAccordion';
import {ReviewsPlaceholder} from '~/components/lumina/pdp/ReviewsPlaceholder';
import {CompleteTheProtocol} from '~/components/lumina/pdp/CompleteTheProtocol';
import {WhyMultiMonth} from '~/components/lumina/pdp/WhyMultiMonth';
import {ComplianceFooter} from '~/components/lumina/pdp/ComplianceFooter';
import {TransparencyCallout} from '~/components/lumina/pdp/TransparencyCallout';
import {SavingsLadder} from '~/components/lumina/SavingsLadder';
import {LUMINA_PRODUCTS} from '~/lib/lumina-data';
import {loadLuminaCatalog} from '~/lib/lumina-catalog.server';
import {entriesForGender, findBaseline} from '~/lib/savings';

export const meta: Route.MetaFunction = ({data}) => {
  const product = data?.product;
  const lumina = data?.lumina;
  const title = product
    ? `${product.title} | Lumina Formulations`
    : 'Lumina Formulations';
  const description =
    lumina?.blurb ??
    product?.seo?.description ??
    product?.description ??
    '';
  return [
    {title},
    {name: 'description', content: description},
    {rel: 'canonical', href: `/products/${product?.handle ?? ''}`},
    {property: 'og:title', content: title},
    {property: 'og:description', content: description},
    {property: 'og:type', content: 'product'},
  ];
};

export async function loader({context, params}: Route.LoaderArgs) {
  const {handle} = params;
  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }
  const {storefront} = context;

  // Two queries in parallel: the specific product (for seo/description),
  // and the full Lumina catalog (for ladder + baseline + savings math).
  const [{product}, entries] = await Promise.all([
    storefront
      .query(PRODUCT_QUERY, {variables: {handle}})
      .catch(() => ({product: null}) as const),
    loadLuminaCatalog(storefront),
  ]);

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  // Match the loaded product against our catalog entry (handle = handle).
  const entry = entries.find((e) => e.handle === handle) ?? null;

  // Pick the matching Lumina content bundle by gender (male/female).
  const lumina =
    entry?.gender === 'male'
      ? LUMINA_PRODUCTS.male
      : entry?.gender === 'female'
        ? LUMINA_PRODUCTS.female
        : null;

  return {product, entries, entry, lumina};
}

export default function ProductRoute() {
  const {product, entries, entry, lumina} = useLoaderData<typeof loader>();

  if (!entry || !entry.gender || !lumina) {
    // Non-Lumina product (shouldn't happen in our store, but safe fallback).
    return (
      <div className="mx-auto max-w-[840px] px-6 py-20 md:px-8">
        <h1 className="text-fg1">{product.title}</h1>
        {product.descriptionHtml && (
          <div
            className="mt-6 text-fg2"
            dangerouslySetInnerHTML={{__html: product.descriptionHtml}}
          />
        )}
      </div>
    );
  }

  const gender = entry.gender;
  const supplyEntries = entriesForGender(entries, gender);
  const baseline = findBaseline(entries, gender);
  const isHero = entry.months === 1;

  return (
    <PurchaseProvider
      entries={supplyEntries}
      initialHandle={entry.handle}
      gender={gender}
    >
      <div>
        <PdpHero
          title={product.title}
          lumina={lumina}
          imageUrl={entry.imageUrl}
          imageAlt={entry.imageAlt}
        />

        <HeroMeta product={lumina} />

        {isHero ? (
          <>
            <PurchaseSteps />
            <PurchaseCta />
          </>
        ) : (
          <>
            <SupplyPurchaseBlock />
            <WhyMultiMonth months={entry.months} />
          </>
        )}

        <BenefitPillars pillars={lumina.benefitPillars} />
        {lumina.blend && <TransparencyCallout blend={lumina.blend} />}
        <IngredientTransparency
          actives={lumina.actives}
          blend={lumina.blend}
          otherIngredients={lumina.otherIngredients}
        />
        <DeepDiveCards dives={lumina.deepDives} />
        <HowToTake product={lumina} />
        <ResultsTimeline stages={lumina.resultStages} />

        <SavingsLadder
          gender={gender}
          entries={supplyEntries}
          currentHandle={entry.handle}
          eyebrow="Switch your supply"
          title={
            isHero
              ? 'Commit further, save more.'
              : 'Switch tiers and see the math.'
          }
        />

        <FormulatedWithout items={lumina.formulatedWithout} />
        <QualityTesting />
        <FaqAccordion faqs={lumina.faqs} />
        <ReviewsPlaceholder product={lumina} />
        <CompleteTheProtocol
          entries={entries}
          currentHandle={entry.handle}
          currentGender={gender}
        />
        <ComplianceFooter product={lumina} />
        <StickyAddToCart productName={lumina.name} />

        <Analytics.ProductView
          data={{
            products: [
              {
                id: product.id,
                title: product.title,
                price: String(entry.price),
                vendor: product.vendor,
                variantId: entry.variantId ?? '',
                variantTitle: 'Default Title',
                quantity: 1,
              },
            ],
          }}
        />
      </div>
    </PurchaseProvider>
  );
}

const PRODUCT_QUERY = `#graphql
  query Product($country: CountryCode, $language: LanguageCode, $handle: String!)
  @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      id
      title
      vendor
      handle
      descriptionHtml
      description
      seo { description title }
    }
  }
` as const;
