import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isIdxEnabled } from "@/lib/compliance/copyright";
import { suppressDisplay, getDisplayAddress } from "@/lib/compliance/suppress";
import { ComplianceAttribution } from "@/components/listing/ComplianceAttribution";
import { ListingDetailClient } from "./listing-detail-client";

interface Props {
  params: Promise<{ listingId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { listingId } = await params;

  if (!isIdxEnabled()) {
    return { title: "Listing unavailable" };
  }

  const supabase = await createClient();
  const { data: listing } = await supabase
    .from("listings")
    .select("unparsed_address, city, state_or_province, list_price, bedrooms_total, bathrooms_total_integer, living_area, internet_address_display_yn, postal_code, street_number, street_name, standard_status, buyer_agent_key, list_office_key, listing_key")
    .eq("listing_key", listingId)
    .is("deleted_at", null)
    .single();

  if (!listing) {
    return { title: "Listing not found" };
  }

  const suppressed = suppressDisplay(listing as any);
  const address = getDisplayAddress(suppressed as any);
  const price = listing.list_price
    ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(listing.list_price)
    : "";

  const specs = [
    listing.bedrooms_total ? `${listing.bedrooms_total} bed` : null,
    listing.bathrooms_total_integer ? `${listing.bathrooms_total_integer} bath` : null,
    listing.living_area ? `${listing.living_area.toLocaleString()} sqft` : null,
  ].filter(Boolean).join(", ");

  return {
    title: `${address} ${price ? `- ${price}` : ""}`,
    description: `${specs} home for sale at ${address}. View photos, details, and schedule a showing with The Knighten Group.`,
  };
}

export default async function ListingDetailPage({ params }: Props) {
  await connection();
  const { listingId } = await params;

  if (!isIdxEnabled()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Listing data is temporarily unavailable.</p>
      </div>
    );
  }

  const supabase = await createClient();

  const { data: listing } = await supabase
    .from("listings")
    .select(`
      *,
      listing_media (
        media_key,
        storage_path,
        order_index,
        media_category,
        is_primary
      )
    `)
    .eq("listing_key", listingId)
    .is("deleted_at", null)
    .single();

  if (!listing) notFound();

  const suppressed = suppressDisplay(listing as any);

  // Fetch agent and office
  const [agentResult, officeResult] = await Promise.all([
    listing.list_agent_key
      ? supabase.from("members").select("*").eq("member_key", listing.list_agent_key).single()
      : null,
    listing.list_office_key
      ? supabase.from("offices").select("*").eq("office_key", listing.list_office_key).single()
      : null,
  ]);

  // Fetch open houses
  const { data: openHouses } = await supabase
    .from("open_houses")
    .select("*")
    .eq("listing_key", listingId)
    .gte("open_house_start_time", new Date().toISOString())
    .order("open_house_start_time", { ascending: true });

  const address = getDisplayAddress(suppressed as any);

  // Schema.org structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: address,
    url: `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"}/listing/${listingId}`,
    ...(listing.list_price && {
      offers: {
        "@type": "Offer",
        price: listing.list_price,
        priceCurrency: "USD",
      },
    }),
    ...(listing.public_remarks && { description: listing.public_remarks }),
    address: {
      "@type": "PostalAddress",
      ...(suppressed.unparsed_address && { streetAddress: suppressed.unparsed_address }),
      addressLocality: listing.city,
      addressRegion: listing.state_or_province,
      postalCode: listing.postal_code,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ListingDetailClient
        listing={suppressed}
        agent={agentResult?.data || null}
        office={officeResult?.data || null}
        openHouses={openHouses || []}
        address={address}
      />
    </>
  );
}
