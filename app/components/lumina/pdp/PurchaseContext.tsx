import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {LUMINA_SUB_DISCOUNT, type LuminaOption} from '~/lib/lumina-data';
import {
  computeSavings,
  findBaseline,
  money,
  type Gender,
  type LuminaProductEntry,
  type SavingsBreakdown,
} from '~/lib/savings';

interface PurchaseValue {
  /** All tier entries for the current product's gender, sorted asc by months. */
  entries: LuminaProductEntry[];
  /** Currently selected entry (defaults to the URL-loaded product). */
  selected: LuminaProductEntry;
  setSelectedHandle: (handle: string) => void;

  baseline: LuminaProductEntry | null;
  /** Savings breakdown for the currently selected entry. */
  breakdown: SavingsBreakdown;

  option: LuminaOption;
  setOption: (opt: LuminaOption) => void;

  /** Whole-dollar display price for the price summary. */
  price: number;
  /** Whole-dollar one-time total (== selected entry price). */
  oneTimeTotal: number;
  /** Subscribe & Save price (one-time × 0.85). */
  subTotal: number;
  /** Selling-plan id to attach to the cart line when option ==
   *  'subscribe' AND the selected product has a selling plan
   *  configured in Shopify. Null otherwise — Add-to-Cart callsites
   *  treat null as "ship as a one-time line even if Subscribe is the
   *  toggled UI choice", so the user never gets billed for a
   *  recurring schedule that isn't actually configured. */
  subscribeSellingPlanId: string | null;
}

const PurchaseContext = createContext<PurchaseValue | null>(null);

/**
 * Drives selection across the tier ladder for a single gender.
 *
 * - `entries` is the live ladder (1/2/4/6/12-month products) ordered asc.
 * - `initialHandle` picks the default selection — normally the handle of
 *   the product the user is currently viewing.
 * - `gender` is used to look up the baseline from `entries`.
 *
 * Subscribe & Save renders at a static 15% off in the toggle UI; once
 * the line lands in the cart with a selling-plan id attached, Shopify
 * is the authoritative source for the final subscribe price and the
 * cart-drawer / checkout reflect that automatically.
 */
export function PurchaseProvider({
  entries,
  initialHandle,
  gender,
  children,
}: {
  entries: LuminaProductEntry[];
  initialHandle: string;
  gender: Gender;
  children: ReactNode;
}) {
  const ordered = useMemo(
    () => [...entries].sort((a, b) => a.months - b.months),
    [entries],
  );
  const baseline = useMemo(
    () => findBaseline(ordered, gender),
    [ordered, gender],
  );

  const [handle, setSelectedHandle] = useState<string>(initialHandle);

  const value = useMemo<PurchaseValue>(() => {
    const selected =
      ordered.find((e) => e.handle === handle) ?? ordered[0];
    const breakdown = computeSavings(selected, baseline);

    const oneTimeTotal = Math.round(selected.price);
    // The UI rate is a sensible default for rendering "Subscribe &
    // Save" totals before Shopify returns the selling-plan-adjusted
    // line price in the cart. Once the line lands in the cart with
    // sellingPlanId attached, the cart line price replaces this on
    // every surface that consumes the cart (cart drawer, checkout).
    const subTotal = Math.round(selected.price * (1 - LUMINA_SUB_DISCOUNT));

    return {
      entries: ordered,
      selected,
      setSelectedHandle,
      baseline,
      breakdown,
      option: 'subscribe',
      setOption: () => {},
      price: oneTimeTotal, // option lives outside this useMemo; see closure below
      oneTimeTotal,
      subTotal,
      subscribeSellingPlanId: selected.sellingPlanId,
    };
  }, [ordered, baseline, handle]);

  const [option, setOption] = useState<LuminaOption>('subscribe');
  const merged = useMemo<PurchaseValue>(
    () => ({
      ...value,
      option,
      setOption,
      price: option === 'subscribe' ? value.subTotal : value.oneTimeTotal,
    }),
    [value, option],
  );

  return (
    <PurchaseContext.Provider value={merged}>
      {children}
    </PurchaseContext.Provider>
  );
}

export function usePurchase(): PurchaseValue {
  const ctx = useContext(PurchaseContext);
  if (!ctx)
    throw new Error('usePurchase must be used inside <PurchaseProvider>');
  return ctx;
}

/** Convenience helper used by the sticky bar copy. */
export function formatTierDetail(entry: LuminaProductEntry): string {
  const supply =
    entry.months === 1
      ? '1-month supply'
      : `${entry.months}-month supply`;
  return `${supply} · ${entry.bottles} ${
    entry.bottles === 1 ? 'bottle' : 'bottles'
  } · ${money(entry.price)}`;
}
