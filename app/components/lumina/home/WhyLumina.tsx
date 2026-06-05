import {FlaskConical, ShieldCheck, MapPin, RotateCcw} from 'lucide-react';
import type {LucideIcon} from 'lucide-react';
import {Eyebrow} from '~/components/lumina/Eyebrow';

interface Pillar {
  Icon: LucideIcon;
  title: string;
  body: string;
}

const PILLARS: Pillar[] = [
  {
    Icon: FlaskConical,
    title: 'Clinically-Studied',
    body: 'Actives chosen for human research — and dosed to match it.',
  },
  {
    Icon: ShieldCheck,
    title: 'Third-Party Tested',
    body: 'Every lot screened for identity, potency, and purity.',
  },
  {
    Icon: MapPin,
    title: 'Made in USA',
    body: 'Produced in a cGMP-certified facility, start to finish.',
  },
  {
    Icon: RotateCcw,
    title: '60-Day Guarantee',
    body: "Not feeling it? Send it back within 60 days for a refund.",
  },
];

export function WhyLumina() {
  return (
    <section className="border-t border-border bg-black">
      <div className="mx-auto max-w-[1100px] px-6 py-24 md:px-10">
        <div className="mb-16 max-w-[620px]">
          <Eyebrow className="mb-5">Why Lumina</Eyebrow>
          <h2
            className="m-0 text-fg1"
            style={{
              font: '300 clamp(32px,3.6vw,46px)/1.12 var(--font-sans)',
              letterSpacing: '-0.01em',
            }}
          >
            Real ingredients, real doses,{' '}
            <span className="text-fg3">nothing for show.</span>
          </h2>
          <p
            className="mt-6 text-fg2"
            style={{font: '300 18px/1.65 var(--font-sans)'}}
          >
            The category runs on hype and hidden &ldquo;proprietary blends.&rdquo; We
            do the opposite — name every active, list every dose, and let the
            testing speak.
          </p>
        </div>
        <div
          className="grid overflow-hidden rounded-lg border border-border bg-border"
          style={{
            gap: '1px',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          }}
        >
          {PILLARS.map(({Icon, title, body}) => (
            <div
              key={title}
              className="flex min-h-[200px] flex-col gap-4 bg-surface p-7"
            >
              <Icon size={26} strokeWidth={2} className="text-crimson" />
              <div className="mt-2 text-[17px] font-medium leading-tight text-fg1">
                {title}
              </div>
              <p
                className="m-0 text-fg3"
                style={{font: '400 14px/1.55 var(--font-sans)'}}
              >
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
