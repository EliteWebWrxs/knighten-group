"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bed, Bath, Maximize, Car, Calendar, Waves, Hammer, Building,
  MapPin, ChevronLeft, ChevronRight, X, Home, DollarSign, Phone, Mail
} from "lucide-react";
import { ComplianceAttribution } from "@/components/listing/ComplianceAttribution";
import { MortgageCalculator } from "@/components/tools/MortgageCalculator";

interface Props {
  listing: any;
  agent: any;
  office: any;
  openHouses: any[];
  address: string;
}

export function ListingDetailClient({ listing, agent, office, openHouses, address }: Props) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const media = (listing.listing_media || [])
    .sort((a: any, b: any) => (a.order_index ?? 0) - (b.order_index ?? 0));

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const getImageUrl = (path: string | null) =>
    path ? `${supabaseUrl}/storage/v1/object/public/${path}` : null;

  const formatPrice = (price: number | null) => {
    if (!price) return "Price not available";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const specs = [
    listing.bedrooms_total != null && { icon: Bed, label: `${listing.bedrooms_total} bedrooms` },
    listing.bathrooms_total_integer != null && { icon: Bath, label: `${listing.bathrooms_total_integer} bathrooms` },
    listing.living_area != null && { icon: Maximize, label: `${listing.living_area.toLocaleString()} sqft` },
    listing.garage_spaces != null && { icon: Car, label: `${listing.garage_spaces} garage` },
    listing.year_built != null && { icon: Calendar, label: `Built ${listing.year_built}` },
    listing.waterfront_yn && { icon: Waves, label: "Waterfront" },
    listing.new_construction_yn && { icon: Hammer, label: "New construction" },
    listing.pool_yn && { icon: Waves, label: "Pool" },
    listing.stories != null && { icon: Building, label: `${listing.stories} stories` },
  ].filter(Boolean) as { icon: any; label: string }[];

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/search" className="hover:text-foreground transition-colors">Search</Link>
            <span>/</span>
            {listing.city && (
              <>
                <Link href={`/search?city=${listing.city}`} className="hover:text-foreground transition-colors">
                  {listing.city}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-foreground truncate">{address}</span>
          </nav>
        </div>
      </div>

      {/* Photo gallery */}
      <div className="bg-muted">
        <div className="mx-auto max-w-7xl">
          {media.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-1 md:h-[480px]">
              {/* Main image */}
              <div
                className="md:col-span-2 md:row-span-2 relative cursor-pointer overflow-hidden"
                onClick={() => { setLightboxOpen(true); setLightboxIndex(0); }}
              >
                <img
                  src={getImageUrl(media[0]?.storage_path) || ""}
                  alt={address}
                  className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              {/* Thumbnails */}
              {media.slice(1, 5).map((m: any, i: number) => (
                <div
                  key={m.media_key}
                  className="relative cursor-pointer overflow-hidden hidden md:block"
                  onClick={() => { setLightboxOpen(true); setLightboxIndex(i + 1); }}
                >
                  <img
                    src={getImageUrl(m.storage_path) || ""}
                    alt={`${address} photo ${i + 2}`}
                    className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {i === 3 && media.length > 5 && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-medium">
                      +{media.length - 5} photos
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <Home className="h-12 w-12" />
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          <button onClick={() => setLightboxOpen(false)} className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full">
            <X className="h-6 w-6" />
          </button>
          <button
            onClick={() => setLightboxIndex((lightboxIndex - 1 + media.length) % media.length)}
            className="absolute left-4 text-white p-2 hover:bg-white/10 rounded-full"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          <img
            src={getImageUrl(media[lightboxIndex]?.storage_path) || ""}
            alt={`${address} photo ${lightboxIndex + 1}`}
            className="max-h-[85vh] max-w-[90vw] object-contain"
          />
          <button
            onClick={() => setLightboxIndex((lightboxIndex + 1) % media.length)}
            className="absolute right-4 text-white p-2 hover:bg-white/10 rounded-full"
          >
            <ChevronRight className="h-8 w-8" />
          </button>
          <p className="absolute bottom-4 text-white text-sm">
            {lightboxIndex + 1} / {media.length}
          </p>
        </div>
      )}

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Price + address header */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                  listing.standard_status === "Active" ? "bg-emerald-500 text-white" :
                  listing.standard_status === "Pending" ? "bg-amber-500 text-white" :
                  "bg-gray-500 text-white"
                }`}>
                  {listing.standard_status}
                </span>
                {listing.days_on_market != null && (
                  <span className="text-sm text-muted-foreground">
                    {listing.days_on_market} days on market
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-display font-semibold text-foreground">
                {formatPrice(listing.list_price)}
              </h1>
              <p className="mt-1 text-lg text-muted-foreground flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {address}
              </p>
            </div>

            {/* Specs grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {specs.map((spec) => (
                <div key={spec.label} className="flex items-center gap-2.5 rounded-lg border border-border p-3">
                  <spec.icon className="h-4 w-4 text-gold shrink-0" />
                  <span className="text-sm text-foreground">{spec.label}</span>
                </div>
              ))}
            </div>

            {/* Description */}
            {listing.public_remarks && (
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-3">About this property</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {listing.public_remarks}
                </p>
              </div>
            )}

            {/* Open houses */}
            {openHouses.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-3">Upcoming open houses</h2>
                <div className="space-y-2">
                  {openHouses.map((oh: any) => (
                    <div key={oh.open_house_key} className="flex items-center gap-3 rounded-lg border border-border p-3">
                      <Calendar className="h-4 w-4 text-gold" />
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {new Date(oh.open_house_start_time).toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(oh.open_house_start_time).toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                          {" - "}
                          {new Date(oh.open_house_end_time).toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mortgage estimate */}
            {listing.list_price && (
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-3">Estimated monthly payment</h2>
                <MortgageCalculator defaultPrice={listing.list_price} compact />
              </div>
            )}

            {/* Compliance attribution */}
            <ComplianceAttribution
              listOfficeName={office?.office_name}
              modificationTimestamp={listing.modification_timestamp}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact card */}
            <div className="rounded-lg border border-border bg-card p-6 sticky top-20">
              <h3 className="font-semibold text-foreground mb-1">Interested in this home?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Reach out and we'll get back to you.
              </p>

              {agent && (
                <div className="mb-4 pb-4 border-b border-border">
                  <p className="text-sm font-medium text-foreground">{agent.member_full_name}</p>
                  {office && <p className="text-xs text-muted-foreground">{office.office_name}</p>}
                </div>
              )}

              <div className="space-y-3">
                <a
                  href={`mailto:info@theknightengroup.com?subject=Inquiry about ${address}`}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-gold px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 transition-opacity"
                >
                  <Mail className="h-4 w-4" />
                  Send a message
                </a>
                <a
                  href="tel:+1"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  Call us
                </a>
              </div>

              <div className="mt-4 pt-4 border-t border-border">
                <a
                  href="https://mortgage.neighborsbank.com/get-approved/2760060"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  <DollarSign className="h-4 w-4" />
                  Get pre-approved
                </a>
              </div>
            </div>

            {/* Property details */}
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="font-semibold text-foreground mb-3">Property details</h3>
              <dl className="space-y-2 text-sm">
                {listing.property_type && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Type</dt>
                    <dd className="text-foreground">{listing.property_type}</dd>
                  </div>
                )}
                {listing.property_sub_type && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Subtype</dt>
                    <dd className="text-foreground">{listing.property_sub_type}</dd>
                  </div>
                )}
                {listing.lot_size_acres != null && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Lot size</dt>
                    <dd className="text-foreground">{listing.lot_size_acres} acres</dd>
                  </div>
                )}
                {listing.hoa_fee != null && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">HOA fee</dt>
                    <dd className="text-foreground">
                      ${listing.hoa_fee}{listing.hoa_fee_frequency ? `/${listing.hoa_fee_frequency}` : ""}
                    </dd>
                  </div>
                )}
                {listing.list_date && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Listed</dt>
                    <dd className="text-foreground">
                      {new Date(listing.list_date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">MLS #</dt>
                  <dd className="text-foreground">{listing.listing_id}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
