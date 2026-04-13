import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Land for sale in Tampa Bay",
  description: "Browse vacant land and lots for sale across Tampa Bay. Build your dream home in Lithia, Riverview, Plant City, and surrounding areas.",
};

export default function LandPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 noise-overlay" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-2xl">
            <div className="section-divider mb-4 opacity-60" />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold">
              Land for sale
            </h1>
            <p className="mt-4 text-lg text-primary-foreground/70 leading-relaxed">
              Vacant lots and acreage across the Tampa Bay area. Build
              custom, start a farm, or hold for later.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-4 text-muted-foreground leading-relaxed mb-8">
            <p>
              Land is still available in the Tampa Bay area, though it is
              getting harder to find close in. Lithia, eastern Hillsborough
              County, and parts of Pasco still have acreage available.
            </p>
            <p>
              If you are thinking about buying land to build, there are some
              things to check before you commit: zoning, utility access, soil
              and survey, flood zone, and whether the county requires impact
              fees for new construction. We can help you work through all of
              that before you make an offer.
            </p>
          </div>

          <div className="text-center py-16 border border-dashed border-border rounded-lg">
            <p className="text-muted-foreground">
              Land listings will appear here once the MLS sync is running.
            </p>
            <Link href="/search?propertyType=Land" className="mt-4 inline-block text-sm text-gold hover:underline">
              Search land listings <ArrowRight className="h-3.5 w-3.5 inline" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
