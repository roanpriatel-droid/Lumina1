import {AlertTriangle, ShieldOff} from 'lucide-react';
import type {LuminaProduct} from '~/lib/lumina-data';

export function ComplianceFooter({product}: {product: LuminaProduct}) {
  return (
    <section className="border-t border-border bg-black">
      <div className="mx-auto max-w-[1000px] px-6 py-16 md:px-8">
        <div className="grid gap-5 md:grid-cols-2">
          <Block
            Icon={ShieldOff}
            title="FDA disclaimer"
            body="These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease."
          />
          <Block Icon={AlertTriangle} title="Warning" body={product.warning} />
        </div>
        <p className="t-mono mt-7 text-center text-[11px] uppercase tracking-[0.14em] text-fg4">
          For Adult Use Only · Keep out of reach of children
        </p>
      </div>
    </section>
  );
}

function Block({
  Icon,
  title,
  body,
}: {
  Icon: typeof AlertTriangle;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-surface px-6 py-6">
      <div className="mb-3 flex items-center gap-3">
        <Icon size={18} strokeWidth={2} className="text-fg3" />
        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-fg3">
          {title}
        </span>
      </div>
      <p
        className="m-0 text-fg3"
        style={{font: '400 13.5px/1.65 var(--font-sans)'}}
      >
        {body}
      </p>
    </div>
  );
}
