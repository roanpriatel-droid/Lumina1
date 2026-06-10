import type {Route} from './+types/products.daily-multi';
import {Sun, FlaskConical, Layers, FileSearch} from 'lucide-react';
import {ComingSoonHero} from '~/components/lumina/ComingSoonHero';
import {Section} from '~/components/lumina/PageChrome';
import {PageCta} from '~/components/lumina/PageCta';

export const meta: Route.MetaFunction = () => [
  {title: 'Lumina Daily Multi — Coming Soon'},
  {
    name: 'description',
    content:
      "Lumina Daily Multi is in formulation. A full-spectrum daily multivitamin built around bioavailable forms — methylated folate and B12, chelated minerals, and the full RDA where it matters. Join the list to be first when it ships.",
  },
];

const FOCUS = [
  {
    Icon: Sun,
    title: 'Methylated B-vitamins',
    body: 'Methylfolate (5-MTHF) and methylcobalamin (B12) for adults with MTHFR variants — and for everyone, because the active forms are what the body actually uses.',
  },
  {
    Icon: FlaskConical,
    title: 'Chelated minerals',
    body: 'Magnesium glycinate, zinc bisglycinate, iron bisglycinate where included. Forms that absorb without the GI cost of cheap oxide or sulfate salts.',
  },
  {
    Icon: Layers,
    title: 'Full RDA on what matters',
    body: "Vitamin D3 + K2 at the levels research uses, not at trace amounts. Magnesium dosed for actual support — not 4% DV.",
  },
  {
    Icon: FileSearch,
    title: 'Every dose disclosed',
    body: "Same standard as the daily formulas. Every vitamin and mineral at its exact milligram or microgram. No 'multivitamin blend' obfuscation.",
  },
];

export default function DailyMultiComingSoon() {
  return (
    <div>
      <ComingSoonHero
        eyebrow="In formulation"
        name="Lumina Daily Multi"
        promise="A full-spectrum daily multivitamin built on bioavailable forms — methylated B-vitamins, chelated minerals, full-RDA D3 + K2, every dose disclosed. The category standard, raised."
        bullets={[
          'Methylfolate + methylcobalamin, not cheap synthetic equivalents.',
          'Chelated minerals over oxides — bioavailable, gut-friendly.',
          'Vitamin D3 + K2 at the doses research actually uses.',
          'Third-party tested every lot. cGMP US manufactured.',
        ]}
        accent="crimson"
      />

      <Section
        eyebrow="What we&rsquo;re working on"
        title="The bar a daily multi should meet."
        lede="Not a checklist of cheap forms padded with botanicals. A real foundation of dosed, bioavailable basics that actually move the needle for adults."
      >
        <div className="grid gap-5 md:grid-cols-2">
          {FOCUS.map(({Icon, title, body}) => (
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
              >
                {body}
              </p>
            </article>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="What we won&rsquo;t do"
        title="The shortcuts the category takes."
        tone="dark"
      >
        <ul className="grid gap-3 md:grid-cols-2">
          {[
            'Magnesium oxide at 4% DV so we can print &ldquo;magnesium&rdquo; on the label.',
            'Folic acid where 5-MTHF should be.',
            'Cyanocobalamin where methylcobalamin should be.',
            'Synthetic dyes, gluten, GMO ingredients, or a stack of fillers.',
            'A &ldquo;men&rsquo;s&rdquo; and &ldquo;women&rsquo;s&rdquo; SKU split for marketing — one well-built foundation, two daily formulas to stack on top.',
            'Ship before the third-party COAs clear the spec.',
          ].map((item) => (
            <li
              key={item}
              className="rounded-md border border-border bg-surface px-5 py-4 text-fg2"
              style={{font: '400 14.5px/1.55 var(--font-sans)'}}
              dangerouslySetInnerHTML={{__html: item}}
            />
          ))}
        </ul>
      </Section>

      <PageCta
        eyebrow="In the meantime"
        title="The two daily formulas are already shipping."
        body="Daily Multi is in formulation. The Male and Female Enhancement formulas are dosed, tested, and shipping today — the Multi is built to be the foundation underneath them."
      />
    </div>
  );
}
