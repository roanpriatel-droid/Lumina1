import {useFetcher} from 'react-router';
import {Mail, Check, AlertCircle} from 'lucide-react';
import {Eyebrow} from '~/components/lumina/Eyebrow';
import {Button} from '~/components/lumina/Button';

interface EmailCaptureProps {
  eyebrow?: string;
  title?: string;
  body?: string;
  cta?: string;
}

interface SubscribeResponse {
  ok?: true;
  error?: string;
}

/**
 * Email-capture band rendered above the footer on every Lumina content
 * page. Submits to /api/subscribe (resource route) which records
 * marketing consent through Shopify's Storefront customerCreate
 * mutation — the subscriber enters the Shopify customer-marketing
 * audience without needing a separate ESP integration upstream.
 *
 * Swap the action target if you later migrate to Klaviyo / Postscript
 * / Beehiiv — the form contract (POST email) doesn't change.
 */
export function EmailCapture({
  eyebrow = 'Field notes',
  title = 'The science, plainly written.',
  body = "Once a fortnight: what's new in our testing, what we're seeing in the formula, what the category is up to. No spam.",
  cta = 'Subscribe',
}: EmailCaptureProps) {
  const fetcher = useFetcher<SubscribeResponse>();
  const submitting = fetcher.state !== 'idle';
  const data = fetcher.data;
  const submitted = data?.ok === true;
  const error = data?.error ?? null;

  return (
    <section className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-[1100px] gap-10 px-6 py-16 md:grid-cols-[1.05fr_0.95fr] md:items-center md:px-8 md:py-20">
        <div>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h3
            className="m-0 mt-3 max-w-[460px] text-fg1"
            style={{
              font: '300 30px/1.15 var(--font-sans)',
              letterSpacing: '-0.01em',
            }}
          >
            {title}
          </h3>
          <p
            className="m-0 mt-4 max-w-[460px] text-fg3"
            style={{font: '300 16px/1.65 var(--font-sans)'}}
          >
            {body}
          </p>
        </div>
        {submitted ? (
          <div
            className="flex items-center gap-3 rounded-pill border border-crimson bg-black px-5 py-4 text-fg1"
            style={{boxShadow: 'var(--shadow-accent)'}}
            role="status"
          >
            <Check size={18} strokeWidth={2.4} className="text-crimson-hi" />
            <span className="text-sm font-medium">
              You&rsquo;re in. Look out for the first dispatch.
            </span>
          </div>
        ) : (
          <fetcher.Form
            method="post"
            action="/api/subscribe"
            className="flex flex-col gap-3"
          >
            <div className="flex flex-col gap-3 sm:flex-row">
              <label
                className="lumina-email-capture relative flex flex-1 items-center rounded-pill border border-border bg-black px-5"
                htmlFor="email-capture-input"
              >
                <Mail size={16} strokeWidth={2} className="mr-2 text-fg4" />
                <input
                  id="email-capture-input"
                  name="email"
                  type="email"
                  required
                  placeholder="Email address"
                  aria-label="Email address"
                  aria-invalid={error ? true : undefined}
                  disabled={submitting}
                  className="flex-1 bg-transparent py-3.5 text-[15px] text-fg1 outline-none disabled:opacity-60"
                />
              </label>
              <Button
                type="submit"
                disabled={submitting}
                className="px-7 py-3.5 disabled:opacity-60"
              >
                {submitting ? 'Subscribing…' : cta}
              </Button>
            </div>
            {error && (
              <div
                role="alert"
                className="flex items-center gap-2 text-[13px] text-crimson-hi"
              >
                <AlertCircle size={14} strokeWidth={2} />
                {error}
              </div>
            )}
          </fetcher.Form>
        )}
      </div>
    </section>
  );
}
