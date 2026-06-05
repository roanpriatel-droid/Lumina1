import {Suspense, useEffect, useState} from 'react';
import {Await, NavLink, useAsyncValue} from 'react-router';
import {
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
import {Search, ShoppingBag, Menu as MenuIcon} from 'lucide-react';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {Wordmark} from '~/components/lumina/Wordmark';

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

type Viewport = 'desktop' | 'mobile';

export function Header({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
}: HeaderProps) {
  const {menu} = header;
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className="sticky top-0 z-40 transition-[background-color,border-color] duration-300 ease-out"
      style={{
        background: scrolled ? 'rgba(11,11,12,0.82)' : 'transparent',
        backdropFilter: scrolled ? 'blur(14px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(14px)' : 'none',
        borderBottom: `1px solid ${scrolled ? 'var(--color-border)' : 'transparent'}`,
      }}
    >
      <div className="mx-auto flex h-[76px] max-w-[1240px] items-center gap-8 px-6 md:px-10">
        <NavLink prefetch="intent" to="/" end aria-label="Lumina home">
          <Wordmark size={21} />
        </NavLink>
        <HeaderMenu
          menu={menu}
          viewport="desktop"
          primaryDomainUrl={header.shop.primaryDomain.url}
          publicStoreDomain={publicStoreDomain}
        />
        <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
      </div>
    </header>
  );
}

export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
  viewport: Viewport;
  publicStoreDomain: HeaderProps['publicStoreDomain'];
}) {
  const {close} = useAside();

  const navClass =
    viewport === 'desktop'
      ? 'hidden md:flex items-center gap-7 ml-4'
      : 'flex flex-col gap-6 px-2 py-4';

  const linkClass =
    viewport === 'desktop'
      ? 'text-sm tracking-[0.02em] text-fg3 hover:text-fg1 transition-colors'
      : 'text-base text-fg2 hover:text-fg1 transition-colors';

  return (
    <nav className={navClass} role="navigation">
      {viewport === 'mobile' && (
        <NavLink end onClick={close} prefetch="intent" to="/" className={linkClass}>
          Home
        </NavLink>
      )}
      {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
        if (!item.url) return null;

        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;

        return (
          <NavLink
            key={item.id}
            end
            onClick={close}
            prefetch="intent"
            to={url}
            className={linkClass}
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}

function HeaderCtas({
  isLoggedIn,
  cart,
}: Pick<HeaderProps, 'isLoggedIn' | 'cart'>) {
  return (
    <nav
      className="ml-auto flex items-center gap-4 md:gap-5"
      role="navigation"
    >
      <NavLink
        prefetch="intent"
        to="/account"
        className="hidden whitespace-nowrap text-[13px] font-medium tracking-[0.04em] text-fg2 hover:text-fg1 md:inline"
      >
        <Suspense fallback="Sign in">
          <Await resolve={isLoggedIn} errorElement="Sign in">
            {(loggedIn) => (loggedIn ? 'Account' : 'Sign in')}
          </Await>
        </Suspense>
      </NavLink>
      <SearchToggle />
      <CartToggle cart={cart} />
      <MobileMenuToggle />
    </nav>
  );
}

function MobileMenuToggle() {
  const {open} = useAside();
  return (
    <button
      className="inline-flex items-center justify-center p-1 text-fg1 md:hidden"
      onClick={() => open('mobile')}
      aria-label="Open menu"
    >
      <MenuIcon size={22} strokeWidth={2} />
    </button>
  );
}

function SearchToggle() {
  const {open} = useAside();
  return (
    <button
      className="inline-flex items-center justify-center p-1 text-fg1 hover:text-crimson-hi transition-colors"
      onClick={() => open('search')}
      aria-label="Search"
    >
      <Search size={20} strokeWidth={2} />
    </button>
  );
}

function CartBadge({count}: {count: number}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <a
      href="/cart"
      className="relative inline-flex items-center justify-center p-1 text-fg1 hover:text-crimson-hi transition-colors"
      aria-label={`Cart (${count} items)`}
      onClick={(e) => {
        e.preventDefault();
        open('cart');
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        } as CartViewPayload);
      }}
    >
      <ShoppingBag size={22} strokeWidth={2} />
      {count > 0 && (
        <span
          className="absolute -right-1 -top-1 inline-flex h-[17px] min-w-[17px] items-center justify-center rounded-pill bg-crimson px-1 text-[10px] font-semibold leading-none text-white"
          aria-hidden
        >
          {count}
        </span>
      )}
    </a>
  );
}

function CartToggle({cart}: Pick<HeaderProps, 'cart'>) {
  return (
    <Suspense fallback={<CartBadge count={0} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/1',
      resourceId: null,
      tags: [],
      title: 'Formulas',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/2',
      resourceId: null,
      tags: [],
      title: 'The Science',
      type: 'HTTP',
      url: '/pages/science',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/3',
      resourceId: null,
      tags: [],
      title: 'Reviews',
      type: 'HTTP',
      url: '/pages/reviews',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/4',
      resourceId: null,
      tags: [],
      title: 'About',
      type: 'PAGE',
      url: '/pages/about',
      items: [],
    },
  ],
};
