import type {Route} from './+types/pages.about';
import {Quote} from 'lucide-react';
import {Eyebrow} from '~/components/lumina/Eyebrow';
import {PageHero, Section} from '~/components/lumina/PageChrome';
import {EmailCapture} from '~/components/lumina/EmailCapture';
import {PageCta} from '~/components/lumina/PageCta';

export const meta: Route.MetaFunction = () => [
  {title: 'About — Lumina Formulations'},
  {
    name: 'description',
    content:
      "Lumina exists because the supplement category lies. We built two daily formulas the way we wished our own supplements were built — disclosed doses, traditional and clinical evidence behind every ingredient, third-party tested every lot.",
  },
];

export default function AboutPage() {
  return (
    <div>
      <PageHero
        eyebrow="About"
        title="A category that needed a transparent option."
        lede="Lumina exists because the supplement aisle is one of the least trustworthy places in commerce — and the few brands worth trusting are buried under shelves of inflated claims, hidden doses, and ingredients added because they look good on a label."
      />

      <Section eyebrow="Why we built it" title="The frustration that became the brief.">
        <div className="grid gap-12 md:grid-cols-[1.1fr_0.9fr] md:items-start">
          <div
            className="text-fg2"
            style={{font: '300 17.5px/1.7 var(--font-sans)'}}
          >
            <p className="m-0">
              For years we read labels in pharmacies and ran the math. Tribulus
              at 50 mg inside a 600 mg &ldquo;men&rsquo;s blend.&rdquo; B12 at
              6 mcg when the research uses many times that. Maca listed
              prominently but absent from the disclosed actives entirely.
            </p>
            <p className="m-0 mt-5">
              The disclosed actives didn&rsquo;t match the marketed promises,
              the proprietary blends hid the doses, and the certificates of
              analysis — if they existed at all — were a customer-service ask
              that most brands hoped you&rsquo;d never make.
            </p>
            <p className="m-0 mt-5">
              We started Lumina to fix that for the two daily formulas we&rsquo;d
              want to take ourselves. Disclosed doses on every vitamin, mineral,
              and amino. Botanical blends listed in full with the total weight.
              Third-party testing on every lot. A 60-day guarantee that means
              what it says.
            </p>
            <p className="m-0 mt-5">
              The two formulas are the start. Sleep and a Daily Multi are
              already in formulation. Everything we ship will be held to the
              same standard: if it&rsquo;s in the bottle, it&rsquo;s on the
              page.
            </p>
          </div>

          <aside
            className="relative overflow-hidden rounded-2xl border border-border bg-surface px-7 py-8 md:px-9 md:py-10"
            style={{boxShadow: 'var(--shadow-md)'}}
          >
            <Quote
              size={28}
              strokeWidth={1.5}
              className="mb-5 text-crimson"
              aria-hidden
            />
            <p
              className="m-0 text-fg1"
              style={{font: '300 21px/1.5 var(--font-sans)'}}
            >
              We didn&rsquo;t start a supplement brand because we wanted to
              sell supplements. We started one because the only way to buy the
              formulas we actually wanted was to build them ourselves.
            </p>
            <p
              className="m-0 mt-5 text-fg4"
              style={{font: '500 12px/1.4 var(--font-sans)', letterSpacing: '0.16em'}}
            >
              THE LUMINA TEAM
            </p>
          </aside>
        </div>
      </Section>

      <Section
        eyebrow="The principles"
        title="What every Lumina product is held to."
        tone="dark"
      >
        <div className="grid gap-3">
          {[
            {
              n: '01',
              title: 'Disclose every dose that can be disclosed',
              body: "Every vitamin, mineral, amino, and absorption catalyst at its exact milligram. Proprietary blends — if they exist — listed in full with total weight, and called out honestly when per-ingredient doses aren't disclosed.",
            },
            {
              n: '02',
              title: 'Dose at studied or traditional levels',
              body: "When research or traditional practice supports a specific level of an ingredient, we dose there. Not at sprinkle amounts that let us print the ingredient on a label without doing the work.",
            },
            {
              n: '03',
              title: 'Test every lot, independently',
              body: 'Identity, potency, heavy metals, microbials — third-party lab, every lot. If the lot fails, it doesn&rsquo;t ship. Certificate of Analysis on request.',
            },
            {
              n: '04',
              title: 'Guarantee what we sell',
              body: '60-day money-back guarantee on every order. If the formula isn&rsquo;t right for you, we&rsquo;ll refund you — even if the bottles are empty.',
            },
            {
              n: '05',
              title: 'Compliant language, always',
              body: '&ldquo;Supports,&rdquo; &ldquo;promotes,&rdquo; &ldquo;traditionally used for,&rdquo; &ldquo;studied for.&rdquo; Never &ldquo;cures,&rdquo; &ldquo;treats,&rdquo; or &ldquo;guarantees outcomes.&rdquo; The supplement category has earned its reputation for hype; we don&rsquo;t add to it.',
            },
          ].map(({n, title, body}) => (
            <article
              key={n}
              className="grid gap-x-8 gap-y-2 rounded-xl border border-border bg-surface px-7 py-7 md:grid-cols-[auto_1fr] md:items-baseline"
            >
              <span
                className="t-mono text-[14px] uppercase tracking-[0.14em] text-crimson-hi"
                style={{lineHeight: 1}}
              >
                {n}
              </span>
              <div>
                <h3
                  className="m-0 text-[20px] font-medium leading-snug text-fg1"
                  dangerouslySetInnerHTML={{__html: title}}
                />
                <p
                  className="m-0 mt-3 max-w-[720px] text-fg3"
                  style={{font: '400 15px/1.65 var(--font-sans)'}}
                  dangerouslySetInnerHTML={{__html: body}}
                />
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="A word on what we're not"
        title="No fake founder bios. No invented backstory."
      >
        <p
          className="m-0 max-w-[760px] text-fg2"
          style={{font: '300 17.5px/1.7 var(--font-sans)'}}
        >
          You&rsquo;ll notice we don&rsquo;t have a photographed founder
          smiling next to a stock-photo lab beaker. That&rsquo;s deliberate.
          The supplement category is full of invented origin stories, and the
          industry has earned every bit of skepticism a customer brings to a
          new brand.
        </p>
        <p
          className="m-0 mt-5 max-w-[760px] text-fg2"
          style={{font: '300 17.5px/1.7 var(--font-sans)'}}
        >
          What we&rsquo;d rather you trust is the work itself: the disclosed
          doses, the lab paperwork on request, the guarantee, the language. If
          you&rsquo;d like to know more about the people behind the formula
          before placing a first order, write to us — the address is on the
          contact page, and a real human answers.
        </p>
      </Section>

      <EmailCapture />
      <PageCta />
    </div>
  );
}
