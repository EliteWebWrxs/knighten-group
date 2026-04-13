import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "New construction homes in Tampa Bay",
  description: "Browse new construction homes for sale across Tampa Bay. Brand new builds in Riverview, Wesley Chapel, FishHawk, and more.",
};

export default function NewConstructionPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 noise-overlay" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-2xl">
            <div className="section-divider mb-4 opacity-60" />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold">
              New construction
            </h1>
            <p className="mt-4 text-lg text-primary-foreground/70 leading-relaxed">
              Brand new homes from builders across Tampa Bay. Everything from
              starter homes to custom builds.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-4 text-muted-foreground leading-relaxed mb-8">
            <p>
              Tampa Bay has a lot of new construction, especially in Riverview,
              Wesley Chapel, and Land O' Lakes where builders still have land to
              work with. New builds range from $300K starter homes to $1M+
              custom estates.
            </p>
            <p>
              A few things to know about buying new construction: having your
              own agent costs you nothing (the builder pays the commission), but
              it gives you someone in your corner during inspections and
              negotiations. Builders have their own contracts that favor them,
              and having an agent review those terms is worth it.
            </p>
          </div>

          <div className="text-center py-16 border border-dashed border-border rounded-lg">
            <p className="text-muted-foreground">
              New construction listings will appear here once the MLS sync is running.
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
