import {Analytics, getShopAnalytics, useNonce} from '@shopify/hydrogen';
import {
  Outlet,
  useRouteError,
  isRouteErrorResponse,
  type ShouldRevalidateFunction,
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
} from 'react-router';
import type {Route} from './+types/root';
import favicon from '~/assets/favicon.svg';
import {FOOTER_QUERY, HEADER_QUERY} from '~/lib/fragments';
import tailwindCss from './styles/tailwind.css?url';
import {PageLayout} from './components/PageLayout';
import {loadLuminaCatalog} from '~/lib/lumina-catalog.server';

export type RootLoader = typeof loader;

/**
 * This is important to avoid re-fetching root queries on sub-navigations
 */
export const shouldRevalidate: ShouldRevalidateFunction = ({
  formMethod,
  currentUrl,
  nextUrl,
}) => {
  // revalidate when a mutation is performed e.g add to cart, login...
  if (formMethod && formMethod !== 'GET') return true;

  // revalidate when manually revalidating via useRevalidator
  if (currentUrl.toString() === nextUrl.toString()) return true;

  // Defaulting to no revalidation for root loader data to improve performance.
  // When using this feature, you risk your UI getting out of sync with your server.
  // Use with caution. If you are uncomfortable with this optimization, update the
  // line below to `return defaultShouldRevalidate` instead.
  // For more details see: https://remix.run/docs/en/main/route/should-revalidate
  return false;
};

/**
 * The main and reset stylesheets are added in the Layout component
 * to prevent a bug in development HMR updates.
 *
 * This avoids the "failed to execute 'insertBefore' on 'Node'" error
 * that occurs after editing and navigating to another page.
 *
 * It's a temporary fix until the issue is resolved.
 * https://github.com/remix-run/remix/issues/9242
 */
export function links() {
  return [
    {
      rel: 'preconnect',
      href: 'https://cdn.shopify.com',
    },
    {
      rel: 'preconnect',
      href: 'https://shop.app',
    },
    // Favicons — SVG for capable browsers, ICO fallback for legacy.
    // Browsers pick the highest-priority match they understand; the SVG
    // takes precedence on Chrome/Edge/Firefox/Safari ≥ 15.
    {rel: 'icon', type: 'image/svg+xml', href: favicon},
    {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico', sizes: 'any'},
    {rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png'},
    {rel: 'manifest', href: '/manifest.webmanifest'},
  ];
}

export async function loader(args: Route.LoaderArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  const {storefront, env} = args.context;

  return {
    ...deferredData,
    ...criticalData,
    publicStoreDomain: env.PUBLIC_STORE_DOMAIN,
    shop: getShopAnalytics({
      storefront,
      publicStorefrontId: env.PUBLIC_STOREFRONT_ID,
    }),
    consent: {
      checkoutDomain: env.PUBLIC_CHECKOUT_DOMAIN,
      storefrontAccessToken: env.PUBLIC_STOREFRONT_API_TOKEN,
      withPrivacyBanner: false,
      // localize the privacy banner
      country: args.context.storefront.i18n.country,
      language: args.context.storefront.i18n.language,
    },
  };
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context}: Route.LoaderArgs) {
  const {storefront} = context;

  // Lumina catalog is consumed everywhere (cart savings, header, etc.),
  // so resolve it as critical and keep the long cache.
  const [header, luminaCatalog] = await Promise.all([
    storefront.query(HEADER_QUERY, {
      cache: storefront.CacheLong(),
      variables: {
        headerMenuHandle: 'main-menu', // Adjust to your header menu handle
      },
    }),
    loadLuminaCatalog(storefront),
  ]);

  return {header, luminaCatalog};
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: Route.LoaderArgs) {
  const {storefront, customerAccount, cart} = context;

  // defer the footer query (below the fold)
  const footer = storefront
    .query(FOOTER_QUERY, {
      cache: storefront.CacheLong(),
      variables: {
        footerMenuHandle: 'footer', // Adjust to your footer menu handle
      },
    })
    .catch((error: Error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });
  return {
    cart: cart.get(),
    isLoggedIn: customerAccount.isLoggedIn(),
    footer,
  };
}

export function Layout({children}: {children?: React.ReactNode}) {
  const nonce = useNonce();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="theme-color" content="#0B0B0C" />
        <meta name="color-scheme" content="dark" />
        <link rel="stylesheet" href={tailwindCss}></link>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

export default function App() {
  const data = useRouteLoaderData<RootLoader>('root');

  if (!data) {
    return <Outlet />;
  }

  return (
    <Analytics.Provider
      cart={data.cart}
      shop={data.shop}
      consent={data.consent}
    >
      <PageLayout {...data}>
        <Outlet />
      </PageLayout>
    </Analytics.Provider>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  let errorMessage = 'Unknown error';
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorMessage = error?.data?.message ?? error.data;
    errorStatus = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  const isNotFound = errorStatus === 404;

  return (
    <section
      className="relative isolate overflow-hidden bg-black"
      style={{minHeight: '60vh'}}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          width: 900,
          height: 900,
          left: '50%',
          top: 0,
          transform: 'translate(-50%,-30%)',
          background: 'var(--glow-hero)',
          opacity: 0.4,
        }}
      />
      <div className="relative mx-auto max-w-[760px] px-6 py-28 text-center md:px-8 md:py-36">
        <p className="eyebrow mb-5 text-crimson-hi">
          {isNotFound ? 'Page not found' : `Error ${errorStatus}`}
        </p>
        <h1
          className="m-0 text-fg1"
          style={{
            font: '300 clamp(40px, 5vw, 60px)/1.05 var(--font-sans)',
            letterSpacing: '-0.015em',
          }}
        >
          {isNotFound
            ? 'There’s nothing at this address.'
            : 'Something went wrong on our end.'}
        </h1>
        <p
          className="m-0 mt-6 text-fg2"
          style={{font: '300 17px/1.65 var(--font-sans)'}}
        >
          {isNotFound
            ? 'The link you followed may be wrong, or the page may have moved. Either way — the formulas are still here.'
            : 'Try again, or jump back to the catalog.'}
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <a
            href="/collections/all"
            className="inline-flex items-center justify-center gap-2 rounded-pill bg-crimson px-7 py-4 text-[15px] font-medium text-white shadow-accent transition-[background] hover:bg-crimson-hi"
          >
            See the catalog
          </a>
          <a
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-pill border border-border-strong bg-transparent px-7 py-4 text-[15px] font-medium text-fg1 transition-colors hover:border-fg3"
          >
            Back to the homepage
          </a>
        </div>
        {!isNotFound && errorMessage && (
          <pre className="t-mono mx-auto mt-12 max-w-[680px] overflow-auto rounded-lg border border-border bg-surface p-6 text-left text-sm text-fg3">
            {errorMessage}
          </pre>
        )}
      </div>
    </section>
  );
}
