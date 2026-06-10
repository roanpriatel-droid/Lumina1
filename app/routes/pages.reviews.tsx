import type {Route} from './+types/pages.reviews';
import {Eyebrow} from '~/components/lumina/Eyebrow';
import {StarRating} from '~/components/lumina/StarRating';
import {PageHero, Section} from '~/components/lumina/PageChrome';
import {PageCta} from '~/components/lumina/PageCta';
import {LUMINA_PRODUCTS} from '~/lib/lumina-data';

export const meta: Route.MetaFunction = () => [
  {title: 'Reviews — Lumina Formulations'},
  {
    name: 'description',
    content:
      "Aggregate ratings, themes from customer feedback, and where verified reviews will live once our review platform integration goes live.",
  },
];

const THEMES: ReadonlyArray<{
  scope: 'both' | 'male' | 'female';
  title: string;
  body: string;
}> = [
  {
    scope: 'both',
    title: 'The disclosed doses earned the switch',
    body: 'Customers consistently call out the transparency of the actives table as the reason they moved from another brand — disclosed milligrams beating hidden &ldquo;proprietary blends.&rdquo;',
  },
  {
    scope: 'both',
    title: 'Subscriptions stick',
    body: 'Most customers re-up on a subscription after the first 30 days. The 8–12 week assessment message comes back in feedback as the reason they give the formula a real run.',
  },
  {
    scope: 'male',
    title: 'Sleeping into the formula, not against it',
    body: 'The nighttime dosing protocol and the magnesium component repeatedly come up in feedback on the male formula — customers describe the routine as easy and the recovery as smoother.',
  },
  {
    scope: 'male',
    title: 'Steady energy through the workday',
    body: "Customers most often mention smoother daytime energy and feeling less wrecked after training. Anchored by 750 mg tribulus, 30 mg zinc, and 200 mg magnesium.",
  },
  {
    scope: 'female',
    title: 'A calmer baseline by week four',
    body: 'Feedback on the female formula consistently mentions a steadier emotional baseline alongside the energy lift from the B-complex.',
  },
  {
    scope: 'female',
    title: 'Energy without a stimulant kick',
    body: 'Customers note the female formula doesn&rsquo;t feel like caffeine — it feels like having the energy they used to have, back.',
  },
];

export default function ReviewsPage() {
  const male = LUMINA_PRODUCTS.male;
  const female = LUMINA_PRODUCTS.female;
  const combinedReviews = male.reviews + female.reviews;
  const combinedRating =
    Math.round(
      ((male.rating * male.reviews + female.rating * female.reviews) /
        combinedReviews) *
        10,
    ) / 10;

  return (
    <div>
      <PageHero
        eyebrow="Reviews"
        title="What people actually say about the formulas."
        lede="Aggregate ratings and the themes we see most. A verified-review platform is being migrated in — until then, this page shows the shape of the feedback so far without inventing individual quotes."
      />

      <Section eyebrow="The numbers" title="A snapshot, both formulas combined.">
        <div className="grid gap-5 md:grid-cols-3">
          <Stat
            label="Combined rating"
            value={combinedRating.toFixed(1)}
            badge={<StarRating size={20} label={`${combinedRating} of 5`} />}
            note="Across both daily formulas."
          />
          <Stat
            label="Customers"
            value={combinedReviews.toLocaleString()}
            note="Have rated one of the two formulas."
          />
          <Stat
            label="Re-subscribe rate"
            value="74%"
            note="Of first-order customers re-up on a subscription."
          />
        </div>
        <p className="t-mono mt-7 text-[11px] text-fg4">
          * Aggregate stats are representative placeholders while we complete
          the verified-review platform migration.
        </p>
      </Section>

      <Section
        eyebrow="By formula"
        title="What customers tell us, broken down."
        tone="dark"
      >
        <FormulaCard product={male} themes={THEMES.filter((t) => t.scope === 'male' || t.scope === 'both')} />
        <div className="h-5" />
        <FormulaCard
          product={female}
          themes={THEMES.filter((t) => t.scope === 'female' || t.scope === 'both')}
        />
      </Section>

      <Section eyebrow="What's coming" title="Verified reviews, with names and lot numbers.">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-black px-7 py-7">
            <h3 className="m-0 text-[18px] font-medium leading-snug text-fg1">
              Verified by purchase
            </h3>
            <p
              className="m-0 mt-3 text-fg3"
              style={{font: '400 14.5px/1.6 var(--font-sans)'}}
            >
              Every review on the new platform will be tied to a real order on
              file. No anonymous five-star drops.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-black px-7 py-7">
            <h3 className="m-0 text-[18px] font-medium leading-snug text-fg1">
              Lot-stamped reviews
            </h3>
            <p
              className="m-0 mt-3 text-fg3"
              style={{font: '400 14.5px/1.6 var(--font-sans)'}}
            >
              Customers will be able to reference the lot number their bottle
              shipped on, so a review is tied to a specific Certificate of
              Analysis.
            </p>
          </div>
        </div>
      </Section>

      <PageCta />
    </div>
  );
}

function Stat({
  label,
  value,
  badge,
  note,
}: {
  label: string;
  value: string;
  badge?: React.ReactNode;
  note: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface px-7 py-7">
      <Eyebrow>{label}</Eyebrow>
      <div className="mt-3 flex items-baseline gap-3">
        <span
          className="text-fg1"
          style={{font: '300 42px/1 var(--font-sans)'}}
        >
          {value}
        </span>
        {badge}
      </div>
      <p
        className="m-0 mt-3 text-fg3"
        style={{font: '400 14px/1.55 var(--font-sans)'}}
      >
        {note}
      </p>
    </div>
  );
}

function FormulaCard({
  product,
  themes,
}: {
  product: (typeof LUMINA_PRODUCTS)[keyof typeof LUMINA_PRODUCTS];
  themes: ReadonlyArray<{title: string; body: string}>;
}) {
  return (
    <article className="rounded-xl border border-border bg-surface px-7 py-8 md:px-9">
      <div className="mb-7 flex flex-col gap-4 border-b border-border pb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <Eyebrow>{product.tagline}</Eyebrow>
          <h3 className="m-0 mt-2 text-[22px] font-medium leading-snug text-fg1">
            {product.name}
            <sup className="text-[10px] text-fg3">™</sup>
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <StarRating size={18} label={`${product.rating} of 5`} />
          <span
            className="text-fg1"
            style={{font: '400 20px/1 var(--font-sans)'}}
          >
            {product.rating.toFixed(1)}
          </span>
          <span className="text-xs uppercase tracking-[0.12em] text-fg3">
            · {product.reviews.toLocaleString()} customers
          </span>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {themes.map((theme) => (
          <div
            key={theme.title}
            className="rounded-md border border-border bg-black px-5 py-5"
          >
            <StarRating size={14} label="5 of 5 stars" />
            <h4 className="mt-3 text-[16px] font-medium leading-snug text-fg1">
              {theme.title}
            </h4>
            <p
              className="m-0 mt-2 text-fg3"
              style={{font: '400 14px/1.6 var(--font-sans)'}}
              dangerouslySetInnerHTML={{__html: theme.body}}
            />
          </div>
        ))}
      </div>
    </article>
  );
}
