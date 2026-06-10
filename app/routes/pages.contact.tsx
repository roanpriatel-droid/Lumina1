import {useState} from 'react';
import type {Route} from './+types/pages.contact';
import {Mail, MessageCircle, Clock3, Check} from 'lucide-react';
import {Eyebrow} from '~/components/lumina/Eyebrow';
import {Button} from '~/components/lumina/Button';
import {PageHero} from '~/components/lumina/PageChrome';
import {PageCta} from '~/components/lumina/PageCta';

export const meta: Route.MetaFunction = () => [
  {title: 'Contact — Lumina Formulations'},
  {
    name: 'description',
    content:
      'Write to us. Real human, real reply, usually within one business day. Email hello@luminaformulations.com or use the form.',
  },
];

const CHANNELS = [
  {
    Icon: Mail,
    eyebrow: 'Email',
    title: 'hello@luminaformulations.com',
    body: 'For orders, formula questions, COA requests, and anything else. A real person answers.',
  },
  {
    Icon: Clock3,
    eyebrow: 'Reply time',
    title: 'Same day on weekdays',
    body: 'Mon–Fri replies within one business day, often sooner. Weekend messages get answered Monday.',
  },
  {
    Icon: MessageCircle,
    eyebrow: 'What to include',
    title: 'Order number if you have one',
    body: "And the lot number from the bottom of the bottle if you're asking about a Certificate of Analysis.",
  },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div>
      <PageHero
        eyebrow="Contact"
        title="Write to a human. They write back."
        lede="No ticketing maze, no AI chatbot. Email us or use the form below — replies land within one business day during the week."
      />

      <section className="border-t border-border bg-surface">
        <div className="mx-auto grid max-w-[1200px] gap-12 px-6 py-20 md:grid-cols-[1fr_1fr] md:px-8">
          <div className="flex flex-col gap-5">
            {CHANNELS.map(({Icon, eyebrow, title, body}) => (
              <div
                key={eyebrow}
                className="rounded-xl border border-border bg-black px-6 py-6"
              >
                <div className="mb-3 flex items-center gap-3">
                  <div
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md"
                    style={{
                      background:
                        'radial-gradient(closest-side, rgba(209,26,42,0.22), rgba(11,11,12,0))',
                    }}
                  >
                    <Icon size={18} strokeWidth={1.75} className="text-crimson" />
                  </div>
                  <Eyebrow>{eyebrow}</Eyebrow>
                </div>
                <h3 className="m-0 text-[18px] font-medium leading-snug text-fg1">
                  {title}
                </h3>
                <p
                  className="m-0 mt-2 text-fg3"
                  style={{font: '400 14.5px/1.6 var(--font-sans)'}}
                >
                  {body}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-col">
            <Eyebrow>Send a message</Eyebrow>
            <h2
              className="m-0 mt-3 max-w-[460px] text-fg1"
              style={{
                font: '300 32px/1.15 var(--font-sans)',
                letterSpacing: '-0.01em',
              }}
            >
              Tell us what you need.
            </h2>
            <p
              className="m-0 mt-4 max-w-[460px] text-fg3"
              style={{font: '300 16px/1.65 var(--font-sans)'}}
            >
              We&rsquo;ll reply within one business day. If your message is
              about an order, including the order number speeds things up.
            </p>

            {submitted ? (
              <div
                role="status"
                className="mt-8 flex items-center gap-3 rounded-xl border border-crimson bg-black px-6 py-5 text-fg1"
                style={{boxShadow: 'var(--shadow-accent)'}}
              >
                <Check size={18} strokeWidth={2.4} className="text-crimson-hi" />
                <span className="text-sm font-medium">
                  Message received. We&rsquo;ll reply by end of next business
                  day.
                </span>
              </div>
            ) : (
              <form
                className="mt-8 flex flex-col gap-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <Field name="name" label="Your name" type="text" required />
                  <Field
                    name="email"
                    label="Email address"
                    type="email"
                    required
                  />
                </div>
                <Field
                  name="orderNumber"
                  label="Order number (optional)"
                  type="text"
                />
                <Field
                  name="subject"
                  label="Subject"
                  type="text"
                  required
                />
                <label
                  className="flex flex-col gap-2"
                  htmlFor="contact-message"
                >
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-fg3">
                    Message
                  </span>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={6}
                    className="rounded-md border border-border bg-black px-4 py-3 text-[15px] text-fg1 outline-none transition-colors focus:border-crimson"
                  />
                </label>
                <Button type="submit" className="self-start px-7 py-3.5">
                  Send message
                </Button>
                <p className="t-mono text-[11px] text-fg4">
                  By submitting this form you agree to be contacted about your
                  inquiry. We never sell your data.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      <PageCta />
    </div>
  );
}

function Field({
  name,
  label,
  type,
  required,
}: {
  name: string;
  label: string;
  type: string;
  required?: boolean;
}) {
  const id = `contact-${name}`;
  return (
    <label htmlFor={id} className="flex flex-col gap-2">
      <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-fg3">
        {label}
      </span>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        className="rounded-md border border-border bg-black px-4 py-3 text-[15px] text-fg1 outline-none transition-colors focus:border-crimson"
      />
    </label>
  );
}
