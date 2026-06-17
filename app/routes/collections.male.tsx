import type {Route} from './+types/collections.male';
import {useLoaderData} from 'react-router';
import {PageHero} from '~/components/lumina/PageChrome';
import {PageCta} from '~/components/lumina/PageCta';
import {SavingsLadder} from '~/components/lumina/SavingsLadder';
import {HisAndHers} from '~/components/lumina/HisAndHers';
import {CatalogGrid, HowLuminaCompares} from '~/components/lumina/CatalogPieces';
import {loadLuminaCatalog} from '~/lib/lumina-catalog.server';
import {entriesForGender, findBaseline} from '~/lib/savings';

export const meta: Route.MetaFunction = () => [
  {title: "Men's Vitality Supplement — Lumina for Men"},
  {
    name: 'description',
    content:
      "Lumina Male Enhancement™ — tribulus 750mg, zinc 30mg, magnesium 200mg and a stack of traditional botanicals dosed for men who actually train. Disclosed doses, third-party tested every lot, 60-day money-back guarantee. From the 1-month entry to the 12-month maximum savings supply.",
  },
  {property: 'og:title', content: "Men's Vitality Supplement — Lumina for Men"},
  {property: 'og:type', content: 'website'},
];

export async function loader({context}: Route.LoaderArgs) {
  const entries = await loadLuminaCatalog(context.storefront);
  return {entries};
}

export default function MaleCollectionPage() {
  const {entries} = useLoaderData<typeof loader>();
  const male = entriesForGender(entries, 'male');
  const baseline = findBaseline(entries, 'male');

  return (
    <div>
      <PageHero
        eyebrow="For men"
        title="Lumina for Men."
        lede="A nightly formula built on tribulus, zinc, magnesium, and a stack of traditional botanicals — dosed at the levels training men actually need, third-party tested every lot, and engineered for an 8–12 week assessment window."
      />

      <CatalogGrid
        title="Lumina Male Enhancement™"
        eyebrow="Male formula · 1 → 12 month supplies"
        entries={male}
        baseline={baseline}
        empty="The male formulas aren't publishing to the storefront yet. Check Hydrogen channel publishing in admin."
      />

      <SavingsLadder
        gender="male"
        entries={male}
        title="The math on the male formula."
      />

      <HisAndHers entries={entries} />

      <HowLuminaCompares />

      <PageCta />
    </div>
  );
}
