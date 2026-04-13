import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Search, FileText, Home, Key, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Buyers guide",
  description:
    "A step-by-step guide to buying a home in Tampa Bay. From pre-approval to closing, The Knighten Group walks you through every stage.",
};

const steps = [
  {
    icon: FileText,
    title: "Get pre-approved",
    body: "Before you start looking at homes, talk to a lender. Pre-approval tells you what you can actually afford and shows sellers you are serious. Without it, your offer goes to the bottom of the pile.",
  },
  {
    icon: Search,
    title: "Search and tour homes",
    body: "We will set you up with a search based on your needs and budget. When something looks good, we schedule a showing. We try to be honest about what we see, good and bad, so you can make a real decision.",
  },
  {
    icon: Home,
    title: "Make an offer",
    body: "When you find the one, we put together a competitive offer. We look at comparable sales, market conditions, and the seller's situation to figure out the right number. Then we negotiate.",
  },
  {
    icon: CheckCircle,
    title: "Inspections and due diligence",
    body: "Once your offer is accepted, you get an inspection period. Use it. We will help you understand what the inspector finds and whether to negotiate repairs or credits.",
  },
  {
    icon: Key,
    title: "Close and get your keys",
    body: "Your lender handles the final underwriting, title does the closing paperwork, and you sign a lot of documents. Then the keys are yours. We will be there for the whole thing.",
  },
];

export default function BuyersPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 noise-overlay" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-2xl">
            <div className="section-divider mb-4 opacity-60" />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold">
              Buying a home in Tampa Bay
            </h1>
            <p className="mt-4 text-lg text-primary-foreground/70 leading-relaxed">
              It is a big decision and the process can feel complicated.
              Here is how it works, step by step, with no jargon.
            </p>
          </div>
        </div>
      </section>

      {/* Steps */}
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

      {/* FAQ */}
      <section className="py-16 sm:py-20 bg-muted/50">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="section-divider mb-4" />
          <h2 className="text-2xl font-display font-semibold text-foreground mb-8">
            Common questions from buyers
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-foreground">How much do I need for a down payment?</h3>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                It depends on the loan type. Conventional loans typically want 5-20%. FHA loans go as low as 3.5%. VA loans can be 0% down if you qualify. Talk to a lender about your specific situation.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-foreground">Do I pay the buyer's agent?</h3>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                In most cases, the seller pays both agents' commissions as part of the listing agreement. This can vary, so we will explain how it works for your specific situation before you commit to anything.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-foreground">How long does it take to close?</h3>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                Usually 30 to 45 days from accepted offer to closing. Cash deals can close faster. Delays happen when there are appraisal issues, inspection negotiations, or lender holdups.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-foreground">What are closing costs?</h3>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                Expect 2-5% of the purchase price in closing costs. This covers things like title insurance, lender fees, recording fees, and prepaid taxes and insurance. Your lender will give you a detailed estimate early in the process.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-display font-semibold text-foreground">
            Ready to start looking?
          </h2>
          <p className="mt-2 text-muted-foreground">
            Search current listings or get in touch to talk about what you want.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/search"
              className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-medium text-white hover:opacity-90"
            >
              <Search className="h-4 w-4" />
              Search listings
            </Link>
            <a
              href="https://mortgage.neighborsbank.com/get-approved/2760060"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium hover:bg-muted"
            >
              Get pre-approved <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
