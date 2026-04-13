import type { Metadata } from "next";
import { HomeValueForm } from "@/components/tools/HomeValueForm";

export const metadata: Metadata = {
  title: "What's my home worth?",
  description:
    "Get a free home value estimate from The Knighten Group. We pull real comps from the MLS and give you an honest market analysis for your Tampa Bay property.",
};

export default function HomeValuePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="mb-8">
          <div className="section-divider mb-4" />
          <h1 className="text-3xl font-display font-semibold text-foreground">
            What's your home worth?
          </h1>
          <p className="mt-3 text-muted-foreground leading-relaxed max-w-lg">
            Fill out the form below and we will put together a comparative
            market analysis for your property. Not an algorithm guess, but
            actual comps from the MLS reviewed by a real person. Most people
            hear back within 24 hours.
          </p>
        </div>
        <HomeValueForm />
      </div>
    </div>
  );
}
