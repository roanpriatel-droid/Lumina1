import {Link} from 'react-router';
import {Bottle} from '~/components/lumina/Bottle';
import {Button} from '~/components/lumina/Button';
import {Eyebrow} from '~/components/lumina/Eyebrow';

const TRUST = ['Clinically-Studied Ingredients', 'Vegan', 'Third-Party Tested'];

export function HomeHero() {
  return (
    <section
      className="relative flex flex-col items-center justify-center overflow-hidden px-6 pb-20 pt-32 text-center md:pt-40"
      style={{minHeight: '100vh'}}
    >
      {/* Signature glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          width: 1100,
          height: 1100,
          left: '50%',
          top: '56%',
          transform: 'translate(-50%,-50%)',
          background: 'var(--glow-hero)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 80% at 50% 100%, rgba(110,11,20,0.25), transparent 60%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 right-0 top-0 h-[200px]"
        style={{
          background:
            'linear-gradient(180deg, rgba(11,11,12,0.85), transparent)',
        }}
      />

      <div className="relative z-[2] flex max-w-[880px] flex-col items-center">
        <Eyebrow style={{color: 'var(--color-crimson-hi)', marginBottom: 26}}>
          Daily vitality, done properly
        </Eyebrow>
        <h1
          className="text-fg1"
          style={{
            font: '200 clamp(54px, 8vw, 104px)/0.98 var(--font-sans)',
            letterSpacing: '-0.02em',
          }}
        >
          Vitality,
          <br />
          <span style={{fontWeight: 300}}>formulated.</span>
        </h1>
        <div className="relative my-9">
          <Bottle width={132} />
        </div>
        <p
          className="m-0 max-w-[560px] text-fg2"
          style={{font: '300 20px/1.6 var(--font-sans)'}}
        >
          Two daily formulas built from clinically-studied actives — dosed at
          the levels studies actually used, tested every lot, and nothing
          hidden.
        </p>
        <div className="mt-9">
          <Link to="/products/lumina-male-enhancement" prefetch="intent">
            <Button className="px-9 py-[17px] text-base">
              Shop the Protocol
            </Button>
          </Link>
        </div>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
          {TRUST.map((label, i) => (
            <span
              key={label}
              className="flex items-center gap-4"
              style={{whiteSpace: 'nowrap'}}
            >
              {i > 0 && (
                <span
                  aria-hidden
                  className="inline-block h-[3px] w-[3px] rounded-full bg-fg4"
                />
              )}
              <span className="text-xs font-medium uppercase tracking-[0.16em] text-fg3">
                {label}
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
