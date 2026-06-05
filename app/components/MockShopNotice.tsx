export function MockShopNotice() {
  return (
    <section
      className="mx-auto my-6 max-w-3xl rounded-lg border border-border bg-bg-elev px-6 py-5"
      aria-labelledby="mock-shop-notice-heading"
    >
      <p className="eyebrow mb-2 text-crimson-hi">Preview</p>
      <h2
        id="mock-shop-notice-heading"
        className="mb-2 text-base font-medium text-fg1"
      >
        Mock storefront — no shop linked yet.
      </h2>
      <p className="text-sm text-fg3">
        Run{' '}
        <code className="t-mono rounded-xs border border-border bg-surface-2 px-1.5 py-0.5 text-xs text-fg2">
          npx shopify hydrogen link
        </code>{' '}
        to connect a real Shopify store.
      </p>
    </section>
  );
}
