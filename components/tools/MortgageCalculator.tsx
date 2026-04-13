"use client";

import { useState, useMemo } from "react";
import { DollarSign, Percent } from "lucide-react";

interface MortgageCalculatorProps {
  defaultPrice?: number;
  compact?: boolean;
}

export function MortgageCalculator({
  defaultPrice = 350000,
  compact = false,
}: MortgageCalculatorProps) {
  const [homePrice, setHomePrice] = useState(defaultPrice);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTerm, setLoanTerm] = useState(30);
  const [propertyTax, setPropertyTax] = useState(
    Math.round(defaultPrice * 0.01 / 12)
  );
  const [insurance, setInsurance] = useState(150);
  const [hoa, setHoa] = useState(0);

  const calculation = useMemo(() => {
    const downPayment = homePrice * (downPaymentPercent / 100);
    const loanAmount = homePrice - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = loanTerm * 12;

    let monthlyPrincipalInterest: number;
    if (monthlyRate === 0) {
      monthlyPrincipalInterest = loanAmount / numPayments;
    } else {
      monthlyPrincipalInterest =
        (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
        (Math.pow(1 + monthlyRate, numPayments) - 1);
    }

    const totalMonthly =
      monthlyPrincipalInterest + propertyTax + insurance + hoa;

    return {
      downPayment,
      loanAmount,
      monthlyPrincipalInterest,
      totalMonthly,
    };
  }, [homePrice, downPaymentPercent, interestRate, loanTerm, propertyTax, insurance, hoa]);

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(n);

  if (compact) {
    return (
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          <div>
            <label className="text-xs text-muted-foreground block mb-1">
              Down payment
            </label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={downPaymentPercent}
                onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                className="w-16 rounded border border-border bg-background px-2 py-1 text-sm"
                min={0}
                max={100}
              />
              <span className="text-muted-foreground">%</span>
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">
              Rate
            </label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-16 rounded border border-border bg-background px-2 py-1 text-sm"
                step={0.1}
                min={0}
              />
              <span className="text-muted-foreground">%</span>
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">
              Term
            </label>
            <select
              value={loanTerm}
              onChange={(e) => setLoanTerm(Number(e.target.value))}
              className="rounded border border-border bg-background px-2 py-1 text-sm"
            >
              <option value={30}>30 years</option>
              <option value={15}>15 years</option>
            </select>
          </div>
          <div className="text-right sm:text-left">
            <p className="text-xs text-muted-foreground mb-1">Est. monthly</p>
            <p className="text-lg font-semibold text-foreground">
              {formatCurrency(calculation.totalMonthly)}
            </p>
          </div>
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">
          Principal & interest {formatCurrency(calculation.monthlyPrincipalInterest)}/mo.
          Taxes, insurance, and HOA estimated separately.
          {" "}
          <a
            href="https://mortgage.neighborsbank.com/get-approved/2760060"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold hover:underline"
          >
            Get pre-approved
          </a>
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">
            Home price
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="number"
              value={homePrice}
              onChange={(e) => setHomePrice(Number(e.target.value))}
              className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2 text-sm"
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">
            Down payment
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="number"
                value={Math.round(homePrice * (downPaymentPercent / 100))}
                onChange={(e) =>
                  setDownPaymentPercent(
                    Math.round((Number(e.target.value) / homePrice) * 100)
                  )
                }
                className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2 text-sm"
              />
            </div>
            <div className="relative w-20">
              <input
                type="number"
                value={downPaymentPercent}
                onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-background pl-3 pr-7 py-2 text-sm"
                min={0}
                max={100}
              />
              <Percent className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            </div>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">
            Interest rate
          </label>
          <div className="relative">
            <input
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full rounded-lg border border-border bg-background pl-3 pr-7 py-2 text-sm"
              step={0.1}
              min={0}
            />
            <Percent className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">
            Loan term
          </label>
          <select
            value={loanTerm}
            onChange={(e) => setLoanTerm(Number(e.target.value))}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          >
            <option value={30}>30 years</option>
            <option value={20}>20 years</option>
            <option value={15}>15 years</option>
            <option value={10}>10 years</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">
            Property tax / month
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="number"
              value={propertyTax}
              onChange={(e) => setPropertyTax(Number(e.target.value))}
              className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2 text-sm"
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">
            Home insurance / month
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="number"
              value={insurance}
              onChange={(e) => setInsurance(Number(e.target.value))}
              className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2 text-sm"
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">
            HOA / month
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="number"
              value={hoa}
              onChange={(e) => setHoa(Number(e.target.value))}
              className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Result */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              Estimated monthly payment
            </p>
            <p className="text-3xl font-display font-semibold text-foreground mt-1">
              {formatCurrency(calculation.totalMonthly)}
            </p>
          </div>
          <a
            href="https://mortgage.neighborsbank.com/get-approved/2760060"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-medium text-white hover:opacity-90 transition-opacity"
          >
            Get pre-approved
          </a>
        </div>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground">Principal & interest</p>
            <p className="font-medium text-foreground">
              {formatCurrency(calculation.monthlyPrincipalInterest)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Property tax</p>
            <p className="font-medium text-foreground">
              {formatCurrency(propertyTax)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Insurance</p>
            <p className="font-medium text-foreground">
              {formatCurrency(insurance)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">HOA</p>
            <p className="font-medium text-foreground">
              {formatCurrency(hoa)}
            </p>
          </div>
        </div>
        <p className="mt-3 text-[11px] text-muted-foreground">
          This is an estimate. Your actual rate, taxes, and insurance may differ.
          Contact a lender for exact numbers.
        </p>
      </div>
    </div>
  );
}
