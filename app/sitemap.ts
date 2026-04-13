import type { MetadataRoute } from "next";

const BASE_URL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "https://theknightengroup.com";

const communities = [
  "riverview", "brandon", "apollo-beach", "fishhawk", "valrico",
  "lithia", "wesley-chapel", "south-tampa", "westchase", "carrollwood",
  "new-tampa", "land-o-lakes", "seffner",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Static pages
  const staticPages = [
    "",
    "/search",
    "/search/open-houses",
    "/communities",
    "/luxury",
    "/new-construction",
    "/waterfront",
    "/land",
    "/buyers",
    "/sellers",
    "/about",
    "/home-value",
    "/mortgage-calculator",
    "/schools",
    "/things-to-do",
    "/blog",
    "/contact",
    "/accessibility",
    "/privacy",
    "/terms",
    "/fair-housing",
  ].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? ("daily" as const) : ("weekly" as const),
    priority: path === "" ? 1.0 : path === "/search" ? 0.9 : 0.7,
  }));

  // Community pages
  const communityPages = communities.map((slug) => ({
    url: `${BASE_URL}/communities/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // TODO: Add listing detail pages dynamically from Supabase
  // when the MLS sync is running:
  //
  // const supabase = createClient(...)
  // const { data: listings } = await supabase
  //   .from('listings')
  //   .select('listing_key, modification_timestamp')
  //   .is('deleted_at', null)
  //   .in('standard_status', ['Active', 'Pending'])
  //   .limit(50000);
  //
  // const listingPages = (listings || []).map((l) => ({
  //   url: `${BASE_URL}/listing/${l.listing_key}`,
  //   lastModified: new Date(l.modification_timestamp),
  //   changeFrequency: 'daily' as const,
  //   priority: 0.6,
  // }));

  return [...staticPages, ...communityPages];
}
