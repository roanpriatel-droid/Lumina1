import {Eyebrow} from '~/components/lumina/Eyebrow';
import {StarRating} from '~/components/lumina/StarRating';
import type {LuminaProduct} from '~/lib/lumina-data';

interface ReviewsPlaceholderProps {
  product: LuminaProduct;
}

/**
 * Static review wall placeholder. We intentionally do not show fake reviews
 * with names + photos — instead we render an aggregate band and four
 * representative themes so the page has a "reviews" anchor without faking it.
 *
 * TODO(reviews): wire to a real review platform (Okendo, Junip, Stamped),
 * pull verified reviews + photos, and replace the static themes.
 */
export function ReviewsPlaceholder({product}: ReviewsPlaceholderProps) {
  const themes: ReadonlyArray<{title: string; body: string}> =
    product.key === 'male'
      ? [
          {
            title: 'Steady energy through the workday',
            body: 'Customers most often mention smoother daytime energy and feeling less wrecked after training sessions.',
          },
          {
            title: 'Sleeping like the dose intends',
            body: 'The nighttime serving and magnesium component come up repeatedly in feedback about restful sleep.',
          },
          {
            title: 'A formula that doesn’t hide its dose',
            body: 'Long-time supplement users call out the disclosed tribulus, zinc, and magnesium amounts as the reason they switched.',
          },
          {
            title: 'Built for the long run',
            body: 'Most customers re-up on a subscription after their first 30 days, citing the 8-week consistency message.',
          },
        ]
      : [
          {
            title: 'A calmer baseline by week four',
            body: 'Feedback consistently mentions a steadier emotional baseline alongside the energy lift from the B-complex.',
          },
          {
            title: 'Daytime energy without a stimulant kick',
            body: 'Customers note the formula doesn’t feel like caffeine — it feels like having the energy they used to have, back.',
          },
          {
            title: 'Honest transparency over the category',
            body: 'The disclosed botanical blend (every name, total weight) is repeatedly cited as the reason for trust.',
          },
          {
            title: 'A daily habit that stuck',
            body: 'Two capsules with water; most customers report the routine itself is the easiest part of their day.',
          },
        ];

  return (
    <section className="border-t border-border bg-black">
      <div className="mx-auto max-w-[1200px] px-6 py-20 md:px-8">
        <Eyebrow className="mb-4">What people are saying</Eyebrow>
        <div className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <h2
            className="m-0 max-w-[760px] text-fg1"
            style={{
              font: '300 38px/1.1 var(--font-sans)',
              letterSpacing: '-0.01em',
            }}
          >
            Themes from the feedback so far.
          </h2>
          <div className="flex items-center gap-4 rounded-lg border border-border bg-surface px-5 py-4">
            <StarRating size={18} label={`${product.rating} of 5`} />
            <div className="flex items-baseline gap-2">
              <span
                className="text-fg1"
                style={{font: '400 22px/1 var(--font-sans)'}}
              >
                {product.rating.toFixed(1)}
              </span>
              <span className="text-xs uppercase tracking-[0.12em] text-fg3">
                / 5
              </span>
            </div>
            <span className="text-xs uppercase tracking-[0.12em] text-fg3">
              · {product.reviews.toLocaleString()} customers
            </span>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {themes.map((theme) => (
            <div
              key={theme.title}
              className="glow-frame-on-hover-rest rounded-xl border border-border bg-surface px-7 py-7"
            >
              <StarRating size={15} label="5 of 5 stars" />
              <h3 className="mt-4 text-[18px] font-medium leading-snug text-fg1">
                {theme.title}
              </h3>
              <p
                className="m-0 mt-3 text-fg3"
                style={{font: '400 15px/1.65 var(--font-sans)'}}
                dangerouslySetInnerHTML={{__html: theme.body}}
              />
            </div>
          ))}
        </div>

        <p className="t-mono mt-7 text-[11px] text-fg4">
          * Aggregate ratings and themes are representative placeholders while
          we migrate to a verified-review platform. Individual photographed
          reviews will replace this section.
        </p>
      </div>
    </section>
  );
}
