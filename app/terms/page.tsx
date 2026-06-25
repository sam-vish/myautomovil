import Link from "next/link";
import type { Metadata } from "next";
import { SITE } from "@/lib/site-config";

export const metadata: Metadata = {
  title: `Terms of Service | ${SITE.nameProper}`,
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-20 sm:px-8">
      <Link
        href="/"
        className="text-sm font-semibold text-stone-500 transition-colors hover:text-ink"
      >
        ← Back to home
      </Link>
      <h1 className="mt-6 font-serif text-4xl font-black tracking-tight text-ink md:text-5xl">
        Terms of Service
      </h1>
      <p className="mt-4 text-stone-500">Last updated: {new Date().getFullYear()}</p>

      {/* TODO: legal copy from Mica-El */}
      <p className="mt-8 leading-relaxed text-stone-600">
        Our full terms of service are being finalized. For any questions about
        using {SITE.nameProper}&apos;s website or services, please contact us at{" "}
        <a
          href={SITE.phoneTel}
          className="font-semibold text-ink underline decoration-primary underline-offset-4"
        >
          {SITE.phone}
        </a>
        .
      </p>
    </main>
  );
}
