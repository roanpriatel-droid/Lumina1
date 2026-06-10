import {Link} from 'react-router';
import {Factory, FlaskConical, FileText, ArrowUpRight} from 'lucide-react';
import {Eyebrow} from '~/components/lumina/Eyebrow';

const PROOFS = [
  {
    Icon: Factory,
    title: 'Manufactured in the United States',
    body: 'Made in cGMP-certified facilities under the standards the FDA expects of a serious supplement manufacturer.',
  },
  {
    Icon: FlaskConical,
    title: 'Every lot, independently tested',
    body: 'Identity, potency, heavy metals, microbials. Tested by an independent third-party lab — not by us, not by the manufacturer.',
  },
  {
    Icon: FileText,
    title: 'Certificate of Analysis on request',
    body: 'If you want to see the paperwork for the lot you bought, email us and we&rsquo;ll send it. That&rsquo;s the entire promise.',
  },
];

export function QualityTesting() {
  return (
    <section className="border-t border-border bg-black">
      <div className="mx-auto max-w-[1200px] px-6 py-20 md:px-8">
        <Eyebrow className="mb-4">Quality &amp; testing</Eyebrow>
        <h2
          className="m-0 mb-4 max-w-[760px] text-fg1"
          style={{
            font: '300 38px/1.1 var(--font-sans)',
            letterSpacing: '-0.01em',
          }}
        >
          The category lies. We don&rsquo;t.
        </h2>
        <p
          className="m-0 mb-12 max-w-[680px] text-fg3"
          style={{font: '300 17px/1.65 var(--font-sans)'}}
        >
          Supplements are one of the easiest places in commerce to cut corners.
          Here&rsquo;s the bar we hold ourselves to.
        </p>

        <div className="grid gap-5 md:grid-cols-3">
          {PROOFS.map(({Icon, title, body}) => (
            <div
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
                dangerouslySetInnerHTML={{__html: body}}
              />
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-5 text-sm">
          <Link
            to="/pages/the-science"
            prefetch="intent"
            className="inline-flex items-center gap-2 text-fg2 transition-colors hover:text-crimson-hi"
          >
            Read our formulation philosophy{' '}
            <ArrowUpRight size={15} strokeWidth={2} />
          </Link>
          <Link
            to="/pages/sourcing"
            prefetch="intent"
            className="inline-flex items-center gap-2 text-fg2 transition-colors hover:text-crimson-hi"
          >
            See where we source and test{' '}
            <ArrowUpRight size={15} strokeWidth={2} />
          </Link>
        </div>
      </div>
    </section>
  );
}
