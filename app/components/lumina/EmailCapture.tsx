import {useState} from 'react';
import {Mail, Check} from 'lucide-react';
import {Eyebrow} from '~/components/lumina/Eyebrow';
import {Button} from '~/components/lumina/Button';

interface EmailCaptureProps {
  eyebrow?: string;
  title?: string;
  body?: string;
  cta?: string;
}

/**
 * Email-capture band rendered above the footer on every Lumina content page.
 *
 * Submit is a no-op success state at the moment so the design is final;
 * TODO(newsletter): wire to a real subscription endpoint (Klaviyo / Postscript
 * / Shopify customer marketing consent) before launch.
 */
export function EmailCapture({
  eyebrow = 'Field notes',
  title = 'The science, plainly written.',
  body = "Once a fortnight: what's new in our testing, what we're seeing in the formula, what the category is up to. No spam.",
  cta = 'Subscribe',
}: EmailCaptureProps) {
  const [submitted, setSubmitted] = useState(false);

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
          <form
            className="flex flex-col gap-3 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
          >
            <label
              className="lumina-email-capture relative flex flex-1 items-center rounded-pill border border-border bg-black px-5"
              htmlFor="email-capture-input"
            >
              <Mail size={16} strokeWidth={2} className="mr-2 text-fg4" />
              <input
                id="email-capture-input"
                type="email"
                required
                placeholder="Email address"
                aria-label="Email address"
                className="flex-1 bg-transparent py-3.5 text-[15px] text-fg1 outline-none"
              />
            </label>
            <Button type="submit" className="px-7 py-3.5">
              {cta}
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
