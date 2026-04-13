import type { Metadata } from "next";
import { MortgageCalculator } from "@/components/tools/MortgageCalculator";

export const metadata: Metadata = {
  title: "Mortgage calculator",
  description:
    "Estimate your monthly mortgage payment for Tampa Bay homes. Adjust price, down payment, rate, taxes, and insurance to see what you can afford.",
};

export default function MortgageCalculatorPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="mb-8">
          <div className="section-divider mb-4" />
          <h1 className="text-3xl font-display font-semibold text-foreground">
            Mortgage calculator
          </h1>
          <p className="mt-2 text-muted-foreground max-w-lg">
            Run the numbers before you start house hunting. Adjust the inputs
            below to see what your monthly payment might look like.
          </p>
        </div>
        <MortgageCalculator />
        <div className="mt-8 rounded-lg bg-muted/50 border border-border p-6">
          <h2 className="text-sm font-semibold text-foreground mb-2">
            A few things to keep in mind
          </h2>
          <ul className="text-sm text-muted-foreground space-y-2 leading-relaxed">
            <li>
              Florida has no state income tax, but property taxes vary by county.
              Hillsborough County's rate is roughly 1% of assessed value.
            </li>
            <li>
              Homeowners insurance in Florida has gone up significantly in recent
              years. Get actual quotes before you commit to a price range.
            </li>
            <li>
              If your down payment is under 20%, you will likely pay private
              mortgage insurance (PMI), which adds to your monthly cost.
            </li>
            <li>
              This calculator gives estimates only. Talk to a lender for real
              numbers based on your credit and financial situation.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
