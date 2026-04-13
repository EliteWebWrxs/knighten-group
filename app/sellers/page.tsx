import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, TrendingUp, Camera, Tag, Users, FileCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Sellers guide",
  description:
    "Sell your Tampa Bay home with The Knighten Group. From pricing strategy to closing, we handle the marketing, negotiations, and paperwork.",
};

const steps = [
  {
    icon: TrendingUp,
    title: "Pricing strategy",
    body: "We pull recent comps, look at what is currently on the market, and factor in your home's specific condition and features. Pricing too high means sitting on the market. Pricing right means multiple offers. We would rather get it right the first time.",
  },
  {
    icon: Camera,
    title: "Prep and photography",
    body: "First impressions matter online. We coordinate professional photography, help with staging recommendations if needed, and make sure the listing shows your home at its best. Most buyers start their search on their phone.",
  },
  {
    icon: Tag,
    title: "List and market",
    body: "Your home goes on the MLS, which feeds to Zillow, Realtor.com, and every other major site. We also do targeted marketing to agents in the area who have active buyers looking for homes like yours.",
  },
  {
    icon: Users,
    title: "Showings and offers",
    body: "We handle scheduling, feedback collection, and all offer negotiations. When offers come in, we walk through every term with you so you understand what you are agreeing to. Not just the price, but contingencies, closing timeline, and financing.",
  },
  {
    icon: FileCheck,
    title: "Under contract to closing",
    body: "Once you accept an offer, there are inspections, appraisals, and a lot of coordination between agents, lenders, and title companies. We keep the deal on track and let you know what is happening at every stage.",
  },
];

export default function SellersPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 noise-overlay" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-2xl">
            <div className="section-divider mb-4 opacity-60" />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold">
              Selling your home in Tampa Bay
            </h1>
            <p className="mt-4 text-lg text-primary-foreground/70 leading-relaxed">
              We handle the pricing, marketing, and negotiations.
              You make the decisions.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {steps.map((step, i) => (
              <div key={step.title} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gold/10 text-gold shrink-0">
                    <step.icon className="h-5 w-5" />
                  </div>
                  {i < steps.length - 1 && (
                    <div className="w-px h-full bg-border mt-3" />
                  )}
                </div>
                <div className="pb-8">
                  <h2 className="text-lg font-semibold text-foreground">
                    {i + 1}. {step.title}
                  </h2>
                  <p className="mt-2 text-muted-foreground leading-relaxed">
                    {step.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-muted/50">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="section-divider mb-4" />
          <h2 className="text-2xl font-display font-semibold text-foreground mb-8">
            Common questions from sellers
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-foreground">When is the best time to sell in Tampa?</h3>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                Spring (March through May) tends to be the most active market, but Tampa's warm climate means year-round demand. Snowbirds shop in fall and winter. The right time to sell is whenever it makes sense for your situation.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-foreground">How long will it take to sell?</h3>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                Depends on price, condition, and location. Well-priced homes in good areas often get offers within the first week or two. Overpriced homes sit. We will be honest with you about pricing from day one.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-foreground">Should I make repairs before listing?</h3>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                Some repairs are worth it, others are not. We will walk through your home and tell you what buyers will care about and what they will not. Major issues like roof or HVAC are usually worth addressing. Minor cosmetic stuff, not always.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-display font-semibold text-foreground">
            Thinking about selling?
          </h2>
          <p className="mt-2 text-muted-foreground">
            Get a free market analysis for your home.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/home-value"
              className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-medium text-white hover:opacity-90"
            >
              <TrendingUp className="h-4 w-4" />
              Get your home value
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium hover:bg-muted"
            >
              Contact us <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
