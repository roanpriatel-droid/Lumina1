import type {Route} from './+types/collections.all';
import {useLoaderData} from 'react-router';
import {PageHero} from '~/components/lumina/PageChrome';
import {PageCta} from '~/components/lumina/PageCta';
import {CatalogCard} from '~/components/lumina/CatalogCard';
import {SavingsLadder} from '~/components/lumina/SavingsLadder';
import {Eyebrow} from '~/components/lumina/Eyebrow';
import {loadLuminaCatalog} from '~/lib/lumina-catalog.server';
import {
  entriesForGender,
  findBaseline,
  type LuminaProductEntry,
} from '~/lib/savings';

export const meta: Route.MetaFunction = () => [
  {title: 'Catalog — Lumina Formulations'},
  {
    name: 'description',
    content:
      "Every Lumina formula, every supply length, with live per-bottle pricing and savings. Pick the cadence that matches the way you actually want to take it.",
  },
];

export async function loader({context}: Route.LoaderArgs) {
  const entries = await loadLuminaCatalog(context.storefront);
  return {entries};
}

export default function CatalogPage() {
  const {entries} = useLoaderData<typeof loader>();
  const male = entriesForGender(entries, 'male');
  const female = entriesForGender(entries, 'female');
  const maleBaseline = findBaseline(entries, 'male');
  const femaleBaseline = findBaseline(entries, 'female');

  return (
    <div>
      <PageHero
        eyebrow="Catalog"
        title="Every formula. Every supply. Live pricing."
        lede="The longer the supply, the cheaper the per-bottle math — same formula, same dose, same lot-by-lot testing. Every number you see is computed from the live storefront price."
      />

      <CatalogGrid
        title="Lumina Male Enhancement™"
        eyebrow="Male formula"
        entries={male}
        baseline={maleBaseline}
        empty="The male formulas aren't showing for the storefront yet. Check Hydrogen channel publishing in admin."
      />

      <SavingsLadder
        gender="male"
        entries={male}
        title="The math on the male formula."
      />

      <CatalogGrid
        title="Lumina Female Enhancement™"
        eyebrow="Female formula"
        entries={female}
        baseline={femaleBaseline}
        empty="The female formulas aren't showing for the storefront yet. Check Hydrogen channel publishing in admin."
      />

      <SavingsLadder
        gender="female"
        entries={female}
        title="The math on the female formula."
      />

      <HowLuminaCompares />

      <PageCta />
    </div>
  );
}

function CatalogGrid({
  eyebrow,
  title,
  entries,
  baseline,
  empty,
}: {
  eyebrow: string;
  title: string;
  entries: LuminaProductEntry[];
  baseline: LuminaProductEntry | null;
  empty: string;
}) {
  return (
    <section className="border-t border-border bg-surface">
      <div className="mx-auto max-w-[1200px] px-6 py-20 md:px-8">
        <Eyebrow className="mb-4">{eyebrow}</Eyebrow>
        <h2
          className="m-0 max-w-[760px] text-fg1"
          style={{
            font: '300 38px/1.1 var(--font-sans)',
            letterSpacing: '-0.01em',
          }}
        >
          {title}
        </h2>
        {entries.length === 0 ? (
          <p
            className="mt-8 max-w-[560px] text-fg3"
            style={{font: '400 15px/1.65 var(--font-sans)'}}
          >
            {empty}
          </p>
        ) : (
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {entries.map((product) => (
              <CatalogCard
                key={product.handle}
                product={product}
                baseline={baseline}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* "How Lumina compares" — quiet, factual, no competitor names. */
function HowLuminaCompares() {
  const rows: Array<{
    feature: string;
    lumina: string;
    typical: string;
    luminaWin: boolean;
  }> = [
    {
      feature: 'Disclosed doses on every active',
      lumina: 'Every mg, every ingredient',
      typical: 'Doses hidden inside a blend',
      luminaWin: true,
    },
    {
      feature: 'Third-party testing',
      lumina: 'Independent lab, every lot',
      typical: 'Manufacturer-issued, sometimes',
      luminaWin: true,
    },
    {
      feature: 'Certificate of Analysis',
      lumina: 'On request, free',
      typical: 'On request, often refused',
      luminaWin: true,
    },
    {
      feature: 'Money-back guarantee',
      lumina: '60 days, empty bottles fine',
      typical: '14–30 days, unopened only',
      luminaWin: true,
    },
    {
      feature: 'Subscriptions',
      lumina: 'Pause, skip, cancel from account',
      typical: 'Call to cancel',
      luminaWin: true,
    },
  ];
  return (
    <section className="border-t border-border bg-black">
      <div className="mx-auto max-w-[1100px] px-6 py-20 md:px-8">
        <Eyebrow className="mb-4">How Lumina compares</Eyebrow>
        <h2
          className="m-0 max-w-[760px] text-fg1"
          style={{
            font: '300 38px/1.1 var(--font-sans)',
            letterSpacing: '-0.01em',
          }}
        >
          The category average vs the bar we set.
        </h2>
        <div className="mt-12 overflow-hidden rounded-xl border border-border">
          <div
            className="hidden grid-cols-[1.4fr_1fr_1fr] gap-4 border-b border-border bg-surface px-6 py-4 md:grid"
            aria-hidden
          >
            <Head>Feature</Head>
            <Head>Lumina</Head>
            <Head>Category average</Head>
          </div>
          {rows.map((row, i) => (
            <div
              key={row.feature}
              className="grid grid-cols-1 gap-x-4 gap-y-2 bg-surface px-6 py-5 md:grid-cols-[1.4fr_1fr_1fr] md:items-baseline"
              style={{borderTop: i > 0 ? '1px solid var(--color-border)' : 'none'}}
            >
              <span className="text-[15px] font-medium text-fg1">
                {row.feature}
              </span>
              <div className="flex items-center gap-2">
                <span className="t-mono text-[11px] uppercase tracking-[0.12em] text-fg4 md:hidden">
                  Lumina
                </span>
                <span className="text-[14px] text-fg2">
                  <span className="mr-2 text-crimson-hi">✓</span>
                  {row.lumina}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="t-mono text-[11px] uppercase tracking-[0.12em] text-fg4 md:hidden">
                  Category
                </span>
                <span className="text-[14px] text-fg3">{row.typical}</span>
              </div>
            </div>
          ))}
        </div>
        <p className="t-mono mt-5 text-[10.5px] uppercase tracking-[0.14em] text-fg4">
          * Category average reflects common practice across published US
          supplement-aisle SKUs. No competitor brand is named.
        </p>
      </div>
    </section>
  );
}

function Head({children}: {children: React.ReactNode}) {
  return (
    <span className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-fg3">
      {children}
    </span>
  );
}
