import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Luxury homes for sale in Tampa Bay",
  description: "Browse luxury homes listed at $1M+ across Tampa Bay. South Tampa, waterfront, new construction, and estate properties.",
};

export default function LuxuryPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 noise-overlay" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-2xl">
            <div className="section-divider mb-4 opacity-60" />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold">
              Luxury homes
            </h1>
            <p className="mt-4 text-lg text-primary-foreground/70 leading-relaxed">
              Tampa Bay properties listed at $1 million and above. Waterfront
              estates, new construction, and high-end homes across the region.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16 border border-dashed border-border rounded-lg">
            <p className="text-muted-foreground">
              Luxury listings ($1M+) will appear here once the MLS sync is running.
            </p>
            <Link href="/search?minPrice=1000000" className="mt-4 inline-block text-sm text-gold hover:underline">
              Search all listings over $1M <ArrowRight className="h-3.5 w-3.5 inline" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
