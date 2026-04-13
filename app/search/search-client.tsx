"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, SlidersHorizontal, X, MapPin, ChevronDown } from "lucide-react";
import { ListingCard } from "@/components/search/ListingCard";
import { ComplianceAttribution } from "@/components/listing/ComplianceAttribution";

interface Listing {
  listing_key: string;
  listing_id: string;
  standard_status: string;
  unparsed_address: string | null;
  city: string | null;
  state_or_province: string | null;
  postal_code: string | null;
  internet_address_display_yn: boolean | null;
  list_price: number | null;
  bedrooms_total: number | null;
  bathrooms_total_integer: number | null;
  bathrooms_half: number | null;
  living_area: number | null;
  lot_size_acres: number | null;
  year_built: number | null;
  property_type: string | null;
  property_sub_type: string | null;
  pool_yn: boolean | null;
  waterfront_yn: boolean | null;
  new_construction_yn: boolean | null;
  days_on_market: number | null;
  list_date: string | null;
  modification_timestamp: string | null;
  list_office_key: string | null;
  listing_media: { storage_path: string | null; order_index: number; is_primary: boolean }[];
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const cities = [
  "All cities",
  "Apollo Beach",
  "Brandon",
  "Carrollwood",
  "FishHawk",
  "Land O' Lakes",
  "Lithia",
  "New Tampa",
  "Riverview",
  "Seffner",
  "South Tampa",
  "Tampa",
  "Valrico",
  "Wesley Chapel",
  "Westchase",
];

const propertyTypes = [
  "All types",
  "Residential",
  "Condominium",
  "Townhouse",
  "Land",
  "Multi-Family",
];

export function SearchPageClient() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 24, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [city, setCity] = useState("All cities");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [beds, setBeds] = useState("");
  const [baths, setBaths] = useState("");
  const [propertyType, setPropertyType] = useState("All types");
  const [sort, setSort] = useState("list_date");

  const fetchListings = useCallback(async (page = 1) => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", "24");
    params.set("status", "Active,Pending");
    params.set("sort", sort);
    params.set("order", "desc");

    if (city !== "All cities") params.set("city", city);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (beds) params.set("beds", beds);
    if (baths) params.set("baths", baths);
    if (propertyType !== "All types") params.set("propertyType", propertyType);

    try {
      const res = await fetch(`/api/listings?${params}`);
      const data = await res.json();
      setListings(data.listings || []);
      setPagination(data.pagination || { page: 1, limit: 24, total: 0, totalPages: 0 });
    } catch {
      setListings([]);
    } finally {
      setLoading(false);
    }
  }, [city, minPrice, maxPrice, beds, baths, propertyType, sort]);

  useEffect(() => {
    fetchListings(1);
  }, [fetchListings]);

  const clearFilters = () => {
    setCity("All cities");
    setMinPrice("");
    setMaxPrice("");
    setBeds("");
    setBaths("");
    setPropertyType("All types");
    setSort("list_date");
  };

  const hasActiveFilters = city !== "All cities" || minPrice || maxPrice || beds || baths || propertyType !== "All types";

  return (
    <div className="min-h-screen bg-background">
      {/* Search header */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-display font-semibold text-foreground">
                Homes for sale
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {pagination.total > 0
                  ? `${pagination.total.toLocaleString()} listings in Tampa Bay`
                  : "Searching..."}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setFiltersOpen(!filtersOpen)}
                className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {hasActiveFilters && (
                  <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-gold text-white text-xs">
                    !
                  </span>
                )}
              </button>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="list_date">Newest</option>
                <option value="list_price">Price (high to low)</option>
                <option value="bedrooms_total">Bedrooms</option>
                <option value="living_area">Sq ft</option>
              </select>
            </div>
          </div>

          {/* Filter panel */}
          {filtersOpen && (
            <div className="mt-4 pt-4 border-t border-border grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
              >
                {cities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Min price"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
              <input
                type="number"
                placeholder="Max price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
              <select
                value={beds}
                onChange={(e) => setBeds(e.target.value)}
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="">Any beds</option>
                <option value="1">1+ beds</option>
                <option value="2">2+ beds</option>
                <option value="3">3+ beds</option>
                <option value="4">4+ beds</option>
                <option value="5">5+ beds</option>
              </select>
              <select
                value={baths}
                onChange={(e) => setBaths(e.target.value)}
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="">Any baths</option>
                <option value="1">1+ baths</option>
                <option value="2">2+ baths</option>
                <option value="3">3+ baths</option>
                <option value="4">4+ baths</option>
              </select>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
              >
                {propertyTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="col-span-2 sm:col-span-1 inline-flex items-center justify-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                  Clear all
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted rounded-lg aspect-[4/3]" />
                <div className="mt-3 h-4 bg-muted rounded w-3/4" />
                <div className="mt-2 h-3 bg-muted rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : listings.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <ListingCard key={listing.listing_key} listing={listing} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  disabled={pagination.page <= 1}
                  onClick={() => fetchListings(pagination.page - 1)}
                  className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-sm text-muted-foreground">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => fetchListings(pagination.page + 1)}
                  className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}

            {/* MLS attribution */}
            <ComplianceAttribution />
          </>
        ) : (
          <div className="text-center py-16">
            <Search className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
            <h2 className="text-lg font-medium text-foreground">No listings found</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Try adjusting your filters or search a different area.
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="mt-4 text-sm text-gold hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
