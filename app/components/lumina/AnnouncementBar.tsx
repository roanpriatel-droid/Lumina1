import {Truck, ShieldCheck} from 'lucide-react';

/**
 * Slim site-wide announcement bar pinned above the header. Two value-prop
 * pills, rotating subtly on mobile (the first item is anchored), no
 * dismissable state — these are the brand's two non-negotiable promises.
 */
export function AnnouncementBar() {
  const items = [
    {Icon: Truck, label: 'Free shipping on subscriptions'},
    {Icon: ShieldCheck, label: '60-Day Guarantee'},
  ];
  return (
    <div
      className="border-b border-border bg-black"
      role="region"
      aria-label="Site announcement"
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-center gap-6 px-6 py-2.5 md:gap-10 md:px-8">
        {items.map(({Icon, label}, i) => (
          <span
            key={label}
            className={`inline-flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.18em] text-fg2 ${
              i > 0 ? 'hidden sm:inline-flex' : ''
            }`}
          >
            <Icon
              size={12}
              strokeWidth={2.4}
              className="text-crimson-hi"
              aria-hidden
            />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
