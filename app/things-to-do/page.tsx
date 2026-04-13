import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Things to do in Tampa Bay",
  description:
    "Moving to Tampa Bay? Here is what the area has to offer, from beaches and parks to restaurants and entertainment.",
};

const sections = [
  {
    title: "Outdoors",
    items: [
      { name: "Bayshore Boulevard", note: "World's longest continuous sidewalk along the bay. Popular for running and biking." },
      { name: "Lettuce Lake Park", note: "Boardwalk through cypress swamp, observation tower, kayak launch. Five minutes from New Tampa." },
      { name: "Alafia River State Park", note: "Mountain biking trails (some of the best in Florida), camping, and hiking in Lithia." },
      { name: "Ben T. Davis Beach", note: "Small beach on the Courtney Campbell Causeway. Sunset views are hard to beat." },
      { name: "Hillsborough River", note: "Kayaking and canoeing through urban wilderness. Rent at the Canoe Escape in Thonotosassa." },
    ],
  },
  {
    title: "Food and drink",
    items: [
      { name: "Ybor City", note: "Tampa's historic Latin quarter. Columbia Restaurant (oldest in Florida), cigar shops, and nightlife." },
      { name: "Armature Works", note: "Heights Public Market food hall in a renovated streetcar building on the Hillsborough River." },
      { name: "South Howard (SoHo)", note: "Tampa's walkable restaurant and bar row. Everything from upscale to casual." },
      { name: "International Plaza", note: "Upscale mall with good restaurant options. Bay Street has outdoor dining." },
      { name: "Datz / Datz Dough", note: "Local favorite in South Tampa. Over-the-top comfort food and a bakery next door." },
    ],
  },
  {
    title: "Family activities",
    items: [
      { name: "Busch Gardens", note: "Theme park and zoo in one. Roller coasters and African wildlife exhibits." },
      { name: "Florida Aquarium", note: "Downtown on the channel. Touch tanks, coral reef exhibit, and penguin habitat." },
      { name: "Glazer Children's Museum", note: "Interactive museum for young kids in the Curtis Hixon waterfront park area." },
      { name: "ZooTampa at Lowry Park", note: "Voted one of the top zoos in the country. Smaller and more walkable than Busch Gardens." },
      { name: "MOSI", note: "Museum of Science and Industry. IMAX theater, planetarium, and hands-on exhibits." },
    ],
  },
  {
    title: "Sports",
    items: [
      { name: "Tampa Bay Buccaneers", note: "NFL. Raymond James Stadium. Tom Brady retired but the fanbase is still going strong." },
      { name: "Tampa Bay Lightning", note: "NHL. Amalie Arena downtown. Back-to-back Stanley Cup champions in 2020-2021." },
      { name: "Tampa Bay Rays", note: "MLB. Currently in St. Pete but a new stadium is in the works." },
      { name: "Tampa Bay Rowdies", note: "USL Championship soccer at Al Lang Stadium in St. Pete." },
    ],
  },
  {
    title: "Day trips",
    items: [
      { name: "St. Petersburg", note: "30 minutes across the bay. The Dali Museum, downtown murals, and craft breweries." },
      { name: "Clearwater Beach", note: "45 minutes west. Consistently rated one of the best beaches in the country." },
      { name: "Anna Maria Island", note: "About an hour south. Old Florida beach town feel. No chain restaurants or high-rises." },
      { name: "Bok Tower Gardens", note: "An hour east in Lake Wales. Singing tower, gardens, and a Pinewood Estate tour." },
    ],
  },
];

export default function ThingsToDoPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 noise-overlay" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-2xl">
            <div className="section-divider mb-4 opacity-60" />
            <h1 className="text-3xl sm:text-4xl font-display font-semibold">
              Things to do in Tampa Bay
            </h1>
            <p className="mt-3 text-lg text-primary-foreground/70">
              The area has more going on than most people expect. Here is a
              quick rundown if you are new or thinking about moving here.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-12">
          {sections.map((section) => (
            <div key={section.title}>
              <div className="section-divider mb-3" />
              <h2 className="text-xl font-display font-semibold text-foreground mb-4">
                {section.title}
              </h2>
              <div className="space-y-3">
                {section.items.map((item) => (
                  <div key={item.name} className="rounded-lg border border-border bg-card p-4">
                    <p className="text-sm font-medium text-foreground">{item.name}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">{item.note}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
