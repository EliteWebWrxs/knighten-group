import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fair housing statement",
  description: "The Knighten Group's fair housing commitment and equal opportunity statement.",
};

export default function FairHousingPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="section-divider mb-4" />
        <h1 className="text-3xl font-display font-semibold text-foreground">
          Fair housing statement
        </h1>
        <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
          <p>
            The Knighten Group is committed to the Fair Housing Act and all
            applicable federal, state, and local fair housing laws. We do not
            discriminate on the basis of race, color, religion, sex, national
            origin, disability, familial status, or any other protected class.
          </p>
          <p>
            All real estate advertised on this site is subject to the Federal
            Fair Housing Act, which makes it illegal to advertise any
            preference, limitation, or discrimination based on protected
            classes.
          </p>
          <p>
            If you believe you have been discriminated against in a housing
            transaction, you may file a complaint with the U.S. Department of
            Housing and Urban Development (HUD) at 1-800-669-9777 or online
            at hud.gov.
          </p>
          <p>
            Questions or concerns? Contact us at{" "}
            <a href="mailto:info@theknightengroup.com" className="text-gold hover:underline">
              info@theknightengroup.com
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
}
