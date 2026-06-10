import {useRef} from 'react';
import {useGSAP} from '@gsap/react';
import {Moon, Sun} from 'lucide-react';
import {Eyebrow} from '~/components/lumina/Eyebrow';
import {fadeRise, parallaxLayer} from '~/lib/motion';

/**
 * Scene 7 — Ritual
 *
 * Split-screen "how it fits a day" — his is a nightly ritual (3 caps
 * before bed), hers is a daily ritual (2 caps in the morning). Each
 * half has a subtle parallax glow layer behind a centered ritual card.
 */
export function Ritual() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      fadeRise(ref.current?.querySelector('.ritual-eyebrow'));
      fadeRise(ref.current?.querySelector('.ritual-headline'), {delay: 0.05});

      const left = ref.current?.querySelector('.ritual-left .ritual-glow');
      const right = ref.current?.querySelector('.ritual-right .ritual-glow');
      parallaxLayer(left, {yPercent: 8, trigger: ref.current});
      parallaxLayer(right, {yPercent: -8, trigger: ref.current});

      const cards = ref.current?.querySelectorAll('.ritual-card');
      cards?.forEach((card, i) =>
        fadeRise(card, {start: 'top 75%', delay: i * 0.1}),
      );
    },
    {scope: ref},
  );

  return (
    <section
      ref={ref}
      className="relative isolate overflow-hidden border-t border-border bg-black"
    >
      <div className="mx-auto max-w-[1320px] px-6 py-28 md:px-10 md:py-36">
        <Eyebrow className="ritual-eyebrow mb-4">The ritual</Eyebrow>
        <h2
          className="ritual-headline m-0 mb-16 max-w-[840px] text-fg1"
          style={{
            font: '300 clamp(36px, 4.5vw, 52px)/1.05 var(--font-sans)',
            letterSpacing: '-0.015em',
          }}
        >
          Two cadences. One protocol. Built around your day.
        </h2>

        <div className="grid gap-5 md:grid-cols-2">
          <article
            className="ritual-left relative overflow-hidden rounded-2xl border border-border bg-surface px-8 py-10 md:px-12 md:py-16"
            style={{boxShadow: 'var(--shadow-md)'}}
          >
            <div
              aria-hidden
              className="ritual-glow pointer-events-none absolute"
              style={{
                width: 700,
                height: 700,
                left: '20%',
                top: '60%',
                transform: 'translate(-50%, -50%)',
                background:
                  'radial-gradient(closest-side, rgba(110,11,20,0.45), rgba(11,11,12,0) 70%)',
                opacity: 0.7,
              }}
            />
            <div className="ritual-card relative flex flex-col gap-5">
              <div
                className="inline-flex h-12 w-12 items-center justify-center rounded-lg border border-border"
                style={{
                  background:
                    'radial-gradient(closest-side, rgba(110,11,20,0.4), rgba(11,11,12,0))',
                }}
              >
                <Moon
                  size={22}
                  strokeWidth={1.75}
                  className="text-crimson-hi"
                />
              </div>
              <div className="t-mono text-[11px] uppercase tracking-[0.16em] text-fg3">
                His · Nightly
              </div>
              <h3
                className="m-0 text-fg1"
                style={{
                  font: '300 28px/1.15 var(--font-sans)',
                  letterSpacing: '-0.01em',
                }}
              >
                Three capsules. Before bed. Every night.
              </h3>
              <p
                className="m-0 max-w-[420px] text-fg3"
                style={{font: '300 16px/1.65 var(--font-sans)'}}
              >
                Magnesium aligns with the body&rsquo;s rebuild window. The
                botanicals work on a slow, traditional timeline. Make the
                dose part of how you close the day.
              </p>
              <div className="mt-3 flex flex-wrap gap-2.5">
                {['8pm–11pm', 'Water', 'No food required', 'Daily'].map((tag) => (
                  <span
                    key={tag}
                    className="t-mono inline-block rounded-pill border border-border bg-black px-3 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-fg3"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </article>

          <article
            className="ritual-right relative overflow-hidden rounded-2xl border border-border bg-surface px-8 py-10 md:px-12 md:py-16"
            style={{boxShadow: 'var(--shadow-md)'}}
          >
            <div
              aria-hidden
              className="ritual-glow pointer-events-none absolute"
              style={{
                width: 700,
                height: 700,
                right: '20%',
                top: '40%',
                transform: 'translate(50%, -50%)',
                background:
                  'radial-gradient(closest-side, rgba(209,26,42,0.32), rgba(11,11,12,0) 70%)',
                opacity: 0.7,
              }}
            />
            <div className="ritual-card relative flex flex-col gap-5">
              <div
                className="inline-flex h-12 w-12 items-center justify-center rounded-lg border border-border"
                style={{
                  background:
                    'radial-gradient(closest-side, rgba(209,26,42,0.3), rgba(11,11,12,0))',
                }}
              >
                <Sun
                  size={22}
                  strokeWidth={1.75}
                  className="text-crimson"
                />
              </div>
              <div className="t-mono text-[11px] uppercase tracking-[0.16em] text-fg3">
                Hers · Daily
              </div>
              <h3
                className="m-0 text-fg1"
                style={{
                  font: '300 28px/1.15 var(--font-sans)',
                  letterSpacing: '-0.01em',
                }}
              >
                Two capsules. With water. Any time of day.
              </h3>
              <p
                className="m-0 max-w-[420px] text-fg3"
                style={{font: '300 16px/1.65 var(--font-sans)'}}
              >
                The B-complex carries you through the day; the adaptogens
                build up on a slower curve. Pair with light movement and
                a sensible diet — they multiply.
              </p>
              <div className="mt-3 flex flex-wrap gap-2.5">
                {['Morning or midday', 'Water', 'With or without food', 'Daily'].map((tag) => (
                  <span
                    key={tag}
                    className="t-mono inline-block rounded-pill border border-border bg-black px-3 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-fg3"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
