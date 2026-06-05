import {Link, useNavigate} from 'react-router';
import {type MappedProductOptions} from '@shopify/hydrogen';
import type {
  Maybe,
  ProductOptionValueSwatch,
} from '@shopify/hydrogen/storefront-api-types';
import {AddToCartButton} from './AddToCartButton';
import {useAside} from './Aside';
import type {ProductFragment} from 'storefrontapi.generated';

export function ProductForm({
  productOptions,
  selectedVariant,
}: {
  productOptions: MappedProductOptions[];
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
}) {
  const navigate = useNavigate();
  const {open} = useAside();
  return (
    <div className="flex flex-col gap-6">
      {productOptions.map((option) => {
        if (option.optionValues.length === 1) return null;

        return (
          <div key={option.name}>
            <h5 className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-fg3">
              {option.name}
            </h5>
            <div className="flex flex-wrap gap-2.5">
              {option.optionValues.map((value) => {
                const {
                  name,
                  handle,
                  variantUriQuery,
                  selected,
                  available,
                  exists,
                  isDifferentProduct,
                  swatch,
                } = value;

                const baseClass =
                  'inline-flex items-center justify-center gap-2 rounded-sm px-4 py-2 text-sm transition-colors';

                if (isDifferentProduct) {
                  return (
                    <Link
                      key={option.name + name}
                      prefetch="intent"
                      preventScrollReset
                      replace
                      to={`/products/${handle}?${variantUriQuery}`}
                      className={baseClass}
                      style={{
                        border: `1px solid ${
                          selected
                            ? 'var(--color-crimson)'
                            : 'var(--color-border)'
                        }`,
                        background: selected
                          ? 'var(--color-surface-2)'
                          : 'var(--color-surface)',
                        color: 'var(--color-fg1)',
                        opacity: available ? 1 : 0.3,
                      }}
                    >
                      <ProductOptionSwatch swatch={swatch} name={name} />
                    </Link>
                  );
                }
                return (
                  <button
                    type="button"
                    key={option.name + name}
                    onClick={() => {
                      if (!selected) {
                        void navigate(`?${variantUriQuery}`, {
                          replace: true,
                          preventScrollReset: true,
                        });
                      }
                    }}
                    disabled={!exists}
                    className={baseClass}
                    style={{
                      border: `1px solid ${
                        selected
                          ? 'var(--color-crimson)'
                          : 'var(--color-border)'
                      }`,
                      background: selected
                        ? 'var(--color-surface-2)'
                        : 'var(--color-surface)',
                      color: 'var(--color-fg1)',
                      opacity: available ? 1 : 0.3,
                      cursor: exists ? 'pointer' : 'not-allowed',
                    }}
                  >
                    <ProductOptionSwatch swatch={swatch} name={name} />
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
      <AddToCartButton
        fullWidth
        disabled={!selectedVariant || !selectedVariant.availableForSale}
        onClick={() => open('cart')}
        lines={
          selectedVariant
            ? [
                {
                  merchandiseId: selectedVariant.id,
                  quantity: 1,
                  selectedVariant,
                },
              ]
            : []
        }
      >
        {selectedVariant?.availableForSale ? 'Add to Cart' : 'Sold out'}
      </AddToCartButton>
    </div>
  );
}

function ProductOptionSwatch({
  swatch,
  name,
}: {
  swatch?: Maybe<ProductOptionValueSwatch> | undefined;
  name: string;
}) {
  const image = swatch?.image?.previewImage?.url;
  const color = swatch?.color;

  if (!image && !color) return <>{name}</>;

  return (
    <span
      aria-label={name}
      className="inline-block h-5 w-5 rounded-full border border-border-strong"
      style={{backgroundColor: color || 'transparent'}}
    >
      {!!image && (
        <img
          src={image}
          alt={name}
          className="h-full w-full rounded-full object-cover"
        />
      )}
    </span>
  );
}
