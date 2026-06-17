import {Suspense} from 'react';
import {Await, NavLink} from 'react-router';
import type {FooterQuery, HeaderQuery} from 'storefrontapi.generated';
import {
  ShieldCheck,
  Lock,
  Truck,
  FlaskConical,
  ListChecks,
  Mail,
} from 'lucide-react';
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
      <TheStandardStrip />
      <Suspense>
        <Await resolve={footerPromise}>
          {(footer) => (
            <footer className="relative isolate overflow-hidden bg-black">
              {/* Top-edge gradient hairline */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-px"
                style={{
                  background:
                    'linear-gradient(90deg, transparent 0%, #2A2A2E 50%, transparent 100%)',
                }}
              />
              {/* Wordmark watermark behind columns */}
              <div
                aria-hidden
                className="t-mono pointer-events-none absolute select-none whitespace-nowrap"
                style={{
                  font: '500 clamp(160px, 22vw, 320px)/1 var(--font-mono)',
                  letterSpacing: '0.42em',
                  color: 'var(--color-fg1)',
                  opacity: 0.03,
                  left: '50%',
                  bottom: '-8%',
                  transform: 'translateX(-50%)',
                }}
              >
                LUMINA
              </div>
              <div className="relative z-[1]">
                <FooterGrid
                  menu={footer?.menu}
                  primaryDomainUrl={header.shop.primaryDomain.url}
                  publicStoreDomain={publicStoreDomain}
                />
                <FooterMeta />
              </div>
            </footer>
          )}
        </Await>
      </Suspense>
    </>
  );
}

/* The Standard mini-row — three brand promises with mono small-caps. */
function TheStandardStrip() {
  const items = [
    {Icon: ListChecks, label: 'Disclosed doses on every active'},
    {Icon: FlaskConical, label: 'Third-party tested every lot'},
    {Icon: ShieldCheck, label: '60-day money-back guarantee'},
    {Icon: Truck, label: 'Free shipping on subscriptions'},
    {Icon: Lock, label: 'Secure checkout'},
  ];
  return (
    <section className="border-y border-border bg-surface">
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-center gap-x-10 gap-y-3 px-8 py-6">
        {items.map(({Icon, label}) => (
          <div key={label} className="flex items-center gap-2.5">
            <Icon size={15} strokeWidth={2.2} className="text-crimson" />
            <span className="t-mono text-[10.5px] font-semibold uppercase tracking-[0.18em] text-fg2">
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
    <div className="mx-auto grid max-w-[1240px] gap-12 px-8 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:gap-10">
      <div className="flex flex-col gap-6">
        <Wordmark size={20} tm />
        <p className="max-w-[260px] text-sm font-light text-fg3">
          Clinically-studied daily formulas, dosed honestly and tested every
          lot. Built for the customer who reads the label.
        </p>
        <div className="flex items-center gap-4">
          <SocialLink
            href="https://instagram.com/luminaformulations"
            label="Instagram"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
          </SocialLink>
          <SocialLink href="https://x.com/luminaformulations" label="X">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2H21l-6.51 7.44L22.5 22h-6.84l-5.36-7.04L4.2 22H1.44l6.95-7.95L1.5 2h6.99l4.83 6.41L18.244 2zm-2.4 18h1.91L7.27 4H5.24l10.604 16z"/></svg>
          </SocialLink>
          <SocialLink
            href="https://youtube.com/@luminaformulations"
            label="YouTube"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" /><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" /></svg>
          </SocialLink>
          <a
            href="mailto:hello@luminaformulations.com"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-black text-fg3 transition-colors hover:border-crimson hover:text-crimson-hi"
            aria-label="Email us"
          >
            <Mail size={14} strokeWidth={2} />
          </a>
        </div>
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

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-black text-fg3 transition-colors hover:border-crimson hover:text-crimson-hi"
      aria-label={label}
    >
      {children}
    </a>
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
      <div className="mx-auto flex max-w-[1240px] flex-wrap justify-between gap-3 px-8 py-5">
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
      {label: 'Lumina for Men', to: '/collections/male'},
      {label: 'Lumina for Women', to: '/collections/female'},
      {label: 'Shop All', to: '/collections/all'},
      {label: 'Sleep — coming soon', to: '/products/sleep'},
      {label: 'Daily Multi — coming soon', to: '/products/daily-multi'},
    ],
  },
  {
    heading: 'Science',
    links: [
      {label: 'The Science', to: '/pages/the-science'},
      {label: 'Ingredients', to: '/pages/ingredients'},
      {label: 'Testing', to: '/pages/testing'},
      {label: 'Protocol', to: '/pages/protocol'},
      {label: 'Sourcing', to: '/pages/sourcing'},
    ],
  },
  {
    heading: 'Company',
    links: [
      {label: 'About', to: '/pages/about'},
      {label: 'Reviews', to: '/pages/reviews'},
      {label: 'Guarantee', to: '/pages/guarantee'},
      {label: 'Contact', to: '/pages/contact'},
      {label: 'FAQ', to: '/pages/faq'},
    ],
  },
];
