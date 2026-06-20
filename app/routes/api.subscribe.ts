import type {Route} from './+types/api.subscribe';

/**
 * Newsletter subscription endpoint.
 *
 * Posts to Shopify's Storefront API `customerCreate` mutation with
 * `acceptsMarketing: true`, which records marketing consent on the
 * customer record so they enter the Shopify customer-marketing
 * audience (i.e. Shopify Email, Shopify Audiences, and any connected
 * ESP that reads marketing-consent state).
 *
 * If the email already belongs to a customer, Shopify returns a
 * "TAKEN" customerUserError — we treat that as success because the
 * subscriber is already in the audience. Any other error returns 400
 * with a JSON `{error}` body so the EmailCapture form can surface it.
 *
 * To switch to a dedicated ESP (Klaviyo, Postscript, Beehiiv, etc.),
 * replace the body of `action()` with the appropriate fetch.
 */
export async function action({request, context}: Route.ActionArgs) {
  if (request.method !== 'POST') {
    return Response.json({error: 'Method not allowed'}, {status: 405});
  }

  const form = await request.formData();
  const email = String(form.get('email') ?? '').trim();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({error: 'Enter a valid email address.'}, {status: 400});
  }

  // Generate a random password. Storefront's customerCreate requires
  // one even when the subscriber will never use it as an account — a
  // crypto-strong value is preferable to anything guessable.
  const password = randomPassword();

  try {
    const result = await context.storefront.mutate(CUSTOMER_CREATE_MUTATION, {
      variables: {
        input: {
          email,
          password,
          acceptsMarketing: true,
        },
      },
    });

    const errors = result?.customerCreate?.customerUserErrors ?? [];
    // "TAKEN" means the customer already exists. They're already in
    // the audience; treat as success so we don't leak account
    // existence and don't show a scary error for a benign case.
    const blocking = errors.find(
      (e: {code?: string | null}) => e.code && e.code !== 'TAKEN',
    );
    if (blocking) {
      return Response.json(
        {error: blocking.message ?? 'Subscription failed.'},
        {status: 400},
      );
    }

    return Response.json({ok: true});
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Subscription failed. Try again.',
      },
      {status: 500},
    );
  }
}

function randomPassword(): string {
  // Shopify customerCreate caps the password at 40 chars. 16 random
  // bytes → 32 hex chars leaves room and is more than strong enough
  // for an account the subscriber will never log into.
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

const CUSTOMER_CREATE_MUTATION = `#graphql
  mutation NewsletterCustomerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer { id email acceptsMarketing }
      customerUserErrors { field message code }
    }
  }
` as const;
