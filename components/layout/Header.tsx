"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

const navLinks = [
  { label: "Search", href: "/search" },
  {
    label: "Buy",
    href: "/search",
    children: [
      { label: "All listings", href: "/search" },
      { label: "Open houses", href: "/search/open-houses" },
      { label: "Luxury homes", href: "/luxury" },
      { label: "New construction", href: "/new-construction" },
      { label: "Waterfront", href: "/waterfront" },
      { label: "Land", href: "/land" },
    ],
  },
  { label: "Communities", href: "/communities" },
  { label: "Buyers", href: "/buyers" },
  { label: "Sellers", href: "/sellers" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image
            src="/Logo.png"
            alt="The Knighten Group"
            width={44}
            height={44}
            className="rounded-full"
            priority
          />
          <div className="flex flex-col leading-none">
            <span className="text-lg font-semibold tracking-tight text-foreground">
              The Knighten Group
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Experience Excellence
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1" role="navigation" aria-label="Main navigation">
          {navLinks.map((link) =>
            link.children ? (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => setActiveDropdown(link.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
                  aria-expanded={activeDropdown === link.label}
                  aria-haspopup="true"
                >
                  {link.label}
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
                {activeDropdown === link.label && (
                  <div className="absolute left-0 top-full pt-1 z-50">
                    <div className="rounded-lg border border-border bg-card p-1.5 shadow-lg min-w-[200px]">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block rounded-md px-3 py-2 text-sm text-foreground/70 transition-colors hover:bg-muted hover:text-foreground"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        {/* CTA + mobile toggle */}
        <div className="flex items-center gap-3">
          <a
            href="https://mortgage.neighborsbank.com/get-approved/2760060"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center rounded-full bg-gold px-4 py-2 text-sm font-medium text-white transition-all hover:opacity-90 hover:shadow-md"
          >
            Get pre-approved
          </a>
          <button
            className="lg:hidden flex items-center justify-center h-10 w-10 rounded-md text-foreground/70 hover:text-foreground hover:bg-muted transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-background">
          <nav className="mx-auto max-w-7xl px-4 py-4 space-y-1" role="navigation" aria-label="Mobile navigation">
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.label}>
                  <span className="block px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {link.label}
                  </span>
                  {link.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block rounded-md px-3 py-2 pl-6 text-sm text-foreground/80 hover:bg-muted hover:text-foreground"
                      onClick={() => setMobileOpen(false)}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block rounded-md px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-muted hover:text-foreground"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              )
            )}
            <div className="pt-3 border-t border-border">
              <a
                href="https://mortgage.neighborsbank.com/get-approved/2760060"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center rounded-full bg-gold px-4 py-2.5 text-sm font-medium text-white"
              >
                Get pre-approved
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
