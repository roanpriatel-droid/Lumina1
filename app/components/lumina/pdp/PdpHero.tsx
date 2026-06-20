import {useRef} from 'react';
import {useGSAP} from '@gsap/react';
import {FlaskConical, ShieldCheck, MapPin, Sprout} from 'lucide-react';
import type {LucideIcon} from 'lucide-react';
import {Eyebrow} from '~/components/lumina/Eyebrow';
import {SplitLines} from '~/components/lumina/SplitLines';
import {PdpGallery} from '~/components/lumina/pdp/PdpGallery';
import {fadeRise, parallaxLayer, textReveal} from '~/lib/motion';
import type {LuminaProduct} from '~/lib/lumina-data';
import type {Gender} from '~/lib/product-assets';

interface PdpHeroProps {
  title: string;
  lumina: LuminaProduct | undefined;
  imageUrl?: string | null;
  imageAlt?: string | null;
}

function splitTitleIntoLines(title: string): string[] {
  // Prefer a clean break on the em-dash supply suffix; otherwise return one line.
  const sep = title.includes(' — ') ? ' — ' : null;
  if (sep) {
    const [first, ...rest] = title.split(sep);
    return [first, sep + rest.join(sep)];
  }
  return [title];
}

const TRUST: ReadonlyArray<{Icon: LucideIcon; label: string}> = [
  {Icon: FlaskConical, label: 'Clinically-Studied Ingredients'},
  {Icon: ShieldCheck, label: 'Third-Party Tested Every Lot'},
  {Icon: MapPin, label: 'Made in USA'},
  {Icon: Sprout, label: 'Non-GMO'},
];

export function PdpHero({title, lumina, imageUrl, imageAlt}: PdpHeroProps) {
  const tagline = lumina?.tagline ?? 'Daily vitality formula';
  const blurb = lumina?.blurb;
  const sectionRef = useRef<HTMLElement>(null);
  // Split the long product title into ~2 readable lines for the reveal.
  const titleLines = splitTitleIntoLines(title);
  const gender = lumina?.key;

  useGSAP(
    () => {
      textReveal(sectionRef.current?.querySelector('.pdp-title'), {
        start: 'top 85%',
      });
      fadeRise(sectionRef.current?.querySelector('.pdp-eyebrow'));
      fadeRise(sectionRef.current?.querySelector('.pdp-blurb'), {delay: 0.15});
      fadeRise(sectionRef.current?.querySelector('.pdp-trust'), {delay: 0.2});
      parallaxLayer(sectionRef.current?.querySelector('.pdp-gallery'), {
        yPercent: 6,
        trigger: sectionRef.current,
      });
    },
    {scope: sectionRef},
  );

  return (
    <section
      ref={sectionRef}
      className="mx-auto grid max-w-[1200px] items-center gap-12 px-6 pb-10 pt-14 md:grid-cols-[1.05fr_0.95fr] md:px-8 md:pt-20"
    >
      <PdpGallery
        gender={(gender as Gender) ?? 'male'}
        fallbackImageUrl={imageUrl}
        fallbackImageAlt={imageAlt}
        productTitle={title}
      />

      {/* Summary */}
      <div className="flex flex-col gap-5">
        <Eyebrow className="pdp-eyebrow">{tagline}</Eyebrow>
        <SplitLines
          lines={titleLines}
          as="h1"
          className="pdp-title m-0 text-fg1"
          style={{
            font: '300 clamp(34px,3.4vw,48px)/1.05 var(--font-sans)',
            letterSpacing: '-0.01em',
          }}
        />
        {blurb && (
          <p
            className="pdp-blurb m-0 max-w-[460px] text-fg2"
            style={{font: '300 18px/1.6 var(--font-sans)'}}
          >
            {blurb}
          </p>
        )}
        <div className="pdp-trust mt-1 flex flex-wrap gap-2.5">
          {TRUST.map(({Icon, label}) => (
            <div
              key={label}
              className="inline-flex items-center gap-2 rounded-pill border border-border bg-surface px-3.5 py-2.5"
            >
              <Icon size={15} strokeWidth={2} className="text-crimson" />
              <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-fg2">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
