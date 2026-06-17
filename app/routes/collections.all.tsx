import type {Route} from './+types/collections.all';
import {useLoaderData} from 'react-router';
import {PageHero} from '~/components/lumina/PageChrome';
import {PageCta} from '~/components/lumina/PageCta';
import {SavingsLadder} from '~/components/lumina/SavingsLadder';
import {HisAndHers} from '~/components/lumina/HisAndHers';
import {CatalogGrid, HowLuminaCompares} from '~/components/lumina/CatalogPieces';
import {loadLuminaCatalog} from '~/lib/lumina-catalog.server';
import {entriesForGender, findBaseline} from '~/lib/savings';

export const meta: Route.MetaFunction = () => [
  {title: 'Shop All — Lumina Formulations'},
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
        eyebrow="Shop all"
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

      <HisAndHers entries={entries} />

      <HowLuminaCompares />

      <PageCta />
    </div>
  );
}
