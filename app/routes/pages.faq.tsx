import {useRef, useState, useMemo} from 'react';
import {useGSAP} from '@gsap/react';
import type {Route} from './+types/pages.faq';
import {Plus, Search} from 'lucide-react';
import {Eyebrow} from '~/components/lumina/Eyebrow';
import {PageHero} from '~/components/lumina/PageChrome';
import {PageCta} from '~/components/lumina/PageCta';
import {fadeRise, staggerChildren} from '~/lib/motion';

type Group = 'Product' | 'Subscriptions' | 'Shipping' | 'Guarantee' | 'Ingredients';

interface Q {
  group: Group;
  q: string;
  a: string;
}

const FAQS: ReadonlyArray<Q> = [
  // Product
  {
    group: 'Product',
    q: 'How long until I notice anything?',
    a: 'The mineral and B-complex pieces can register inside the first one or two weeks. Botanicals and adaptogens are traditionally used over weeks — the supplier&rsquo;s own instruction is a minimum 8-week run for best assessment.',
  },
  {
    group: 'Product',
    q: 'Why do you take the male formula at night?',
    a: '200 mg of magnesium supports muscle function and restful sleep, and the body does its actual rebuild while you sleep. Taking the formula before bed lines the dose up with when your body is using it.',
  },
  {
    group: 'Product',
    q: 'Can I take this with other supplements?',
    a: 'Most stacks are fine. If you&rsquo;re already taking a high-zinc or magnesium supplement, account for the doses already in the Lumina formula so you don&rsquo;t double up. Talk to your doctor about any prescription interactions.',
  },
  {
    group: 'Product',
    q: 'Who shouldn&rsquo;t take this?',
    a: 'Pregnant or nursing mothers, anyone under 18, and individuals with a known medical condition should consult a physician before using this or any dietary supplement.',
  },
  {
    group: 'Product',
    q: 'Does the female formula contain caffeine?',
    a: 'No. The energy comes from the B-vitamin complex and the adaptogenic botanicals — not from a stimulant. Some women take it in the morning, some midday. There is no wrong time.',
  },

  // Subscriptions
  {
    group: 'Subscriptions',
    q: 'How does the subscription work?',
    a: "Subscribe and you save 15% on every bottle, ship free, and can pause, skip, or cancel any time from your account in two clicks. The cadence matches the supply length you chose — a 6-month supply ships every six months, not monthly.",
  },
  {
    group: 'Subscriptions',
    q: 'Can I pause my subscription?',
    a: "Yes — from your account in two clicks. No phone call, no retention script. Resume when you're ready.",
  },
  {
    group: 'Subscriptions',
    q: 'Can I switch supply lengths on a subscription?',
    a: 'Yes. Cancel the current sub and start a new one at the new tier — your discount applies on every shipment for as long as it runs.',
  },
  {
    group: 'Subscriptions',
    q: 'Is the 15% discount on every shipment or only the first?',
    a: 'Every shipment, for as long as the subscription runs. Never just the first one.',
  },

  // Shipping
  {
    group: 'Shipping',
    q: 'When does my order ship?',
    a: 'Same-day on weekday orders placed before 3pm ET; next business day otherwise. Tracked, insured, delivered in 2–5 business days inside the US.',
  },
  {
    group: 'Shipping',
    q: 'Do you ship internationally?',
    a: 'Yes — Canada, the UK and EU, and Australia/New Zealand. Rates and timing are listed at /pages/shipping.',
  },
  {
    group: 'Shipping',
    q: 'What if my package is lost or stuck?',
    a: 'If a tracked shipment hasn&rsquo;t moved in five business days or shows delivered when it isn&rsquo;t, email us with the order number. We open the case with the courier and ship a replacement if it&rsquo;s not recovered. You don&rsquo;t wait on the carrier — we do.',
  },
  {
    group: 'Shipping',
    q: 'Are shipping carbons offset?',
    a: 'Yes. Every order ships carbon-neutral — the courier offsets are paid by us, not added to your cart.',
  },

  // Guarantee
  {
    group: 'Guarantee',
    q: 'What does the 60-Day Guarantee cover?',
    a: 'A full refund — money back on the original payment method, not store credit, not a discount on your next order. Empty bottles fine.',
  },
  {
    group: 'Guarantee',
    q: 'How do I start a refund?',
    a: 'Email hello@luminaformulations.com with your order number and a sentence on why the formula wasn&rsquo;t right. We reply within one business day and settle the refund in 3–5 business days.',
  },
  {
    group: 'Guarantee',
    q: 'Do I have to ship the bottles back?',
    a: 'Usually no — that&rsquo;s wasteful for both of us. For single-bottle orders, confirming in the email is enough. For multi-bottle orders we may ask you to return unopened bottles; we cover the return label.',
  },
  {
    group: 'Guarantee',
    q: 'What if it&rsquo;s been more than 60 days?',
    a: 'Write to us anyway. The window is firm, but if something genuinely went wrong with the formula we&rsquo;d rather make it right than hide behind a date.',
  },

  // Ingredients
  {
    group: 'Ingredients',
    q: 'Why do you disclose every dose?',
    a: 'Because the alternative is hiding behind a proprietary blend, and that has earned the supplement category its reputation. We print every mg so you can compare us to anything on the shelf.',
  },
  {
    group: 'Ingredients',
    q: 'Why is the female blend partially proprietary?',
    a: 'We disclose every botanical in the blend by name and the exact total weight (802 mg). Per-ingredient doses inside the blend remain proprietary at this revision — more transparency than the category standard, but less than we want long-term. We&rsquo;re working with the formulator on a fully open-dose version.',
  },
  {
    group: 'Ingredients',
    q: 'Where are the ingredients sourced?',
    a: 'See /pages/sourcing for the full chain of custody. Raw materials are qualified by audit, manufactured in the United States in cGMP facilities, then tested by an independent lab before release.',
  },
  {
    group: 'Ingredients',
    q: 'Is the formula gluten-free / GMO-free?',
    a: 'Yes to both. Tested by ELISA when applicable; both formulas are gluten-free and non-GMO.',
  },
];

const GROUPS: ReadonlyArray<Group> = [
  'Product',
  'Subscriptions',
  'Shipping',
  'Guarantee',
  'Ingredients',
];

export const meta: Route.MetaFunction = () => [
  {title: 'FAQ — Lumina Formulations'},
  {
    name: 'description',
    content:
      'Every question we get most, grouped and searchable. The protocol, subscriptions, shipping, guarantee, and ingredients — answered honestly.',
  },
];

export default function FaqPage() {
  const [query, setQuery] = useState('');
  const [openKey, setOpenKey] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      fadeRise(ref.current?.querySelector('.faq-search-bar'));
      const groups = ref.current?.querySelectorAll('.faq-group');
      groups?.forEach((g) => {
        fadeRise(g.querySelector('.faq-group-header'));
        staggerChildren(g.querySelector('.faq-group-list'), '.faq-row', {
          start: 'top 85%',
          stagger: 0.05,
        });
      });
    },
    {scope: ref},
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FAQS.filter((row) => {
      if (!q) return true;
      return (
        row.q.toLowerCase().includes(q) ||
        row.a.toLowerCase().includes(q) ||
        row.group.toLowerCase().includes(q)
      );
    });
  }, [query]);

  return (
    <div ref={ref}>
      <PageHero
        eyebrow="FAQ"
        title="Every question, answered honestly."
        lede="The full catalogue, grouped by topic and searchable. If the answer you need isn&rsquo;t here, write to us — a real human replies within a business day."
      />

      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-[1000px] px-6 py-10 md:px-8">
          <label
            className="faq-search-bar relative flex items-center rounded-pill border border-border bg-black px-5"
          >
            <Search size={16} strokeWidth={2} className="mr-2 text-fg4" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the FAQ…"
              className="flex-1 bg-transparent py-3.5 text-[15px] text-fg1 outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="text-[11px] font-semibold uppercase tracking-[0.12em] text-fg4 transition-colors hover:text-crimson-hi"
                aria-label="Clear search"
              >
                Clear
              </button>
            )}
          </label>
          {query && (
            <p className="mt-3 text-[12px] text-fg4">
              {filtered.length} match{filtered.length === 1 ? '' : 'es'} for {' '}
              <span className="t-mono text-crimson-hi">&ldquo;{query}&rdquo;</span>
            </p>
          )}
        </div>
      </section>

      {GROUPS.map((g) => {
        const rows = filtered.filter((r) => r.group === g);
        if (rows.length === 0) return null;
        return (
          <section
            key={g}
            className="faq-group border-t border-border bg-black"
          >
            <div className="mx-auto max-w-[1000px] px-6 py-16 md:px-8 md:py-20">
              <div className="faq-group-header mb-8 flex items-center gap-4">
                <Eyebrow style={{color: 'var(--color-crimson-hi)'}}>
                  {g}
                </Eyebrow>
                <span className="t-mono text-[10.5px] uppercase tracking-[0.14em] text-fg4">
                  · {rows.length} question{rows.length === 1 ? '' : 's'}
                </span>
              </div>
              <div className="faq-group-list flex flex-col">
                {rows.map((row, i) => {
                  const key = `${g}-${row.q}`;
                  const isOpen = openKey === key;
                  return (
                    <div
                      key={key}
                      className="faq-row border-b border-border"
                      style={{
                        borderTop: i === 0 ? '1px solid var(--color-border)' : 'none',
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => setOpenKey(isOpen ? null : key)}
                        aria-expanded={isOpen}
                        className="flex w-full items-center gap-5 py-5 text-left"
                      >
                        <span
                          className="flex-1 text-fg1"
                          style={{font: '400 17px/1.4 var(--font-sans)'}}
                        >
                          {row.q}
                        </span>
                        <Plus
                          size={20}
                          strokeWidth={2}
                          className="flex-none text-fg3 transition-transform duration-200"
                          style={{transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)'}}
                        />
                      </button>
                      <div
                        className="grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out"
                        style={{gridTemplateRows: isOpen ? '1fr' : '0fr'}}
                      >
                        <div className="overflow-hidden">
                          <p
                            className="m-0 max-w-[760px] pb-6 text-fg3"
                            style={{font: '400 15px/1.7 var(--font-sans)'}}
                            dangerouslySetInnerHTML={{__html: row.a}}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })}

      {filtered.length === 0 && (
        <section className="border-t border-border bg-black">
          <div className="mx-auto max-w-[760px] px-6 py-24 text-center md:px-8">
            <p
              className="m-0 text-fg3"
              style={{font: '300 17px/1.65 var(--font-sans)'}}
            >
              No questions match your search. Try a different keyword, or
              email <a className="text-crimson-hi hover:text-fg1" href="mailto:hello@luminaformulations.com">hello@luminaformulations.com</a> — we usually reply within a business day.
            </p>
          </div>
        </section>
      )}

      <PageCta />
    </div>
  );
}
