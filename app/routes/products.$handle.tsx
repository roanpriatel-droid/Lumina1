import {useLoaderData} from 'react-router';
import type {Route} from './+types/products.$handle';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';
import {ProductPrice} from '~/components/ProductPrice';
import {ProductForm} from '~/components/ProductForm';
import {PdpHero} from '~/components/lumina/pdp/PdpHero';
import {HeroMeta} from '~/components/lumina/pdp/HeroMeta';
import {IngredientTransparency} from '~/components/lumina/pdp/IngredientTransparency';
import {PurchaseProvider} from '~/components/lumina/pdp/PurchaseContext';
import {PurchaseSteps} from '~/components/lumina/pdp/PurchaseSteps';
import {PurchaseCta} from '~/components/lumina/pdp/PurchaseCta';
import {StickyAddToCart} from '~/components/lumina/pdp/StickyAddToCart';
import {BenefitPillars} from '~/components/lumina/pdp/BenefitPillars';
import {DeepDiveCards} from '~/components/lumina/pdp/DeepDiveCards';
import {HowToTake} from '~/components/lumina/pdp/HowToTake';
import {ResultsTimeline} from '~/components/lumina/pdp/ResultsTimeline';
import {FormulatedWithout} from '~/components/lumina/pdp/FormulatedWithout';
import {QualityTesting} from '~/components/lumina/pdp/QualityTesting';
import {FaqAccordion} from '~/components/lumina/pdp/FaqAccordion';
import {ReviewsPlaceholder} from '~/components/lumina/pdp/ReviewsPlaceholder';
import {CrossSell} from '~/components/lumina/pdp/CrossSell';
import {ComplianceFooter} from '~/components/lumina/pdp/ComplianceFooter';
import {TransparencyCallout} from '~/components/lumina/pdp/TransparencyCallout';
import {getLuminaProductByHandle} from '~/lib/lumina-product';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';

export const meta: Route.MetaFunction = ({data}) => {
  const lumina = data?.lumina;
  const product = data?.product;
  const title = lumina
    ? `${lumina.name}™ — ${lumina.benefit} | Lumina Formulations`
    : `Lumina | ${product?.title ?? ''}`;
  const description =
    lumina?.blurb ??
    product?.seo?.description ??
    product?.description ??
    '';
  return [
    {title},
    {name: 'description', content: description},
    {
      rel: 'canonical',
      href: `/products/${product?.handle ?? lumina?.handle ?? ''}`,
    },
    {property: 'og:title', content: title},
    {property: 'og:description', content: description},
    {property: 'og:type', content: 'product'},
  ];
};

export async function loader(args: Route.LoaderArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context, params, request}: Route.LoaderArgs) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const lumina = getLuminaProductByHandle(handle) ?? null;

  const [{product}] = await Promise.all([
    storefront
      .query(PRODUCT_QUERY, {
        variables: {handle, selectedOptions: getSelectedProductOptions(request)},
      })
      .catch(() => ({product: null}) as const),
  ]);

  if (!product?.id) {
    // Non-Lumina handle without a Shopify match → genuine 404.
    if (!lumina) {
      throw new Response(null, {status: 404});
    }
    // Lumina handle without a wired Shopify product → preview mode.
    // The PDP renders fully but the cart CTAs sit in a disabled "Coming soon"
    // state until the product + selling plans land in Shopify admin.
    return {product: null, lumina};
  }

  redirectIfHandleIsLocalized(request, {handle, data: product});

  return {product, lumina};
}

function loadDeferredData(_args: Route.LoaderArgs) {
  return {};
}

export default function Product() {
  const {product, lumina} = useLoaderData<typeof loader>();

  // When we have a Shopify product, drive selection from variant URL.
  // When we don't (preview mode), skip the hooks that need product data.
  if (product) {
    return <FullProduct product={product} lumina={lumina} />;
  }

  if (lumina) {
    return <PreviewProduct lumina={lumina} />;
  }

  // Should be unreachable: loader 404s in this case.
  return null;
}

type LoaderProduct = NonNullable<
  Awaited<ReturnType<typeof loader>>['product']
>;
type LoaderLumina = Awaited<ReturnType<typeof loader>>['lumina'];

function FullProduct({
  product,
  lumina,
}: {
  product: LoaderProduct;
  lumina: LoaderLumina;
}) {
  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const {title, descriptionHtml} = product;
  const isLumina = Boolean(lumina);

  return (
    <PurchaseProvider>
      <div>
        <PdpHero
          title={title}
          lumina={lumina ?? undefined}
          image={selectedVariant?.image}
        />

        {lumina && <HeroMeta product={lumina} />}

        {isLumina && lumina ? (
          <>
            <PurchaseSteps />
            <PurchaseCta selectedVariant={selectedVariant} />
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
            <FormulatedWithout items={lumina.formulatedWithout} />
            <QualityTesting />
            <FaqAccordion faqs={lumina.faqs} />
            <ReviewsPlaceholder product={lumina} />
            <CrossSell currentKey={lumina.key} />
            <ComplianceFooter product={lumina} />
            <StickyAddToCart
              productName={lumina.name}
              selectedVariant={selectedVariant}
            />
          </>
        ) : (
          <>
            <section className="mx-auto max-w-[1200px] px-6 pb-12 md:px-8">
              <aside className="mx-auto flex max-w-[480px] flex-col gap-6 rounded-xl border border-border bg-surface p-7">
                <div>
                  <p className="eyebrow mb-2 text-fg3">Price</p>
                  <ProductPrice
                    price={selectedVariant?.price}
                    compareAtPrice={selectedVariant?.compareAtPrice}
                  />
                </div>
                <ProductForm
                  productOptions={productOptions}
                  selectedVariant={selectedVariant}
                />
              </aside>
            </section>
            {descriptionHtml && (
              <section className="mx-auto max-w-[840px] px-6 pb-16 md:px-8">
                <div
                  className="text-fg2 [&_a]:text-crimson-hi [&_h2]:font-light [&_h2]:text-fg1 [&_h3]:font-medium [&_h3]:text-fg1 [&_p]:my-3 [&_strong]:text-fg1"
                  style={{font: '300 16px/1.65 var(--font-sans)'}}
                  dangerouslySetInnerHTML={{__html: descriptionHtml}}
                />
              </section>
            )}
          </>
        )}

        <Analytics.ProductView
          data={{
            products: [
              {
                id: product.id,
                title: product.title,
                price: selectedVariant?.price.amount || '0',
                vendor: product.vendor,
                variantId: selectedVariant?.id || '',
                variantTitle: selectedVariant?.title || '',
                quantity: 1,
              },
            ],
          }}
        />
      </div>
    </PurchaseProvider>
  );
}

/**
 * Preview-mode rendering of the PDP when no Shopify product is wired yet.
 * Surfaces every Lumina section in its final design state; the purchase CTAs
 * sit in a disabled "Coming soon" state. As soon as the matching product + a
 * sellable variant exist in Shopify Admin, the route flips back to FullProduct.
 */
function PreviewProduct({lumina}: {lumina: NonNullable<LoaderLumina>}) {
  return (
    <PurchaseProvider>
      <div>
        <PdpHero title={lumina.name} lumina={lumina} image={null} />
        <HeroMeta product={lumina} />
        <PurchaseSteps />
        <PurchaseCta selectedVariant={undefined} />
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
        <FormulatedWithout items={lumina.formulatedWithout} />
        <QualityTesting />
        <FaqAccordion faqs={lumina.faqs} />
        <ReviewsPlaceholder product={lumina} />
        <CrossSell currentKey={lumina.key} />
        <ComplianceFooter product={lumina} />
        <StickyAddToCart productName={lumina.name} selectedVariant={undefined} />
      </div>
    </PurchaseProvider>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
` as const;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    encodedVariantExistence
    encodedVariantAvailability
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants (selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;

