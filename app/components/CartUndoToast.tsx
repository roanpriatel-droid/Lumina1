import {useEffect, useRef, useState} from 'react';
import {CartForm, type OptimisticCart} from '@shopify/hydrogen';
import {Undo2} from 'lucide-react';
import type {CartApiQueryFragment} from 'storefrontapi.generated';

/**
 * Cart line removal "undo" toast. Watches the cart's line ids on every
 * render — when a line that was present is suddenly gone, we capture its
 * last-known merchandise id and quantity and surface a toast with an
 * Undo button that re-adds it.
 *
 * The toast auto-dismisses after 5 seconds. Undo submits a LinesAdd
 * form via CartForm so it integrates with the rest of the cart flow.
 */
export function CartUndoToast({
  cart,
}: {
  cart: OptimisticCart<CartApiQueryFragment | null>;
}) {
  type RemovedLine = {
    title: string;
    merchandiseId: string;
    quantity: number;
  };

  const previousLinesRef = useRef<
    Record<string, RemovedLine>
  >({});
  const [removed, setRemoved] = useState<RemovedLine | null>(null);

  useEffect(() => {
    const currentIds = new Set<string>();
    const currentLines: Record<string, RemovedLine> = {};
    for (const line of cart?.lines?.nodes ?? []) {
      currentIds.add(line.id);
      currentLines[line.id] = {
        title:
          line.merchandise?.product?.title ?? line.merchandise?.title ?? 'Item',
        merchandiseId: line.merchandise?.id ?? '',
        quantity: line.quantity ?? 1,
      };
    }
    for (const [prevId, info] of Object.entries(previousLinesRef.current)) {
      if (!currentIds.has(prevId) && info.merchandiseId) {
        setRemoved(info);
        break;
      }
    }
    previousLinesRef.current = currentLines;
  }, [cart?.lines?.nodes]);

  useEffect(() => {
    if (!removed) return;
    const t = setTimeout(() => setRemoved(null), 5000);
    return () => clearTimeout(t);
  }, [removed]);

  if (!removed) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-0 bottom-6 z-[70] mx-auto flex max-w-md items-center justify-between gap-4 rounded-pill border border-crimson bg-black px-5 py-3"
      style={{
        boxShadow: 'var(--shadow-accent)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
      }}
    >
      <span className="truncate text-[13px] font-medium leading-tight text-fg1">
        Removed <span className="text-fg2">{removed.title}</span>
      </span>
      <CartForm
        route="/cart"
        action={CartForm.ACTIONS.LinesAdd}
        inputs={{
          lines: [
            {
              merchandiseId: removed.merchandiseId,
              quantity: removed.quantity,
            },
          ],
        }}
      >
        <button
          type="submit"
          onClick={() => setRemoved(null)}
          className="inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-crimson-hi transition-colors hover:text-fg1"
        >
          <Undo2 size={13} strokeWidth={2.2} />
          Undo
        </button>
      </CartForm>
    </div>
  );
}
