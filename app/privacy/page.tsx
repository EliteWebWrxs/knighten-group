import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How The Knighten Group collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="section-divider mb-4" />
        <h1 className="text-3xl font-display font-semibold text-foreground">
          Privacy policy
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Last updated: April 2026
        </p>
        <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed text-sm">
          <p>
            The Knighten Group LLC ("we", "us") operates theknightengroup.com.
            This page explains what information we collect and how we use it.
          </p>
          <h2 className="text-base font-semibold text-foreground pt-2">Information we collect</h2>
          <p>
            When you fill out a form on our site (contact, home value request,
            or listing inquiry), we collect the information you provide: name,
            email, phone number, and any details about your property or
            question.
          </p>
          <p>
            We also collect basic analytics data (page views, device type) to
            understand how people use our site. We do not sell this data.
          </p>
          <h2 className="text-base font-semibold text-foreground pt-2">How we use it</h2>
          <p>
            We use your contact information to respond to your inquiry. We may
            follow up about real estate services if you have asked about buying
            or selling. You can opt out of any follow-up communication at any
            time.
          </p>
          <h2 className="text-base font-semibold text-foreground pt-2">MLS listing data</h2>
          <p>
            Property listing information displayed on this site comes from the
            Stellar MLS via the MLS Grid API. This data is provided for
            consumers' personal, non-commercial use. It may not be used for any
            purpose other than identifying prospective properties consumers may
            be interested in purchasing.
          </p>
          <h2 className="text-base font-semibold text-foreground pt-2">Contact</h2>
          <p>
            Questions about this policy? Email us at{" "}
            <a href="mailto:info@theknightengroup.com" className="text-gold hover:underline">
              info@theknightengroup.com
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
}
