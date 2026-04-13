import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Tampa Bay communities",
  description:
    "Explore neighborhoods across Tampa Bay. Find homes in Riverview, Brandon, Apollo Beach, FishHawk, Valrico, Wesley Chapel, South Tampa, and more.",
};

const communities = [
  { name: "Riverview", slug: "riverview", description: "One of Tampa's fastest-growing suburbs. Good schools, newer construction, and relatively affordable compared to closer-in neighborhoods.", priceRange: "$280K - $650K" },
  { name: "Brandon", slug: "brandon", description: "Established community east of Tampa. Mix of older ranch homes and newer builds. Close to everything, easy highway access.", priceRange: "$250K - $500K" },
  { name: "Apollo Beach", slug: "apollo-beach", description: "Waterfront community south of Tampa. Canal homes, boat access to Tampa Bay, and a laid-back feel. Popular with boaters and anglers.", priceRange: "$350K - $900K" },
  { name: "FishHawk Ranch", slug: "fishhawk", description: "Master-planned community in Lithia. Top-rated schools, trails, pools, and a golf course. Popular with families who want space.", priceRange: "$400K - $800K" },
  { name: "Valrico", slug: "valrico", description: "Quiet suburb east of Brandon. Mix of older homes on larger lots and some newer development. Good value for the area.", priceRange: "$300K - $600K" },
  { name: "Lithia", slug: "lithia", description: "Rural feel with newer master-planned communities mixed in. Larger lots, horse properties, and FishHawk is technically here. If you want land, look here.", priceRange: "$350K - $1M+" },
  { name: "Wesley Chapel", slug: "wesley-chapel", description: "North Tampa suburb that has exploded with growth. New retail, restaurants, and subdivisions. The Outlets and Advent Health are big draws.", priceRange: "$300K - $700K" },
  { name: "South Tampa", slug: "south-tampa", description: "The most expensive and most walkable part of Tampa. Bayshore Boulevard, Hyde Park, SoHo. Older bungalows and new construction side by side.", priceRange: "$500K - $2M+" },
  { name: "Westchase", slug: "westchase", description: "Master-planned community in northwest Tampa. Well-maintained, good schools, golf course, and close to the airport and International Mall.", priceRange: "$400K - $900K" },
  { name: "Carrollwood", slug: "carrollwood", description: "Established northwest Tampa neighborhood. Mix of older and newer homes, good restaurants, and central location.", priceRange: "$300K - $700K" },
  { name: "New Tampa", slug: "new-tampa", description: "North Tampa area with mostly newer construction. Good shopping, USF nearby, and easy access to I-75.", priceRange: "$300K - $600K" },
  { name: "Land O' Lakes", slug: "land-o-lakes", description: "Pasco County suburb north of Tampa. More affordable than Hillsborough, growing fast, and popular with first-time buyers.", priceRange: "$280K - $550K" },
  { name: "Seffner", slug: "seffner", description: "Small community between Brandon and Plant City. Quieter, more rural feel, with affordable homes and easy I-4 access.", priceRange: "$250K - $450K" },
];

export default function CommunitiesPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 noise-overlay" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-2xl">
            <div className="section-divider mb-4 opacity-60" />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold">
              Tampa Bay communities
            </h1>
            <p className="mt-4 text-lg text-primary-foreground/70 leading-relaxed">
              Every neighborhood has its own personality. Here is a quick
              overview of the areas where we work most.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {communities.map((c) => (
              <Link
                key={c.slug}
                href={`/communities/${c.slug}`}
                className="group rounded-lg border border-border bg-card p-6 hover-lift"
              >
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-gold" />
                  <h2 className="font-semibold text-foreground group-hover:text-gold transition-colors">
                    {c.name}
                  </h2>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  {c.description}
                </p>
                <p className="text-xs text-gold font-medium">{c.priceRange}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
