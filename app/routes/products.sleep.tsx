import type {Route} from './+types/products.sleep';
import {Moon, BedDouble, Sparkles, Brain} from 'lucide-react';
import {ComingSoonHero} from '~/components/lumina/ComingSoonHero';
import {Section} from '~/components/lumina/PageChrome';
import {PageCta} from '~/components/lumina/PageCta';

export const meta: Route.MetaFunction = () => [
  {title: 'Lumina Sleep — Coming Soon'},
  {
    name: 'description',
    content:
      "Lumina Sleep is in formulation. A nightly capsule built on magnesium glycinate, L-theanine, glycine, and a small dose of melatonin — the basics, dosed honestly. Join the list to be first when it ships.",
  },
];

const FOCUS = [
  {
    Icon: Moon,
    title: 'Honest melatonin dose',
    body: "Most of the category dumps 5–10 mg of melatonin into a capsule because higher numbers look more powerful. The research disagrees. We're dosing low — at the level that actually works for sleep onset, without the morning grog.",
  },
  {
    Icon: BedDouble,
    title: 'Magnesium glycinate',
    body: "The form of magnesium that's bioavailable and well-tolerated overnight. Supports muscle relaxation, restful sleep, and the recovery work the body does while you're under.",
  },
  {
    Icon: Brain,
    title: 'L-theanine + glycine',
    body: "Two ingredients well-studied for supporting a calm baseline and restful sleep architecture. Dosed at studied levels, not at tokens.",
  },
  {
    Icon: Sparkles,
    title: 'No drowsy hangover',
    body: "We're formulating against the morning grog problem most sleep aids ignore. The goal: a clean night, a clean morning, every time.",
  },
];

export default function SleepComingSoon() {
  return (
    <div>
      <ComingSoonHero
        eyebrow="In formulation"
        name="Lumina Sleep"
        promise="A nightly capsule built on the basics — magnesium glycinate, L-theanine, glycine, and a low dose of melatonin. Built for restful sleep without the morning grog."
        bullets={[
          'No proprietary blends. Every active disclosed.',
          'Low-dose melatonin, the way the research actually uses it.',
          'Third-party tested every lot. cGMP US manufactured.',
          'Designed to stack with the male or female daily formula.',
        ]}
        accent="oxblood"
      />

      <Section
        eyebrow="What we&rsquo;re working on"
        title="The formulation brief, plainly."
        lede="What's in scope. What's not. What we'll disclose when it ships."
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
        title="The temptations the category falls for."
        tone="dark"
      >
        <ul className="grid gap-3 md:grid-cols-2">
          {[
            'Stack a 10 mg dose of melatonin to look powerful.',
            'Hide the doses inside a "proprietary sleep blend."',
            'Add CBD without an FDA-cleared structure-function claim to attach it to.',
            'Use any ingredient at sprinkle level to print its name on the label.',
            'Run a countdown timer or a fake waitlist scarcity push.',
            'Ship before our third-party lab has cleared the first production lot.',
          ].map((item) => (
            <li
              key={item}
              className="rounded-md border border-border bg-surface px-5 py-4 text-fg2"
              style={{font: '400 14.5px/1.55 var(--font-sans)'}}
            >
              {item}
            </li>
          ))}
        </ul>
      </Section>

      <PageCta
        eyebrow="In the meantime"
        title="The two daily formulas are already shipping."
        body="Sleep is in formulation. The Male and Female Enhancement formulas are dosed, tested, and shipping today — and the daily formulas are designed to stack with Sleep when it lands."
      />
    </div>
  );
}
