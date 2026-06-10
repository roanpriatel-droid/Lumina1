import type {Route} from './+types/pages.returns';
import {Heart, Mail, ShieldCheck, Wallet, Calendar} from 'lucide-react';
import {Eyebrow} from '~/components/lumina/Eyebrow';
import {PageHero, Section} from '~/components/lumina/PageChrome';
import {EmailCapture} from '~/components/lumina/EmailCapture';
import {PageCta} from '~/components/lumina/PageCta';

export const meta: Route.MetaFunction = () => [
  {title: '60-Day Guarantee — Lumina Formulations'},
  {
    name: 'description',
    content:
      "60-day money-back guarantee on every order. Empty bottles fine. No restocking fees, no shipping deductions, no return-merchandise gauntlet. If the formula isn't right for you, we refund you.",
  },
];

export default function ReturnsPage() {
  return (
    <div>
      <PageHero
        eyebrow="60-Day guarantee"
        title="If it's not right, you get your money back. Empty bottles fine."
        lede="We dose for 8–12 weeks of consistent use because that's when traditional botanicals are typically assessed. Sixty days is enough to know. If it isn't right, we refund you — and we mean refund, not store credit."
      />

      <section className="border-t border-border bg-surface">
        <div className="mx-auto grid max-w-[1200px] gap-12 px-6 py-20 md:grid-cols-[1.2fr_1fr] md:items-center md:px-8">
          <div>
            <Eyebrow style={{color: 'var(--color-crimson-hi)'}}>The promise</Eyebrow>
            <h2
              className="m-0 mt-4 text-fg1"
              style={{
                font: '300 38px/1.1 var(--font-sans)',
                letterSpacing: '-0.01em',
              }}
            >
              The full refund. No conditions you wouldn&rsquo;t want to live
              with on your own purchase.
            </h2>
            <ul className="mt-9 flex flex-col gap-4">
              {[
                {
                  Icon: Wallet,
                  body: 'Full refund of what you paid, including original shipping. Not store credit. Not "a discount on your next order." Money back.',
                },
                {
                  Icon: Calendar,
                  body: '60 days from the date your order was placed. Plenty of runway to give the formula the consistent 8-week assessment it deserves.',
                },
                {
                  Icon: Heart,
                  body: "Empty bottles fine. If you ran the formula for the full eight weeks and decided it wasn't right, that's exactly when we want you to be able to walk away cleanly.",
                },
                {
                  Icon: ShieldCheck,
                  body: 'No restocking fees, no return-merchandise gauntlet, no retention script. Email us and you get your money back.',
                },
              ].map(({Icon, body}, i) => (
                <li
                  key={i}
                  className="flex items-start gap-4"
                >
                  <Icon
                    size={22}
                    strokeWidth={1.75}
                    className="mt-0.5 flex-none text-crimson"
                  />
                  <span
                    className="text-fg2"
                    style={{font: '400 15.5px/1.65 var(--font-sans)'}}
                  >
                    {body}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <aside
            className="relative overflow-hidden rounded-2xl border border-crimson bg-black px-7 py-8 md:px-9 md:py-10"
            style={{boxShadow: 'var(--shadow-accent)'}}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'radial-gradient(closest-side at 50% 100%, rgba(209,26,42,0.22), rgba(11,11,12,0) 70%)',
              }}
            />
            <Eyebrow style={{color: 'var(--color-crimson-hi)'}}>
              How to start a refund
            </Eyebrow>
            <h3
              className="m-0 mt-4 text-[24px] font-medium leading-snug text-fg1"
            >
              One email. One reply. One refund.
            </h3>
            <p
              className="m-0 mt-4 text-fg2"
              style={{font: '300 15px/1.65 var(--font-sans)'}}
            >
              Write to{' '}
              <a
                href="mailto:hello@luminaformulations.com?subject=Refund%20request"
                className="text-crimson-hi hover:text-fg1"
              >
                hello@luminaformulations.com
              </a>{' '}
              with your order number and a sentence on why the formula
              wasn&rsquo;t right. We&rsquo;ll reply within one business day and
              start the refund — typically settled in 3–5 business days back to
              the original payment method.
            </p>
            <a
              href="mailto:hello@luminaformulations.com?subject=Refund%20request"
              className="mt-7 inline-flex items-center gap-3 rounded-pill bg-crimson px-6 py-3.5 text-[14px] font-medium text-white transition-[background,transform] hover:bg-crimson-hi active:translate-y-px"
            >
              <Mail size={15} strokeWidth={2} />
              Start a refund
            </a>
          </aside>
        </div>
      </section>

      <Section
        eyebrow="Edge cases"
        title="The questions worth answering up front."
        tone="dark"
      >
        <div className="grid gap-3">
          {[
            {
              q: 'What if I subscribed and want to refund a single shipment?',
              a: 'You can cancel the subscription from your account in two clicks. We refund any unwanted shipment within the 60-day window. No questions.',
            },
            {
              q: 'Do I need to ship the bottles back?',
              a: "Usually no — that's wasteful for both of us. For a single-bottle order, just confirm in the email. For multi-bottle orders, we may ask you to return unopened bottles; we cover the return label.",
            },
            {
              q: 'What about a Duo bundle?',
              a: 'Same policy. Run one formula, decide on the other. We refund the unused half — or both — within 60 days, no math required.',
            },
            {
              q: 'What if the bottle was damaged in transit?',
              a: "Send us a photo and we'll ship a replacement same day. Damage in transit isn't a refund — it's a replacement, our cost.",
            },
            {
              q: 'What if it&rsquo;s been more than 60 days?',
              a: "Write to us anyway. The guarantee window is firm, but if something genuinely went wrong with the formula we'd rather make it right than hide behind a date.",
            },
          ].map(({q, a}) => (
            <article
              key={q}
              className="rounded-xl border border-border bg-surface px-7 py-7"
            >
              <h3
                className="m-0 text-[18px] font-medium leading-snug text-fg1"
                dangerouslySetInnerHTML={{__html: q}}
              />
              <p
                className="m-0 mt-3 max-w-[760px] text-fg3"
                style={{font: '400 14.5px/1.65 var(--font-sans)'}}
              >
                {a}
              </p>
            </article>
          ))}
        </div>
      </Section>

      <EmailCapture />
      <PageCta />
    </div>
  );
}
