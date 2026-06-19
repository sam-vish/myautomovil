import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  weight: ["400", "500", "600", "700", "900"],
});

export const metadata: Metadata = {
  title: "My Automovil Corp | Premium Pre-Owned Dealership in Orlando, FL",
  description:
    "Browse hand-selected luxury and family inventory in Orlando. Value your trade instantly, chat with Sage AI 24/7, and get pre-approved for financing in under 3 minutes.",
  keywords: [
    "Orlando car dealership",
    "pre-owned vehicles Orlando",
    "auto financing Florida",
    "trade-in valuation",
    "My Automovil Corp",
  ],
  openGraph: {
    title: "My Automovil Corp | Premium Pre-Owned Dealership",
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
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="bg-cream font-sans text-ink antialiased">{children}</body>
    </html>
  );
}
