import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AdaWidget } from "@/components/accessibility/AdaWidget";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-body",
  display: "swap",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-display",
  display: "swap",
  subsets: ["latin"],
});

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    default: "The Knighten Group | Tampa Bay Real Estate",
    template: "%s | The Knighten Group",
  },
  description:
    "Find your next home in Tampa Bay with The Knighten Group. Search active MLS listings across Riverview, Brandon, Apollo Beach, FishHawk, and all of Hillsborough County.",
  keywords: [
    "Tampa Bay real estate",
    "Tampa homes for sale",
    "Riverview FL homes",
    "Brandon FL real estate",
    "Apollo Beach homes",
    "FishHawk Ranch",
    "Hillsborough County realtor",
    "Earl Knighten",
    "The Knighten Group",
  ],
  authors: [{ name: "The Knighten Group LLC" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "The Knighten Group",
    title: "The Knighten Group | Tampa Bay Real Estate",
    description:
      "Find your next home in Tampa Bay with The Knighten Group. Search active MLS listings across Riverview, Brandon, Apollo Beach, FishHawk, and all of Hillsborough County.",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Knighten Group | Tampa Bay Real Estate",
    description:
      "Find your next home in Tampa Bay with The Knighten Group.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="canonical" href={defaultUrl} />
      </head>
      <body
        className={`${dmSans.variable} ${playfair.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <AdaWidget />
        </ThemeProvider>
      </body>
    </html>
  );
}
