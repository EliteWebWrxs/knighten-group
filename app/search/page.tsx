import type { Metadata } from "next";
import { SearchPageClient } from "./search-client";

export const metadata: Metadata = {
  title: "Search homes for sale in Tampa Bay",
  description:
    "Browse active MLS listings across Tampa, Brandon, Riverview, Apollo Beach, FishHawk, and all of Hillsborough County. Filter by price, beds, baths, and more.",
};

export default function SearchPage() {
  return <SearchPageClient />;
}
