const BASE_URL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "https://theknightengroup.com";

/**
 * schema.org RealEstateAgent for the homepage and about page.
 */
export function getRealEstateAgentSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "The Knighten Group",
    url: BASE_URL,
    logo: `${BASE_URL}/logos/knighten-group.svg`,
    image: `${BASE_URL}/logos/knighten-group.svg`,
    description:
      "Tampa Bay real estate brokerage helping buyers and sellers across Hillsborough County.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "213 E Robertson Street",
      addressLocality: "Brandon",
      addressRegion: "FL",
      postalCode: "33511",
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 27.9378,
      longitude: -82.2859,
    },
    telephone: "+1-813-555-0100",
    email: "info@theknightengroup.com",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "10:00",
        closes: "16:00",
      },
    ],
    areaServed: [
      { "@type": "City", name: "Tampa" },
      { "@type": "City", name: "Brandon" },
      { "@type": "City", name: "Riverview" },
      { "@type": "City", name: "Apollo Beach" },
      { "@type": "City", name: "Valrico" },
      { "@type": "City", name: "Lithia" },
      { "@type": "City", name: "Wesley Chapel" },
    ],
    sameAs: [],
  };
}

/**
 * schema.org LocalBusiness for NAP consistency.
 */
export function getLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "The Knighten Group LLC",
    url: BASE_URL,
    telephone: "+1-813-555-0100",
    email: "info@theknightengroup.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "213 E Robertson Street",
      addressLocality: "Brandon",
      addressRegion: "FL",
      postalCode: "33511",
      addressCountry: "US",
    },
  };
}

/**
 * schema.org BreadcrumbList helper.
 */
export function getBreadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
