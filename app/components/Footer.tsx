import {Suspense} from 'react';
import {Await, NavLink} from 'react-router';
import type {FooterQuery, HeaderQuery} from 'storefrontapi.generated';
import {ShieldCheck, Lock, Truck} from 'lucide-react';
import {Wordmark} from '~/components/lumina/Wordmark';
import {Button} from '~/components/lumina/Button';

interface FooterProps {
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  publicStoreDomain: string;
}

export function Footer({
  footer: footerPromise,
  header,
  publicStoreDomain,
}: FooterProps) {
  return (
    <>
      <BenefitStrip />
      <Suspense>
        <Await resolve={footerPromise}>
          {(footer) => (
            <footer className="border-t border-border bg-black">
              <NewsletterBand />
              <FooterGrid
                menu={footer?.menu}
                primaryDomainUrl={header.shop.primaryDomain.url}
                publicStoreDomain={publicStoreDomain}
              />
              <FooterMeta />
            </footer>
          )}
        </Await>
      </Suspense>
    </>
  );
}

function BenefitStrip() {
  const items = [
    {Icon: ShieldCheck, label: '60-Day Money-Back Guarantee'},
    {Icon: Lock, label: 'Secure Checkout'},
    {Icon: Truck, label: 'Ships Free'},
  ];
  return (
    <section className="border-y border-border bg-surface">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-center gap-x-14 gap-y-4 px-8 py-7">
        {items.map(({Icon, label}) => (
          <div key={label} className="flex items-center gap-3">
            <Icon size={20} strokeWidth={2} className="text-crimson" />
            <span className="text-[13px] font-medium uppercase tracking-[0.12em] text-fg2">
              {label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function NewsletterBand() {
  return (
    <div className="border-b border-border">
      <div className="mx-auto grid max-w-[1100px] gap-10 px-8 py-14 md:grid-cols-2 md:items-center">
        <div>
          <h3 className="text-[26px] font-light leading-tight text-fg1 tracking-[-0.01em]">
            Join the protocol
          </h3>
          <p className="mt-3 max-w-[360px] text-sm text-fg3">
            Field notes on the science, sourcing, and what we test for. No spam,
            plainly written.
          </p>
        </div>
        <form
          className="flex flex-col gap-3 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            // TODO(newsletter): wire up real subscription endpoint.
          }}
        >
          <input
            type="email"
            required
            placeholder="Email address"
            className="flex-1 rounded-pill border border-border bg-surface px-5 py-3.5 text-[15px] text-fg1 outline-none transition-colors focus:border-crimson"
            aria-label="Email address"
          />
          <Button type="submit" className="px-6 py-3.5">
            Subscribe
          </Button>
        </form>
      </div>
    </div>
  );
}

function FooterGrid({
  menu,
  primaryDomainUrl,
  publicStoreDomain,
}: {
  menu: FooterQuery['menu'] | undefined;
  primaryDomainUrl: FooterProps['header']['shop']['primaryDomain']['url'];
  publicStoreDomain: string;
}) {
  return (
    <div className="mx-auto grid max-w-[1100px] gap-10 px-8 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
      <div>
        <Wordmark size={20} tm />
        <p className="mt-5 max-w-[240px] text-sm font-light text-fg3">
          Clinically-studied daily formulas, dosed honestly and tested every
          lot.
        </p>
      </div>
      {FOOTER_COLUMNS.map((col) => (
        <div key={col.heading}>
          <div className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-fg3">
            {col.heading}
          </div>
          <div className="flex flex-col gap-3">
            {col.links.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                prefetch="intent"
                className="text-sm text-fg2 transition-colors hover:text-fg1"
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      ))}
      {menu ? (
        <ShopifyFooterMenu
          menu={menu}
          primaryDomainUrl={primaryDomainUrl}
          publicStoreDomain={publicStoreDomain}
        />
      ) : null}
    </div>
  );
}

function ShopifyFooterMenu({
  menu,
  primaryDomainUrl,
  publicStoreDomain,
}: {
  menu: NonNullable<FooterQuery['menu']>;
  primaryDomainUrl: FooterProps['header']['shop']['primaryDomain']['url'];
  publicStoreDomain: string;
}) {
  return (
    <div className="col-span-full mt-6 border-t border-border pt-6">
      <div className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-fg3">
        Policies
      </div>
      <nav className="flex flex-wrap gap-x-6 gap-y-2" role="navigation">
        {menu.items.map((item) => {
          if (!item.url) return null;
          const url =
            item.url.includes('myshopify.com') ||
            item.url.includes(publicStoreDomain) ||
            item.url.includes(primaryDomainUrl)
              ? new URL(item.url).pathname
              : item.url;
          const isExternal = !url.startsWith('/');
          return isExternal ? (
            <a
              key={item.id}
              href={url}
              rel="noopener noreferrer"
              target="_blank"
              className="text-sm text-fg2 hover:text-fg1"
            >
              {item.title}
            </a>
          ) : (
            <NavLink
              key={item.id}
              to={url}
              prefetch="intent"
              className="text-sm text-fg2 hover:text-fg1"
            >
              {item.title}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}

function FooterMeta() {
  return (
    <div className="border-t border-border">
      <div className="mx-auto flex max-w-[1100px] flex-wrap justify-between gap-3 px-8 py-5">
        <span className="text-xs text-fg4">
          © {new Date().getFullYear()} Lumina Formulations. All rights reserved.
        </span>
        <span className="text-xs text-fg4">
          These statements have not been evaluated by the FDA.
        </span>
      </div>
    </div>
  );
}

const FOOTER_COLUMNS: ReadonlyArray<{
  heading: string;
  links: ReadonlyArray<{label: string; to: string}>;
}> = [
  {
    heading: 'Formulas',
    links: [
      {label: 'Male Enhancement', to: '/products/lumina-male-enhancement'},
      {label: 'Female Enhancement', to: '/products/lumina-female-enhancement'},
      {label: 'Sleep', to: '/collections'},
      {label: 'Daily Multi', to: '/collections'},
    ],
  },
  {
    heading: 'Company',
    links: [
      {label: 'About', to: '/pages/about'},
      {label: 'The Science', to: '/pages/science'},
      {label: 'Sourcing', to: '/pages/sourcing'},
      {label: 'Reviews', to: '/pages/reviews'},
    ],
  },
  {
    heading: 'Support',
    links: [
      {label: 'Contact', to: '/pages/contact'},
      {label: 'Subscriptions', to: '/account'},
      {label: 'Shipping', to: '/policies/shipping-policy'},
      {label: 'Returns', to: '/policies/refund-policy'},
    ],
  },
];
