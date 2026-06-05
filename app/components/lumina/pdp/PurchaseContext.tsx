import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  computeLuminaPrice,
  LUMINA_BUNDLES,
  LUMINA_TIERS,
  type LuminaBundle,
  type LuminaOption,
  type LuminaTier,
} from '~/lib/lumina-data';

interface PurchaseValue {
  tier: LuminaTier;
  setTierId: (id: string) => void;
  option: LuminaOption;
  setOption: (opt: LuminaOption) => void;
  bundle: LuminaBundle;
  setBundleId: (id: string) => void;
  /** Total in dollars per the placeholder pricing math. */
  price: number;
  /** Base per-bottle one-time total (no sub discount, no bundle multipliers). */
  oneTimeTotal: number;
  /** Same as oneTimeTotal but with the 15% sub discount applied. */
  subTotal: number;
}

const PurchaseContext = createContext<PurchaseValue | null>(null);

/**
 * Holds the static placeholder selection state — supply tier, subscribe vs
 * one-time, optional bundle — for PurchaseSteps + StickyAddToCart to share.
 *
 * TODO(shopify-wiring): swap LUMINA_TIERS + LUMINA_BUNDLES + the price
 * math here for Shopify selling-plan + variant data once the products
 * exist in Admin. The provider's public surface (tier/option/bundle/price)
 * stays the same so the UI components don't change.
 */
export function PurchaseProvider({children}: {children: ReactNode}) {
  const [tierId, setTierId] = useState('apex');
  const [option, setOption] = useState<LuminaOption>('subscribe');
  const [bundleId, setBundleId] = useState('solo');

  const value = useMemo<PurchaseValue>(() => {
    const tier = LUMINA_TIERS.find((t) => t.id === tierId) ?? LUMINA_TIERS[3];
    const bundle =
      LUMINA_BUNDLES.find((b) => b.id === bundleId) ?? LUMINA_BUNDLES[0];
    const oneTimeTotal = tier.per * tier.bottles;
    const subTotal = Math.round(oneTimeTotal * (1 - 0.15));
    const price = computeLuminaPrice(tier, option, bundle);
    return {
      tier,
      setTierId,
      option,
      setOption,
      bundle,
      setBundleId,
      price,
      oneTimeTotal,
      subTotal,
    };
  }, [tierId, option, bundleId]);

  return (
    <PurchaseContext.Provider value={value}>
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
