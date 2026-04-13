import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Search, Home, TrendingUp, DollarSign, Calculator, ArrowRight, Star, MapPin } from "lucide-react";
import { getRealEstateAgentSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "The Knighten Group | Tampa Bay Real Estate",
  description:
    "Find your next home in Tampa Bay with The Knighten Group. Search active MLS listings across Riverview, Brandon, Apollo Beach, FishHawk, and all of Hillsborough County.",
};

const communities = [
  { name: "Riverview", slug: "riverview", count: "200+" },
  { name: "Brandon", slug: "brandon", count: "150+" },
  { name: "Apollo Beach", slug: "apollo-beach", count: "80+" },
  { name: "FishHawk", slug: "fishhawk", count: "60+" },
  { name: "Valrico", slug: "valrico", count: "90+" },
  { name: "Wesley Chapel", slug: "wesley-chapel", count: "120+" },
  { name: "South Tampa", slug: "south-tampa", count: "100+" },
  { name: "Westchase", slug: "westchase", count: "70+" },
];

const services = [
  {
    icon: Home,
    title: "Buy a home",
    description: "We'll walk you through every step, from first showing to closing table.",
    href: "/buyers",
  },
  {
    icon: TrendingUp,
    title: "Sell your home",
    description: "Get a pricing strategy and marketing plan that actually works for your property.",
    href: "/sellers",
  },
  {
    icon: DollarSign,
    title: "What's my home worth?",
    description: "Free market analysis. We pull comps, look at the numbers, and give you a straight answer.",
    href: "/home-value",
  },
  {
    icon: Calculator,
    title: "Mortgage calculator",
    description: "Run the numbers before you get serious. See what your monthly payment looks like.",
    href: "/mortgage-calculator",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getRealEstateAgentSchema()) }}
      />
      {/* Hero */}
      <section className="relative bg-primary text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 noise-overlay" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
          <div className="max-w-2xl animate-fade-in">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-semibold leading-[1.1]">
              Find your place in
              <span className="block text-gradient-gold">Tampa Bay</span>
            </h1>
            <p className="mt-5 text-lg text-primary-foreground/70 max-w-lg leading-relaxed">
              We help people buy and sell homes across Hillsborough County.
              No pressure, no runaround. Just honest guidance from people who know this market.
            </p>
          </div>

          {/* Search bar */}
          <div className="mt-8 max-w-xl animate-fade-in-delay-2">
            <Link
              href="/search"
              className="flex items-center gap-3 rounded-xl bg-background/10 backdrop-blur-sm border border-white/10 px-5 py-4 text-primary-foreground/60 hover:bg-background/15 transition-colors group"
            >
              <Search className="h-5 w-5 shrink-0" />
              <span className="text-sm">Search by city, zip code, or address...</span>
              <ArrowRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </div>

          {/* Quick links */}
          <div className="mt-6 flex flex-wrap gap-3 animate-fade-in-delay-3">
            {["Riverview", "Brandon", "Apollo Beach", "FishHawk"].map((city) => (
              <Link
                key={city}
                href={`/search?city=${city}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs text-primary-foreground/60 hover:bg-white/5 transition-colors"
              >
                <MapPin className="h-3 w-3" />
                {city}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Communities */}
      <section className="py-16 sm:py-20 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="section-divider mb-4" />
              <h2 className="text-2xl sm:text-3xl font-display font-semibold text-foreground">
                Tampa Bay communities
              </h2>
              <p className="mt-2 text-muted-foreground max-w-md">
                Each neighborhood has its own feel. Here are the areas where we do
                most of our work.
              </p>
            </div>
            <Link
              href="/communities"
              className="hidden sm:inline-flex items-center gap-1 text-sm text-gold hover:underline"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {communities.map((c) => (
              <Link
                key={c.slug}
                href={`/communities/${c.slug}`}
                className="group rounded-lg border border-border p-4 hover-lift bg-card"
              >
                <p className="font-medium text-foreground group-hover:text-gold transition-colors">
                  {c.name}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {c.count} active listings
                </p>
              </Link>
            ))}
          </div>
          <Link
            href="/communities"
            className="sm:hidden mt-4 inline-flex items-center gap-1 text-sm text-gold hover:underline"
          >
            View all communities <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 sm:py-20 bg-muted/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="section-divider mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl font-display font-semibold text-foreground">
              How we can help
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <Link
                key={service.href}
                href={service.href}
                className="group rounded-lg border border-border bg-card p-6 hover-lift"
              >
                <service.icon className="h-8 w-8 text-gold mb-4" />
                <h3 className="font-semibold text-foreground group-hover:text-gold transition-colors">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About preview */}
      <section className="py-16 sm:py-20 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="section-divider mb-4" />
              <h2 className="text-2xl sm:text-3xl font-display font-semibold text-foreground">
                Who we are
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                The Knighten Group is a small team based in Brandon, FL. We work
                with buyers and sellers across the Tampa Bay area, mostly in
                Hillsborough County. Earl Knighten started the brokerage because
                he wanted to do real estate the right way: take the time, explain
                everything, and treat people like adults.
              </p>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                We're not the biggest team in Tampa. We're fine with that. We'd
                rather give five clients our full attention than juggle fifty.
              </p>
              <Link
                href="/about"
                className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-gold hover:underline"
              >
                More about us <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="rounded-lg overflow-hidden aspect-[4/3] relative bg-muted">
              <Image
                src="/Earl 1_2.jpg"
                alt="Earl Knighten, Broker and Owner of The Knighten Group"
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 sm:py-20 bg-muted/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="section-divider mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl font-display font-semibold text-foreground">
              What our clients say
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                text: "Earl made the whole process feel manageable. He answered every question we had, even the ones we asked three times.",
                name: "Recent buyer",
              },
              {
                text: "We listed on a Thursday and had two offers by Monday. The pricing strategy was spot on.",
                name: "Recent seller",
              },
              {
                text: "First-time buyer here. Nisha walked us through everything and never made us feel rushed or stupid for asking questions.",
                name: "First-time buyer",
              },
            ].map((review, i) => (
              <div key={i} className="rounded-lg border border-border bg-card p-6">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  "{review.text}"
                </p>
                <p className="mt-3 text-xs font-medium text-foreground">
                  {review.name}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <a
              href="https://g.page/r/CXjdSTfMtV8VEBM/review"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-gold hover:underline"
            >
              Leave us a review on Google <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 noise-overlay" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-display font-semibold">
            Ready to get started?
          </h2>
          <p className="mt-3 text-primary-foreground/60 max-w-md mx-auto">
            Whether you're buying, selling, or just have questions, we're here.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/search"
              className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-medium text-white hover:opacity-90 transition-opacity"
            >
              <Search className="h-4 w-4" />
              Search listings
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-white/5 transition-colors"
            >
              Get in touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
