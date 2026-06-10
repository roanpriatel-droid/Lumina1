import type {Route} from './+types/pages.shipping';
import {Truck, Plane, Clock3, PackageCheck} from 'lucide-react';
import {Eyebrow} from '~/components/lumina/Eyebrow';
import {PageHero, Section} from '~/components/lumina/PageChrome';
import {EmailCapture} from '~/components/lumina/EmailCapture';
import {PageCta} from '~/components/lumina/PageCta';

export const meta: Route.MetaFunction = () => [
  {title: 'Shipping — Lumina Formulations'},
  {
    name: 'description',
    content:
      'Free US shipping on subscriptions. Same-day fulfillment on orders before 3pm ET. International shipping in 35 countries. Carbon-neutral courier.',
  },
];

const RATES = [
  {
    region: 'United States',
    sub: 'Free on subscriptions · $4 on one-time',
    timing: '2–5 business days',
    method: 'USPS Ground / UPS depending on weight',
  },
  {
    region: 'Canada',
    sub: '$12 flat · free over $150',
    timing: '5–10 business days',
    method: 'UPS Standard',
  },
  {
    region: 'United Kingdom & EU',
    sub: '$18 flat · free over $200',
    timing: '6–12 business days',
    method: 'DHL Express',
  },
  {
    region: 'Australia & New Zealand',
    sub: '$22 flat · free over $250',
    timing: '8–14 business days',
    method: 'DHL Express',
  },
];

const NOTES = [
  {
    Icon: Clock3,
    title: 'Same-day fulfillment cutoff',
    body: "Orders placed before 3pm ET on a business day go out the same day. After that, the next business day.",
  },
  {
    Icon: PackageCheck,
    title: 'Tracked from door to door',
    body: "Every shipment includes a tracking number — emailed and posted in your account. We're notified when something stalls and reach out before you have to.",
  },
  {
    Icon: Plane,
    title: 'Customs and duties',
    body: "International orders may be subject to customs duties and import taxes assessed by your country. These are the recipient's responsibility — we'd rather you knew upfront than be surprised.",
  },
];

export default function ShippingPage() {
  return (
    <div>
      <PageHero
        eyebrow="Shipping"
        title="Free on subscriptions. Fast on everything else."
        lede="Same-day fulfillment on weekday orders before 3pm ET. Tracked, insured, and reach you in 2–5 business days inside the US."
      />

      <Section
        eyebrow="Rates &amp; timing"
        title="Where we ship, and what it costs."
      >
        <div className="overflow-hidden rounded-xl border border-border">
          <div className="hidden grid-cols-[1.4fr_1.4fr_1fr_1.2fr] gap-x-6 border-b border-border bg-surface px-6 py-4 md:grid">
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-fg3">
              Region
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-fg3">
              Rate
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-fg3">
              Timing
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-fg3">
              Courier
            </span>
          </div>
          {RATES.map((r, i) => (
            <div
              key={r.region}
              className="grid grid-cols-1 gap-x-6 gap-y-3 bg-surface px-6 py-6 md:grid-cols-[1.4fr_1.4fr_1fr_1.2fr] md:py-5"
              style={{
                borderTop:
                  i > 0 ? '1px solid var(--color-border)' : 'none',
              }}
            >
              <span className="text-[16px] font-medium text-fg1">
                {r.region}
              </span>
              <span className="text-[14px] text-fg2">{r.sub}</span>
              <span className="text-[14px] text-fg2">{r.timing}</span>
              <span className="text-[14px] text-fg3">{r.method}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Things to know"
        title="The fine print, but readable."
        tone="dark"
      >
        <div className="grid gap-5 md:grid-cols-3">
          {NOTES.map(({Icon, title, body}) => (
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
        eyebrow="Lost &amp; stuck packages"
        title="If something doesn&rsquo;t arrive, we make it right."
      >
        <p
          className="m-0 max-w-[760px] text-fg2"
          style={{font: '300 17px/1.7 var(--font-sans)'}}
        >
          If a tracked shipment hasn&rsquo;t moved in five business days or
          shows delivered when it isn&rsquo;t, email us at{' '}
          <a
            href="mailto:hello@luminaformulations.com"
            className="text-crimson-hi hover:text-fg1"
          >
            hello@luminaformulations.com
          </a>{' '}
          with the order number. We&rsquo;ll open the case with the courier
          and ship a replacement if it&rsquo;s not recovered. You don&rsquo;t
          wait on the carrier — we do.
        </p>
        <div className="mt-10 flex items-center gap-4 rounded-xl border border-border bg-surface px-6 py-5">
          <Truck size={22} strokeWidth={1.75} className="text-crimson" />
          <p
            className="m-0 text-fg2"
            style={{font: '400 14.5px/1.55 var(--font-sans)'}}
          >
            Carbon-neutral shipping on every order — courier offsets paid by us,
            not added to your cart.
          </p>
        </div>
      </Section>

      <EmailCapture />
      <PageCta />
    </div>
  );
}
