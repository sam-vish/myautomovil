import type { Metadata } from "next";
import { Inter, Bricolage_Grotesque } from "next/font/google";
import { SITE } from "@/lib/site-config";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Display font for all headings (variable weight axis 200–800).
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${SITE.nameProper} | Premium Pre-Owned Dealership in Orlando, FL`,
  description:
    "Browse our hand-selected pre-owned inventory in Orlando. Value your trade instantly, chat with Sage AI 24/7, and get pre-approved for financing in under 3 minutes.",
  keywords: [
    "Orlando car dealership",
    "pre-owned vehicles Orlando",
    "auto financing Florida",
    "trade-in valuation",
    SITE.nameProper,
  ],
  openGraph: {
    title: `${SITE.nameProper} | Premium Pre-Owned Dealership`,
    description:
      "The smartest way to buy your next vehicle in Orlando, FL. Get pre-approved in under 3 minutes.",
    type: "website",
    locale: "en_US",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${display.variable}`}>
      {/* suppressHydrationWarning: browser extensions (password managers,
          form-fillers) inject attributes like __processed_*__ onto <body>
          before React hydrates, causing a harmless attribute-only mismatch.
          This is shallow — it only suppresses diffs on <body> itself. */}
      <body
        suppressHydrationWarning
        className="bg-surface font-sans text-ink antialiased"
      >
        {children}
      </body>
    </html>
  );
}
