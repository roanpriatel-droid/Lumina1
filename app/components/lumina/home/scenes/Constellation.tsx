import {useRef} from 'react';
import {useGSAP} from '@gsap/react';
import {Eyebrow} from '~/components/lumina/Eyebrow';
import {BotanicalEngraving} from '~/components/graphics/BotanicalEngraving';
import {MonoWatermark} from '~/components/graphics/MonoWatermark';
import {countUp, fadeRise, staggerChildren} from '~/lib/motion';

/**
 * Scene 4 — Ingredient Constellation
 *
 * Key actives from both formulas float as mono-labeled nodes with their
 * doses, arranged as a constellation against a dark sky. Doses count up
 * as each node enters the viewport. Hairlines connect related nodes
 * (his cluster ↔ hers cluster, both anchored to the central crest).
 *
 * Clinical, not playful. Every number reconciles to the actual formula.
 */

interface NodeDef {
  ingredient: string;
  formula: 'his' | 'hers';
  end: number;
  decimals?: number;
  suffix: string;
  note: string;
  pos: {x: number; y: number};
  showCount?: boolean;
}

const NODES: ReadonlyArray<NodeDef> = [
  {
    ingredient: 'Tribulus',
    formula: 'his',
    end: 750,
    suffix: 'mg',
    note: 'Traditional anchor botanical',
    pos: {x: 8, y: 18},
  },
  {
    ingredient: 'Zinc',
    formula: 'his',
    end: 30,
    suffix: 'mg',
    note: '273% DV · testosterone metabolism cofactor',
    pos: {x: 32, y: 8},
  },
  {
    ingredient: 'Magnesium',
    formula: 'his',
    end: 200,
    suffix: 'mg',
    note: '48% DV · the night-time recovery mineral',
    pos: {x: 18, y: 52},
  },
  {
    ingredient: 'Tongkat Ali',
    formula: 'his',
    end: 50,
    suffix: 'mg',
    note: 'Root extract · stress resilience',
    pos: {x: 38, y: 70},
  },
  {
    ingredient: 'B12',
    formula: 'hers',
    end: 2250,
    suffix: '% DV',
    note: 'The energy vitamin · reduced fatigue',
    pos: {x: 64, y: 12},
  },
  {
    ingredient: 'Ashwagandha',
    formula: 'hers',
    end: 1,
    decimals: 0,
    suffix: '',
    note: 'Adaptogen · in disclosed botanical blend',
    pos: {x: 86, y: 28},
    showCount: false,
  },
  {
    ingredient: 'Maca',
    formula: 'hers',
    end: 1,
    decimals: 0,
    suffix: '',
    note: 'Peruvian root · vitality and mood support',
    pos: {x: 88, y: 60},
    showCount: false,
  },
  {
    ingredient: 'BioPerine®',
    formula: 'hers',
    end: 1,
    suffix: 'mg',
    note: 'Patented absorption catalyst',
    pos: {x: 60, y: 78},
  },
];

export function Constellation() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      fadeRise(ref.current?.querySelector('.scene-eyebrow'));
      fadeRise(ref.current?.querySelector('.scene-headline'), {delay: 0.05});
      fadeRise(ref.current?.querySelector('.scene-lede'), {delay: 0.1});
      staggerChildren(
        ref.current?.querySelector('.constellation-field'),
        '.constellation-node',
        {start: 'top 75%', stagger: 0.08},
      );
      // count up doses
      const nodes = ref.current?.querySelectorAll('.constellation-node');
      nodes?.forEach((node, i) => {
        const def = NODES[i];
        if (def.showCount === false) return;
        const target = node.querySelector('.constellation-dose');
        if (!target) return;
        countUp(target, {
          end: def.end,
          decimals: def.decimals ?? 0,
          suffix: def.suffix,
          duration: 1.4,
          triggerStart: 'top 80%',
        });
      });
    },
    {scope: ref},
  );

  return (
    <section
      ref={ref}
      className="relative isolate overflow-hidden border-t border-border lumina-bg-1"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          width: 1500,
          height: 1500,
          left: '50%',
          top: '60%',
          transform: 'translate(-50%,-50%)',
          background: 'var(--glow-hero)',
          opacity: 0.25,
        }}
      />
      {/* oversized cropped engravings bleeding off-edge */}
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{left: '-8%', top: '12%', opacity: 0.35}}
      >
        <BotanicalEngraving
          name="ashwagandha"
          width={520}
          strokeOpacity={0.6}
          accentOpacity={0.18}
          drawOnScroll
        />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{right: '-6%', bottom: '6%', opacity: 0.35, transform: 'rotate(8deg)'}}
      >
        <BotanicalEngraving
          name="tribulus"
          width={460}
          strokeOpacity={0.6}
          accentOpacity={0.18}
          drawOnScroll
        />
      </div>
      <MonoWatermark position="top-right" size={300} opacity={0.04}>
        17 ACTIVES
      </MonoWatermark>
      <div className="relative mx-auto max-w-[1320px] px-6 py-28 md:px-10 md:py-36">
        <Eyebrow className="scene-eyebrow mb-4">The active map</Eyebrow>
        <h2
          className="scene-headline m-0 max-w-[820px] text-fg1"
          style={{
            font: '300 clamp(2.5rem, 5vw, 4.5rem)/1.05 var(--font-sans)',
            letterSpacing: '-0.015em',
          }}
        >
          What&rsquo;s in the bottles. The amounts. The reasoning.
        </h2>
        <p
          className="scene-lede m-0 mt-5 max-w-[640px] text-fg3"
          style={{font: '300 17px/1.65 var(--font-sans)'}}
        >
          The constellation of actives across both formulas. Every dose lives
          on the page, in mono, so you can compare it to anything else on
          the shelf.
        </p>

        <div
          className="constellation-field relative mt-16 hidden md:block"
          style={{
            height: 'clamp(520px, 60vw, 720px)',
          }}
        >
          {NODES.map((node, i) => (
            <ConstellationNode key={node.ingredient} node={node} index={i} />
          ))}
          <svg
            aria-hidden
            className="pointer-events-none absolute inset-0 h-full w-full"
          >
            <g stroke="var(--color-border)" strokeWidth="1" fill="none">
              {NODES.map((from, i) =>
                NODES.slice(i + 1).map((to, j) => {
                  if (from.formula !== to.formula) return null;
                  const x1 = `${from.pos.x}%`;
                  const y1 = `${from.pos.y}%`;
                  const x2 = `${to.pos.x}%`;
                  const y2 = `${to.pos.y}%`;
                  return (
                    <line
                      key={`${i}-${j}`}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      strokeDasharray="2 4"
                      opacity="0.5"
                    />
                  );
                }),
              )}
            </g>
          </svg>
        </div>

        {/* Mobile fallback — stack the nodes as a list */}
        <div className="mt-12 grid gap-3 md:hidden">
          {NODES.map((node) => (
            <ConstellationNodeMobile key={node.ingredient} node={node} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ConstellationNode({node, index}: {node: NodeDef; index: number}) {
  return (
    <article
      className="constellation-node absolute"
      style={{
        left: `${node.pos.x}%`,
        top: `${node.pos.y}%`,
        transform: 'translate(-50%, -50%)',
        zIndex: 10 - index,
      }}
    >
      <div
        className="relative rounded-xl border border-border bg-surface px-5 py-4"
        style={{
          minWidth: 220,
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="t-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-fg4">
            {node.formula === 'his' ? 'His' : 'Hers'}
          </div>
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full bg-crimson"
            style={{boxShadow: '0 0 12px var(--color-crimson)'}}
          />
        </div>
        <h3 className="mt-2 text-[16px] font-medium leading-snug text-fg1">
          {node.ingredient}
        </h3>
        <div
          className="t-mono mt-1 text-[15px] font-medium text-crimson-hi constellation-dose"
        >
          {node.showCount === false
            ? 'In blend'
            : `${node.end}${node.suffix}`}
        </div>
        <p
          className="m-0 mt-2 text-[12.5px] leading-snug text-fg3"
          style={{maxWidth: 260}}
        >
          {node.note}
        </p>
      </div>
    </article>
  );
}

function ConstellationNodeMobile({node}: {node: NodeDef}) {
  return (
    <div className="rounded-lg border border-border bg-surface px-5 py-4">
      <div className="flex items-center justify-between gap-3">
        <div className="t-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-fg4">
          {node.formula === 'his' ? 'His' : 'Hers'}
        </div>
        <span
          aria-hidden
          className="inline-block h-1.5 w-1.5 rounded-full bg-crimson"
        />
      </div>
      <h3 className="mt-2 text-[15px] font-medium text-fg1">{node.ingredient}</h3>
      <div className="t-mono mt-1 text-[14px] font-medium text-crimson-hi">
        {node.showCount === false ? 'In blend' : `${node.end}${node.suffix}`}
      </div>
      <p className="m-0 mt-2 text-[12.5px] leading-snug text-fg3">{node.note}</p>
    </div>
  );
}
