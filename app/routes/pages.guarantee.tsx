import {useRef} from 'react';
import {useGSAP} from '@gsap/react';
import type {Route} from './+types/pages.guarantee';
import {Mail, ShieldCheck} from 'lucide-react';
import {Eyebrow} from '~/components/lumina/Eyebrow';
import {PageHero, Section} from '~/components/lumina/PageChrome';
import {PageCta} from '~/components/lumina/PageCta';
import {SplitLines} from '~/components/lumina/SplitLines';
import {fadeRise, staggerChildren, textReveal} from '~/lib/motion';

const STEPS = [
  {
    n: '01',
    title: 'Run the protocol.',
    body: 'Take the formula daily for as long as you want, up to the 60-day window from your order date. Empty bottles fine.',
  },
  {
    n: '02',
    title: 'Email a single line.',
    body: 'hello@luminaformulations.com — your order number plus a sentence on why the formula wasn&rsquo;t right for you. No form, no portal.',
  },
  {
    n: '03',
    title: 'Get your money back.',
    body: 'Real human reply within one business day. Refund settles to your original payment method in 3–5 business days. No store credit, no restocking, no retention script.',
  },
];

export const meta: Route.MetaFunction = () => [
  {title: '60-Day Money-Back Guarantee — Lumina Formulations'},
  {
    name: 'description',
    content:
      'The full 60-Day Money-Back Guarantee, in three steps. Empty bottles fine. Money back to your original payment method, not store credit.',
  },
];

export default function GuaranteePage() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      textReveal(ref.current?.querySelector('.guarantee-headline'), {
        start: 'top 75%',
        stagger: 0.1,
      });
      fadeRise(ref.current?.querySelector('.guarantee-lede'), {delay: 0.2});
      staggerChildren(ref.current?.querySelector('.guarantee-steps'), '.guarantee-step', {
        start: 'top 78%',
        stagger: 0.1,
      });
      fadeRise(ref.current?.querySelector('.guarantee-fine'), {start: 'top 85%'});
    },
    {scope: ref},
  );

  return (
    <div ref={ref}>
      <PageHero
        eyebrow="The guarantee"
        title="60 days. Empty bottles fine."
        lede="The fewest possible conditions on getting your money back. We dose for an 8-week assessment — sixty days is enough to know."
      />

      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-[1100px] px-6 py-24 md:px-10 md:py-32">
          <Eyebrow className="mb-4" style={{color: 'var(--color-crimson-hi)'}}>
            How it works
          </Eyebrow>
          <SplitLines
            lines={['Three steps.', 'No fine print.']}
            as="h2"
            className="guarantee-headline mt-3 text-fg1"
            style={{
              font: '300 clamp(40px, 5.4vw, 76px)/0.98 var(--font-sans)',
              letterSpacing: '-0.025em',
            }}
          />
          <p
            className="guarantee-lede m-0 mt-8 max-w-[600px] text-fg2"
            style={{font: '300 18px/1.65 var(--font-sans)'}}
          >
            We hold the guarantee in this tone because every brand should
            — and most of them don&rsquo;t.
          </p>
          <div className="guarantee-steps mt-16 grid gap-5 md:grid-cols-3">
            {STEPS.map(({n, title, body}) => (
              <article
                key={n}
                className="guarantee-step flex flex-col gap-4 rounded-xl border border-border bg-black px-7 py-8 md:px-9 md:py-10"
              >
                <span
                  className="t-mono text-[14px] font-medium uppercase tracking-[0.14em] text-crimson-hi"
                >
                  {n}
                </span>
                <h3 className="m-0 text-[22px] font-medium leading-snug text-fg1">
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
          <a
            href="mailto:hello@luminaformulations.com?subject=Refund%20request"
            className="mt-12 inline-flex items-center gap-3 rounded-pill bg-crimson px-7 py-4 text-[15px] font-medium text-white shadow-accent transition-[background,transform] hover:bg-crimson-hi active:translate-y-px"
          >
            <Mail size={16} strokeWidth={2} />
            Start a refund
          </a>
        </div>
      </section>

      <Section
        eyebrow="What it isn&rsquo;t"
        title="The escape hatches we don&rsquo;t use."
        tone="dark"
      >
        <ul className="grid gap-3">
          {[
            'No restocking fee.',
            'No store credit — money to your original payment method.',
            'No requirement that bottles be unopened. Empty is fine; the assessment is the point.',
            'No phone call to cancel. Email is the only step.',
            'No retention script. We refund you the first time you ask.',
          ].map((line) => (
            <li
              key={line}
              className="flex items-start gap-3 rounded-md border border-border bg-surface px-5 py-4"
            >
              <ShieldCheck
                size={18}
                strokeWidth={1.75}
                className="mt-0.5 flex-none text-crimson"
              />
              <span
                className="text-fg2"
                style={{font: '400 15px/1.55 var(--font-sans)'}}
              >
                {line}
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <Section eyebrow="The fine print" title="Read it once, then never again.">
        <p
          className="guarantee-fine m-0 max-w-[760px] text-fg3"
          style={{font: '400 15px/1.7 var(--font-sans)'}}
        >
          The 60-day window starts the day your order was placed. Refunds
          apply to the order amount including original shipping. International
          duties and import taxes paid at customs are not within our control
          and are not refunded by us. Damaged-in-transit cases are handled
          as replacements, not refunds, at our cost. Otherwise: empty bottles
          fine, no questions asked, full refund.
        </p>
      </Section>

      <PageCta
        title="Run the formula with confidence."
        body="The guarantee is the floor. The eight-week protocol is the actual ask. Pick a tier and begin."
      />
    </div>
  );
}
