import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { CopyrightLine } from "./CopyrightLine";

const footerLinks = {
  search: [
    { label: "All listings", href: "/search" },
    { label: "Open houses", href: "/search/open-houses" },
    { label: "Luxury homes", href: "/luxury" },
    { label: "New construction", href: "/new-construction" },
    { label: "Waterfront", href: "/waterfront" },
    { label: "Land", href: "/land" },
  ],
  resources: [
    { label: "Buyers guide", href: "/buyers" },
    { label: "Sellers guide", href: "/sellers" },
    { label: "Home value", href: "/home-value" },
    { label: "Mortgage calculator", href: "/mortgage-calculator" },
    { label: "Schools", href: "/schools" },
    { label: "Things to do", href: "/things-to-do" },
  ],
  company: [
    { label: "About us", href: "/about" },
    { label: "Communities", href: "/communities" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  legal: [
    { label: "Privacy policy", href: "/privacy" },
    { label: "Terms of service", href: "/terms" },
    { label: "Accessibility", href: "/accessibility" },
    { label: "Fair housing", href: "/fair-housing" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      {/* Main footer content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3">
              <Image
                src="/Logo - Transparent (White).png"
                alt="The Knighten Group"
                width={40}
                height={40}
                className="rounded-full"
              />
              <span className="text-xl font-semibold tracking-tight">
                The Knighten Group
              </span>
            </Link>
            <p className="mt-3 text-sm text-primary-foreground/60 max-w-xs leading-relaxed">
              Tampa Bay area real estate. Buying, selling, and everything
              in between.
            </p>
            <div className="mt-5 space-y-2.5">
              <a
                href="https://maps.google.com/?q=213+E+Robertson+Street+Brandon+FL+33511"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
              >
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                213 E Robertson Street, Brandon, FL 33511
              </a>
              <a
                href="mailto:info@theknightengroup.com"
                className="flex items-center gap-2 text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
              >
                <Mail className="h-4 w-4 shrink-0" />
                info@theknightengroup.com
              </a>
              <a
                href="tel:+1"
                className="flex items-center gap-2 text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
              >
                <Phone className="h-4 w-4 shrink-0" />
                (813) 555-0100
              </a>
            </div>
          </div>

          {/* Link columns */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-primary-foreground/40 mb-3">
              Search
            </h3>
            <ul className="space-y-2">
              {footerLinks.search.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-primary-foreground/40 mb-3">
              Resources
            </h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-primary-foreground/40 mb-3">
              Company
            </h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-primary-foreground/40 mb-3">
              Legal
            </h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Logo row + MLS attribution */}
      <div className="border-t border-primary-foreground/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          {/* Logo row */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-4">
            <Image
              src="/Logo - Transparent (White).png"
              alt="The Knighten Group"
              width={48}
              height={48}
              className="rounded-full opacity-60"
            />
            <Image
              src="/MLS realtor logo.PNG"
              alt="REALTOR, MLS, and Equal Housing Opportunity logos"
              width={160}
              height={48}
              className="brightness-0 invert opacity-50"
            />
            {/* Stellar MLS logo — appears site-wide per TPDAA */}
            <a
              href="https://www.stellarmls.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary-foreground/40 border border-primary-foreground/20 rounded px-3 py-1.5 hover:text-primary-foreground/60 transition-colors"
            >
              Stellar MLS
            </a>
          </div>

          {/* Copyright */}
          <div className="text-center space-y-1">
            <Suspense>
              <CopyrightLine />
            </Suspense>
            <p className="text-xs text-primary-foreground/30">
              Listing information is deemed reliable but not guaranteed.
              All measurements and data should be independently verified.
            </p>
          </div>

          {/* Review CTA */}
          <div className="mt-4 text-center">
            <a
              href="https://g.page/r/CXjdSTfMtV8VEBM/review"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-xs text-gold hover:underline"
            >
              Leave us a review on Google
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
