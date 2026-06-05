import type {Route} from './+types/_index';
import {HomeHero} from '~/components/lumina/home/Hero';
import {ProductPair} from '~/components/lumina/home/ProductPair';
import {WhyLumina} from '~/components/lumina/home/WhyLumina';
import {IngredientStory} from '~/components/lumina/home/IngredientStory';
import {TiersTeaser} from '~/components/lumina/home/TiersTeaser';
import {SocialProof} from '~/components/lumina/home/SocialProof';

export const meta: Route.MetaFunction = () => {
  return [
    {title: 'Lumina Formulations — Vitality, formulated.'},
    {
      name: 'description',
      content:
        'Two daily vitality formulas built from clinically-studied actives, dosed honestly and tested every lot.',
    },
  ];
};

// TODO(shopify-wiring): when the real Lumina products land in Shopify, restore
// a loader here that pulls the male/female products + a "from" price by
// handle, then pass that through to <ProductPair /> instead of placeholders.
// Until then the homepage is fully static.

export default function Homepage() {
  return (
    <div>
      <HomeHero />
      <ProductPair />
      <WhyLumina />
      <IngredientStory />
      <TiersTeaser />
      <SocialProof />
    </div>
  );
}
