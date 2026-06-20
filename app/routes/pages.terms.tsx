import type {Route} from './+types/pages.terms';
import {PageHero, Section} from '~/components/lumina/PageChrome';
import {PageCta} from '~/components/lumina/PageCta';

export const meta: Route.MetaFunction = () => [
  {title: 'Terms of Service — Lumina Formulations'},
  {
    name: 'description',
    content:
      "The terms under which you may shop, subscribe, and use Lumina Formulations. Covers purchases, subscriptions, returns, the supplement disclaimer, and the standard limitation-of-liability and dispute-resolution clauses.",
  },
];

// TODO(brand): these Terms are a commercially conservative US-DTC
// template that a launch-stage Shopify storefront can ship today.
// Before launch, have counsel review and adjust:
//   - EFFECTIVE_DATE → real launch / last-updated date
//   - GOVERNING_STATE → the state under whose law you intend disputes
//     to be resolved (typically your state of formation)
//   - The arbitration clause (Section 13) if you'd rather litigate
//   - The class-action waiver if you're operating in a jurisdiction
//     where it isn't enforceable
//   - The "subscription" terms against the cadence and pause/skip
//     mechanics you actually offer
const EFFECTIVE_DATE = 'June 2026';
const CONTACT_EMAIL = 'support@luminaformulations.com';
const GOVERNING_STATE = 'Delaware';

export default function TermsPage() {
  return (
    <div>
      <PageHero
        eyebrow="Terms of Service"
        title="The terms you agree to when you shop with us."
        lede={`Effective ${EFFECTIVE_DATE}. Plain language wherever possible, complete legal language where it has to be. Read this page if you're going to use the Site, subscribe, or buy a product.`}
        watermark="Terms"
      />

      <Section
        eyebrow="1. Acceptance"
        title="What you agree to by using the Site."
      >
        <BodyText>
          These Terms of Service (&ldquo;Terms&rdquo;) govern your access to
          and use of luminaformulations.com and any related properties
          (collectively, the &ldquo;Site&rdquo;) operated by Lumina
          Formulations (&ldquo;Lumina,&rdquo; &ldquo;we,&rdquo;
          &ldquo;us&rdquo;). By using the Site, placing an order, subscribing,
          or otherwise interacting with us, you agree to be bound by these
          Terms and our{' '}
          <a className="text-crimson-hi underline" href="/pages/privacy">
            Privacy Policy
          </a>
          . If you do not agree, do not use the Site.
        </BodyText>
      </Section>

      <Section
        tone="dark"
        eyebrow="2. Eligibility"
        title="You must be 18 or older to purchase."
      >
        <BodyText>
          You must be at least 18 years old and able to form a binding
          contract under applicable law to purchase from us or create an
          account. By placing an order you represent that you meet these
          requirements.
        </BodyText>
      </Section>

      <Section
        eyebrow="3. Products and supplement disclaimer"
        title="What our products are, and what they are not."
      >
        <BodyText>
          Lumina sells dietary supplements. The statements made on this Site
          and accompanying any product have not been evaluated by the U.S.
          Food and Drug Administration. Our products are not intended to
          diagnose, treat, cure, or prevent any disease.
        </BodyText>
        <BodyText>
          Consult a qualified healthcare professional before starting any
          dietary supplement, particularly if you are pregnant, nursing,
          taking medication, preparing for surgery, or have a known medical
          condition. Discontinue use and consult your doctor if you
          experience any adverse reaction.
        </BodyText>
        <BodyText>
          Product photography and descriptions are illustrative; the
          authoritative ingredient panel is the label on the bottle you
          receive.
        </BodyText>
      </Section>

      <Section
        tone="dark"
        eyebrow="4. Pricing and payment"
        title="How prices are set, and how we charge you."
      >
        <BodyList
          items={[
            'Prices on the Site are shown in U.S. dollars unless stated otherwise. Live prices are displayed at checkout; we are not responsible for typographical errors in displayed pricing and reserve the right to correct them before completing an order.',
            'Applicable taxes are calculated and displayed at checkout based on your shipping address.',
            'Payment is processed by Shopify Payments or an alternate processor you select. We never store full card numbers.',
            'You authorize us to charge the payment method you provide for the order total, including taxes and shipping. For subscriptions, you authorize the recurring charge at the cadence you selected until you pause, skip, or cancel.',
            'If a charge is declined, we may notify you and attempt to recover the payment using the method on file.',
          ]}
        />
      </Section>

      <Section
        eyebrow="5. Subscriptions"
        title="How recurring orders work — and how to stop them."
      >
        <BodyList
          items={[
            "When you subscribe, we charge your payment method on the cadence you selected and ship the corresponding supply. The first shipment is billed at order placement; each subsequent shipment is billed on the day it goes out.",
            "You can pause, skip a shipment, change cadence, or cancel at any time from your customer account or by emailing us — no phone calls, no retention scripts.",
            "Changes you make at least 24 hours before the next-shipment date take effect on that shipment. Changes made inside the 24-hour window apply to the shipment after next.",
            "If you cancel a subscription, you keep any product you've already received. You are not charged for shipments that haven't yet processed.",
          ]}
        />
      </Section>

      <Section
        tone="dark"
        eyebrow="6. Shipping &amp; delivery"
        title="When we ship, and what happens if something goes wrong."
      >
        <BodyText>
          Standard shipping windows, rates, and carriers are listed on{' '}
          <a className="text-crimson-hi underline" href="/pages/shipping">
            /pages/shipping
          </a>
          . Risk of loss passes to you when the carrier accepts the package.
          If a package is lost in transit or arrives damaged, contact us
          within 14 days and we will replace it or issue a refund at our
          discretion.
        </BodyText>
      </Section>

      <Section
        eyebrow="7. Returns &amp; the 60-day guarantee"
        title="Our money-back guarantee."
      >
        <BodyText>
          Every order is covered by a 60-day money-back guarantee. If the
          formula isn&rsquo;t right for you, write to us within 60 days of
          delivery and we will refund the order. Empty bottles are fine.
          See{' '}
          <a className="text-crimson-hi underline" href="/pages/returns">
            /pages/returns
          </a>{' '}
          and{' '}
          <a className="text-crimson-hi underline" href="/pages/guarantee">
            /pages/guarantee
          </a>{' '}
          for the full procedure and any state-specific notices.
        </BodyText>
      </Section>

      <Section
        tone="dark"
        eyebrow="8. Account use"
        title="Your account, your responsibility."
      >
        <BodyText>
          You are responsible for activity that occurs under your account.
          Keep your password confidential. Notify us immediately if you
          believe your account has been used without your authorization. We
          may suspend or terminate accounts that are used in violation of
          these Terms.
        </BodyText>
      </Section>

      <Section
        eyebrow="9. Acceptable use"
        title="What you agree not to do on the Site."
      >
        <BodyList
          items={[
            'You will not use the Site for any unlawful purpose or in a way that violates these Terms.',
            "You will not attempt to gain unauthorized access to the Site or interfere with its operation.",
            'You will not scrape, mirror, or systematically copy content from the Site without our prior written consent.',
            "You will not impersonate another person or misrepresent your affiliation with any person or entity.",
            'You will not submit content that is false, misleading, abusive, defamatory, infringing, or otherwise objectionable.',
          ]}
        />
      </Section>

      <Section
        tone="dark"
        eyebrow="10. Intellectual property"
        title="What we own, and what you may do with it."
      >
        <BodyText>
          The Site, our product names, the Lumina marks, the formulations,
          and all content we publish (including copy, photography,
          illustrations, and code) are owned by Lumina or our licensors and
          are protected by intellectual property laws. You may view and
          share Site content for personal, non-commercial purposes. You may
          not reproduce, modify, distribute, or create derivative works for
          any other purpose without our prior written consent.
        </BodyText>
      </Section>

      <Section
        eyebrow="11. Disclaimers"
        title="The Site is provided &ldquo;as is.&rdquo;"
      >
        <BodyText>
          To the maximum extent permitted by applicable law, the Site and
          our products are provided on an &ldquo;as is&rdquo; and &ldquo;as
          available&rdquo; basis. We disclaim all express and implied
          warranties, including the implied warranties of merchantability,
          fitness for a particular purpose, and non-infringement.
        </BodyText>
        <BodyText>
          We do not warrant that the Site will be uninterrupted or
          error-free, that defects will be corrected, or that the Site or
          the servers that make it available are free of viruses or other
          harmful components.
        </BodyText>
      </Section>

      <Section
        tone="dark"
        eyebrow="12. Limitation of liability"
        title="The maximum we are liable to you for."
      >
        <BodyText>
          To the maximum extent permitted by applicable law, Lumina and its
          officers, directors, employees, affiliates, and agents will not be
          liable for any indirect, incidental, special, consequential, or
          punitive damages, or any loss of profits or revenues, arising out
          of or related to your use of the Site or our products. Our total
          liability to you for any claim arising out of or related to these
          Terms or the products you purchased shall not exceed the amount
          you paid for the products giving rise to the claim in the
          preceding twelve months. Some jurisdictions do not allow the
          exclusion of certain damages, so some of these limitations may
          not apply to you.
        </BodyText>
      </Section>

      <Section
        eyebrow="13. Governing law &amp; disputes"
        title={`Disputes are governed by the laws of ${GOVERNING_STATE}.`}
      >
        <BodyText>
          These Terms are governed by the laws of the State of{' '}
          {GOVERNING_STATE}, without regard to its conflict-of-laws
          principles.
        </BodyText>
        <BodyText>
          Any dispute arising out of or relating to these Terms or your use
          of the Site will be resolved in the state or federal courts
          located in {GOVERNING_STATE}, and you and Lumina each consent to
          the exclusive jurisdiction of those courts. You agree to waive any
          right to a jury trial and to bring claims only on an individual
          basis, not as a plaintiff or class member in a class or
          representative proceeding, except where such waiver is not
          enforceable under applicable law.
        </BodyText>
      </Section>

      <Section
        tone="dark"
        eyebrow="14. Changes &amp; contact"
        title="How these Terms change, and how to reach us."
      >
        <BodyText>
          We may update these Terms from time to time. The
          &ldquo;Effective&rdquo; date at the top of the page reflects the
          most recent revision. Material changes will be announced via a
          notice on the Site. Continued use of the Site after a change
          constitutes acceptance of the revised Terms.
        </BodyText>
        <BodyText>
          Questions about these Terms — write to{' '}
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

function BodyText({children}: {children: React.ReactNode}) {
  return (
    <p
      className="m-0 mt-4 max-w-[760px] text-fg2 first:mt-0"
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
