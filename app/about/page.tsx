import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About us",
  description:
    "The Knighten Group is a Brandon, FL real estate team led by broker Earl Knighten. We help buyers and sellers across Tampa Bay's Hillsborough County.",
};

const team = [
  {
    name: "Earl Knighten",
    role: "Owner / Broker",
    photo: "/Headshot no background.png",
    bio: "Earl started The Knighten Group because he was tired of watching clients get treated like transactions. He has been in real estate for over a decade, most of it in the Tampa Bay area. He handles pricing strategy, negotiations, and anything that requires a broker's license. When he is not working, he is probably watching football or grilling something.",
    email: "earl@theknightengroup.com",
  },
  {
    name: "Nisha Lewis",
    role: "Realtor Consultant",
    photo: "/nisha headshot.jpg",
    bio: "Nisha works primarily with buyers, especially first-timers who have a lot of questions (and she likes it that way). She is patient, organized, and genuinely good at making complicated processes feel less overwhelming. She grew up in the Tampa area and knows the neighborhoods inside out.",
    email: "nisha@theknightengroup.com",
  },
  {
    name: "Selena Washington",
    role: "Realtor Consultant",
    photo: "/selena headshot1.jpg",
    bio: "Selena focuses on sellers and listings. She handles staging advice, photography coordination, and marketing plans. She has a background in marketing and brings that to every listing presentation. She is direct, detail-oriented, and does not sugarcoat things.",
    email: "selena@theknightengroup.com",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 noise-overlay" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-2xl">
            <div className="section-divider mb-4 opacity-60" />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold">
              About The Knighten Group
            </h1>
            <p className="mt-4 text-lg text-primary-foreground/70 leading-relaxed">
              A small real estate team in Brandon, FL that does things differently.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-display font-semibold text-foreground mb-6">
              How we work
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                We are a real estate brokerage in Brandon, Florida, about 20
                minutes east of downtown Tampa. We work with buyers and sellers
                across Hillsborough County and the surrounding areas.
              </p>
              <p>
                The short version of our approach: we take fewer clients so we
                can give each one real attention. Earl started the brokerage
                after years of watching agents juggle too many people at once.
                Someone always gets the short end. We would rather work with
                five clients and do it right than sign up twenty and scramble.
              </p>
              <p>
                We are not flashy. We do not promise to sell your home in 24
                hours or find you a deal that is too good to be true. What we
                will do is explain everything clearly, return your calls, and
                give you honest advice even when it is not what you want to hear.
              </p>
              <p>
                Most of our clients find us through referrals. That matters to
                us more than any marketing campaign.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 sm:py-20 bg-muted/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div className="section-divider mb-4" />
            <h2 className="text-2xl sm:text-3xl font-display font-semibold text-foreground">
              Meet the team
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member) => (
              <div key={member.name} className="rounded-lg border border-border bg-card overflow-hidden">
                <div className="aspect-[3/4] bg-muted relative">
                  <Image
                    src={member.photo}
                    alt={member.name}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-foreground">
                    {member.name}
                  </h3>
                  <p className="text-sm text-gold font-medium">{member.role}</p>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    {member.bio}
                  </p>
                  <a
                    href={`mailto:${member.email}`}
                    className="mt-4 inline-flex items-center gap-1.5 text-sm text-gold hover:underline"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    {member.email}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-display font-semibold text-foreground">
            Want to work with us?
          </h2>
          <p className="mt-2 text-muted-foreground">
            Drop us a line. No obligation, no sales pitch.
          </p>
          <div className="mt-6 flex items-center justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-medium text-white hover:opacity-90 transition-opacity"
            >
              Contact us <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
