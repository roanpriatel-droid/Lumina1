import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {CartLayout} from '~/components/CartMain';
import {CartForm, Money, type OptimisticCart} from '@shopify/hydrogen';
import {useEffect, useId, useRef, useState} from 'react';
import {useFetcher, useRouteLoaderData} from 'react-router';
import {Lock, Truck} from 'lucide-react';
import {Button} from '~/components/lumina/Button';
import type {RootLoader} from '~/root';
import {lineSavings} from '~/lib/cart-savings';
import {money} from '~/lib/savings';

type CartSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout: CartLayout;
};

export function CartSummary({cart, layout}: CartSummaryProps) {
  const summaryId = useId();
  const discountsHeadingId = useId();
  const discountCodeInputId = useId();
  const giftCardHeadingId = useId();
  const giftCardInputId = useId();

  const root = useRouteLoaderData<RootLoader>('root');
  const catalog = root?.luminaCatalog ?? [];
  let totalSaved = 0;
  for (const node of cart?.lines?.nodes ?? []) {
    const handle = node.merchandise.product.handle;
    const title = node.merchandise.product.title;
    const totalDollars = Number.parseFloat(node.cost?.totalAmount?.amount ?? '0');
    const saved = lineSavings({
      productHandle: handle,
      productTitle: title,
      lineQuantity: node.quantity,
      lineTotalDollars: totalDollars,
      catalog,
    });
    if (saved && saved > 0) totalSaved += saved;
  }

  const wrap =
    layout === 'aside'
      ? 'glow-frame-edge-top relative flex-none border-t border-border bg-bg-elev px-6 py-5'
      : 'glow-frame glow-frame-base glow-frame-rest mt-8 rounded-lg p-6';

  return (
    <div aria-labelledby={summaryId} className={wrap}>
      <h4
        id={summaryId}
        className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-fg3"
      >
        Totals
      </h4>
      <dl
        role="group"
        className="mb-4 flex items-baseline justify-between border-b border-border pb-4"
      >
        <dt className="text-sm text-fg3">Subtotal</dt>
        <dd className="text-xl font-light text-fg1">
          {cart?.cost?.subtotalAmount?.amount ? (
            <Money data={cart?.cost?.subtotalAmount} />
          ) : (
            '-'
          )}
        </dd>
      </dl>
      {totalSaved > 0 && (
        <dl
          role="group"
          className="mb-4 flex items-baseline justify-between rounded-md border border-crimson bg-black px-3 py-2.5"
          style={{boxShadow: 'var(--shadow-accent)'}}
        >
          <dt className="text-[12px] font-semibold uppercase tracking-[0.12em] text-crimson-hi">
            Total saved
          </dt>
          <dd className="t-mono text-[15px] font-semibold text-crimson-hi">
            − {money(totalSaved)}
          </dd>
        </dl>
      )}
      <div className="mb-4 inline-flex items-center gap-2 text-[11.5px] uppercase tracking-[0.12em] text-fg3">
        <Truck size={13} strokeWidth={2} className="text-crimson" />
        Free shipping on subscriptions · 60-day guarantee
      </div>
      <CartDiscounts
        discountCodes={cart?.discountCodes}
        discountsHeadingId={discountsHeadingId}
        discountCodeInputId={discountCodeInputId}
      />
      <CartGiftCard
        giftCardCodes={cart?.appliedGiftCards}
        giftCardHeadingId={giftCardHeadingId}
        giftCardInputId={giftCardInputId}
      />
      <CartCheckoutActions checkoutUrl={cart?.checkoutUrl} />
    </div>
  );
}

function CartCheckoutActions({checkoutUrl}: {checkoutUrl?: string}) {
  if (!checkoutUrl) return null;
  return (
    <a href={checkoutUrl} target="_self" className="mt-4 block">
      <Button full className="gap-2">
        <Lock size={15} strokeWidth={2} />
        Secure Checkout
      </Button>
    </a>
  );
}

const inputClass =
  'flex-1 rounded-sm border border-border bg-surface-2 px-3 py-2 text-sm text-fg1 outline-none transition-colors focus:border-crimson';
const inlineBtnClass =
  'rounded-sm border border-border bg-surface-2 px-3 py-2 text-xs font-medium uppercase tracking-[0.1em] text-fg2 transition-colors hover:border-fg3 hover:text-fg1';

function CartDiscounts({
  discountCodes,
  discountsHeadingId,
  discountCodeInputId,
}: {
  discountCodes?: CartApiQueryFragment['discountCodes'];
  discountsHeadingId: string;
  discountCodeInputId: string;
}) {
  const codes: string[] =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];

  return (
    <section aria-label="Discounts" className="mb-4">
      <dl hidden={!codes.length} className="mb-3">
        <div>
          <dt
            id={discountsHeadingId}
            className="mb-1 text-xs uppercase tracking-[0.1em] text-fg3"
          >
            Discount
          </dt>
          <UpdateDiscountForm>
            <div
              className="flex items-center gap-2"
              role="group"
              aria-labelledby={discountsHeadingId}
            >
              <code className="t-mono rounded-xs border border-border bg-surface-2 px-2 py-1 text-xs text-crimson-hi">
                {codes?.join(', ')}
              </code>
              <button
                type="submit"
                aria-label="Remove discount"
                className="text-xs text-fg4 hover:text-crimson-hi"
              >
                Remove
              </button>
            </div>
          </UpdateDiscountForm>
        </div>
      </dl>
      <UpdateDiscountForm discountCodes={codes}>
        <div className="flex gap-2">
          <label htmlFor={discountCodeInputId} className="sr-only">
            Discount code
          </label>
          <input
            id={discountCodeInputId}
            type="text"
            name="discountCode"
            placeholder="Discount code"
            className={inputClass}
          />
          <button
            type="submit"
            aria-label="Apply discount code"
            className={inlineBtnClass}
          >
            Apply
          </button>
        </div>
      </UpdateDiscountForm>
    </section>
  );
}

function UpdateDiscountForm({
  discountCodes,
  children,
}: {
  discountCodes?: string[];
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{discountCodes: discountCodes || []}}
    >
      {children}
    </CartForm>
  );
}

function CartGiftCard({
  giftCardCodes,
  giftCardHeadingId,
  giftCardInputId,
}: {
  giftCardCodes: CartApiQueryFragment['appliedGiftCards'] | undefined;
  giftCardHeadingId: string;
  giftCardInputId: string;
}) {
  const giftCardCodeInput = useRef<HTMLInputElement>(null);
  const removeButtonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const previousCardIdsRef = useRef<string[]>([]);
  const giftCardAddFetcher = useFetcher({key: 'gift-card-add'});
  const [removedCardIndex, setRemovedCardIndex] = useState<number | null>(null);

  useEffect(() => {
    if (giftCardAddFetcher.data && giftCardCodeInput.current !== null) {
      giftCardCodeInput.current.value = '';
    }
  }, [giftCardAddFetcher.data]);

  useEffect(() => {
    const currentCardIds = giftCardCodes?.map((card) => card.id) || [];

    if (removedCardIndex !== null && giftCardCodes) {
      const focusTargetIndex = Math.min(
        removedCardIndex,
        giftCardCodes.length - 1,
      );
      const focusTargetCard = giftCardCodes[focusTargetIndex];
      const focusButton = focusTargetCard
        ? removeButtonRefs.current.get(focusTargetCard.id)
        : null;

      if (focusButton) {
        focusButton.focus();
      } else if (giftCardCodeInput.current) {
        giftCardCodeInput.current.focus();
      }
      setRemovedCardIndex(null);
    }
    previousCardIdsRef.current = currentCardIds;
  }, [giftCardCodes, removedCardIndex]);

  const handleRemoveClick = (cardId: string) => {
    const index = previousCardIdsRef.current.indexOf(cardId);
    if (index !== -1) setRemovedCardIndex(index);
  };

  return (
    <section aria-label="Gift cards" className="mb-2">
      {giftCardCodes && giftCardCodes.length > 0 && (
        <dl className="mb-3">
          <dt
            id={giftCardHeadingId}
            className="mb-2 text-xs uppercase tracking-[0.1em] text-fg3"
          >
            Applied Gift Card(s)
          </dt>
          {giftCardCodes.map((giftCard) => (
            <dd key={giftCard.id} className="mb-1 flex items-center gap-2">
              <RemoveGiftCardForm
                giftCardId={giftCard.id}
                lastCharacters={giftCard.lastCharacters}
                onRemoveClick={() => handleRemoveClick(giftCard.id)}
                buttonRef={(el: HTMLButtonElement | null) => {
                  if (el) removeButtonRefs.current.set(giftCard.id, el);
                  else removeButtonRefs.current.delete(giftCard.id);
                }}
              >
                <code className="t-mono rounded-xs border border-border bg-surface-2 px-2 py-1 text-xs text-fg2">
                  ***{giftCard.lastCharacters}
                </code>
                <span className="text-sm text-fg2">
                  <Money data={giftCard.amountUsed} />
                </span>
              </RemoveGiftCardForm>
            </dd>
          ))}
        </dl>
      )}

      <AddGiftCardForm fetcherKey="gift-card-add">
        <div className="flex gap-2">
          <label htmlFor={giftCardInputId} className="sr-only">
            Gift card code
          </label>
          <input
            id={giftCardInputId}
            type="text"
            name="giftCardCode"
            placeholder="Gift card code"
            ref={giftCardCodeInput}
            className={inputClass}
          />
          <button
            type="submit"
            disabled={giftCardAddFetcher.state !== 'idle'}
            aria-label="Apply gift card code"
            className={`${inlineBtnClass} disabled:cursor-not-allowed disabled:opacity-50`}
          >
            Apply
          </button>
        </div>
      </AddGiftCardForm>
    </section>
  );
}

function AddGiftCardForm({
  fetcherKey,
  children,
}: {
  fetcherKey?: string;
  children: React.ReactNode;
}) {
  return (
    <CartForm
      fetcherKey={fetcherKey}
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesAdd}
    >
      {children}
    </CartForm>
  );
}

function RemoveGiftCardForm({
  giftCardId,
  lastCharacters,
  children,
  onRemoveClick,
  buttonRef,
}: {
  giftCardId: string;
  lastCharacters: string;
  children: React.ReactNode;
  onRemoveClick?: () => void;
  buttonRef?: (el: HTMLButtonElement | null) => void;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesRemove}
      inputs={{giftCardCodes: [giftCardId]}}
    >
      <div className="flex items-center gap-2">
        {children}
        <button
          type="submit"
          aria-label={`Remove gift card ending in ${lastCharacters}`}
          onClick={onRemoveClick}
          ref={buttonRef}
          className="text-xs text-fg4 hover:text-crimson-hi"
        >
          Remove
        </button>
      </div>
    </CartForm>
  );
}
