import {Link} from 'react-router';
import {ArrowRight} from 'lucide-react';
import {Button} from '~/components/lumina/Button';
import {Eyebrow} from '~/components/lumina/Eyebrow';
import {LUMINA_PRODUCTS} from '~/lib/lumina-data';

export function IngredientStory() {
  const actives = LUMINA_PRODUCTS.male.actives.slice(0, 5);
  return (
    <section className="relative overflow-hidden border-t border-border">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, #0B0B0C 0%, #15080B 50%, #0B0B0C 100%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          width: 1000,
          height: 760,
          right: -180,
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'var(--glow-hero)',
          opacity: 0.8,
        }}
      />
      <div className="relative mx-auto grid max-w-[1100px] items-center gap-16 px-6 py-28 md:grid-cols-2 md:px-10">
        <div>
          <Eyebrow style={{color: 'var(--color-crimson-hi)', marginBottom: 20}}>
            The formula
          </Eyebrow>
          <h2
            className="m-0 text-fg1"
            style={{
              font: '300 clamp(32px,3.6vw,48px)/1.1 var(--font-sans)',
              letterSpacing: '-0.01em',
            }}
          >
            What&rsquo;s inside,
            <br />
            and exactly why.
          </h2>
          <p
            className="mt-6 max-w-[420px] text-fg2"
            style={{font: '300 18px/1.65 var(--font-sans)'}}
          >
            Citrulline for blood flow. Ginseng for stamina. Ashwagandha for the
            stress that blunts both. Each active earns its place — and we show
            the dose.
          </p>
          <div className="mt-9">
            <Link
              to="/products/lumina-male-enhancement"
              prefetch="intent"
            >
              <Button variant="secondary" className="px-7 py-4">
                See the full breakdown
                <ArrowRight size={16} strokeWidth={2} />
              </Button>
            </Link>
          </div>
        </div>
        <div
          className="flex flex-col overflow-hidden rounded-lg border border-border bg-border"
          style={{gap: '1px', backdropFilter: 'blur(2px)'}}
        >
          {actives.map((a) => (
            <div
              key={a.name}
              className="flex items-center justify-between gap-4 px-6 py-[18px]"
              style={{background: 'rgba(20,20,22,0.78)'}}
            >
              <span className="text-base font-medium text-fg1">{a.name}</span>
              <span className="t-mono whitespace-nowrap text-sm font-medium text-crimson-hi">
                {a.amount}
              </span>
            </div>
          ))}
          <div
            className="px-6 py-[15px] text-center text-[13px] text-fg3"
            style={{background: 'rgba(20,20,22,0.78)'}}
          >
            + 2 more actives, fully disclosed
          </div>
        </div>
      </div>
    </section>
  );
}
