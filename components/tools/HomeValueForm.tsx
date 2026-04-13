"use client";

import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";

export function HomeValueForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    bedrooms: "",
    bathrooms: "",
    sqft: "",
    condition: "",
    timeline: "",
    message: "",
  });

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/home-value", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to submit");
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again or email us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground">
          We got your request
        </h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
          We will pull comps for your area and get back to you with a market
          analysis, usually within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-border bg-card p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">
            Your name *
          </label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">
            Email *
          </label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">
            Phone
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">
            Property address *
          </label>
          <input
            type="text"
            required
            value={form.address}
            onChange={(e) => update("address", e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            placeholder="123 Main St, Brandon, FL 33511"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">
            Bedrooms
          </label>
          <select
            value={form.bedrooms}
            onChange={(e) => update("bedrooms", e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="">Select</option>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">
            Bathrooms
          </label>
          <select
            value={form.bathrooms}
            onChange={(e) => update("bathrooms", e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="">Select</option>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">
            Approx. square footage
          </label>
          <input
            type="number"
            value={form.sqft}
            onChange={(e) => update("sqft", e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">
            Condition
          </label>
          <select
            value={form.condition}
            onChange={(e) => update("condition", e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="">Select</option>
            <option value="excellent">Excellent / fully updated</option>
            <option value="good">Good / minor updates needed</option>
            <option value="fair">Fair / needs some work</option>
            <option value="poor">Needs major renovation</option>
          </select>
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-foreground block mb-1.5">
          When are you thinking of selling?
        </label>
        <select
          value={form.timeline}
          onChange={(e) => update("timeline", e.target.value)}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        >
          <option value="">No rush, just curious</option>
          <option value="0-3">Within 3 months</option>
          <option value="3-6">3 to 6 months</option>
          <option value="6-12">6 to 12 months</option>
          <option value="12+">More than a year out</option>
        </select>
      </div>
      <div>
        <label className="text-sm font-medium text-foreground block mb-1.5">
          Anything else we should know?
        </label>
        <textarea
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm resize-none"
          placeholder="Recent upgrades, unique features, concerns..."
        />
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-2.5 text-sm font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        <Send className="h-4 w-4" />
        {submitting ? "Sending..." : "Get my home value"}
      </button>
    </form>
  );
}
