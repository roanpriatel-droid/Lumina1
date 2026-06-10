import type {Route} from './+types/pages.the-science';
import {
  Microscope,
  FlaskConical,
  ShieldCheck,
  Factory,
  FileCheck2,
  Eye,
} from 'lucide-react';
import {PageCta} from '~/components/lumina/PageCta';
import {PageHero, Section} from '~/components/lumina/PageChrome';

export const meta: Route.MetaFunction = () => [
  {title: 'The Science — Lumina Formulations'},
  {
    name: 'description',
    content:
      "Our formulation philosophy: every key active disclosed at its real dose, third-party tested every lot, cGMP manufactured in the US. Here's what's in each formula and why.",
  },
];

const PRINCIPLES = [
  {
    Icon: Eye,
    title: 'No hidden doses',
    body: 'Every vitamin, mineral, and amino acid is dosed openly. Where a proprietary blend is necessary, we disclose every ingredient by name plus the total weight — more transparency than the category standard.',
  },
  {
    Icon: Microscope,
    title: 'Studied use, not sprinkle doses',
    body: 'When we put an ingredient in a formula, it&rsquo;s at the level used in research or traditional practice — not at the token milligram amount that lets a marketer print the name on a label.',
  },
  {
    Icon: FlaskConical,
    title: 'Function over fashion',
    body: "We don't add an ingredient because it's trending. Each active earns its place by what it supports — energy metabolism, hormonal balance, circulation, recovery — not by what's hot on TikTok.",
  },
];

const KEY_ACTIVES = [
  {
    name: 'Ashwagandha',
    studied: 'Studied for adaptogenic stress support, balance, and resilience.',
    where: 'Inside the female formula&rsquo;s botanical vitality blend.',
    body: 'Used in Ayurvedic practice for thousands of years. Modern research has investigated its role in supporting the body&rsquo;s response to occasional stress and a steady baseline mood.',
  },
  {
    name: 'Maca',
    studied:
      'Traditionally used for energy, mood, and libido support; mineral-rich Andean root.',
    where: 'Inside the female formula&rsquo;s botanical vitality blend.',
    body: 'Grown above 13,000 feet in the Peruvian Andes. A traditional staple for vitality and endurance in Indigenous communities for centuries.',
  },
  {
    name: 'Tribulus Terrestris',
    studied:
      'Traditionally used to support male vitality, stamina, and drive. Anchor botanical of the male formula at 750 mg.',
    where: 'Male formula, 750 mg disclosed dose.',
    body: 'A real anchor dose, not a sprinkle. Where the category lists tribulus inside a 50 mg blend and calls it support, we put it front and center at the level traditional practice has used for generations.',
  },
  {
    name: 'Tongkat Ali (Longjack)',
    studied:
      'Traditionally used in Southeast Asia to support male performance, energy under load, and stress resilience.',
    where: 'Male formula, 50 mg root extract.',
    body: 'Used for centuries across Indonesia and Malaysia. We use the root extract — the part of the plant traditional preparations actually call for.',
  },
  {
    name: 'Zinc',
    studied:
      'Essential cofactor in normal testosterone metabolism, immune function, and recovery. Most adults under-consume it.',
    where:
      'Male formula 30 mg (273% DV). Female formula 26 mg (236% DV) for skin health and hormonal balance support.',
    body: 'The mineral most active adults are quietly low on. Both formulas dose it at levels designed to actually move the needle — not at a 2 mg trace.',
  },
  {
    name: 'Magnesium',
    studied:
      'Cofactor in 300+ enzymatic processes. Supports muscle function, energy metabolism, and restful sleep.',
    where: 'Male formula 200 mg (48% DV). Why the male formula is taken at night.',
    body: 'The foundation mineral for recovery. Taken at night, it supports the restful sleep that&rsquo;s part of how the body actually rebuilds — which is why we put the male formula on a nighttime dosing protocol.',
  },
  {
    name: 'B-Complex',
    studied:
      'B1, B3, B5, B6, B12 — supports energy metabolism, normal hormonal activity regulation, and reduced tiredness.',
    where: 'Female formula. B12 dosed at 2,250% DV; B6 at 224% DV.',
    body: "The B-vitamins are how your body converts food into usable energy. We dose B12 at a level designed to actually move the needle for women running low — not at a trace amount that lets us print 'B-complex' on the label.",
  },
  {
    name: 'BioPerine® Black Pepper Extract',
    studied:
      'Patented absorption catalyst; clinically studied to enhance the bioavailability of nutrients it&rsquo;s formulated with.',
    where: 'Female formula, 1 mg (the studied dose).',
    body: "The sophistication signal. BioPerine® at the studied dose, included so the rest of the formula actually gets absorbed instead of passing through — a detail you usually don't see in this category.",
  },
];

const QUALITY = [
  {
    Icon: Factory,
    title: 'cGMP-certified US manufacturing',
    body: 'Made in the United States in current Good Manufacturing Practice facilities under the standards the FDA expects of a serious supplement manufacturer.',
  },
  {
    Icon: FileCheck2,
    title: 'Independently tested, every lot',
    body: 'Identity, potency, heavy metals, microbial contamination. Tested by an independent third-party lab — not by us, not by the manufacturer.',
  },
  {
    Icon: ShieldCheck,
    title: 'Certificate of Analysis on request',
    body: 'You want to see the paperwork for the lot you bought? Email us and we&rsquo;ll send it. That&rsquo;s the entire promise.',
  },
];

export default function TheSciencePage() {
  return (
    <div>
      <PageHero
        eyebrow="The science"
        title="Doses you can verify. Sourcing you can audit."
        lede="We built Lumina the way we wished our own supplements were built — with disclosed doses, traditional and clinical evidence behind every choice, and the lab paperwork to back it up."
      />

      <Section eyebrow="Formulation philosophy" title="Three principles, every formula.">
        <div className="grid gap-5 md:grid-cols-3">
          {PRINCIPLES.map(({Icon, title, body}) => (
            <article
              key={title}
              className="flex flex-col gap-4 rounded-xl border border-border bg-surface px-7 py-7"
            >
              <div
                className="inline-flex h-11 w-11 items-center justify-center rounded-md"
                style={{
                  background:
                    'radial-gradient(closest-side, rgba(209,26,42,0.22), rgba(11,11,12,0))',
                }}
              >
                <Icon size={22} strokeWidth={1.75} className="text-crimson" />
              </div>
              <h3 className="m-0 text-[18px] font-medium leading-snug text-fg1">
                {title}
              </h3>
              <p
                className="m-0 text-fg3"
                style={{font: '400 14.5px/1.6 var(--font-sans)'}}
                dangerouslySetInnerHTML={{__html: body}}
              />
            </article>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="The key actives"
        title="Eight ingredients. The reasoning, plainly."
        lede="Across both formulas, this is the working ingredient list. Each one is here for a specific function — and dosed at the level that function actually requires."
        tone="dark"
      >
        <div className="flex flex-col">
          {KEY_ACTIVES.map((active, i) => (
            <article
              key={active.name}
              className="grid gap-x-10 gap-y-3 py-7 md:grid-cols-[1fr_2fr]"
              style={{
                borderTop:
                  i === 0
                    ? '1px solid var(--color-border)'
                    : '1px solid var(--color-border)',
              }}
            >
              <div>
                <h3 className="m-0 text-[20px] font-medium leading-tight text-fg1">
                  {active.name}
                </h3>
                <p
                  className="m-0 mt-2 text-fg4"
                  style={{font: '400 13px/1.55 var(--font-sans)'}}
                  dangerouslySetInnerHTML={{__html: active.where}}
                />
              </div>
              <div className="flex flex-col gap-3">
                <p
                  className="m-0 text-fg2"
                  style={{font: '400 15.5px/1.65 var(--font-sans)'}}
                  dangerouslySetInnerHTML={{__html: active.studied}}
                />
                <p
                  className="m-0 text-fg3"
                  style={{font: '400 14.5px/1.65 var(--font-sans)'}}
                  dangerouslySetInnerHTML={{__html: active.body}}
                />
              </div>
            </article>
          ))}
        </div>
        <p className="t-mono mt-7 text-[11px] text-fg4">
          * &ldquo;Studied for&rdquo; and &ldquo;traditionally used for&rdquo;
          language reflects investigated and historical uses. These statements
          have not been evaluated by the FDA. This product is not intended to
          diagnose, treat, cure, or prevent any disease.
        </p>
      </Section>

      <Section
        eyebrow="Quality & testing"
        title="The bar we hold ourselves to."
        lede="Supplements are one of the easiest places in commerce to cut corners. Here&rsquo;s how we don&rsquo;t."
      >
        <div className="grid gap-5 md:grid-cols-3">
          {QUALITY.map(({Icon, title, body}) => (
            <article
              key={title}
              className="flex flex-col gap-4 rounded-xl border border-border bg-black px-7 py-7"
            >
              <div
                className="inline-flex h-11 w-11 items-center justify-center rounded-md"
                style={{
                  background:
                    'radial-gradient(closest-side, rgba(209,26,42,0.22), rgba(11,11,12,0))',
                }}
              >
                <Icon size={22} strokeWidth={1.75} className="text-crimson" />
              </div>
              <h3 className="m-0 text-[18px] font-medium leading-snug text-fg1">
                {title}
              </h3>
              <p
                className="m-0 text-fg3"
                style={{font: '400 14.5px/1.6 var(--font-sans)'}}
                dangerouslySetInnerHTML={{__html: body}}
              />
            </article>
          ))}
        </div>
      </Section>

      <PageCta />
    </div>
  );
}

