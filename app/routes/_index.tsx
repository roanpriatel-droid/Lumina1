import type {Route} from './+types/_index';
import {useLoaderData} from 'react-router';
import {Hero2} from '~/components/lumina/home/scenes/Hero2';
import {Manifesto} from '~/components/lumina/home/scenes/Manifesto';
import {ByTheNumbers} from '~/components/lumina/home/scenes/ByTheNumbers';
import {TwoFormulas} from '~/components/lumina/home/scenes/TwoFormulas';
import {Constellation} from '~/components/lumina/home/scenes/Constellation';
import {InsideTheCapsule} from '~/components/lumina/home/scenes/InsideTheCapsule';
import {HisHersSplit} from '~/components/lumina/home/scenes/HisHersSplit';
import {TheStandard} from '~/components/lumina/home/scenes/TheStandard';
import {EightWeekArc} from '~/components/lumina/home/scenes/EightWeekArc';
import {SupplyLadderScene} from '~/components/lumina/home/scenes/SupplyLadderScene';
import {ProofWall} from '~/components/lumina/home/scenes/ProofWall';
import {FaqTeaser} from '~/components/lumina/home/scenes/FaqTeaser';
import {FinalCta} from '~/components/lumina/home/scenes/FinalCta';
import {entriesForGender} from '~/lib/savings';
import {loadLuminaCatalog} from '~/lib/lumina-catalog.server';

export const meta: Route.MetaFunction = () => {
  return [
    {title: 'Lumina Formulations — Vitality, formulated honestly.'},
    {
      name: 'description',
      content:
        "Two daily vitality formulas built on disclosed doses, tested every lot, and a 60-Day Guarantee. The protocol begins here.",
    },
    {property: 'og:title', content: 'Lumina Formulations — Vitality, formulated honestly.'},
    {property: 'og:type', content: 'website'},
  ];
};

export async function loader({context}: Route.LoaderArgs) {
  const entries = await loadLuminaCatalog(context.storefront);
  return {entries};
}

export default function Homepage() {
  const {entries} = useLoaderData<typeof loader>();
  const male = entriesForGender(entries, 'male');

  return (
    <div>
      <Hero2 />
      <hr className="lumina-divider" />
      <Manifesto />
      <hr className="lumina-divider" />
      <TwoFormulas entries={entries} />
      <hr className="lumina-divider" />
      <ByTheNumbers />
      <hr className="lumina-divider" />
      <Constellation />
      <hr className="lumina-divider" />
      <InsideTheCapsule />
      <hr className="lumina-divider" />
      <HisHersSplit entries={entries} />
      <hr className="lumina-divider" />
      <TheStandard />
      <hr className="lumina-divider" />
      <EightWeekArc />
      <hr className="lumina-divider" />
      <SupplyLadderScene entries={male} gender="male" />
      <hr className="lumina-divider" />
      <ProofWall />
      <hr className="lumina-divider" />
      <FaqTeaser />
      <hr className="lumina-divider" />
      <FinalCta entries={entries} />
    </div>
  );
}
