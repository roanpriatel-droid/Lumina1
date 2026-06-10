import type {Route} from './+types/pages.subscriptions';
import {
  PauseCircle,
  SkipForward,
  XCircle,
  Truck,
  Percent,
  Calendar,
} from 'lucide-react';
import {Eyebrow} from '~/components/lumina/Eyebrow';
import {PageHero, Section} from '~/components/lumina/PageChrome';
import {EmailCapture} from '~/components/lumina/EmailCapture';
import {PageCta} from '~/components/lumina/PageCta';

export const meta: Route.MetaFunction = () => [
  {title: 'Subscriptions — Lumina Formulations'},
  {
    name: 'description',
    content:
      'Subscribe to any Lumina formula and save 15%. Free shipping. Pause, skip, or cancel anytime from your account — no calls, no friction. The formulas are built for daily use; this is the easiest way to actually take them.',
  },
];

const BENEFITS = [
  {
    Icon: Percent,
    title: 'Save 15% on every bottle',
    body: "The 15% discount applies to every shipment for as long as the subscription runs — never just the first order, never a 'first month only' trick.",
  },
  {
    Icon: Truck,
    title: 'Ships free, every time',
    body: "Subscriber orders ship free in the US. International rates discounted off our standard table — no fuel surcharges, no surprise add-ons at the cart.",
  },
  {
    Icon: Calendar,
    title: 'Cadence that matches your supply',
    body: "Pick the cadence that matches the bottle count you ordered. A 6-month supply ships every six months — not every month with a stack of bottles piling up.",
  },
];

const FLEX = [
  {
    Icon: PauseCircle,
    title: 'Pause',
    body: "Going on vacation? Out of town for a month? Pause your sub from your account in two clicks. Resume when you're back.",
  },
  {
    Icon: SkipForward,
    title: 'Skip',
    body: 'Got an extra bottle on the shelf? Skip the next shipment without canceling. The cadence resumes after.',
  },
  {
    Icon: XCircle,
    title: 'Cancel',
    body: "Cancel anytime, from your account, in two clicks. No phone calls, no retention scripts, no 'are you sure' loops. The button says cancel and that's what it does.",
  },
];

export default function SubscriptionsPage() {
  return (
    <div>
      <PageHero
        eyebrow="Subscriptions"
        title="The easiest way to actually take the formula."
        lede="These formulas are built for daily use over 8–12 weeks. A subscription is the friction-free way to do that — 15% off every bottle, ships free, pause or cancel anytime from your account."
      />

      <Section
        eyebrow="The deal"
        title="What subscribing gets you."
      >
        <div className="grid gap-5 md:grid-cols-3">
          {BENEFITS.map(({Icon, title, body}) => (
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
              >
                {body}
              </p>
            </article>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="The flexibility"
        title="Pause. Skip. Cancel. No calls."
        lede="Subscriptions stick when they're easy to leave. Every control lives in your account, two clicks deep, no retention script in the way."
        tone="dark"
      >
        <div className="grid gap-5 md:grid-cols-3">
          {FLEX.map(({Icon, title, body}) => (
            <article
              key={title}
              className="relative flex flex-col gap-4 overflow-hidden rounded-xl border border-border bg-surface px-7 py-7"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'radial-gradient(closest-side at 100% 0%, rgba(209,26,42,0.14), rgba(11,11,12,0) 60%)',
                }}
              />
              <div
                className="relative inline-flex h-11 w-11 items-center justify-center rounded-md"
                style={{
                  background:
                    'radial-gradient(closest-side, rgba(209,26,42,0.22), rgba(11,11,12,0))',
                }}
              >
                <Icon size={22} strokeWidth={1.75} className="text-crimson" />
              </div>
              <h3 className="relative m-0 text-[20px] font-medium leading-snug text-fg1">
                {title}
              </h3>
              <p
                className="relative m-0 text-fg3"
                style={{font: '400 14.5px/1.6 var(--font-sans)'}}
              >
                {body}
              </p>
            </article>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="How it works"
        title="From order to next-shipment, plainly."
      >
        <ol className="flex flex-col gap-4">
          {[
            'Choose Subscribe & Save on any formula. 15% applies automatically.',
            'Your first shipment goes out the same day if you order before 3pm ET.',
            'Your next shipment is scheduled for the end of your current supply — a 30-day supply ships monthly, a 90-day supply quarterly, and so on.',
            'Adjust cadence, pause, skip, or cancel from your account at any time. We send a reminder email 5 days before any shipment so you can adjust.',
            'Save 15% on every shipment for as long as the subscription runs. Never just the first one.',
          ].map((step, i) => (
            <li
              key={step}
              className="grid gap-4 rounded-lg border border-border bg-surface px-5 py-5 md:grid-cols-[auto_1fr] md:items-baseline md:px-7"
            >
              <span
                className="t-mono text-[14px] uppercase tracking-[0.14em] text-crimson-hi"
                style={{lineHeight: 1}}
              >
                0{i + 1}
              </span>
              <p
                className="m-0 text-fg2"
                style={{font: '400 15.5px/1.6 var(--font-sans)'}}
              >
                {step}
              </p>
            </li>
          ))}
        </ol>
      </Section>

      <EmailCapture />
      <PageCta
        title="Start the subscription. Save 15% on every bottle."
        body="Subscribe and save 15%, ships free, pause or cancel anytime. The formulas are dosed for 8–12 weeks of consistent use — this is how you actually take them."
      />
    </div>
  );
}
