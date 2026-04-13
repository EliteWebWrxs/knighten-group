import type { Metadata } from "next";
import { ContactForm } from "./contact-form";
import { MapPin, Mail, Phone, Clock } from "lucide-react";
import { getLocalBusinessSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "Contact us",
  description:
    "Reach The Knighten Group for real estate questions in Tampa Bay. Office in Brandon, FL. Call, email, or fill out our contact form.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getLocalBusinessSchema()) }}
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <div>
            <div className="section-divider mb-4" />
            <h1 className="text-3xl font-display font-semibold text-foreground">
              Get in touch
            </h1>
            <p className="mt-3 text-muted-foreground max-w-md">
              Questions about buying or selling? Want to chat about the market?
              We are happy to help. No strings attached.
            </p>
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>

          {/* Info */}
          <div className="lg:pl-8">
            <div className="rounded-lg border border-border bg-card p-6 space-y-5">
              <h2 className="font-semibold text-foreground">
                The Knighten Group LLC
              </h2>
              <div className="space-y-4">
                <a
                  href="https://maps.google.com/?q=213+E+Robertson+Street+Brandon+FL+33511"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-gold" />
                  <span>213 E Robertson Street<br />Brandon, FL 33511</span>
                </a>
                <a
                  href="mailto:info@theknightengroup.com"
                  className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Mail className="h-4 w-4 shrink-0 text-gold" />
                  info@theknightengroup.com
                </a>
                <a
                  href="tel:+1"
                  className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Phone className="h-4 w-4 shrink-0 text-gold" />
                  (813) 555-0100
                </a>
                <div className="flex items-start gap-3 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mt-0.5 shrink-0 text-gold" />
                  <span>
                    Mon - Fri: 9am - 6pm<br />
                    Sat: 10am - 4pm<br />
                    Sun: By appointment
                  </span>
                </div>
              </div>
            </div>

            {/* Map embed placeholder */}
            <div className="mt-4 rounded-lg border border-border bg-muted aspect-video flex items-center justify-center text-sm text-muted-foreground">
              Google Maps embed
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
