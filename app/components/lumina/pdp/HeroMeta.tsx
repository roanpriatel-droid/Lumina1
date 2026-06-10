import type {LuminaProduct} from '~/lib/lumina-data';

export function HeroMeta({product}: {product: LuminaProduct}) {
  const items = [
    {label: 'Capsules', value: `${product.bottleCount}`},
    {label: 'Daily serving', value: product.dailyServing},
    {label: 'Supply', value: `${product.supplyDays} days`},
  ];

  return (
    <section className="border-y border-border bg-surface">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-y-3 px-6 py-5 sm:grid-cols-3 md:px-8">
        {items.map((item, i) => (
          <div
            key={item.label}
            className="flex items-baseline gap-3"
            style={{
              borderLeft:
                i > 0
                  ? '1px solid var(--color-border)'
                  : 'none',
              paddingLeft: i > 0 ? 18 : 0,
            }}
          >
            <span className="t-mono text-[11px] uppercase tracking-[0.14em] text-fg4">
              {item.label}
            </span>
            <span
              className="text-fg2"
              style={{font: '400 14.5px/1.4 var(--font-sans)'}}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
