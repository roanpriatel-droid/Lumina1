import {Suspense} from 'react';
import {Await, NavLink} from 'react-router';
import type {FooterQuery, HeaderQuery} from 'storefrontapi.generated';
import {ShieldCheck, Lock, Truck} from 'lucide-react';
import {Wordmark} from '~/components/lumina/Wordmark';
import {EmailCapture} from '~/components/lumina/EmailCapture';

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
      <EmailCapture />
      <BenefitStrip />
      <Suspense>
        <Await resolve={footerPromise}>
          {(footer) => (
            <footer className="border-t border-border bg-black">
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
    {Icon: Truck, label: 'Ships Free on Subscriptions'},
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
        <p className="mt-5 max-w-[260px] text-sm font-light text-fg3">
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
      {label: 'Male Enhancement', to: '/products/male-enhancement'},
      {label: 'Female Enhancement', to: '/products/female-enhancement'},
      {label: 'Sleep', to: '/products/sleep'},
      {label: 'Daily Multi', to: '/products/daily-multi'},
    ],
  },
  {
    heading: 'Company',
    links: [
      {label: 'About', to: '/pages/about'},
      {label: 'The Science', to: '/pages/the-science'},
      {label: 'Sourcing', to: '/pages/sourcing'},
      {label: 'Reviews', to: '/pages/reviews'},
    ],
  },
  {
    heading: 'Support',
    links: [
      {label: 'Contact', to: '/pages/contact'},
      {label: 'Subscriptions', to: '/pages/subscriptions'},
      {label: 'Shipping', to: '/pages/shipping'},
      {label: 'Returns', to: '/pages/returns'},
    ],
  },
];
