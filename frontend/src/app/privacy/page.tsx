import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Privacy Policy — Triepe",
  description:
    "How Triepe collects, uses, and protects your personal data in accordance with GDPR.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-black pt-32 pb-24 px-4 sm:px-8 text-white">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/store"
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors tracking-widest text-sm font-bold uppercase mb-8"
        >
          <ArrowLeft size={16} /> BACK TO STORE
        </Link>

        <h1
          className="text-5xl md:text-7xl font-black tracking-widest uppercase mb-4 border-b border-zinc-900 pb-8"
          style={{ fontFamily: "var(--font-koulen), Impact, sans-serif" }}
        >
          PRIVACY POLICY
        </h1>

        <p className="text-zinc-500 text-xs tracking-widest uppercase mb-12">
          Last updated: April 2026
        </p>

        <div className="space-y-12 text-zinc-300 leading-relaxed">
          <section>
            <h2 className="text-lg font-black tracking-widest uppercase text-white mb-4 border-b border-zinc-900 pb-2">
              1. Who We Are
            </h2>
            <p>
              Triepe (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;)
              is the data controller responsible for your personal data. For
              data-related inquiries, please contact us at:{" "}
              <a
                href="mailto:support@triepe.com"
                className="text-white underline underline-offset-2 hover:text-zinc-300 transition-colors"
              >
                support@triepe.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black tracking-widest uppercase text-white mb-4 border-b border-zinc-900 pb-2">
              2. Data We Collect
            </h2>
            <p className="mb-4">
              When you place an order on our website, we collect the following
              personal data:
            </p>
            <ul className="list-disc list-inside space-y-2 text-zinc-400 ml-4">
              <li>Full name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Delivery city and address / courier office</li>
              <li>Order details (items, sizes, quantities, amounts)</li>
              <li>Timestamp of your privacy policy acknowledgment</li>
            </ul>
            <p className="mt-4">
              We do not collect payment card data. All orders are fulfilled via
              Cash on Delivery.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black tracking-widest uppercase text-white mb-4 border-b border-zinc-900 pb-2">
              3. Legal Basis for Processing
            </h2>
            <p>
              We process your personal data on the basis of{" "}
              <strong className="text-white">
                Article 6(1)(b) of the GDPR
              </strong>{" "}
              &mdash; processing is necessary for the performance of a contract
              (your order). Without this data, we cannot fulfil, ship, or
              communicate with you about your order.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black tracking-widest uppercase text-white mb-4 border-b border-zinc-900 pb-2">
              4. How We Use Your Data
            </h2>
            <ul className="list-disc list-inside space-y-2 text-zinc-400 ml-4">
              <li>Processing and fulfilling your order</li>
              <li>
                Communicating order confirmations and shipping updates via email
              </li>
              <li>Resolving disputes or handling returns</li>
              <li>
                Complying with legal obligations (Bulgarian accounting law
                requires us to retain transaction records)
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-black tracking-widest uppercase text-white mb-4 border-b border-zinc-900 pb-2">
              5. Who We Share Your Data With
            </h2>
            <p className="mb-4">
              We share your personal data only with third parties strictly
              necessary to fulfil your order:
            </p>
            <ul className="list-disc list-inside space-y-2 text-zinc-400 ml-4">
              <li>
                <strong className="text-zinc-200">Speedy / Econt</strong> —
                courier partners who receive your name, phone, and delivery
                address solely to deliver your parcel.
              </li>
            </ul>
            <p className="mt-4">
              We do not sell, rent, or share your data with any other third
              parties for marketing or analytics purposes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black tracking-widest uppercase text-white mb-4 border-b border-zinc-900 pb-2">
              6. Data Retention
            </h2>
            <p>
              Order records (including personal data) are retained for{" "}
              <strong className="text-white">5 years</strong> from the date of
              purchase, as required by Bulgarian accounting legislation (Закон
              за счетоводството). After this period, data is securely deleted.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black tracking-widest uppercase text-white mb-4 border-b border-zinc-900 pb-2">
              7. Your Rights Under GDPR
            </h2>
            <p className="mb-4">As a data subject, you have the right to:</p>
            <ul className="list-disc list-inside space-y-2 text-zinc-400 ml-4">
              <li>
                <strong className="text-zinc-200">Access</strong> — request a
                copy of the personal data we hold about you.
              </li>
              <li>
                <strong className="text-zinc-200">Rectification</strong> —
                request correction of inaccurate data.
              </li>
              <li>
                <strong className="text-zinc-200">Erasure</strong> — request
                deletion of your data where it is no longer necessary for the
                purpose it was collected, subject to legal retention obligations.
              </li>
              <li>
                <strong className="text-zinc-200">Restriction</strong> —
                request that we limit how we process your data.
              </li>
              <li>
                <strong className="text-zinc-200">Portability</strong> —
                receive your data in a structured, machine-readable format.
              </li>
              <li>
                <strong className="text-zinc-200">Objection</strong> — object
                to processing based on legitimate interests.
              </li>
            </ul>
            <p className="mt-4">
              To exercise any of these rights, contact us at{" "}
              <a
                href="mailto:support@triepe.com"
                className="text-white underline underline-offset-2 hover:text-zinc-300 transition-colors"
              >
                support@triepe.com
              </a>
              . We will respond within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black tracking-widest uppercase text-white mb-4 border-b border-zinc-900 pb-2">
              8. Right to Lodge a Complaint
            </h2>
            <p>
              If you believe we have not handled your data correctly, you have
              the right to lodge a complaint with the Bulgarian data protection
              supervisory authority:
            </p>
            <div className="mt-4 p-4 border border-zinc-800 bg-zinc-950 text-sm text-zinc-400 space-y-1">
              <p className="font-bold text-zinc-200 tracking-widest uppercase">
                Commission for Personal Data Protection (CPDP)
              </p>
              <p>2 Prof. Tsvetan Lazarov Blvd., Sofia 1592, Bulgaria</p>
              <p>
                Website:{" "}
                <a
                  href="https://www.cpdp.bg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white underline underline-offset-2 hover:text-zinc-300 transition-colors"
                >
                  www.cpdp.bg
                </a>
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-black tracking-widest uppercase text-white mb-4 border-b border-zinc-900 pb-2">
              9. Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. The date at
              the top of this page will reflect the most recent revision. We
              encourage you to review this page periodically.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
