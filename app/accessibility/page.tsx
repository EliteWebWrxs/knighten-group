import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accessibility statement",
  description: "The Knighten Group's commitment to web accessibility and ADA compliance.",
};

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="section-divider mb-4" />
        <h1 className="text-3xl font-display font-semibold text-foreground">
          Accessibility
        </h1>
        <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
          <p>
            The Knighten Group is committed to making our website accessible
            to all users, including those with disabilities. We aim to meet
            WCAG 2.1 Level AA standards.
          </p>
          <p>
            Our site includes an accessibility widget (powered by UserWay) that
            allows you to adjust text size, contrast, cursor size, and other
            settings. You can find it in the bottom-left corner of every page.
          </p>
          <h2 className="text-lg font-semibold text-foreground pt-4">
            What we have done
          </h2>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Semantic HTML structure throughout the site</li>
            <li>Alt text on all images</li>
            <li>Keyboard navigable interface</li>
            <li>Sufficient color contrast ratios</li>
            <li>Focus indicators on interactive elements</li>
            <li>Descriptive link text</li>
            <li>Form labels and error messages</li>
          </ul>
          <h2 className="text-lg font-semibold text-foreground pt-4">
            Contact us about accessibility
          </h2>
          <p>
            If you encounter any accessibility barriers on our site, please
            let us know. We take this seriously and will work to fix any
            issues.
          </p>
          <p>
            Email:{" "}
            <a href="mailto:info@theknightengroup.com" className="text-gold hover:underline">
              info@theknightengroup.com
            </a>
          </p>
          <p>
            Phone: (813) 555-0100
          </p>
        </div>
      </div>
    </div>
  );
}
