import {useState} from 'react';
import {BrandFallback} from '~/components/lumina/BrandFallback';
import {Button} from '~/components/lumina/Button';
import {Eyebrow} from '~/components/lumina/Eyebrow';
import {Mail, Check} from 'lucide-react';

interface ComingSoonHeroProps {
  eyebrow: string;
  name: string;
  promise: string;
  bullets: ReadonlyArray<string>;
  /** Tag shown above the bottle, e.g. "In formulation". */
  status?: string;
  /** Color used to tint the bottle / glow. Defaults to brand crimson. */
  accent?: 'crimson' | 'oxblood';
}

/**
 * Hero for a Coming Soon product page. Identity carried by the bottle and
 * the typography; no fake price, no fake reviews, no countdown drama. The
 * email capture is the only conversion surface.
 */
export function ComingSoonHero({
  eyebrow,
  name,
  promise,
  bullets,
  status = 'In formulation',
  accent = 'crimson',
}: ComingSoonHeroProps) {
  const [joined, setJoined] = useState(false);

  return (
    <section className="relative overflow-hidden bg-black">
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          width: 1100,
          height: 1100,
          left: '50%',
          top: '52%',
          transform: 'translate(-50%,-50%)',
          background:
            accent === 'crimson'
              ? 'var(--glow-hero)'
              : 'radial-gradient(closest-side, rgba(110,11,20,0.55), rgba(58,6,12,0.35) 38%, rgba(11,11,12,0) 70%)',
          opacity: 0.65,
        }}
      />
      <div className="relative mx-auto grid max-w-[1200px] items-center gap-12 px-6 pb-24 pt-24 md:grid-cols-[0.95fr_1.05fr] md:gap-16 md:px-8 md:pt-32">
        <div className="relative flex flex-col items-center justify-center">
          <div className="relative">
            <div className="relative z-[1]">
              <BrandFallback
                width={200}
                accent={accent}
                caption={name}
              />
            </div>
            <span
              className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-full rounded-pill border border-crimson bg-black px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-crimson-hi"
              style={{boxShadow: 'var(--shadow-accent)'}}
            >
              {status}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <Eyebrow style={{color: 'var(--color-crimson-hi)'}}>{eyebrow}</Eyebrow>
          <h1
            className="m-0 text-fg1"
            style={{
              font: '300 clamp(42px, 5.4vw, 68px)/1.05 var(--font-sans)',
              letterSpacing: '-0.015em',
            }}
          >
            {name}
            <sup
              className="text-fg3"
              style={{font: '300 0.32em/1 var(--font-sans)', verticalAlign: 'super', marginLeft: 4}}
            >
              ™
            </sup>
          </h1>
          <p
            className="m-0 max-w-[520px] text-fg2"
            style={{font: '300 19px/1.6 var(--font-sans)'}}
          >
            {promise}
          </p>

          <ul className="mt-1 flex flex-col gap-2.5">
            {bullets.map((b) => (
              <li
                key={b}
                className="flex items-start gap-2.5 text-fg2"
                style={{font: '400 15px/1.55 var(--font-sans)'}}
              >
                <span
                  aria-hidden
                  className="mt-2 inline-block h-1 w-1 flex-none rounded-full bg-crimson"
                />
                {b}
              </li>
            ))}
          </ul>

          {joined ? (
            <div
              role="status"
              className="mt-4 inline-flex items-center gap-3 self-start rounded-pill border border-crimson bg-black px-5 py-3 text-fg1"
              style={{boxShadow: 'var(--shadow-accent)'}}
            >
              <Check size={16} strokeWidth={2.4} className="text-crimson-hi" />
              <span className="text-sm font-medium">
                You&rsquo;re on the list. You&rsquo;ll be first to know.
              </span>
            </div>
          ) : (
            <form
              className="mt-4 flex w-full max-w-[480px] flex-col gap-3 sm:flex-row"
              onSubmit={(e) => {
                e.preventDefault();
                setJoined(true);
              }}
            >
              <label
                htmlFor={`coming-${eyebrow.replace(/\s+/g, '-').toLowerCase()}`}
                className="relative flex flex-1 items-center rounded-pill border border-border bg-surface px-5"
              >
                <Mail size={16} strokeWidth={2} className="mr-2 text-fg4" />
                <input
                  id={`coming-${eyebrow.replace(/\s+/g, '-').toLowerCase()}`}
                  type="email"
                  required
                  placeholder="Email address"
                  aria-label="Email address"
                  className="flex-1 bg-transparent py-3.5 text-[15px] text-fg1 outline-none"
                />
              </label>
              <Button type="submit" className="px-6 py-3.5">
                Join the list
              </Button>
            </form>
          )}
          <p className="t-mono text-[11px] text-fg4">
            * One email when the formula goes live. No drip campaign, no
            countdown timers.
          </p>
        </div>
      </div>
    </section>
  );
}
