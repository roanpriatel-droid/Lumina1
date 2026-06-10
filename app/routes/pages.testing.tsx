import {useRef} from 'react';
import {useGSAP} from '@gsap/react';
import type {Route} from './+types/pages.testing';
import {Factory, FileCheck2, FlaskConical, Microscope, ShieldCheck, Mail} from 'lucide-react';
import {Eyebrow} from '~/components/lumina/Eyebrow';
import {PageHero, Section} from '~/components/lumina/PageChrome';
import {PageCta} from '~/components/lumina/PageCta';
import {HexLattice} from '~/components/graphics/Molecular';
import {MonoWatermark} from '~/components/graphics/MonoWatermark';
import {fadeRise, staggerChildren} from '~/lib/motion';

const TESTS = [
  {label: 'Identity', body: 'HPTLC / HPLC against reference standards.'},
  {label: 'Potency', body: 'Quantitative assay against the disclosed label dose.'},
  {label: 'Heavy metals', body: 'ICP-MS against USP <232> limits for Pb, As, Cd, Hg.'},
  {label: 'Microbials', body: 'Total aerobic + yeast/mold + pathogen screen.'},
  {label: 'Gluten', body: 'ELISA when applicable; both formulas are gluten-free.'},
  {label: 'Residual solvents', body: 'Where botanical extracts require solvent removal.'},
];

const STANDARDS = [
  {
    Icon: Factory,
    title: 'cGMP-certified US manufacturing',
    body: 'Made in the United States in current Good Manufacturing Practice facilities. The standard the FDA expects of a serious supplement manufacturer.',
  },
  {
    Icon: FlaskConical,
    title: 'Independent third-party testing',
    body: 'Every production lot is tested by a lab that has no manufacturing or commercial relationship with us. The CoA is theirs, not ours.',
  },
  {
    Icon: FileCheck2,
    title: 'No lot ships without passing',
    body: "If a lot doesn't pass identity, potency, heavy metals, or microbials, it doesn't ship. We absorb the cost of failed lots — that's how this is supposed to work.",
  },
];

export const meta: Route.MetaFunction = () => [
  {title: 'Testing — Lumina Formulations'},
  {
    name: 'description',
    content:
      'Every lot independently tested for identity, potency, heavy metals, microbials, and contaminants. Certificate of Analysis available on request.',
  },
];

export default function TestingPage() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      fadeRise(ref.current?.querySelector('.testing-eyebrow'));
      fadeRise(ref.current?.querySelector('.testing-headline'), {delay: 0.05});
      staggerChildren(ref.current?.querySelector('.standards-grid'), '.standard-card', {
        start: 'top 80%',
        stagger: 0.08,
      });
      staggerChildren(ref.current?.querySelector('.tests-grid'), '.test-cell', {
        start: 'top 80%',
        stagger: 0.05,
      });
    },
    {scope: ref},
  );

  return (
    <div ref={ref}>
      <PageHero
        eyebrow="Testing"
        title="The COA is the receipt. Ask and we send it."
        lede="The category is full of brands that claim to be tested. Few will actually send you the paperwork. This page is for the customer who wants the paperwork."
        watermark="LOT-TESTED"
      />

      <Section
        eyebrow="The bar"
        title="Three standards. Non-negotiable."
        decoration={
          <>
            <div className="absolute inset-0 opacity-35">
              <HexLattice rows={8} cols={14} size={48} strokeOpacity={0.35} />
            </div>
            <MonoWatermark position="bottom-right" size={320} opacity={0.045}>
              cGMP
            </MonoWatermark>
          </>
        }
      >
        <div className="standards-grid grid gap-5 md:grid-cols-3">
          {STANDARDS.map(({Icon, title, body}) => (
            <article
              key={title}
              className="standard-card flex flex-col gap-4 rounded-xl border border-border bg-black px-7 py-7"
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
        eyebrow="What every lot is tested for"
        title="Six tests. Independent lab. Pass or it doesn&rsquo;t ship."
        tone="dark"
        decoration={
          <>
            <div className="absolute inset-0 opacity-30">
              <HexLattice rows={10} cols={16} size={42} strokeOpacity={0.4} />
            </div>
            <MonoWatermark position="top-right" size={300} opacity={0.045}>
              ICP-MS
            </MonoWatermark>
          </>
        }
      >
        <div className="tests-grid grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {TESTS.map(({label, body}) => (
            <div
              key={label}
              className="test-cell rounded-md border border-border bg-surface px-5 py-5"
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
        title="Email us. We send you the paperwork."
      >
        <p
          className="m-0 max-w-[680px] text-fg2"
          style={{font: '300 17px/1.7 var(--font-sans)'}}
        >
          The Certificate of Analysis for the lot your bottle came from is
          in our inbox. Email the lot number from the bottom of the bottle
          and a real person sends you the lab&rsquo;s report — usually
          within a business day, always within two.
        </p>
        <a
          href="mailto:lab@luminaformulations.com?subject=COA%20request"
          className="mt-10 inline-flex items-center gap-3 rounded-pill border border-crimson bg-black px-7 py-4 text-[15px] font-medium text-fg1"
          style={{boxShadow: 'var(--shadow-accent)'}}
        >
          <Mail size={16} strokeWidth={2} className="text-crimson-hi" />
          Request a Certificate of Analysis
        </a>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          <Note
            Icon={ShieldCheck}
            title="Why on request, not openly"
            body="Lot COAs identify our supplier and our manufacturing partner. Competitors mine that — customers get it on a single email."
          />
          <Note
            Icon={FileCheck2}
            title="Where the lot number is"
            body="Bottom of the bottle, embossed or printed in black. Format L-YYYYMMDD-####. Include it in your email and the reply has the COA."
          />
        </div>
      </Section>

      <Section
        eyebrow="Compliance, plainly stated"
        title="The supplement category has earned its reputation. We don&rsquo;t pretend otherwise."
        tone="dark"
      >
        <p
          className="m-0 max-w-[760px] text-fg2"
          style={{font: '300 17px/1.7 var(--font-sans)'}}
        >
          Every claim on this site uses structure/function language only —
          &ldquo;supports,&rdquo; &ldquo;promotes,&rdquo; &ldquo;traditionally
          used for,&rdquo; &ldquo;studied for.&rdquo; Nothing on this site
          treats, cures, or prevents any disease. These statements have not
          been evaluated by the FDA.
        </p>
        <p
          className="m-0 mt-5 max-w-[760px] text-fg2"
          style={{font: '300 17px/1.7 var(--font-sans)'}}
        >
          We hold ourselves to the bar above because the category as a
          whole doesn&rsquo;t. If a brand can&rsquo;t send you the COA on
          request, that is the brand telling you something — believe it.
        </p>
      </Section>

      <PageCta />
    </div>
  );
}

function Note({
  Icon,
  title,
  body,
}: {
  Icon: typeof ShieldCheck;
  title: string;
  body: string;
}) {
  return (
    <article className="flex gap-4 rounded-lg border border-border bg-surface px-6 py-6">
      <Icon size={22} strokeWidth={1.75} className="mt-1 flex-none text-crimson" />
      <div>
        <h4 className="m-0 text-[16px] font-medium leading-snug text-fg1">
          {title}
        </h4>
        <p
          className="m-0 mt-2 text-fg3"
          style={{font: '400 14px/1.6 var(--font-sans)'}}
        >
          {body}
        </p>
      </div>
    </article>
  );
}
