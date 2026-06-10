import {useRef, useState} from 'react';
import {useGSAP} from '@gsap/react';
import type {Route} from './+types/pages.ingredients';
import {ChevronDown} from 'lucide-react';
import {Eyebrow} from '~/components/lumina/Eyebrow';
import {PageHero, Section} from '~/components/lumina/PageChrome';
import {PageCta} from '~/components/lumina/PageCta';
import {fadeRise, staggerChildren} from '~/lib/motion';

type Formula = 'his' | 'hers' | 'both';
type Goal =
  | 'energy'
  | 'drive'
  | 'balance'
  | 'recovery'
  | 'circulation'
  | 'hormonal';

interface IngredientCard {
  name: string;
  form?: string;
  formula: Formula;
  goals: Goal[];
  dose: string;
  used: string;
  body: string;
}

const INGREDIENTS: ReadonlyArray<IngredientCard> = [
  {
    name: 'Tribulus Terrestris',
    form: 'fruit',
    formula: 'his',
    goals: ['drive', 'recovery'],
    dose: '750 mg',
    used: 'Anchor botanical of the male formula. Traditionally used in Ayurvedic and Eastern European practice.',
    body: '750 mg is a real anchor dose, not a sprinkle. Where the category lists tribulus inside a 50 mg blend and calls it support, ours puts the dose where traditional preparations actually call for it. Traditionally used to support male vitality, stamina, and drive.',
  },
  {
    name: 'Tongkat Ali (Longjack)',
    form: 'root',
    formula: 'his',
    goals: ['drive', 'energy'],
    dose: '50 mg',
    used: 'Used for centuries across Indonesia and Malaysia.',
    body: 'Root extract used in traditional Southeast Asian practice to support male performance, energy under load, and stress resilience. We use the root, the part of the plant traditional preparations call for.',
  },
  {
    name: 'Zinc',
    form: 'as Zinc Oxide',
    formula: 'both',
    goals: ['hormonal', 'recovery'],
    dose: '30 mg (his) · 26 mg (hers)',
    used: 'Cofactor in 300+ enzymatic processes; most adults under-consume it.',
    body: 'Essential for normal testosterone metabolism, immune function, and recovery in the male formula (273% DV). In the female formula at 236% DV it supports skin health, immune function, and normal hormonal balance.',
  },
  {
    name: 'Magnesium',
    form: 'as Magnesium Oxide',
    formula: 'his',
    goals: ['recovery', 'energy'],
    dose: '200 mg',
    used: 'The foundation mineral for muscle function and restful sleep.',
    body: 'Cofactor in 300+ enzymatic processes. Supports muscle function, energy metabolism, and restful sleep — which is why the male formula is taken at night, lined up with the rebuild window.',
  },
  {
    name: 'Horny Goat Weed (Epimedium)',
    form: 'aerial',
    formula: 'both',
    goals: ['drive', 'circulation'],
    dose: '50 mg (his) · in blend (hers)',
    used: 'Traditional Chinese practice for libido and circulation.',
    body: 'A long-used botanical for libido and healthy circulation support. Present at a disclosed dose in the male formula and as part of the disclosed blend in the female formula.',
  },
  {
    name: 'Saw Palmetto Berries',
    formula: 'his',
    goals: ['hormonal'],
    dose: '50 mg',
    used: 'Best known for supporting normal prostate health.',
    body: 'A daily men&rsquo;s formula that ignores prostate support is missing half the assignment. Included at a disclosed dose for long-game support.',
  },
  {
    name: 'Hawthorn Berries',
    formula: 'his',
    goals: ['circulation'],
    dose: '50 mg',
    used: 'Traditional European botanical for cardiovascular wellness.',
    body: 'Supports healthy circulation and overall cardiovascular wellness. A clean botanical that has been part of European herbal practice for centuries.',
  },
  {
    name: 'Cissus Quadrangularis',
    form: 'stem',
    formula: 'his',
    goals: ['recovery'],
    dose: '50 mg',
    used: 'Used in traditional practice for joint comfort and recovery.',
    body: 'Supports joint comfort, recovery, and an active lifestyle. A botanical chosen for the active man who needs the formula to keep up with training.',
  },
  {
    name: 'Chrysin',
    form: 'seed',
    formula: 'his',
    goals: ['hormonal'],
    dose: '75 mg',
    used: 'Studied for its role in supporting normal hormonal balance.',
    body: 'A flavonoid studied for its role in supporting normal hormonal balance. Included at a meaningful disclosed dose, not as a label decoration.',
  },
  {
    name: 'Vitamin B12',
    form: 'methylcobalamin',
    formula: 'hers',
    goals: ['energy'],
    dose: '54 mcg (2,250% DV)',
    used: 'The energy vitamin; supports red blood cell formation and reduced fatigue.',
    body: 'Dosed at 2,250% DV — a level designed to actually move the needle for women running low. The B12 in the formula is the active methylated form, not a cheap synthetic.',
  },
  {
    name: 'Vitamin B6',
    formula: 'hers',
    goals: ['energy', 'hormonal'],
    dose: '3.8 mg (224% DV)',
    used: 'Supports energy, normal hormonal activity regulation, and neurotransmitter synthesis.',
    body: 'A cornerstone of the female formula&rsquo;s daily-energy backbone. B6 supports normal hormonal activity regulation, which lines up with the formula&rsquo;s balance pillar.',
  },
  {
    name: 'BioPerine® Black Pepper Extract',
    formula: 'hers',
    goals: ['energy'],
    dose: '1 mg',
    used: 'Patented absorption catalyst.',
    body: 'BioPerine® is a clinically-studied black pepper extract used to enhance the bioavailability of the nutrients alongside it. 1 mg is the studied dose — enough to do its job, included so the rest of the formula actually gets absorbed.',
  },
  {
    name: 'L-Arginine',
    formula: 'hers',
    goals: ['circulation'],
    dose: '100 mg',
    used: 'Amino acid for nitric oxide pathway support.',
    body: 'Supports normal circulation through the nitric oxide pathway. Part of the female formula&rsquo;s circulation pillar.',
  },
  {
    name: 'Ashwagandha',
    formula: 'hers',
    goals: ['balance', 'energy'],
    dose: 'in disclosed blend',
    used: 'Ayurvedic practice for stress resilience and balance.',
    body: 'The foundational adaptogen in the female formula. Used in Ayurveda for thousands of years to support the body&rsquo;s response to stress and a steady baseline. Included by name in the disclosed botanical blend.',
  },
  {
    name: 'Maca',
    formula: 'hers',
    goals: ['drive', 'energy'],
    dose: 'in disclosed blend',
    used: 'Peruvian Andean root; traditional vitality support.',
    body: 'Mineral-rich root traditionally used by Indigenous Peruvian communities for energy, mood support, and libido. Part of the disclosed botanical blend by name.',
  },
  {
    name: 'Dong Quai',
    formula: 'hers',
    goals: ['balance', 'circulation'],
    dose: 'in disclosed blend',
    used: 'The women&rsquo;s tonic of traditional Chinese medicine.',
    body: 'Sometimes called &ldquo;female ginseng,&rdquo; dong quai has been the most prescribed women&rsquo;s tonic in traditional Chinese practice for over 2,000 years — traditionally used to support balance, circulation, and cycle wellness.',
  },
  {
    name: 'Damiana',
    formula: 'hers',
    goals: ['balance', 'drive'],
    dose: 'in disclosed blend',
    used: 'Traditional Mexican botanical for relaxation and vitality.',
    body: 'A traditionally-used relaxation botanical from Mexico and Central America. Part of the female formula&rsquo;s balance pillar within the disclosed blend.',
  },
  {
    name: 'Ginkgo',
    formula: 'hers',
    goals: ['circulation'],
    dose: 'in disclosed blend',
    used: 'Traditional Chinese botanical for circulation support.',
    body: 'Supports normal circulation. Included in the disclosed botanical blend by name.',
  },
  {
    name: 'Asian Ginseng',
    formula: 'hers',
    goals: ['energy', 'drive'],
    dose: 'in disclosed blend',
    used: 'Traditional adaptogen; centuries of energy and vitality use.',
    body: 'A traditional adaptogen for energy and vitality. Disclosed in the female formula&rsquo;s blend.',
  },
];

const FORMULA_FILTERS: ReadonlyArray<{value: 'all' | Formula; label: string}> = [
  {value: 'all', label: 'All formulas'},
  {value: 'his', label: 'His'},
  {value: 'hers', label: 'Hers'},
  {value: 'both', label: 'Both'},
];

const GOAL_FILTERS: ReadonlyArray<{value: 'all' | Goal; label: string}> = [
  {value: 'all', label: 'All goals'},
  {value: 'energy', label: 'Energy'},
  {value: 'drive', label: 'Drive'},
  {value: 'balance', label: 'Balance'},
  {value: 'recovery', label: 'Recovery'},
  {value: 'circulation', label: 'Circulation'},
  {value: 'hormonal', label: 'Hormonal'},
];

export const meta: Route.MetaFunction = () => [
  {title: 'Ingredients Library — Lumina Formulations'},
  {
    name: 'description',
    content:
      'Every active across both Lumina formulas: dose, form, traditional use, and the reasoning. Filterable by formula and by goal.',
  },
];

export default function IngredientsPage() {
  const [formula, setFormula] = useState<'all' | Formula>('all');
  const [goal, setGoal] = useState<'all' | Goal>('all');
  const [open, setOpen] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      fadeRise(ref.current?.querySelector('h1'));
      fadeRise(ref.current?.querySelector('.ingredients-filters'), {delay: 0.1});
      staggerChildren(ref.current?.querySelector('.ingredients-grid'), '.ingredient-card', {
        start: 'top 80%',
        stagger: 0.05,
      });
    },
    {scope: ref},
  );

  const filtered = INGREDIENTS.filter((it) => {
    if (formula !== 'all' && it.formula !== formula && it.formula !== 'both') return false;
    if (goal !== 'all' && !it.goals.includes(goal)) return false;
    return true;
  });

  return (
    <div ref={ref}>
      <PageHero
        eyebrow="Ingredients library"
        title="Every active. Every dose. Every reason."
        lede="The full working ingredient list across both formulas, with the dose, the form, and the traditional or clinical rationale. Filter by formula or by what you&rsquo;re training the protocol for."
      />

      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-[1200px] px-6 py-12 md:px-8">
          <div className="ingredients-filters flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <FilterRow
              label="Formula"
              options={FORMULA_FILTERS}
              value={formula}
              onChange={(v) => setFormula(v as 'all' | Formula)}
            />
            <FilterRow
              label="Goal"
              options={GOAL_FILTERS}
              value={goal}
              onChange={(v) => setGoal(v as 'all' | Goal)}
            />
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-black">
        <div className="mx-auto max-w-[1200px] px-6 py-16 md:px-8 md:py-24">
          {filtered.length === 0 ? (
            <p
              className="m-0 text-fg3"
              style={{font: '400 15px/1.65 var(--font-sans)'}}
            >
              No ingredients match the current filters.
            </p>
          ) : (
            <div className="ingredients-grid grid gap-3 md:grid-cols-2">
              {filtered.map((it) => {
                const isOpen = open === it.name;
                return (
                  <article
                    key={it.name}
                    className="ingredient-card rounded-xl border border-border bg-surface"
                  >
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : it.name)}
                      aria-expanded={isOpen}
                      className="flex w-full items-start justify-between gap-5 px-6 py-5 text-left"
                    >
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <span className="t-mono text-[10.5px] font-semibold uppercase tracking-[0.16em] text-crimson-hi">
                            {it.formula === 'both' ? 'His · Hers' : it.formula === 'his' ? 'His' : 'Hers'}
                          </span>
                          {it.goals.map((g) => (
                            <span
                              key={g}
                              className="rounded-pill border border-border bg-black px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-fg3"
                            >
                              {g}
                            </span>
                          ))}
                        </div>
                        <h3 className="m-0 text-[17px] font-medium leading-snug text-fg1">
                          {it.name}
                          {it.form && (
                            <span className="ml-2 text-[12.5px] text-fg4">
                              {it.form}
                            </span>
                          )}
                        </h3>
                        <span className="t-mono text-[12.5px] font-medium text-crimson-hi">
                          {it.dose}
                        </span>
                      </div>
                      <ChevronDown
                        size={18}
                        strokeWidth={2}
                        className="mt-1 flex-none text-fg3 transition-transform"
                        style={{transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'}}
                      />
                    </button>
                    <div
                      className="grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out"
                      style={{gridTemplateRows: isOpen ? '1fr' : '0fr'}}
                    >
                      <div className="overflow-hidden">
                        <div className="border-t border-border px-6 py-5">
                          <p
                            className="m-0 text-[12.5px] uppercase tracking-[0.14em] text-fg4"
                          >
                            Traditional use
                          </p>
                          <p
                            className="m-0 mt-2 text-fg2"
                            style={{font: '400 14.5px/1.6 var(--font-sans)'}}
                            dangerouslySetInnerHTML={{__html: it.used}}
                          />
                          <p
                            className="m-0 mt-4 text-fg3"
                            style={{font: '400 14px/1.65 var(--font-sans)'}}
                            dangerouslySetInnerHTML={{__html: it.body}}
                          />
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Section
        eyebrow="Compliance"
        title="A note on language."
      >
        <p
          className="m-0 max-w-[760px] text-fg3"
          style={{font: '400 15.5px/1.7 var(--font-sans)'}}
        >
          Each ingredient page uses structure/function language — &ldquo;studied
          for,&rdquo; &ldquo;traditionally used for,&rdquo; &ldquo;supports.&rdquo;
          No ingredient on this page treats, cures, or prevents any disease.
          These statements have not been evaluated by the FDA.
        </p>
      </Section>

      <PageCta />
    </div>
  );
}

function FilterRow<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: ReadonlyArray<{value: T; label: string}>;
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <Eyebrow style={{color: 'var(--color-fg3)'}}>{label}</Eyebrow>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={value === opt.value}
            className="rounded-pill px-3.5 py-1.5 text-[11.5px] font-medium uppercase tracking-[0.1em] transition-[border-color,background] duration-150"
            style={{
              border:
                value === opt.value
                  ? '1px solid var(--color-crimson)'
                  : '1px solid var(--color-border)',
              background:
                value === opt.value ? 'var(--color-bg)' : 'var(--color-surface)',
              color:
                value === opt.value
                  ? 'var(--color-crimson-hi)'
                  : 'var(--color-fg2)',
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
