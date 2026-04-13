import type { Metadata } from "next";
import Link from "next/link";
import { GraduationCap, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Schools in Tampa Bay",
  description:
    "Find top-rated schools across Tampa Bay. Hillsborough and Pasco County school information for home buyers.",
};

const topSchools = [
  { name: "Newsome High School", type: "Public High School", area: "Lithia / FishHawk", rating: "A" },
  { name: "Plant High School", type: "Public High School", area: "South Tampa", rating: "A" },
  { name: "Steinbrenner High School", type: "Public High School", area: "Lutz", rating: "A" },
  { name: "Barrington Middle School", type: "Public Middle School", area: "Lithia / FishHawk", rating: "A" },
  { name: "Boyette Springs Elementary", type: "Public Elementary", area: "Riverview", rating: "A" },
  { name: "Westchase Elementary", type: "Public Elementary", area: "Westchase", rating: "A" },
  { name: "Academy at the Lakes", type: "Private K-12", area: "Land O' Lakes", rating: "Private" },
  { name: "Berkeley Preparatory School", type: "Private K-12", area: "Tampa", rating: "Private" },
];

export default function SchoolsPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 noise-overlay" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-2xl">
            <div className="section-divider mb-4 opacity-60" />
            <h1 className="text-3xl sm:text-4xl font-display font-semibold">Schools</h1>
            <p className="mt-3 text-lg text-primary-foreground/70">
              School quality is one of the biggest factors in where families
              buy. Here is an overview of the Tampa Bay area.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-4 text-muted-foreground leading-relaxed mb-8">
            <p>
              Hillsborough County is the largest school district in the area and
              one of the biggest in the country. School quality varies a lot by
              neighborhood, so checking the specific school zone for any home
              you are considering is important.
            </p>
            <p>
              FishHawk and Lithia consistently have the top-rated public schools
              in the county. South Tampa has strong options too, especially at
              the high school level (Plant High). Wesley Chapel and Land O' Lakes
              are in Pasco County, which has been investing in new schools as the
              area grows.
            </p>
          </div>

          <h2 className="text-lg font-semibold text-foreground mb-4">
            Top-rated schools in the area
          </h2>
          <div className="space-y-3">
            {topSchools.map((school) => (
              <div
                key={school.name}
                className="flex items-center justify-between rounded-lg border border-border bg-card p-4"
              >
                <div className="flex items-center gap-3">
                  <GraduationCap className="h-4 w-4 text-gold shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{school.name}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {school.area} &middot; {school.type}
                    </p>
                  </div>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                  school.rating === "A" ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"
                }`}>
                  {school.rating}
                </span>
              </div>
            ))}
          </div>

          <p className="mt-6 text-xs text-muted-foreground">
            School ratings based on Florida Department of Education data. Always verify
            current school zones with the district before making a purchase decision.
          </p>
        </div>
      </section>
    </div>
  );
}
