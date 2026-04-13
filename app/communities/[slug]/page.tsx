import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";

const communityData: Record<string, { name: string; searchCity: string; description: string; priceRange: string; details: string }> = {
  riverview: {
    name: "Riverview",
    searchCity: "Riverview",
    priceRange: "$280K - $650K",
    description: "One of Tampa's fastest-growing suburbs with good schools and newer construction.",
    details: "Riverview sits south of Brandon along the Alafia River. Over the past 15 years, it has gone from a mostly rural area to one of the busiest housing markets in Hillsborough County. The draw is simple: newer homes at prices lower than what you would pay closer to Tampa.\n\nMost of the housing stock was built after 2005. You will find a lot of master-planned communities with pools, playgrounds, and walking trails. Schools here are generally well-rated, which makes it popular with young families.\n\nThe trade-off is traffic. US-301 and Bloomingdale Avenue get congested during rush hour. If you work in downtown Tampa, plan on a 30-45 minute commute depending on the time of day.\n\nPopular subdivisions include Alafia, Summerfield, Boyette Springs, and Panther Trace.",
  },
  brandon: {
    name: "Brandon",
    searchCity: "Brandon",
    priceRange: "$250K - $500K",
    description: "Established community east of Tampa with a mix of older ranch homes and newer builds.",
    details: "Brandon is one of Tampa's most established suburbs. It has been around long enough to have real character, with a mix of 1960s-80s ranch homes, 90s subdivisions, and some newer infill development.\n\nThe location is hard to beat. You are 15 minutes from downtown Tampa, 20 minutes from the beaches, and right off I-75 and the Crosstown Expressway. Westfield Brandon mall anchors the retail area, and there are plenty of restaurants and shops along SR-60.\n\nHome prices are reasonable, especially for how central the location is. Older homes tend to need updates but sit on larger lots. Newer homes are smaller lots but move-in ready.\n\nSchools vary by area, so check the specific school zone for any home you are considering.",
  },
  "apollo-beach": {
    name: "Apollo Beach",
    searchCity: "Apollo Beach",
    priceRange: "$350K - $900K",
    description: "Waterfront community with canal homes and boat access to Tampa Bay.",
    details: "Apollo Beach sits on the southeast shore of Tampa Bay, about 25 minutes south of downtown. It is a waterfront community, and that is the main selling point. Many homes have canal access that leads out to Tampa Bay, making it popular with boaters and anglers.\n\nThe community has a mix of older waterfront homes built in the 70s and 80s and newer developments like MiraBay and Waterset. MiraBay has a private beach club, which is a nice perk.\n\nPrices vary widely depending on water access. A home on a canal or with a view can be twice the price of an inland home a few blocks away.\n\nThe area has gotten more retail in recent years, but for serious shopping or dining, you are going to Brandon or South Tampa.",
  },
  fishhawk: {
    name: "FishHawk Ranch",
    searchCity: "Lithia",
    priceRange: "$400K - $800K",
    description: "Master-planned community with top-rated schools and resort-style amenities.",
    details: "FishHawk is a large master-planned community in Lithia, about 30 minutes southeast of downtown Tampa. It opened in the early 2000s and has been one of the most popular family communities in the area since.\n\nThe schools are the biggest draw. Barrington Middle and Newsome High School are consistently among the top-rated in Hillsborough County.\n\nAmenities include multiple pools, a splash pad, sports courts, miles of trails, and the FishHawk Sporting Club with a golf course. There is also a small commercial area with restaurants and shops.\n\nHomes range from townhomes in the $400Ks to large single-family homes over $800K. The newer sections (FishHawk Ranch West, Starling) tend to be pricier.",
  },
  valrico: {
    name: "Valrico",
    searchCity: "Valrico",
    priceRange: "$300K - $600K",
    description: "Quiet suburb east of Brandon with a mix of older homes and newer development.",
    details: "Valrico is a quiet, mostly residential area east of Brandon. It does not have its own downtown or commercial center, but that is part of the appeal for people who want a quieter setting.\n\nThe housing stock is a mix. You will find 80s and 90s homes on half-acre lots alongside newer subdivisions with smaller lots and modern floor plans. Bloomingdale is the main commercial corridor.\n\nSchools are solid, particularly in the eastern parts of the community. Bloomingdale High School and the surrounding elementaries have good reputations.\n\nIf you want more space than Brandon offers but do not want to go as far out as Lithia, Valrico is the sweet spot.",
  },
  lithia: {
    name: "Lithia",
    searchCity: "Lithia",
    priceRange: "$350K - $1M+",
    description: "Rural feel with newer master-planned communities. Larger lots and horse properties available.",
    details: "Lithia is the eastern edge of suburban Hillsborough County. It still has a rural character in many areas, with horse farms, produce stands, and two-lane roads.\n\nBut it also includes FishHawk Ranch and several other newer communities that have brought suburban development to the area. You can find five-acre horse properties a few miles from master-planned subdivisions.\n\nIf you want land, Lithia is one of the few places in Hillsborough County where you can get it without paying a fortune. Prices vary wildly depending on whether you are in a community or on acreage.\n\nThe trade-off is distance. You are 35-45 minutes from downtown Tampa, and the roads are two-lane in many areas.",
  },
  "wesley-chapel": {
    name: "Wesley Chapel",
    searchCity: "Wesley Chapel",
    priceRange: "$300K - $700K",
    description: "North Tampa suburb with rapid growth, new retail, and newer construction.",
    details: "Wesley Chapel is in Pasco County, north of Tampa, and it has grown faster than almost any other area in the region. Ten years ago it was mostly cattle ranches. Now it has outlet malls, hospitals, and thousands of new homes.\n\nThe housing is mostly built after 2010, so everything feels new. Communities like Epperson and Bexley have lagoon-style amenities. The Shops at Wiregrass and Tampa Premium Outlets handle the retail.\n\nSchools are improving as the area grows, and several new schools have opened in the past few years. Pasco County property taxes are lower than Hillsborough, which helps with affordability.\n\nThe commute to Tampa can be rough on I-75, especially during construction. But if you work north or remote, it is a solid option.",
  },
  "south-tampa": {
    name: "South Tampa",
    searchCity: "Tampa",
    priceRange: "$500K - $2M+",
    description: "The most walkable and expensive part of Tampa. Bayshore, Hyde Park, and SoHo.",
    details: "South Tampa is where Tampa feels most like an actual city. Bayshore Boulevard, Hyde Park Village, SoHo (South Howard), and the waterfront parks give it a walkable urban feel that does not exist in most of the suburbs.\n\nHousing ranges from 1920s bungalows to brand-new construction. Tear-downs are common, with older homes on large lots being replaced by modern builds. Flood zones are a real consideration here, so check elevation and insurance costs.\n\nThis is the most expensive area on this list. Entry-level is around $500K for a smaller home that needs work, and new construction easily clears $1M.\n\nSchools are a mixed bag. Some families go private. Plant High School is the big public draw.",
  },
  westchase: {
    name: "Westchase",
    searchCity: "Westchase",
    priceRange: "$400K - $900K",
    description: "Master-planned community in northwest Tampa with good schools and golf.",
    details: "Westchase is a large master-planned community in northwest Hillsborough County, near the airport and International Mall. It has been around since the early 90s, so it has a more established feel than some newer communities.\n\nThe community has its own golf course, multiple pools, parks, and a swim and tennis club. The landscaping and common areas are well-maintained.\n\nSchools are strong, especially the elementary schools. Davidsen Middle and Sickles High serve most of the community.\n\nHomes range from townhomes in the $400Ks to large single-family homes approaching $900K. The closer to the golf course, the higher the price.",
  },
  carrollwood: {
    name: "Carrollwood",
    searchCity: "Carrollwood",
    priceRange: "$300K - $700K",
    description: "Established northwest Tampa neighborhood with a central location and good restaurants.",
    details: "Carrollwood is one of Tampa's more established suburban neighborhoods, located in the northwest part of the city. It has been around since the 70s and 80s, and the result is mature trees, larger lots, and a real neighborhood feel.\n\nDale Mabry Highway is the main commercial corridor, with restaurants, shops, and services. Carrollwood Village has its own little downtown area with some good local spots.\n\nHousing is a mix of older homes that have been updated and some newer construction. You can find good value here compared to South Tampa, with a more suburban feel but still a central location.\n\nSchools vary. Check specific zones.",
  },
  "new-tampa": {
    name: "New Tampa",
    searchCity: "Tampa",
    priceRange: "$300K - $600K",
    description: "North Tampa area with mostly newer construction and easy highway access.",
    details: "New Tampa is the area north of the University of South Florida, roughly between I-75 and I-275. Most of the development here happened from the late 90s through the 2010s.\n\nThe name is accurate: almost everything here is newer. You will find a lot of two-story stucco homes in planned communities. Shopping and dining have improved significantly along Bruce B. Downs and Cross Creek Boulevard.\n\nUSF is right next door, and Tampa General Hospital has a campus here. Moffitt Cancer Center is also nearby.\n\nI-75 access makes commuting north or south straightforward. The Veterans Expressway and Suncoast Parkway are also close.",
  },
  "land-o-lakes": {
    name: "Land O' Lakes",
    searchCity: "Land O Lakes",
    priceRange: "$280K - $550K",
    description: "Affordable Pasco County suburb growing fast and popular with first-time buyers.",
    details: "Land O' Lakes is in Pasco County, just north of Lutz and the Hillsborough County line. It has grown a lot in the past decade, driven by lower property taxes and more affordable home prices.\n\nMany of the communities here are newer, with homes built after 2010. Connerton and Bexley (which straddles the Wesley Chapel line) are two of the bigger master-planned communities.\n\nFor first-time buyers on a budget, this is one of the better options in the Tampa metro. You get more house for your money here than in most Hillsborough County locations.\n\nThe commute to central Tampa is about 30-40 minutes depending on traffic.",
  },
  seffner: {
    name: "Seffner",
    searchCity: "Seffner",
    priceRange: "$250K - $450K",
    description: "Small community between Brandon and Plant City with affordable homes.",
    details: "Seffner is a small, unincorporated community between Brandon and Plant City along I-4. It has a quieter, more rural feel than Brandon despite being just a few miles east.\n\nHomes here tend to sit on larger lots, and prices are among the lowest in the area for Hillsborough County. You can find 3-bedroom homes under $300K, which is getting harder to do closer to Tampa.\n\nThe main drawback is limited retail and dining. You are going to Brandon for most shopping. But I-4 access is good, and if you work in Lakeland or the I-4 corridor, the commute is reasonable.\n\nIt is a good spot for buyers who want space and do not mind a quieter area.",
  },
};

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const community = communityData[slug];
  if (!community) return { title: "Community not found" };
  return {
    title: `${community.name} homes for sale`,
    description: `Find homes for sale in ${community.name}, FL. ${community.description} Price range: ${community.priceRange}.`,
  };
}

export default async function CommunityDetailPage({ params }: Props) {
  const { slug } = await params;
  const community = communityData[slug];
  if (!community) notFound();

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 noise-overlay" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <nav className="flex items-center gap-2 text-sm text-primary-foreground/50 mb-6">
            <Link href="/communities" className="hover:text-primary-foreground transition-colors">Communities</Link>
            <span>/</span>
            <span className="text-primary-foreground">{community.name}</span>
          </nav>
          <div className="max-w-2xl">
            <div className="section-divider mb-4 opacity-60" />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold">
              {community.name}
            </h1>
            <p className="mt-3 text-lg text-primary-foreground/70">
              {community.description}
            </p>
            <p className="mt-2 text-gold font-medium">{community.priceRange}</p>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="prose prose-neutral max-w-none">
            {community.details.split("\n\n").map((paragraph, i) => (
              <p key={i} className="text-muted-foreground leading-relaxed mb-4">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-border">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Homes for sale in {community.name}
            </h2>
            <div className="rounded-lg border border-dashed border-border p-8 text-center">
              <p className="text-muted-foreground text-sm">
                Live listings will appear here once the MLS sync is running.
              </p>
              <Link href={`/search?city=${encodeURIComponent(community.searchCity)}`} className="mt-3 inline-flex items-center gap-1 text-sm text-gold hover:underline">
                Search {community.name} listings <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
