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
import {IngredientTransparency} from '~/components/lumina/pdp/IngredientTransparency';
import {getLuminaProductByHandle} from '~/lib/lumina-product';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';

export const meta: Route.MetaFunction = ({data}) => {
  return [
    {title: `Lumina | ${data?.product.title ?? ''}`},
    {
      rel: 'canonical',
      href: `/products/${data?.product.handle}`,
    },
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

  const [{product}] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {handle, selectedOptions: getSelectedProductOptions(request)},
    }),
  ]);

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  redirectIfHandleIsLocalized(request, {handle, data: product});

  return {product};
}

function loadDeferredData(_args: Route.LoaderArgs) {
  return {};
}

export default function Product() {
  const {product} = useLoaderData<typeof loader>();

  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const {title, descriptionHtml, handle} = product;
  const lumina = getLuminaProductByHandle(handle);

  return (
    <div>
      <PdpHero title={title} lumina={lumina} image={selectedVariant?.image} />

      {/* Product purchase panel.
          TODO(phase-3a): replace this block with the static Supply Tiers /
          Subscribe & Save / Bundles flow + sticky Add to Cart, wired to
          AddToCartButton with the real selectedVariant. */}
      <section className="mx-auto max-w-[1200px] px-6 pb-10 md:px-8">
        <div className="grid gap-10 md:grid-cols-[1fr_440px]">
          <div className="prose-invert prose order-2 max-w-none md:order-1">
            {descriptionHtml && (
              <div
                className="text-fg2 [&_a]:text-crimson-hi [&_h2]:font-light [&_h2]:text-fg1 [&_h3]:font-medium [&_h3]:text-fg1 [&_p]:my-3 [&_strong]:text-fg1"
                style={{font: '300 16px/1.65 var(--font-sans)'}}
                dangerouslySetInnerHTML={{__html: descriptionHtml}}
              />
            )}
          </div>
          <aside className="order-1 flex flex-col gap-6 rounded-xl border border-border bg-surface p-7 md:order-2 md:sticky md:top-28 md:self-start">
            <div>
              <p className="eyebrow mb-2 text-fg3">Single bottle</p>
              <ProductPrice
                price={selectedVariant?.price}
                compareAtPrice={selectedVariant?.compareAtPrice}
              />
              {lumina && (
                <p className="t-mono mt-2 text-xs text-fg4">
                  Subscribe & Save flow in Phase 3a — purchase steps coming
                  next.
                </p>
              )}
            </div>
            <ProductForm
              productOptions={productOptions}
              selectedVariant={selectedVariant}
            />
          </aside>
        </div>
      </section>

      {lumina && <IngredientTransparency actives={lumina.actives} />}

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
