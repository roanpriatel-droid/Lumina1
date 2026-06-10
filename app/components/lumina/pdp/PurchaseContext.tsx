import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type {ProductVariantFragment} from 'storefrontapi.generated';
import {
  LUMINA_BUNDLES,
  LUMINA_SUB_DISCOUNT,
  LUMINA_TIER_PRESETS,
  type LuminaBundle,
  type LuminaOption,
  type LuminaTierPreset,
} from '~/lib/lumina-data';
import {
  computeSavePct,
  perBottlePrice,
  pickInitialTierId,
  type LuminaLiveTier,
} from '~/lib/lumina-tiers';

interface PurchaseValue {
  /** Full tier ladder paired with Shopify variants (variant=null when missing). */
  tiers: LuminaLiveTier[];
  tier: LuminaLiveTier;
  setTierId: (id: string) => void;

  option: LuminaOption;
  setOption: (opt: LuminaOption) => void;

  bundle: LuminaBundle;
  setBundleId: (id: string) => void;

  /** Live variant for the selected tier (null when that supply isn't wired in Shopify). */
  selectedVariant: ProductVariantFragment | null;

  /** Per-tier helpers, for the tier cards. */
  perBottle: (tier: LuminaLiveTier) => number | null;
  savePct: (tier: LuminaLiveTier) => number;

  /** Pricing displayed by PurchaseCta / StickyAddToCart, in whole dollars. */
  price: number;
  oneTimeTotal: number;
  subTotal: number;
  /** Shopify's compare-at total for the selected tier (whole dollars, or null). */
  compareAtTotal: number | null;
}

const PurchaseContext = createContext<PurchaseValue | null>(null);

/**
 * Holds the supply tier selection backed by live Shopify variants.
 *
 * Subscribe & Save is rendered as a static 15% off because selling plans
 * aren't configured for the formulas yet — see TODO(selling-plan).
 * Bundle math also stays static until Shopify product-bundle support lands.
 */
export function PurchaseProvider({
  tiers,
  initialVariantId,
  children,
}: {
  /** Optional: pass live tiers built from the product. When omitted we
   *  fall back to a preset-only ladder with no variants (preview mode). */
  tiers?: LuminaLiveTier[];
  initialVariantId?: string;
  children: ReactNode;
}) {
  const liveTiers = useMemo<LuminaLiveTier[]>(
    () =>
      tiers ??
      LUMINA_TIER_PRESETS.map<LuminaLiveTier>((preset) => ({
        preset,
        variant: null,
      })),
    [tiers],
  );

  const [tierId, setTierId] = useState(() =>
    pickInitialTierId(liveTiers, initialVariantId),
  );
  const [option, setOption] = useState<LuminaOption>('subscribe');
  const [bundleId, setBundleId] = useState('solo');

  const value = useMemo<PurchaseValue>(() => {
    const tier =
      liveTiers.find((t) => t.preset.id === tierId) ?? liveTiers[0];
    const bundle =
      LUMINA_BUNDLES.find((b) => b.id === bundleId) ?? LUMINA_BUNDLES[0];

    const variantPrice = tier.variant
      ? Number.parseFloat(tier.variant.price.amount)
      : 0;
    const oneTimeTotal = Math.round(variantPrice);

    // TODO(selling-plan): when subscriptions are wired in Shopify Admin,
    // swap this for the real selling-plan-adjusted price from the API.
    const subTotal = Math.round(variantPrice * (1 - LUMINA_SUB_DISCOUNT));

    let displayBase = option === 'subscribe' ? subTotal : oneTimeTotal;
    displayBase *= bundle.mult;
    if (bundle.save) displayBase *= 1 - bundle.save / 100;

    const compareAt = tier.variant?.compareAtPrice
      ? Math.round(Number.parseFloat(tier.variant.compareAtPrice.amount))
      : null;

    return {
      tiers: liveTiers,
      tier,
      setTierId,
      option,
      setOption,
      bundle,
      setBundleId,
      selectedVariant: tier.variant,
      perBottle: perBottlePrice,
      savePct: computeSavePct,
      price: Math.round(displayBase),
      oneTimeTotal,
      subTotal,
      compareAtTotal: compareAt,
    };
  }, [liveTiers, tierId, option, bundleId]);

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

export type {LuminaTierPreset};
