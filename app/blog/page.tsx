import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Real estate tips, Tampa Bay market updates, and community guides from The Knighten Group.",
};

const posts = [
  {
    slug: "first-time-buyer-tampa",
    title: "Buying your first home in Tampa Bay: what to actually expect",
    excerpt: "The internet makes it sound simple. It is not. Here is what the process actually looks like, from pre-approval to getting your keys.",
    category: "Buyer tips",
    date: "2026-04-10",
  },
  {
    slug: "tampa-market-spring-2026",
    title: "Tampa Bay housing market, spring 2026",
    excerpt: "Inventory is up, rates are holding steady, and prices have leveled off in most areas. Here is what we are seeing on the ground.",
    category: "Market updates",
    date: "2026-04-01",
  },
  {
    slug: "selling-in-riverview",
    title: "Selling a home in Riverview: what works right now",
    excerpt: "Riverview is still growing, but the market has shifted. Here is how we are pricing and marketing homes in the area.",
    category: "Seller tips",
    date: "2026-03-20",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 noise-overlay" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-2xl">
            <div className="section-divider mb-4 opacity-60" />
            <h1 className="text-3xl sm:text-4xl font-display font-semibold">Blog</h1>
            <p className="mt-3 text-lg text-primary-foreground/70">
              Market updates, buyer and seller tips, and Tampa Bay community guides.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {posts.map((post) => (
              <article key={post.slug} className="group">
                <Link href={`/blog/${post.slug}`} className="block">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                    <span className="text-gold font-medium">{post.category}</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(post.date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <h2 className="text-lg font-semibold text-foreground group-hover:text-gold transition-colors">
                    {post.title}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                    {post.excerpt}
                  </p>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
