import Link from "next/link";
import type { Metadata } from "next";
import { SITE } from "@/lib/site-config";

export const metadata: Metadata = {
  title: `Opt-In SMS Disclosure | ${SITE.nameProper}`,
};

export default function SmsDisclosurePage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-20 sm:px-8">
      <Link
        href="/"
        className="text-sm font-semibold text-stone-500 transition-colors hover:text-ink"
      >
        ← Back to home
      </Link>
      <h1 className="mt-6 font-serif text-4xl font-black tracking-tight text-ink md:text-5xl">
        Opt-In SMS Disclosure
      </h1>
      <p className="mt-4 text-stone-500">Last updated: {new Date().getFullYear()}</p>

      {/* TODO: legal copy from Mica-El */}
      <p className="mt-8 leading-relaxed text-stone-600">
        By providing your phone number to {SITE.nameProper}, you consent to
        receive calls and text messages (including via automated technology)
        about your inquiry. Message and data rates may apply; message frequency
        varies. Reply STOP to opt out at any time, or HELP for help. Consent is
        not a condition of any purchase. Full disclosure language is being
        finalized — questions? Call{" "}
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
