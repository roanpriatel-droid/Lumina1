import {Link} from 'react-router';
import {Button} from '~/components/lumina/Button';
import {Eyebrow} from '~/components/lumina/Eyebrow';
import {LUMINA_TIERS} from '~/lib/lumina-data';

export function TiersTeaser() {
  return (
    <section className="border-t border-border bg-black">
      <div className="mx-auto max-w-[1160px] px-6 py-24 md:px-10">
        <div className="mb-14 text-center">
          <Eyebrow className="mb-4">The commitment ladder</Eyebrow>
          <h2
            className="m-0 text-fg1"
            style={{
              font: '300 clamp(30px,3.4vw,44px)/1.1 var(--font-sans)',
              letterSpacing: '-0.01em',
            }}
          >
            Go deeper, pay less per bottle
          </h2>
          <p
            className="mx-auto mt-5 max-w-[480px] text-fg2"
            style={{font: '300 17px/1.6 var(--font-sans)'}}
          >
            Subscribe and the price steps down with every tier. Pause or cancel
            anytime.
          </p>
        </div>
        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-5">
          {LUMINA_TIERS.map((t) => (
            <div
              key={t.id}
              className="relative flex flex-col items-center gap-1.5 rounded-lg border bg-surface p-5 text-center"
              style={{
                borderColor: t.best
                  ? 'var(--color-crimson)'
                  : 'var(--color-border)',
                boxShadow: t.best
                  ? '0 0 0 1px var(--color-crimson), var(--shadow-accent)'
                  : 'none',
              }}
            >
              {t.best && (
                <span
                  className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded-xs bg-crimson px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.13em] text-white"
                  style={{top: -10, boxShadow: 'var(--shadow-accent)'}}
                >
                  Best Value
                </span>
              )}
              <span className="text-lg font-medium leading-none text-fg1">
                {t.name}
              </span>
              <span className="whitespace-nowrap text-xs leading-snug text-fg3">
                {t.months} {t.months === 1 ? 'mo' : 'mos'} · {t.bottles}{' '}
                {t.bottles === 1 ? 'btl' : 'btls'}
              </span>
              <span
                className="mt-2 text-fg1"
                style={{font: '300 26px/1 var(--font-sans)'}}
              >
                ${t.per}
              </span>
              <span className="t-mono text-[11px] text-fg4">/ bottle</span>
              <span
                className="mt-2 text-[11px] font-semibold uppercase tracking-[0.1em]"
                style={{
                  color: t.save
                    ? 'var(--color-crimson-hi)'
                    : 'var(--color-fg4)',
                }}
              >
                {t.save ? `Save ${t.save}%` : 'Base'}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-11 text-center">
          <Link to="/products/lumina-male-enhancement" prefetch="intent">
            <Button className="px-8 py-4 text-base">Start your protocol</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
