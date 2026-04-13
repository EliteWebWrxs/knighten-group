import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Waves } from "lucide-react";

export const metadata: Metadata = {
  title: "Waterfront homes for sale in Tampa Bay",
  description: "Browse waterfront properties across Tampa Bay. Canal homes, bayfront estates, and river access properties in Apollo Beach, South Tampa, and more.",
};

export default function WaterfrontPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 noise-overlay" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-2xl">
            <div className="section-divider mb-4 opacity-60" />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold">
              Waterfront homes
            </h1>
            <p className="mt-4 text-lg text-primary-foreground/70 leading-relaxed">
              Canal homes, bayfront properties, and river access across
              Tampa Bay.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-4 text-muted-foreground leading-relaxed mb-8">
            <p>
              Tampa Bay is surrounded by water, and waterfront property is one
              of the most popular searches in this market. Apollo Beach is the
              go-to for canal homes with Gulf access. South Tampa has bayfront
              properties along Bayshore Boulevard. And you can find river access
              homes along the Alafia and Hillsborough rivers.
            </p>
            <p>
              Waterfront comes with extra considerations: flood insurance
              (required in most waterfront zones), seawall condition, dock
              permits, and elevation. We can help you navigate all of that.
            </p>
          </div>

          <div className="text-center py-16 border border-dashed border-border rounded-lg">
            <p className="text-muted-foreground">
              Waterfront listings will appear here once the MLS sync is running.
            </p>
            <Link href="/search" className="mt-4 inline-block text-sm text-gold hover:underline">
              Browse all listings <ArrowRight className="h-3.5 w-3.5 inline" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
