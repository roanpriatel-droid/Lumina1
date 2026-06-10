import {Await, Link} from 'react-router';
import {Suspense, useId} from 'react';
import {Search} from 'lucide-react';
import type {
  CartApiQueryFragment,
  FooterQuery,
  HeaderQuery,
} from 'storefrontapi.generated';
import {Aside} from '~/components/Aside';
import {Footer} from '~/components/Footer';
import {Header, HeaderMenu} from '~/components/Header';
import {AnnouncementBar} from '~/components/lumina/AnnouncementBar';
import {CartMain} from '~/components/CartMain';
import {
  SEARCH_ENDPOINT,
  SearchFormPredictive,
} from '~/components/SearchFormPredictive';
import {SearchResultsPredictive} from '~/components/SearchResultsPredictive';

interface PageLayoutProps {
  cart: Promise<CartApiQueryFragment | null>;
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
  children?: React.ReactNode;
}

export function PageLayout({
  cart,
  children = null,
  footer,
  header,
  isLoggedIn,
  publicStoreDomain,
}: PageLayoutProps) {
  return (
    <Aside.Provider>
      <CartAside cart={cart} />
      <SearchAside />
      <MobileMenuAside header={header} publicStoreDomain={publicStoreDomain} />
      <AnnouncementBar />
      {header && (
        <Header
          header={header}
          cart={cart}
          isLoggedIn={isLoggedIn}
          publicStoreDomain={publicStoreDomain}
        />
      )}
      <main className="flex-1">{children}</main>
      <Footer
        footer={footer}
        header={header}
        publicStoreDomain={publicStoreDomain}
      />
    </Aside.Provider>
  );
}

function CartAside({cart}: {cart: PageLayoutProps['cart']}) {
  return (
    <Aside type="cart" heading="Your Cart">
      <Suspense fallback={<CartSkeleton />}>
        <Await resolve={cart}>
          {(resolvedCart) => (
            <CartMain cart={resolvedCart} layout="aside" />
          )}
        </Await>
      </Suspense>
    </Aside>
  );
}

function CartSkeleton() {
  return (
    <div className="flex h-full flex-col" aria-label="Loading cart" role="status">
      <div className="flex-1 overflow-y-auto px-6 py-5">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="flex gap-4 border-b border-border py-5"
            aria-hidden
          >
            <div
              className="h-[70px] w-[54px] flex-none rounded-sm bg-surface-2"
              style={{
                background:
                  'linear-gradient(90deg, #1b1b1e 0%, #232327 50%, #1b1b1e 100%)',
              }}
            />
            <div className="flex flex-1 flex-col gap-2">
              <div className="h-3 w-3/4 rounded-sm bg-surface-2" />
              <div className="h-3 w-1/2 rounded-sm bg-surface-2" />
              <div className="mt-2 flex gap-3">
                <div className="h-7 w-24 rounded-sm bg-surface-2" />
                <div className="ml-auto h-3 w-12 self-center rounded-sm bg-surface-2" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex-none border-t border-border bg-bg-elev px-6 py-5">
        <div className="mb-4 h-3 w-16 rounded-sm bg-surface-2" />
        <div className="mb-4 flex items-baseline justify-between border-b border-border pb-4">
          <div className="h-3 w-20 rounded-sm bg-surface-2" />
          <div className="h-6 w-24 rounded-sm bg-surface-2" />
        </div>
        <div className="h-11 w-full rounded-pill bg-surface-2" />
      </div>
      <span className="sr-only">Loading your cart</span>
    </div>
  );
}

function SearchAside() {
  const queriesDatalistId = useId();
  return (
    <Aside type="search" heading="Search">
      <div className="flex h-full flex-col">
        <SearchFormPredictive>
          {({fetchResults, goToSearch, inputRef}) => (
            <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-border bg-surface px-6 py-4">
              <Search size={18} strokeWidth={2} className="text-fg3" />
              <input
                name="q"
                onChange={fetchResults}
                onFocus={fetchResults}
                placeholder="Search formulas, ingredients, journal…"
                ref={inputRef}
                type="search"
                list={queriesDatalistId}
                className="flex-1 bg-transparent text-sm text-fg1 outline-none placeholder:text-fg4"
              />
              <button
                onClick={goToSearch}
                className="text-xs font-medium uppercase tracking-[0.1em] text-fg3 transition-colors hover:text-fg1"
              >
                Search
              </button>
            </div>
          )}
        </SearchFormPredictive>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <SearchResultsPredictive>
            {({items, total, term, state, closeSearch}) => {
              const {articles, collections, pages, products, queries} = items;

              if (state === 'loading' && term.current) {
                return <div className="py-6 text-sm text-fg3">Loading…</div>;
              }

              if (!total) {
                return <SearchResultsPredictive.Empty term={term} />;
              }

              return (
                <>
                  <SearchResultsPredictive.Queries
                    queries={queries}
                    queriesDatalistId={queriesDatalistId}
                  />
                  <SearchResultsPredictive.Products
                    products={products}
                    closeSearch={closeSearch}
                    term={term}
                  />
                  <SearchResultsPredictive.Collections
                    collections={collections}
                    closeSearch={closeSearch}
                    term={term}
                  />
                  <SearchResultsPredictive.Pages
                    pages={pages}
                    closeSearch={closeSearch}
                    term={term}
                  />
                  <SearchResultsPredictive.Articles
                    articles={articles}
                    closeSearch={closeSearch}
                    term={term}
                  />
                  {term.current && total ? (
                    <Link
                      onClick={closeSearch}
                      to={`${SEARCH_ENDPOINT}?q=${term.current}`}
                      className="mt-4 inline-flex items-center gap-2 text-[13px] font-medium uppercase tracking-[0.1em] text-crimson-hi hover:text-fg1"
                    >
                      View all results for <q>{term.current}</q> →
                    </Link>
                  ) : null}
                </>
              );
            }}
          </SearchResultsPredictive>
        </div>
      </div>
    </Aside>
  );
}

function MobileMenuAside({
  header,
  publicStoreDomain,
}: {
  header: PageLayoutProps['header'];
  publicStoreDomain: PageLayoutProps['publicStoreDomain'];
}) {
  return (
    header.menu &&
    header.shop.primaryDomain?.url && (
      <Aside type="mobile" heading="Menu">
        <div className="px-6 py-6">
          <HeaderMenu
            menu={header.menu}
            viewport="mobile"
            primaryDomainUrl={header.shop.primaryDomain.url}
            publicStoreDomain={publicStoreDomain}
          />
        </div>
      </Aside>
    )
  );
}
