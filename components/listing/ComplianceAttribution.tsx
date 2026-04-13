"use client";

import { getMlsCopyright } from "@/lib/compliance/copyright";

interface ComplianceAttributionProps {
  listOfficeName?: string | null;
  modificationTimestamp?: string | null;
  showStellarLogo?: boolean;
}

export function ComplianceAttribution({
  listOfficeName,
  modificationTimestamp,
  showStellarLogo = true,
}: ComplianceAttributionProps) {
  const lastUpdated = modificationTimestamp
    ? new Date(modificationTimestamp).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : null;

  return (
    <div className="border-t border-border pt-6 mt-8 space-y-3">
      {/* Stellar MLS logo — required per TPDAA Exhibit C paragraph 8 */}
      {showStellarLogo && (
        <div className="flex items-center gap-3">
          {/* Replace with actual Stellar MLS logo SVG */}
          <a
            href="https://www.stellarmls.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground border border-border rounded px-3 py-1.5 hover:text-foreground transition-colors"
          >
            Stellar MLS
          </a>
        </div>
      )}

      {/* Listing courtesy */}
      {listOfficeName && (
        <p className="text-xs text-muted-foreground">
          Listing courtesy of {listOfficeName}
        </p>
      )}

      {/* MLS copyright — required on every page showing listing data */}
      <p className="text-xs text-muted-foreground">{getMlsCopyright(new Date().getFullYear())}</p>

      {/* Last updated timestamp */}
      {lastUpdated && (
        <p className="text-xs text-muted-foreground">
          Last updated: {lastUpdated}
        </p>
      )}

      {/* Disclaimer */}
      <p className="text-[11px] text-muted-foreground/60 leading-relaxed max-w-2xl">
        Listing information is deemed reliable but not guaranteed. All
        measurements and data should be independently verified. Information is
        provided by Stellar MLS and may not reflect all real estate activity in
        the market.
      </p>
    </div>
  );
}
