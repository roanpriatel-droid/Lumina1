import {useOptimisticCart} from '@shopify/hydrogen';
import {Link} from 'react-router';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {CartLineItem, type CartLine} from '~/components/CartLineItem';
import {CartSummary} from './CartSummary';
import {CartUpgradeHint} from './CartUpgradeHint';
import {CartUndoToast} from './CartUndoToast';

export type CartLayout = 'page' | 'aside';

export type CartMainProps = {
  cart: CartApiQueryFragment | null;
  layout: CartLayout;
};

export type LineItemChildrenMap = {[parentId: string]: CartLine[]};

function getLineItemChildrenMap(lines: CartLine[]): LineItemChildrenMap {
  const children: LineItemChildrenMap = {};
  for (const line of lines) {
    if ('parentRelationship' in line && line.parentRelationship?.parent) {
      const parentId = line.parentRelationship.parent.id;
      if (!children[parentId]) children[parentId] = [];
      children[parentId].push(line);
    }
    if ('lineComponents' in line) {
      const nested = getLineItemChildrenMap(line.lineComponents);
      for (const [parentId, childIds] of Object.entries(nested)) {
        if (!children[parentId]) children[parentId] = [];
        children[parentId].push(...childIds);
      }
    }
  }
  return children;
}

export function CartMain({layout, cart: originalCart}: CartMainProps) {
  const cart = useOptimisticCart(originalCart);
  const cartHasItems = cart?.totalQuantity ? cart.totalQuantity > 0 : false;
  const childrenMap = getLineItemChildrenMap(cart?.lines?.nodes ?? []);

  const wrapClass =
    layout === 'aside' ? 'flex h-full flex-col' : 'mx-auto max-w-2xl px-6 py-12';

  return (
    <section
      className={wrapClass}
      aria-label={layout === 'page' ? 'Cart page' : 'Cart drawer'}
    >
      {!cartHasItems && <CartEmpty layout={layout} />}
      {cartHasItems && (
        <>
          <div
            className={
              layout === 'aside'
                ? 'flex-1 overflow-y-auto'
                : 'mb-8'
            }
          >
            {layout === 'aside' && <CartUpgradeHint cart={cart} />}
            <div className={layout === 'aside' ? 'px-6' : ''}>
              <p id="cart-lines" className="sr-only">
                Line items
              </p>
              <ul aria-labelledby="cart-lines" className="m-0 p-0">
                {(cart?.lines?.nodes ?? []).map((line) => {
                  if (
                    'parentRelationship' in line &&
                    line.parentRelationship?.parent
                  ) {
                    return null;
                  }
                  return (
                    <CartLineItem
                      key={line.id}
                      line={line}
                      layout={layout}
                      childrenMap={childrenMap}
                    />
                  );
                })}
              </ul>
            </div>
          </div>
          <CartSummary cart={cart} layout={layout} />
          <CartUndoToast cart={cart} />
        </>
      )}
    </section>
  );
}

function CartEmpty({layout}: {layout: CartLayout}) {
  const {close} = useAside();
  return (
    <div
      className={
        layout === 'aside'
          ? 'flex flex-1 flex-col items-center justify-center px-8 py-16 text-center'
          : 'py-24 text-center'
      }
    >
      <p className="max-w-[280px] text-sm font-light text-fg2">
        Your cart is empty. The protocol begins with the first bottle.
      </p>
      <Link
        to="/collections"
        onClick={close}
        prefetch="intent"
        className="mt-6 inline-flex items-center gap-2 text-[13px] font-medium uppercase tracking-[0.1em] text-crimson-hi transition-colors hover:text-fg1"
      >
        Continue shopping →
      </Link>
    </div>
  );
}
