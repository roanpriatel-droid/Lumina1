import type {Route} from './+types/pages.sourcing';
import {
  Factory,
  FlaskConical,
  FileCheck2,
  Globe2,
  Microscope,
  ShieldCheck,
  Mail,
} from 'lucide-react';
import {Eyebrow} from '~/components/lumina/Eyebrow';
import {PageHero, Section} from '~/components/lumina/PageChrome';
import {EmailCapture} from '~/components/lumina/EmailCapture';
import {PageCta} from '~/components/lumina/PageCta';

export const meta: Route.MetaFunction = () => [
  {title: 'Sourcing — Lumina Formulations'},
  {
    name: 'description',
    content:
      'Made in the United States in cGMP-certified facilities. Every lot independently tested for identity, potency, heavy metals, and microbials. Certificate of Analysis on request.',
  },
];

const STEPS = [
  {
    Icon: Globe2,
    n: '01',
    title: 'Raw material qualification',
    body: 'Every botanical, vitamin, mineral, and amino comes from a supplier we&rsquo;ve qualified — by audit, by paperwork, and by our own incoming-quality testing. We choose suppliers by what their COAs actually show, not by what their marketing claims.',
  },
  {
    Icon: Factory,
    n: '02',
    title: 'cGMP US manufacturing',
    body: 'Manufactured in the United States in current Good Manufacturing Practice facilities. cGMP is the FDA&rsquo;s standard for how a serious supplement is made — clean rooms, validated equipment, batch records, documented chain of custody.',
  },
  {
    Icon: FlaskConical,
    n: '03',
    title: 'Lot-by-lot independent testing',
    body: 'Every production lot is tested by an independent third-party laboratory before it ships. Identity (what&rsquo;s actually in the capsule), potency (at the doses on the label), heavy metals (lead, arsenic, cadmium, mercury under USP limits), and microbial contamination.',
  },
  {
    Icon: FileCheck2,
    n: '04',
    title: 'COA generation &amp; release',
    body: 'The third-party lab issues a Certificate of Analysis for the lot. We won&rsquo;t release a lot to fulfillment unless every test on its COA passes our spec. If a lot doesn&rsquo;t pass, it doesn&rsquo;t ship.',
  },
];

const TESTS = [
  {label: 'Identity', body: 'HPTLC / HPLC against reference standards.'},
  {label: 'Potency', body: 'Quantitative assay against the disclosed label dose.'},
  {label: 'Heavy metals', body: 'ICP-MS against USP <232> limits for Pb, As, Cd, Hg.'},
  {label: 'Microbials', body: 'Total aerobic + yeast/mold + pathogen screen.'},
  {label: 'Gluten', body: 'ELISA when applicable; both formulas are gluten-free.'},
  {label: 'Residual solvents', body: 'Where botanical extracts require solvent removal.'},
];

export default function SourcingPage() {
  return (
    <div>
      <PageHero
        eyebrow="Sourcing"
        title="Where every capsule comes from, and how we know it's clean."
        lede="We don't ship a lot we wouldn't open ourselves. The full chain of custody, from raw material to your bottle, is below."
      />

      <Section
        eyebrow="The chain of custody"
        title="Four stages, every lot. No exceptions."
      >
        <div className="flex flex-col gap-5">
          {STEPS.map(({Icon, n, title, body}) => (
            <article
              key={n}
              className="grid gap-6 rounded-xl border border-border bg-black px-7 py-8 md:grid-cols-[auto_auto_1fr] md:items-start md:px-9"
            >
              <span
                aria-hidden
                className="t-mono text-[20px] font-medium text-crimson-hi"
                style={{lineHeight: 1}}
              >
                {n}
              </span>
              <div
                className="inline-flex h-12 w-12 flex-none items-center justify-center rounded-md"
                style={{
                  background:
                    'radial-gradient(closest-side, rgba(209,26,42,0.22), rgba(11,11,12,0))',
                }}
              >
                <Icon size={24} strokeWidth={1.75} className="text-crimson" />
              </div>
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
        eyebrow="What every lot is tested for"
        title="Six tests. Independent lab. Pass or it doesn't ship."
        tone="dark"
      >
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {TESTS.map(({label, body}) => (
            <div
              key={label}
              className="rounded-md border border-border bg-surface px-5 py-5"
            >
              <div className="mb-2 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-crimson-hi">
                <Microscope size={13} strokeWidth={2} /> {label}
              </div>
              <p
                className="m-0 text-fg3"
                style={{font: '400 14px/1.55 var(--font-sans)'}}
              >
                {body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="The COA promise"
        title="You want the paperwork? Ask for it."
        lede="If you want to see the Certificate of Analysis for the lot you bought, email us the lot number from the bottom of your bottle and we'll send you the lab&rsquo;s report. That's the entire promise. No portal, no form, no friction."
      >
        <a
          href="mailto:lab@luminaformulations.com?subject=COA%20request"
          className="inline-flex items-center gap-3 rounded-pill border border-crimson bg-black px-7 py-4 text-[15px] font-medium text-fg1 transition-[transform,box-shadow] duration-150 hover:-translate-y-0.5"
          style={{boxShadow: 'var(--shadow-accent)'}}
        >
          <Mail size={16} strokeWidth={2} className="text-crimson-hi" />
          Request a Certificate of Analysis
        </a>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          <article className="flex gap-4 rounded-lg border border-border bg-surface px-6 py-6">
            <ShieldCheck
              size={22}
              strokeWidth={1.75}
              className="mt-1 flex-none text-crimson"
            />
            <div>
              <h4 className="m-0 text-[16px] font-medium leading-snug text-fg1">
                Why we publish on request, not openly
              </h4>
              <p
                className="m-0 mt-2 text-fg3"
                style={{font: '400 14px/1.6 var(--font-sans)'}}
              >
                Lot COAs identify proprietary supplier relationships and
                manufacturing partners that competitors would mine. We send the
                report freely to customers — we just don&rsquo;t put the
                supplier&rsquo;s name on the open web for them.
              </p>
            </div>
          </article>
          <article className="flex gap-4 rounded-lg border border-border bg-surface px-6 py-6">
            <Eyebrow style={{color: 'var(--color-crimson-hi)'}}>Lot lookup</Eyebrow>
            <div>
              <h4 className="m-0 mt-2 text-[16px] font-medium leading-snug text-fg1">
                Where to find your lot number
              </h4>
              <p
                className="m-0 mt-2 text-fg3"
                style={{font: '400 14px/1.6 var(--font-sans)'}}
              >
                Bottom of the bottle, embossed on the label or printed in black
                ink. Format: <span className="t-mono">L-YYYYMMDD-####</span>.
                Include it in your email and we&rsquo;ll reply with the COA.
              </p>
            </div>
          </article>
        </div>
      </Section>

      <EmailCapture />
      <PageCta />
    </div>
  );
}
