import {Suspense, useEffect, useState} from 'react';
import {Await, NavLink, useAsyncValue} from 'react-router';
import {
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
import {Search, ShoppingBag, Menu as MenuIcon, ChevronDown} from 'lucide-react';
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

interface NavItem {
  label: string;
  to: string;
  children?: ReadonlyArray<{label: string; to: string; note?: string}>;
}

const LUMINA_NAV: ReadonlyArray<NavItem> = [
  {
    label: 'Shop',
    to: '/collections/all',
    children: [
      {label: 'For Men', to: '/collections/male', note: 'Lumina Male Enhancement™ · 1–12 month supplies'},
      {label: 'For Women', to: '/collections/female', note: 'Lumina Female Enhancement™ · 1–12 month supplies'},
      {label: 'Shop All', to: '/collections/all', note: 'Every formula, every supply, side by side'},
    ],
  },
  {
    label: 'Science',
    to: '/pages/the-science',
    children: [
      {label: 'The Science', to: '/pages/the-science', note: 'Formulation philosophy + 8 actives'},
      {label: 'Ingredients', to: '/pages/ingredients', note: 'Filterable library'},
      {label: 'Testing', to: '/pages/testing', note: 'cGMP + COA promise'},
      {label: 'Protocol', to: '/pages/protocol', note: 'The 8-week arc, in editorial'},
    ],
  },
  {label: 'Reviews', to: '/pages/reviews'},
  {label: 'Guarantee', to: '/pages/guarantee'},
  {label: 'About', to: '/pages/about'},
];

export function Header({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
}: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [direction, setDirection] = useState<'up' | 'down'>('up');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let lastY = window.scrollY;
    // Cache the document height; recompute only on resize. Reading
    // scrollHeight from inside the scroll handler triggers a layout
    // recalc on every frame.
    let maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;
    let raf = 0;
    let pendingY = window.scrollY;
    const flush = () => {
      raf = 0;
      const y = pendingY;
      setScrolled(y > 20);
      setDirection(y > lastY && y > 60 ? 'down' : 'up');
      setProgress(maxScroll > 0 ? y / maxScroll : 0);
      lastY = y;
    };
    const onScroll = () => {
      pendingY = window.scrollY;
      if (!raf) raf = requestAnimationFrame(flush);
    };
    const onResize = () => {
      maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
    };
    flush();
    window.addEventListener('scroll', onScroll, {passive: true});
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const condensed = scrolled && direction === 'down';

  return (
    <header
      className="sticky top-0 z-40 transition-[background-color,border-color] duration-300 ease-out"
      style={{
        background: scrolled ? 'rgba(11,11,12,0.7)' : 'rgba(11,11,12,0.4)',
        backdropFilter: 'blur(16px) saturate(140%)',
        WebkitBackdropFilter: 'blur(16px) saturate(140%)',
        borderBottom: '1px solid #1A1A1E',
      }}
    >
      <div
        className="mx-auto flex items-center gap-8 px-6 transition-[height] duration-200 ease-out md:px-10"
        style={{
          height: condensed ? 56 : 76,
          maxWidth: 1240,
        }}
      >
        <NavLink prefetch="intent" to="/" end aria-label="Lumina home">
          <Wordmark size={condensed ? 18 : 21} />
        </NavLink>
        <HeaderMenu viewport="desktop" />
        <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
      </div>

      {/* scroll progress: 2px crimson hairline along the header bottom */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-[-2px]"
        style={{
          height: 2,
          background:
            'linear-gradient(90deg, var(--color-crimson) 0%, var(--color-crimson-hi) 100%)',
          boxShadow: '0 0 12px rgba(209,26,42,0.4)',
          transformOrigin: 'left center',
          transform: `scaleX(${progress})`,
          opacity: scrolled ? 1 : 0.55,
          transition: 'opacity 200ms ease',
        }}
      />
    </header>
  );
}

export function HeaderMenu({viewport}: {viewport: Viewport}) {
  const {close} = useAside();

  if (viewport === 'mobile') {
    return (
      <nav className="flex flex-col gap-2 px-2 py-4" role="navigation">
        <NavLink
          end
          onClick={close}
          prefetch="intent"
          to="/"
          className="text-base text-fg2 hover:text-fg1 transition-colors"
        >
          Home
        </NavLink>
        {LUMINA_NAV.map((item) => (
          <div key={item.label}>
            <NavLink
              end
              onClick={close}
              prefetch="intent"
              to={item.to}
              className="text-base text-fg2 hover:text-fg1 transition-colors"
            >
              {item.label}
            </NavLink>
            {item.children && (
              <div className="mt-2 ml-4 flex flex-col gap-1.5">
                {item.children.map((child) => (
                  <NavLink
                    key={child.label}
                    end
                    onClick={close}
                    prefetch="intent"
                    to={child.to}
                    className="text-[13px] text-fg3 hover:text-fg1 transition-colors"
                  >
                    {child.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    );
  }

  return (
    <nav
      className="hidden md:flex items-center gap-7 ml-4"
      role="navigation"
    >
      {LUMINA_NAV.map((item) =>
        item.children ? (
          <NavDropdown key={item.label} item={item} />
        ) : (
          <NavLink
            key={item.label}
            end
            prefetch="intent"
            to={item.to}
            className="lumina-navlink text-sm tracking-[0.02em] text-fg3 hover:text-fg1 transition-colors"
          >
            {item.label}
          </NavLink>
        ),
      )}
    </nav>
  );
}

function NavDropdown({item}: {item: NavItem}) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <NavLink
        end
        prefetch="intent"
        to={item.to}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="inline-flex items-center gap-1 text-sm tracking-[0.02em] text-fg3 hover:text-fg1 transition-colors"
      >
        {item.label}
        <ChevronDown
          size={13}
          strokeWidth={2}
          className="transition-transform"
          style={{transform: open ? 'rotate(180deg)' : 'rotate(0deg)'}}
        />
      </NavLink>
      <div
        className="absolute left-0 top-full z-50 mt-3 w-[320px] rounded-xl border border-border bg-black p-2 transition-[opacity,transform] duration-200"
        style={{
          background: 'rgba(11,11,12,0.95)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          opacity: open ? 1 : 0,
          transform: open ? 'translateY(0)' : 'translateY(-4px)',
          pointerEvents: open ? 'auto' : 'none',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        {item.children?.map((child) => (
          <NavLink
            key={child.label}
            end
            prefetch="intent"
            to={child.to}
            className="flex flex-col gap-1 rounded-lg px-4 py-3 transition-colors hover:bg-surface"
          >
            <span className="text-[13.5px] font-medium text-fg1">
              {child.label}
            </span>
            {child.note && (
              <span className="text-[12px] text-fg3">{child.note}</span>
            )}
          </NavLink>
        ))}
      </div>
    </div>
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
