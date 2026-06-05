import type {CartLineUpdateInput} from '@shopify/hydrogen/storefront-api-types';
import type {CartLayout, LineItemChildrenMap} from '~/components/CartMain';
import {CartForm, Image, type OptimisticCartLine} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {Link} from 'react-router';
import {Minus, Plus, X} from 'lucide-react';
import {ProductPrice} from './ProductPrice';
import {useAside} from './Aside';
import type {
  CartApiQueryFragment,
  CartLineFragment,
} from 'storefrontapi.generated';

export type CartLine = OptimisticCartLine<CartApiQueryFragment>;

export function CartLineItem({
  layout,
  line,
  childrenMap,
}: {
  layout: CartLayout;
  line: CartLine;
  childrenMap: LineItemChildrenMap;
}) {
  const {id, merchandise} = line;
  const {product, title, image, selectedOptions} = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);
  const {close} = useAside();
  const lineItemChildren = childrenMap[id];
  const childrenLabelId = `cart-line-children-${id}`;

  return (
    <li className="border-b border-border py-5 last:border-b-0">
      <div className="flex gap-4">
        {image ? (
          <div className="h-[70px] w-[54px] flex-none overflow-hidden rounded-sm border border-border-strong bg-surface-2">
            <Image
              alt={title}
              aspectRatio="1/1"
              data={image}
              height={140}
              loading="lazy"
              width={140}
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div
            className="h-[70px] w-[54px] flex-none rounded-sm border border-border-strong"
            style={{
              background: 'linear-gradient(180deg,#232327,#0d0d0f)',
            }}
            aria-hidden
          />
        )}

        <div className="min-w-0 flex-1">
          <Link
            prefetch="intent"
            to={lineItemUrl}
            onClick={() => layout === 'aside' && close()}
            className="text-sm font-medium leading-tight text-fg1 hover:text-crimson-hi"
          >
            {product.title}
          </Link>
          {selectedOptions.length > 0 && (
            <ul className="mt-1">
              {selectedOptions.map((option) => (
                <li
                  key={option.name}
                  className="text-xs leading-tight text-fg3"
                >
                  {option.name}: {option.value}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-2 flex items-center justify-between gap-3">
            <CartLineQuantity line={line} />
            <ProductPrice price={line?.cost?.totalAmount} compact />
          </div>
        </div>
      </div>

      {lineItemChildren ? (
        <div className="mt-3 border-l border-border pl-4">
          <p id={childrenLabelId} className="sr-only">
            Line items with {product.title}
          </p>
          <ul aria-labelledby={childrenLabelId}>
            {lineItemChildren.map((childLine) => (
              <CartLineItem
                childrenMap={childrenMap}
                key={childLine.id}
                line={childLine}
                layout={layout}
              />
            ))}
          </ul>
        </div>
      ) : null}
    </li>
  );
}

function CartLineQuantity({line}: {line: CartLine}) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity, isOptimistic} = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center rounded-sm border border-border bg-surface-2">
        <CartLineUpdateButton lines={[{id: lineId, quantity: prevQuantity}]}>
          <button
            type="submit"
            aria-label="Decrease quantity"
            disabled={quantity <= 1 || !!isOptimistic}
            name="decrease-quantity"
            value={prevQuantity}
            className="inline-flex h-7 w-7 items-center justify-center text-fg2 transition-colors hover:text-fg1 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Minus size={12} strokeWidth={2.5} />
          </button>
        </CartLineUpdateButton>
        <span className="t-mono w-6 text-center text-xs text-fg1">
          {quantity}
        </span>
        <CartLineUpdateButton lines={[{id: lineId, quantity: nextQuantity}]}>
          <button
            type="submit"
            aria-label="Increase quantity"
            name="increase-quantity"
            value={nextQuantity}
            disabled={!!isOptimistic}
            className="inline-flex h-7 w-7 items-center justify-center text-fg2 transition-colors hover:text-fg1 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus size={12} strokeWidth={2.5} />
          </button>
        </CartLineUpdateButton>
      </div>
      <CartLineRemoveButton lineIds={[lineId]} disabled={!!isOptimistic} />
    </div>
  );
}

function CartLineRemoveButton({
  lineIds,
  disabled,
}: {
  lineIds: string[];
  disabled: boolean;
}) {
  return (
    <CartForm
      fetcherKey={getUpdateKey(lineIds)}
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{lineIds}}
    >
      <button
        disabled={disabled}
        type="submit"
        aria-label="Remove item"
        className="inline-flex h-7 w-7 items-center justify-center text-fg4 transition-colors hover:text-crimson-hi disabled:cursor-not-allowed disabled:opacity-40"
      >
        <X size={14} strokeWidth={2} />
      </button>
    </CartForm>
  );
}

function CartLineUpdateButton({
  children,
  lines,
}: {
  children: React.ReactNode;
  lines: CartLineUpdateInput[];
}) {
  const lineIds = lines.map((line) => line.id);

  return (
    <CartForm
      fetcherKey={getUpdateKey(lineIds)}
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{lines}}
    >
      {children}
    </CartForm>
  );
}

function getUpdateKey(lineIds: string[]) {
  return [CartForm.ACTIONS.LinesUpdate, ...lineIds].join('-');
}
