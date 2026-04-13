import Link from "next/link";
import { MapPin, Bed, Bath, Maximize, Calendar } from "lucide-react";
import { getDisplayAddress } from "@/lib/compliance/suppress";

interface ListingCardProps {
  listing: {
    listing_key: string;
    standard_status: string;
    unparsed_address: string | null;
    city: string | null;
    state_or_province: string | null;
    postal_code: string | null;
    internet_address_display_yn: boolean | null;
    list_price: number | null;
    bedrooms_total: number | null;
    bathrooms_total_integer: number | null;
    living_area: number | null;
    property_type: string | null;
    days_on_market: number | null;
    listing_media: { storage_path: string | null; is_primary: boolean }[];
  };
}

export function ListingCard({ listing }: ListingCardProps) {
  const address = getDisplayAddress(listing as any);
  const primaryImage = listing.listing_media?.find((m) => m.is_primary)?.storage_path
    || listing.listing_media?.[0]?.storage_path;

  const formatPrice = (price: number | null) => {
    if (!price) return "Price not available";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const statusColors: Record<string, string> = {
    Active: "bg-emerald-500 text-white",
    Pending: "bg-amber-500 text-white",
    Closed: "bg-gray-500 text-white",
  };

  return (
    <Link
      href={`/listing/${listing.listing_key}`}
      className="group block rounded-lg overflow-hidden border border-border bg-card hover-lift"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-muted overflow-hidden">
        {primaryImage ? (
          <img
            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${primaryImage}`}
            alt={address}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-muted-foreground">
            <MapPin className="h-8 w-8" />
          </div>
        )}
        {/* Status badge */}
        <span
          className={`absolute top-3 left-3 px-2 py-0.5 rounded text-xs font-medium ${
            statusColors[listing.standard_status] || "bg-gray-500 text-white"
          }`}
        >
          {listing.standard_status}
        </span>
        {/* Days on market */}
        {listing.days_on_market !== null && listing.days_on_market <= 7 && (
          <span className="absolute top-3 right-3 px-2 py-0.5 rounded text-xs font-medium bg-gold text-white">
            New
          </span>
        )}
      </div>

      {/* Details */}
      <div className="p-4">
        <p className="text-lg font-semibold text-foreground">
          {formatPrice(listing.list_price)}
        </p>
        <div className="flex items-center gap-3 mt-1.5 text-sm text-muted-foreground">
          {listing.bedrooms_total != null && (
            <span className="flex items-center gap-1">
              <Bed className="h-3.5 w-3.5" />
              {listing.bedrooms_total} bd
            </span>
          )}
          {listing.bathrooms_total_integer != null && (
            <span className="flex items-center gap-1">
              <Bath className="h-3.5 w-3.5" />
              {listing.bathrooms_total_integer} ba
            </span>
          )}
          {listing.living_area != null && (
            <span className="flex items-center gap-1">
              <Maximize className="h-3.5 w-3.5" />
              {listing.living_area.toLocaleString()} sqft
            </span>
          )}
        </div>
        <p className="mt-2 text-sm text-muted-foreground truncate flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          {address}
        </p>
      </div>
    </Link>
  );
}
