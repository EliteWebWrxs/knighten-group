import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Open houses in Tampa Bay",
  description:
    "Find upcoming open houses across Tampa, Brandon, Riverview, Apollo Beach, and surrounding areas. Tour homes in person this weekend.",
};

export default function OpenHousesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-display font-semibold text-foreground">
            Open houses this weekend
          </h1>
          <p className="mt-3 text-muted-foreground">
            Walk through homes in person. Open houses are updated from the MLS
            every 15 minutes, so check back if you don't see what you're looking
            for right now.
          </p>
        </div>

        <div className="mt-8 text-center py-16 border border-dashed border-border rounded-lg">
          <p className="text-muted-foreground">
            Open house listings will appear here once the MLS sync is running.
          </p>
          <Link href="/search" className="mt-4 inline-block text-sm text-gold hover:underline">
            Browse all listings instead
          </Link>
        </div>
      </div>
    </div>
  );
}
