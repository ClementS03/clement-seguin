import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Clément Seguin",
  description: "Privacy policy and data processing information for clement-seguin.fr",
  robots: { index: false, follow: false },
};

const UPDATED = "May 2026";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-bg-base pt-24">
      <section className="section-padding">
        <div className="section-container max-w-2xl">
          <header className="mb-12">
            <div className="badge mb-6 inline-block">Legal</div>
            <h1 className="section-headline mb-4">Privacy Policy</h1>
            <p className="text-xs text-text-tertiary">Last updated: {UPDATED}</p>
          </header>

          <div className="flex flex-col gap-10 text-text-secondary text-sm leading-relaxed">

            <section>
              <h2 className="text-xs font-medium text-text-secondary tracking-wider uppercase mb-4 pb-3 border-b border-bg-border">
                1. Who we are
              </h2>
              <p>
                This site is operated by Clément Seguin, a freelance web builder based in France. Contact:{" "}
                <a href="mailto:contact@clement-seguin.fr" className="text-accent hover:underline">
                  contact@clement-seguin.fr
                </a>
                . For any privacy-related requests, please use this email address.
              </p>
            </section>

            <section>
              <h2 className="text-xs font-medium text-text-secondary tracking-wider uppercase mb-4 pb-3 border-b border-bg-border">
                2. Data we collect and why
              </h2>
              <div className="flex flex-col gap-6">
                <div>
                  <p className="font-medium text-text-primary mb-2">Contact form</p>
                  <p>When you submit the contact form, we collect your first name, email address, business activity, and message. This data is used solely to respond to your enquiry. It is not stored in a database — it is forwarded to our inbox via Resend (email delivery service) and kept only as long as the email thread remains active.</p>
                </div>
                <div>
                  <p className="font-medium text-text-primary mb-2">Newsletter</p>
                  <p>If you subscribe to the newsletter, your email address is stored in our Resend audience. You can unsubscribe at any time using the link included in every email. We do not share your email with third parties.</p>
                </div>
                <div>
                  <p className="font-medium text-text-primary mb-2">Shop purchases</p>
                  <p>When you purchase a digital product, payment is handled by Stripe. We receive your email address to deliver your product. We do not store your payment card details — these are handled exclusively by Stripe. For Stripe&apos;s privacy practices, see{" "}<a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">stripe.com/privacy</a>.</p>
                </div>
                <div>
                  <p className="font-medium text-text-primary mb-2">Analytics</p>
                  <p>This site uses <strong className="text-text-primary">Plausible Analytics</strong>, a privacy-first analytics tool. Plausible does not use cookies and does not collect any personally identifiable information. It only tracks aggregated, anonymous data (page views, referrer sources, device type). No cookie consent banner is required. For details, see{" "}<a href="https://plausible.io/privacy" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">plausible.io/privacy</a>.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xs font-medium text-text-secondary tracking-wider uppercase mb-4 pb-3 border-b border-bg-border">
                3. Legal basis for processing (GDPR)
              </h2>
              <ul className="flex flex-col gap-2">
                <li><span className="text-text-primary font-medium">Contact form:</span> Legitimate interest (responding to your enquiry).</li>
                <li><span className="text-text-primary font-medium">Newsletter:</span> Consent (you opted in explicitly).</li>
                <li><span className="text-text-primary font-medium">Shop purchases:</span> Contract performance (delivering the product you purchased).</li>
                <li><span className="text-text-primary font-medium">Analytics:</span> Legitimate interest (understanding aggregate site usage). No personal data is processed.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xs font-medium text-text-secondary tracking-wider uppercase mb-4 pb-3 border-b border-bg-border">
                4. Data retention
              </h2>
              <ul className="flex flex-col gap-2">
                <li><span className="text-text-primary font-medium">Contact form data:</span> Kept only for the duration of the email exchange, then deleted.</li>
                <li><span className="text-text-primary font-medium">Newsletter subscribers:</span> Until you unsubscribe.</li>
                <li><span className="text-text-primary font-medium">Purchase email:</span> Retained for accounting and legal obligations (French law: 10 years for invoicing records).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xs font-medium text-text-secondary tracking-wider uppercase mb-4 pb-3 border-b border-bg-border">
                5. Third-party services
              </h2>
              <ul className="flex flex-col gap-2">
                <li><span className="text-text-primary font-medium">Resend</span> — email delivery. Data processed in the EU. <a href="https://resend.com/privacy" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Privacy policy</a></li>
                <li><span className="text-text-primary font-medium">Stripe</span> — payment processing. <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Privacy policy</a></li>
                <li><span className="text-text-primary font-medium">Plausible Analytics</span> — anonymous site analytics. No cookies, no personal data. <a href="https://plausible.io/privacy" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Privacy policy</a></li>
                <li><span className="text-text-primary font-medium">Netlify</span> — site hosting. <a href="https://www.netlify.com/privacy/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Privacy policy</a></li>
                <li><span className="text-text-primary font-medium">Airtable</span> — internal product catalogue (not user-facing data). <a href="https://www.airtable.com/privacy" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Privacy policy</a></li>
              </ul>
              <p className="mt-4">We do not sell or rent your personal data to any third party.</p>
            </section>

            <section>
              <h2 className="text-xs font-medium text-text-secondary tracking-wider uppercase mb-4 pb-3 border-b border-bg-border">
                6. Cookies
              </h2>
              <p>
                This site does not use advertising or tracking cookies. Plausible Analytics operates without any cookies. No cookie consent banner is displayed because no cookies requiring consent are set.
              </p>
            </section>

            <section>
              <h2 className="text-xs font-medium text-text-secondary tracking-wider uppercase mb-4 pb-3 border-b border-bg-border">
                7. Your rights (GDPR)
              </h2>
              <p className="mb-3">Under the General Data Protection Regulation (GDPR), you have the following rights regarding your personal data:</p>
              <ul className="flex flex-col gap-2">
                <li><span className="text-text-primary font-medium">Right of access:</span> obtain confirmation of whether we process data about you and request a copy.</li>
                <li><span className="text-text-primary font-medium">Right to rectification:</span> request correction of inaccurate data.</li>
                <li><span className="text-text-primary font-medium">Right to erasure:</span> request deletion of your data, subject to legal obligations.</li>
                <li><span className="text-text-primary font-medium">Right to object:</span> object to processing based on legitimate interest.</li>
                <li><span className="text-text-primary font-medium">Right to data portability:</span> receive your data in a structured, machine-readable format.</li>
                <li><span className="text-text-primary font-medium">Right to withdraw consent:</span> for newsletter subscriptions, unsubscribe at any time.</li>
              </ul>
              <p className="mt-4">
                To exercise any of these rights, contact{" "}
                <a href="mailto:contact@clement-seguin.fr" className="text-accent hover:underline">
                  contact@clement-seguin.fr
                </a>. We will respond within 30 days.
              </p>
              <p className="mt-3">
                You also have the right to file a complaint with the French data protection authority:{" "}
                <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">CNIL — cnil.fr</a>.
              </p>
            </section>

            <section>
              <h2 className="text-xs font-medium text-text-secondary tracking-wider uppercase mb-4 pb-3 border-b border-bg-border">
                8. Security
              </h2>
              <p>
                We implement appropriate technical and organisational measures to protect your data against unauthorised access, alteration, disclosure, or destruction. All data transmissions are encrypted via HTTPS. Payment data is handled exclusively by Stripe and never passes through our servers.
              </p>
            </section>

            <section>
              <h2 className="text-xs font-medium text-text-secondary tracking-wider uppercase mb-4 pb-3 border-b border-bg-border">
                9. Changes to this policy
              </h2>
              <p>
                This privacy policy may be updated periodically. Any significant changes will be reflected in the &quot;Last updated&quot; date at the top of this page. We encourage you to review this policy from time to time.
              </p>
            </section>

          </div>
        </div>
      </section>
    </main>
  );
}
