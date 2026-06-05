import {BadgeCheck} from 'lucide-react';
import {StarRating} from '~/components/lumina/StarRating';

interface Quote {
  body: string;
  name: string;
  role: string;
}

const QUOTES: Quote[] = [
  {
    body: 'Six weeks in and the difference is real — energy and drive both up. The transparency is what sold me.',
    name: 'Marcus R.',
    role: 'Apex subscriber',
  },
  {
    body: "Finally a brand that lists the actual doses. No mystery blends. I trust what I'm taking.",
    name: 'Daniela P.',
    role: 'Ascent subscriber',
  },
  {
    body: 'Clean, no jitters, no crash. It just works in the background. Cancelling was never a fight either.',
    name: 'Jordan T.',
    role: 'Legacy subscriber',
  },
];

export function SocialProof() {
  return (
    <section className="border-t border-border bg-black">
      <div className="mx-auto max-w-[1100px] px-6 py-24 md:px-10">
        <div className="mb-14 flex flex-col items-center text-center">
          <StarRating size={22} label="4.8 of 5 stars" />
          <div
            className="mt-5 text-fg1"
            style={{font: '300 34px/1 var(--font-sans)'}}
          >
            4.8 out of 5
          </div>
          <div className="mt-3 text-[15px] text-fg3">
            from 4,279 verified reviews
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {QUOTES.map((q) => (
            <div
              key={q.name}
              className="flex flex-col gap-5 rounded-lg border border-border bg-surface p-7"
            >
              <StarRating size={15} />
              <p
                className="m-0 flex-1 text-fg2"
                style={{font: '300 16px/1.6 var(--font-sans)'}}
              >
                &ldquo;{q.body}&rdquo;
              </p>
              <div className="flex items-center gap-2.5 border-t border-border pt-3">
                <span className="inline-flex h-[30px] w-[30px] items-center justify-center rounded-full border border-border-strong bg-surface-2 text-xs font-medium text-fg2">
                  {q.name[0]}
                </span>
                <div>
                  <div className="text-[13px] font-medium leading-tight text-fg1">
                    {q.name}
                  </div>
                  <div className="text-[11px] leading-tight text-fg4">
                    {q.role}
                  </div>
                </div>
                <BadgeCheck
                  size={16}
                  strokeWidth={2}
                  className="ml-auto text-crimson"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
