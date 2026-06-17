import type {Route} from './+types/collections.female';
import {useLoaderData} from 'react-router';
import {PageHero} from '~/components/lumina/PageChrome';
import {PageCta} from '~/components/lumina/PageCta';
import {SavingsLadder} from '~/components/lumina/SavingsLadder';
import {HisAndHers} from '~/components/lumina/HisAndHers';
import {CatalogGrid, HowLuminaCompares} from '~/components/lumina/CatalogPieces';
import {loadLuminaCatalog} from '~/lib/lumina-catalog.server';
import {entriesForGender, findBaseline} from '~/lib/savings';

export const meta: Route.MetaFunction = () => [
  {title: "Women's Vitality Supplement — Lumina for Women"},
  {
    name: 'description',
    content:
      "Lumina Female Enhancement™ — a B-complex backbone, 15 traditional botanicals (ashwagandha, maca, dong quai), L-arginine and a BioPerine® absorption catalyst, dosed for the way modern women actually live. Disclosed doses on every vitamin, mineral, and amino acid; third-party tested every lot; 60-day money-back guarantee.",
  },
  {property: 'og:title', content: "Women's Vitality Supplement — Lumina for Women"},
  {property: 'og:type', content: 'website'},
];

export async function loader({context}: Route.LoaderArgs) {
  const entries = await loadLuminaCatalog(context.storefront);
  return {entries};
}

export default function FemaleCollectionPage() {
  const {entries} = useLoaderData<typeof loader>();
  const female = entriesForGender(entries, 'female');
  const baseline = findBaseline(entries, 'female');

  return (
    <div>
      <PageHero
        eyebrow="For women"
        title="Lumina for Women."
        lede="A complete daily vitality formula built on a B-complex backbone with 15 traditional botanicals, an absorption catalyst, and minerals dosed for daily energy, balance, and circulation. Every active disclosed, third-party tested every lot, engineered for an 8-week assessment window."
      />

      <CatalogGrid
        title="Lumina Female Enhancement™"
        eyebrow="Female formula · 1 → 12 month supplies"
        entries={female}
        baseline={baseline}
        empty="The female formulas aren't publishing to the storefront yet. Check Hydrogen channel publishing in admin."
      />

      <SavingsLadder
        gender="female"
        entries={female}
        title="The math on the female formula."
      />

      <HisAndHers entries={entries} />

      <HowLuminaCompares />

      <PageCta />
    </div>
  );
}
