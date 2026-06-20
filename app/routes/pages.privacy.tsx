import type {Route} from './+types/pages.privacy';
import {PageHero, Section} from '~/components/lumina/PageChrome';
import {PageCta} from '~/components/lumina/PageCta';

export const meta: Route.MetaFunction = () => [
  {title: 'Privacy Policy — Lumina Formulations'},
  {
    name: 'description',
    content:
      "How Lumina Formulations collects, uses, and protects your personal information when you shop, subscribe, or contact us. Updated to align with applicable US and EU data protection laws.",
  },
];

// TODO(brand): the editor below covers every standard data-protection
// disclosure for a US-launched DTC supplement storefront on Shopify
// (Storefront + Checkout, Shopify Payments / Shop Pay, fulfillment
// partner, marketing ESP). Before launch, have counsel review and
// adjust:
//   - EFFECTIVE_DATE → real launch / last-updated date
//   - The "Information We Share" subprocessor list against the actual
//     vendors in use (fulfillment, analytics, ESP, helpdesk)
//   - The CCPA / GDPR sections if/when sales materially target those
//     jurisdictions
//   - The data-retention defaults if you have specific policy
// The placeholders below are commercially conservative defaults — you
// can ship them today and have legal tighten in-place after launch.
const EFFECTIVE_DATE = 'June 2026';
const CONTACT_EMAIL = 'privacy@luminaformulations.com';

export default function PrivacyPage() {
  return (
    <div>
      <PageHero
        eyebrow="Privacy Policy"
        title="What we collect, why we collect it, and what we never will."
        lede={`Effective ${EFFECTIVE_DATE}. We collect the minimum needed to run the storefront, ship your order, and answer the door when you write in. We don't sell personal information. We don't run cross-site retargeting on health-adjacent behavioral signals.`}
        watermark="Privacy"
      />

      <Section
        eyebrow="Scope"
        title="Who this policy applies to."
        lede="This Privacy Policy explains how Lumina Formulations (&ldquo;Lumina,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;) handles personal information when you visit luminaformulations.com (the &ldquo;Site&rdquo;), purchase a product, subscribe to a marketing communication, or contact our team. It does not apply to third-party sites or services we link to."
      >
        <BodyText>
          By using the Site you agree to the practices described here. If you
          do not agree, please do not use the Site.
        </BodyText>
      </Section>

      <Section
        tone="dark"
        eyebrow="Information we collect"
        title="What we ask for, and what we get from your visit."
        lede="Information we collect falls into three buckets: information you provide, information collected automatically, and information from service providers acting on our behalf."
      >
        <Subhead>Information you provide</Subhead>
        <BodyList
          items={[
            'Contact information you submit at checkout, on a contact form, or to a customer service representative — name, shipping and billing address, email, phone number.',
            'Order and account information — the products you purchase, supply tier, subscription cadence, order history, and the email/password you choose if you create a Shopify customer account.',
            'Marketing preferences — whether you opt in to our newsletter and product updates, recorded as an explicit consent flag on your Shopify customer record.',
            'Customer support correspondence — the contents of any email, form submission, or chat you send us.',
          ]}
        />

        <Subhead>Information collected automatically</Subhead>
        <BodyList
          items={[
            'Device and browser information — IP address, browser type and version, operating system, referring URL, pages viewed, and the date and time of each request.',
            'Cookies and similar technologies — Shopify sets first-party cookies for cart state, checkout, fraud prevention, and analytics. We use Shopify Analytics to understand aggregate site usage. See "Cookies" below for details and how to opt out.',
          ]}
        />

        <Subhead>Information from service providers</Subhead>
        <BodyList
          items={[
            'Payment processors — Shopify Payments (and any alternate processor you choose at checkout) handles card data directly; we receive the order outcome, the last four digits, the card brand, and a token-level reference. We do not store full card numbers.',
            'Fulfillment partners — our warehouse and shipping carriers receive your name, shipping address, and order contents so they can pick, pack, and deliver.',
            'Email and marketing platforms — if you opt in to marketing, your email and consent timestamp are recorded so we can honor your preferences and only send what you asked for.',
          ]}
        />
      </Section>

      <Section
        eyebrow="How we use it"
        title="The purposes information is processed for."
      >
        <BodyList
          items={[
            'Fulfilling your order — processing payment, picking and shipping the product, sending confirmation and tracking emails, and handling returns and refunds.',
            'Operating subscriptions — billing on the cadence you selected, sending pre-shipment notifications, and honoring pause / skip / cancel requests.',
            'Customer service — answering questions, troubleshooting orders, processing guarantee claims.',
            'Account features — letting you log in, view order history, and manage subscriptions.',
            'Marketing — if and only if you opt in: sending periodic field-notes emails about our formulas, ingredients, testing, and related content. You can unsubscribe at any time via the link in every email or by emailing us.',
            'Site improvement and security — analyzing aggregate usage, preventing fraud, debugging and securing the Site, and complying with our legal obligations.',
          ]}
        />
        <BodyText>
          We rely on (a) the contract with you to fulfill orders, (b) our
          legitimate interest in running the business to improve the Site and
          prevent fraud, (c) your consent for marketing, and (d) legal
          obligations (e.g. tax records).
        </BodyText>
      </Section>

      <Section
        tone="dark"
        eyebrow="Information we share"
        title="Who we share with, and why."
        lede="We do not sell personal information. We share it only with service providers acting on our behalf under written agreements, and with authorities where required by law."
      >
        <Subhead>Service providers</Subhead>
        <BodyList
          items={[
            'Shopify Inc. — storefront, checkout, payments, customer accounts, analytics.',
            'Payment processors — Shopify Payments, Shop Pay, PayPal, and any alternate processor you select at checkout.',
            'Fulfillment and shipping — our warehouse partner and the carrier delivering your order.',
            'Email and customer-marketing tools — only your email and explicit consent state, where you have opted in.',
            'Customer-support tooling — the helpdesk we use to triage and respond to your enquiries.',
          ]}
        />
        <Subhead>Legal and protective disclosures</Subhead>
        <BodyText>
          We may disclose information to comply with applicable law,
          legitimate subpoenas or court orders, or to protect our or others&rsquo;
          rights, property, or safety. We will not voluntarily disclose
          information to law enforcement unless we are legally required to do
          so.
        </BodyText>
        <Subhead>Business transfers</Subhead>
        <BodyText>
          If Lumina is acquired, merges with another business, or transfers
          assets, personal information may be transferred as part of that
          transaction. We will post a notice on the Site before personal
          information becomes subject to a different privacy policy.
        </BodyText>
      </Section>

      <Section
        eyebrow="Your rights"
        title="What you can ask us to do."
        lede="Depending on where you live, you may have rights to access, correct, port, restrict the processing of, or delete personal information we hold about you, and to opt out of marketing communications."
      >
        <BodyList
          items={[
            'Access — request a copy of the personal information we hold about you.',
            'Correction — ask us to fix inaccurate or incomplete information.',
            'Deletion — ask us to delete personal information, subject to retention required by tax law and to keep records of past transactions.',
            'Opt out of marketing — at any time via the unsubscribe link in any marketing email, or by emailing us. Account-related transactional emails will continue while your account is active.',
            `California residents — we honor the rights granted by the California Consumer Privacy Act, including the right to know, the right to delete, and the right to opt out of "sale" or "sharing." We do not sell personal information.`,
            'European residents — the rights granted by the GDPR are honored where applicable, including the right to lodge a complaint with your local supervisory authority.',
          ]}
        />
        <BodyText>
          To exercise a right, write to us at{' '}
          <a className="text-crimson-hi underline" href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL}
          </a>
          . We may verify your identity before completing a request.
        </BodyText>
      </Section>

      <Section
        tone="dark"
        eyebrow="Cookies"
        title="How we use cookies and similar technologies."
      >
        <BodyText>
          We and Shopify use first-party cookies to keep your cart between
          pages, run checkout, prevent fraud, remember your preferences, and
          measure aggregate site usage. We do not use cookies for behavioral
          ad targeting on health-adjacent signals.
        </BodyText>
        <BodyText>
          You can disable cookies in your browser settings, but parts of the
          Site (notably checkout) may not work properly if you do. Where
          required by law, we present a consent banner on first visit.
        </BodyText>
      </Section>

      <Section
        eyebrow="Retention &amp; security"
        title="How long we keep information, and how we protect it."
      >
        <BodyList
          items={[
            'Order and tax records are retained for the period required by applicable tax law (in the US, this is generally seven years).',
            'Marketing-consent records are retained for as long as your subscription remains active, and a reasonable period afterward to honor your unsubscribe request.',
            'Customer support correspondence is retained for two years and then archived or deleted.',
            'We use industry-standard administrative, technical, and physical safeguards to protect personal information. No system is perfectly secure; if a breach materially impacts you, we will notify you in accordance with applicable law.',
          ]}
        />
      </Section>

      <Section
        tone="dark"
        eyebrow="Children"
        title="We do not knowingly collect information from children under 18."
      >
        <BodyText>
          The Site and products are not directed to children. We do not
          knowingly collect personal information from anyone under 18. If you
          believe a minor has provided us with personal information, please
          contact us and we will delete it.
        </BodyText>
      </Section>

      <Section
        eyebrow="Changes &amp; contact"
        title="Updates to this Policy, and how to reach us."
      >
        <BodyText>
          We may update this Policy from time to time. Material changes will
          be announced via a notice on the Site and, where appropriate, an
          email to subscribers. The &ldquo;Effective&rdquo; date at the top of
          this page reflects the most recent revision.
        </BodyText>
        <BodyText>
          Questions, requests, or complaints — write to{' '}
          <a className="text-crimson-hi underline" href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL}
          </a>
          .
        </BodyText>
      </Section>

      <PageCta />
    </div>
  );
}

function Subhead({children}: {children: React.ReactNode}) {
  return (
    <h3
      className="mt-8 text-fg1 first:mt-0"
      style={{
        font: '500 16px/1.4 var(--font-sans)',
        letterSpacing: '-0.005em',
      }}
    >
      {children}
    </h3>
  );
}

function BodyText({children}: {children: React.ReactNode}) {
  return (
    <p
      className="m-0 mt-4 max-w-[760px] text-fg2"
      style={{font: '300 16px/1.7 var(--font-sans)'}}
    >
      {children}
    </p>
  );
}

function BodyList({items}: {items: ReadonlyArray<string>}) {
  return (
    <ul className="m-0 mt-4 flex max-w-[760px] flex-col gap-2.5 pl-0">
      {items.map((item) => (
        <li
          key={item}
          className="relative pl-5 text-fg2"
          style={{font: '300 16px/1.65 var(--font-sans)'}}
        >
          <span
            aria-hidden
            className="absolute left-0 top-[0.7em] inline-block h-1 w-1 rounded-full bg-crimson"
          />
          {item}
        </li>
      ))}
    </ul>
  );
}
