import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of service",
  description: "Terms of service for The Knighten Group website.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="section-divider mb-4" />
        <h1 className="text-3xl font-display font-semibold text-foreground">
          Terms of service
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Last updated: April 2026
        </p>
        <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed text-sm">
          <p>
            By using theknightengroup.com, you agree to the following terms.
          </p>
          <h2 className="text-base font-semibold text-foreground pt-2">Listing data</h2>
          <p>
            Property listing data displayed on this site is provided by the
            Stellar MLS and is intended for consumers' personal,
            non-commercial use only. You may not copy, redistribute, or
            republish any listing content without written permission.
          </p>
          <h2 className="text-base font-semibold text-foreground pt-2">Accuracy</h2>
          <p>
            We try to keep listing data current and accurate, but we cannot
            guarantee it. All information should be independently verified.
            Square footage, lot sizes, and other measurements are approximate.
          </p>
          <h2 className="text-base font-semibold text-foreground pt-2">Not legal or financial advice</h2>
          <p>
            Nothing on this site constitutes legal, financial, or tax advice.
            The mortgage calculator provides estimates only. Consult
            appropriate professionals for your specific situation.
          </p>
          <h2 className="text-base font-semibold text-foreground pt-2">Contact</h2>
          <p>
            Questions? Email{" "}
            <a href="mailto:info@theknightengroup.com" className="text-gold hover:underline">
              info@theknightengroup.com
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
}
