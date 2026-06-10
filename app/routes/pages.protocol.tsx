import {useRef} from 'react';
import {useGSAP} from '@gsap/react';
import type {Route} from './+types/pages.protocol';
import {Link, useLoaderData} from 'react-router';
import {ArrowDown, ArrowUpRight, Calendar, Clock, Compass, Repeat} from 'lucide-react';
import {Eyebrow} from '~/components/lumina/Eyebrow';
import {SplitLines} from '~/components/lumina/SplitLines';
import {PageCta} from '~/components/lumina/PageCta';
import {fadeRise, gsap, prefersReducedMotion, staggerChildren, textReveal} from '~/lib/motion';
import {loadLuminaCatalog} from '~/lib/lumina-catalog.server';
import {entriesForGender, findBaseline, money} from '~/lib/savings';

export const meta: Route.MetaFunction = () => [
  {title: 'The Protocol — Lumina Formulations'},
  {
    name: 'description',
    content:
      'Daily consistency over 8–12 weeks is the protocol. How the male and female formulas differ, how the supply tiers map to the assessment arc, and how to actually run it.',
  },
];

export async function loader({context}: Route.LoaderArgs) {
  const entries = await loadLuminaCatalog(context.storefront);
  return {entries};
}

export default function ProtocolPage() {
  const {entries} = useLoaderData<typeof loader>();
  const ref = useRef<HTMLDivElement>(null);
  const male = findBaseline(entries, 'male');
  const female = findBaseline(entries, 'female');
  const maleApex = entriesForGender(entries, 'male').find((e) => e.months === 6);
  const femaleApex = entriesForGender(entries, 'female').find((e) => e.months === 6);

  useGSAP(
    () => {
      const sections = ref.current?.querySelectorAll('[data-chapter]');
      sections?.forEach((section) => {
        textReveal(section.querySelector('h2'), {start: 'top 75%'});
        fadeRise(section.querySelector('.chapter-eyebrow'));
        fadeRise(section.querySelector('.chapter-lede'), {delay: 0.1});
        staggerChildren(section.querySelector('.chapter-grid'), '.chapter-card', {
          start: 'top 80%',
          stagger: 0.08,
        });
      });

      // Pin chapter headers on desktop only — light treatment.
      if (!prefersReducedMotion() && window.innerWidth >= 1024) {
        const headers = ref.current?.querySelectorAll('.chapter-header');
        headers?.forEach((h) => {
          gsap.to(h, {
            scrollTrigger: {
              trigger: h.parentElement,
              start: 'top top+=80',
              end: 'bottom bottom-=200',
              pin: h,
              pinSpacing: false,
            },
          });
        });
      }
    },
    {scope: ref},
  );

  return (
    <div ref={ref}>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-black">
        <div
          aria-hidden
          className="pointer-events-none absolute"
          style={{
            width: 1100,
            height: 1100,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'var(--glow-hero)',
            opacity: 0.5,
          }}
        />
        <div className="relative mx-auto max-w-[1100px] px-6 pb-20 pt-32 md:px-10 md:pb-28 md:pt-48">
          <Eyebrow style={{color: 'var(--color-crimson-hi)'}}>
            The protocol · An editorial
          </Eyebrow>
          <SplitLines
            lines={['Eight weeks', 'is the assessment.', 'Everything else is noise.']}
            as="h1"
            className="protocol-headline mt-7 text-fg1"
            style={{
              font: '200 clamp(40px, 5.4vw, 76px)/0.98 var(--font-sans)',
              letterSpacing: '-0.025em',
            }}
          />
          <p
            className="m-0 mt-8 max-w-[640px] text-fg2"
            style={{font: '300 19px/1.65 var(--font-sans)'}}
          >
            The supplement category is built on impatience — buy a bottle,
            judge it in a week, churn. Our formulas are built for the
            opposite cadence. Below: the protocol, in five chapters, written
            like a piece you&rsquo;d save.
          </p>
          <div
            className="t-mono mt-12 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-fg4"
          >
            Scroll <ArrowDown size={12} strokeWidth={2} />
          </div>
        </div>
      </section>

      {/* Chapter 01 — why daily consistency */}
      <Chapter
        index="01"
        title="Why daily consistency is the only variable that matters."
        eyebrow="Chapter 01 · Cadence"
        lede="Most botanical actives don't have a single-dose effect — they have an exposure curve. Eight weeks of consistent daily intake is what the research and the traditional practice both call for."
        icon={Repeat}
      >
        <ChapterPoint
          k="Why daily, not loaded"
          v="Hero dosing on day one is a marketing instinct, not a biological one. Adaptogens and traditional botanicals compound; minerals stabilize at working levels over weeks."
        />
        <ChapterPoint
          k="What 'compounds' means in practice"
          v="The benefit isn't a peak on day one — it's a higher steady baseline by week eight. You stop measuring single doses and start measuring how you feel across a week."
        />
        <ChapterPoint
          k="The discipline part"
          v="The single biggest predictor of an outcome is whether you actually take the formula daily. Multi-month supplies remove the re-order break that kills routines."
        />
      </Chapter>

      {/* Chapter 02 — the 8-week assessment arc */}
      <Chapter
        index="02"
        title="The 8-week arc, plainly."
        eyebrow="Chapter 02 · Arc"
        lede="What the protocol looks like, week by week. No promises — just the shape we expect customers to see when they run it consistently."
        icon={Calendar}
      >
        <ChapterPoint
          k="Week 1–2 · Routine sets"
          v="The habit gets built. The minerals and B-vitamins reach working levels. Most customers report no dramatic shift yet — and that's the right reading."
        />
        <ChapterPoint
          k="Week 4 · Baseline shifts"
          v="The slow signals start: steadier daytime energy (her formula), smoother recovery and a more aligned sleep–wake cycle (his formula). Adaptogens have started their build."
        />
        <ChapterPoint
          k="Week 8 · Assessment point"
          v="The supplier's own instruction is a minimum 8-week run. This is when you decide: keep going or refund. Sixty days is plenty of runway."
        />
        <ChapterPoint
          k="Week 12+ · Maintenance"
          v="Past the assessment, it's just routine — the formula does its work in the background. Most customers stay on a 6-month subscription from this point."
        />
      </Chapter>

      {/* Chapter 03 — his vs hers */}
      <Chapter
        index="03"
        title="How His and Hers differ — and complement."
        eyebrow="Chapter 03 · Pair"
        lede="Same standard, two different biological assignments. The formulas are designed to be run separately or stacked as a duo."
        icon={Compass}
      >
        <ChapterPoint
          k="His · the nightly stack"
          v="Tribulus 750mg, zinc 30mg, magnesium 200mg, plus tongkat ali, epimedium, saw palmetto, hawthorn, cissus. Nightly dosing lines up with the body's recovery window."
        />
        <ChapterPoint
          k="Hers · the daily energy stack"
          v="B-complex backbone (B12 at 2,250% DV, B6 at 224% DV) plus zinc, L-arginine, BioPerine®, and a disclosed botanical blend (ashwagandha, maca, dong quai, damiana, ginkgo, ginseng, plus nine more)."
        />
        <ChapterPoint
          k="As a duo"
          v="The protocols don't conflict — they're complementary cadences. Many customers run both, stacking the assessment windows together."
        />
      </Chapter>

      {/* Chapter 04 — supply ladder mapping */}
      <Chapter
        index="04"
        title="How supply tiers map to the arc."
        eyebrow="Chapter 04 · Supply"
        lede="The 1-month is for evaluation. The 2-month is a cautious commitment. The 4 and 6-month are where the math and the arc start lining up. The 12-month is the believer's tier."
        icon={Clock}
      >
        <ChapterPoint
          k="1-month · 'I'll see'"
          v="Useful for trial, not for assessment. The protocol's own instruction is at least 8 weeks — that's two of these in a row, with the re-order friction in between."
        />
        <ChapterPoint
          k="2-month · 'I want to be sure'"
          v="A first read. By the time you finish bottle two, you're inside the assessment window — but the friction of re-ordering can still break the routine."
        />
        <ChapterPoint
          k="6-month · 'I'm in' (best value)"
          v="Lands you all the way through the assessment and into the maintenance phase. Per-bottle math gets cheaper. This is what most customers settle on."
        />
        <ChapterPoint
          k="12-month · 'Set and forget'"
          v="The believer's tier. Maximum savings, one re-order per year, no friction left to break the routine. The longest possible run on the formula."
        />
      </Chapter>

      {/* Chapter 05 — pair-with basics */}
      <Chapter
        index="05"
        title="The basics the formula doesn't replace."
        eyebrow="Chapter 05 · Pair with"
        lede="A supplement is a supplement. It works around the basics, not in place of them."
        icon={Repeat}
      >
        <ChapterPoint
          k="Sleep"
          v="A consistent 7–9 hour sleep window is doing more for daytime energy and recovery than any single supplement. The formula stacks on top of that — it doesn't make up for the absence."
        />
        <ChapterPoint
          k="Movement"
          v="Light to moderate movement most days. The actives support active recovery; they don't substitute for the load."
        />
        <ChapterPoint
          k="Protein and whole foods"
          v="The minerals and B-vitamins work best in a body fed with whole foods and adequate protein. Pair the protocol with a sensible diet — it multiplies the math."
        />
        <ChapterPoint
          k="Water"
          v="Each serving is taken with water. Hydration carries the absorbed nutrients to where they're used."
        />
      </Chapter>

      {/* Recap CTA */}
      <section className="relative isolate border-t border-border bg-surface">
        <div className="mx-auto max-w-[1200px] px-6 py-24 md:px-10 md:py-32">
          <Eyebrow className="mb-4">Begin where it makes sense</Eyebrow>
          <h2
            className="m-0 max-w-[760px] text-fg1"
            style={{
              font: '300 clamp(36px, 4.5vw, 52px)/1.05 var(--font-sans)',
              letterSpacing: '-0.015em',
            }}
          >
            Two formulas, mapped to the protocol.
          </h2>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {male && (
              <ProtocolEntryCard
                title="Start with His"
                href={`/products/${male.handle}`}
                priceLabel={`From ${money(male.price)}`}
                body="Three capsules nightly. Built for the 8-week recovery + drive arc."
              />
            )}
            {female && (
              <ProtocolEntryCard
                title="Start with Hers"
                href={`/products/${female.handle}`}
                priceLabel={`From ${money(female.price)}`}
                body="Two capsules daily. Built for the 8-week energy + balance arc."
              />
            )}
          </div>
          {(maleApex || femaleApex) && (
            <p
              className="mt-10 max-w-[640px] text-fg3"
              style={{font: '300 16px/1.65 var(--font-sans)'}}
            >
              For the protocol as designed, the 6-month supply matches the
              assessment window plus a maintenance month — the math is also
              cheapest there.{' '}
              {maleApex && (
                <Link
                  to={`/products/${maleApex.handle}`}
                  className="text-crimson-hi hover:text-fg1"
                >
                  6-month His · {money(maleApex.price)}
                </Link>
              )}
              {maleApex && femaleApex && ' · '}
              {femaleApex && (
                <Link
                  to={`/products/${femaleApex.handle}`}
                  className="text-crimson-hi hover:text-fg1"
                >
                  6-month Hers · {money(femaleApex.price)}
                </Link>
              )}
              .
            </p>
          )}
        </div>
      </section>

      <PageCta />
    </div>
  );
}

function Chapter({
  index,
  eyebrow,
  title,
  lede,
  icon: Icon,
  children,
}: {
  index: string;
  eyebrow: string;
  title: string;
  lede: string;
  icon: typeof Calendar;
  children: React.ReactNode;
}) {
  return (
    <section
      data-chapter
      className="relative border-t border-border bg-black"
    >
      <div className="mx-auto grid max-w-[1200px] gap-12 px-6 py-24 md:grid-cols-[0.9fr_1.1fr] md:px-10 md:py-32">
        <header className="chapter-header self-start">
          <div className="t-mono inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-crimson-hi">
            <Icon size={14} strokeWidth={2.2} />
            {eyebrow}
          </div>
          <div className="chapter-eyebrow t-mono mt-3 text-[80px] font-medium leading-none text-fg4">
            {index}
          </div>
        </header>

        <div>
          <h2
            className="m-0 max-w-[640px] text-fg1"
            style={{
              font: '300 clamp(30px, 3.6vw, 42px)/1.1 var(--font-sans)',
              letterSpacing: '-0.015em',
            }}
          >
            {title}
          </h2>
          <p
            className="chapter-lede m-0 mt-5 max-w-[640px] text-fg3"
            style={{font: '300 17px/1.65 var(--font-sans)'}}
          >
            {lede}
          </p>
          <dl className="chapter-grid mt-10 grid gap-4">{children}</dl>
        </div>
      </div>
    </section>
  );
}

function ChapterPoint({k, v}: {k: string; v: string}) {
  return (
    <div className="chapter-card grid gap-2 rounded-lg border border-border bg-surface px-6 py-5 md:grid-cols-[1fr_2fr] md:gap-6 md:px-7 md:py-6">
      <dt className="t-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-crimson-hi">
        {k}
      </dt>
      <dd
        className="m-0 text-fg2"
        style={{font: '400 15.5px/1.65 var(--font-sans)'}}
      >
        {v}
      </dd>
    </div>
  );
}

function ProtocolEntryCard({
  title,
  href,
  priceLabel,
  body,
}: {
  title: string;
  href: string;
  priceLabel: string;
  body: string;
}) {
  return (
    <Link
      to={href}
      prefetch="intent"
      className="group flex flex-col gap-4 rounded-xl border border-border bg-black p-7 transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-crimson md:p-9"
    >
      <Eyebrow style={{color: 'var(--color-crimson-hi)'}}>{title}</Eyebrow>
      <p
        className="m-0 max-w-[440px] text-fg2"
        style={{font: '400 16px/1.55 var(--font-sans)'}}
      >
        {body}
      </p>
      <div className="mt-3 flex items-baseline justify-between border-t border-border pt-5">
        <span
          className="text-fg1"
          style={{font: '300 24px/1 var(--font-sans)'}}
        >
          {priceLabel}
        </span>
        <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-crimson-hi">
          View formula
          <ArrowUpRight
            size={13}
            strokeWidth={2}
            className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </span>
      </div>
    </Link>
  );
}
