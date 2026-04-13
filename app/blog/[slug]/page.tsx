import type { Metadata } from "next";
import { connection } from "next/server";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    description: "Read this article on The Knighten Group blog.",
  };
}

export default async function BlogPostPage({ params }: Props) {
  await connection();
  const { slug } = await params;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to blog
        </Link>
        <article>
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
            <span className="text-gold font-medium">Article</span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date().toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          <h1 className="text-3xl font-display font-semibold text-foreground">
            {slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
          </h1>
          <div className="mt-8 border border-dashed border-border rounded-lg p-8 text-center">
            <p className="text-muted-foreground">
              Blog content will be managed through Sanity CMS or MDX files.
            </p>
          </div>
        </article>
      </div>
    </div>
  );
}
