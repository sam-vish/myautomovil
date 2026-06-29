"use client";

import {
  useState,
  useEffect,
  useRef,
  type FormEvent,
} from "react";
import {
  Bot,
  Coins,
  ShieldCheck,
  Menu,
  X,
  Phone,
  ArrowRight,
  ArrowUpRight,
  Loader2,
  CheckCircle2,
  MessageSquare,
  MapPin,
  Star,
  PiggyBank,
  Wallet,
  CircleDollarSign,
  Plus,
  Minus,
  BadgeCheck,
  Quote,
  Facebook,
  Instagram,
  Search,
} from "lucide-react";
import { SITE } from "@/lib/site-config";

/* ------------------------------------------------------------------ */
/* Scroll hooks (no external deps — IntersectionObserver + rAF)        */
/* ------------------------------------------------------------------ */

/** Fires once when the element scrolls into view. */
function useInView<T extends HTMLElement>(threshold = 0.25) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.unobserve(el);
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, inView };
}

/** Returns 0→1 progress as the element travels through the viewport. */
function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.8; // begin filling as the top nears the lower third
      const end = vh * 0.45; // finish as the bottom clears the middle
      const span = rect.height + (start - end);
      const passed = start - rect.top;
      setProgress(Math.min(1, Math.max(0, passed / span)));
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return { ref, progress };
}

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

const CREDIT_OPTIONS = [
  { value: "", label: "Estimated Credit Score" },
  { value: "excellent", label: "Excellent (720+)" },
  { value: "good", label: "Good (680–719)" },
  { value: "fair", label: "Fair (620–679)" },
  { value: "rebuilding", label: "Rebuilding (<620)" },
];

const BRANDS = SITE.makes.map((m) => m.toUpperCase());

const STATS = [
  { value: SITE.vehicleCount, label: "Vehicles in stock" },
  { value: `${SITE.rating}★`, label: "Google rating" },
  { value: "3 min", label: "To pre-approval" },
  { value: SITE.yearsServing, label: "Serving Orlando" },
];

const PILLARS = [
  {
    icon: Coins,
    title: "Instant Trade Valuation",
    body: "Value your current vehicle against live market data instantly. Get a guaranteed cash offer — no haggling, no surprises.",
  },
  {
    icon: Bot,
    title: "24/7 Virtual Concierge",
    body: "Our Sage AI assistant is online around the clock to help you browse inventory, check pricing, and schedule test drives.",
  },
  {
    icon: ShieldCheck,
    title: "Express Credit Approval",
    body: "We partner with major lenders across Central Florida to secure the lowest rates for every credit tier.",
  },
];

const CATEGORIES = [
  {
    icon: PiggyBank,
    title: "Under $5K",
    sub: "Budget-friendly, ready to drive",
    href: SITE.links.under5k,
  },
  {
    icon: Wallet,
    title: "Under $10K",
    sub: "Quality pre-owned that fits the budget",
    href: SITE.links.under10k,
  },
  {
    icon: CircleDollarSign,
    title: "Under $20K",
    sub: "Newer models, more options",
    href: SITE.links.under20k,
  },
];

const STEPS = [
  {
    n: "01",
    title: "Browse the showroom",
    body: `Explore ${SITE.vehicleCount} hand-inspected vehicles online or chat with Sage to narrow it down in seconds.`,
  },
  {
    n: "02",
    title: "Value your trade",
    body: "Tell us what you drive now and get a real, guaranteed cash offer backed by live market data.",
  },
  {
    n: "03",
    title: "Get pre-approved",
    body: "One short form, no credit-score impact. We match you with lenders for every tier in minutes.",
  },
  {
    n: "04",
    title: "Drive home happy",
    body: "Sign in-store or we deliver. Every car comes inspection-certified and ready for Florida roads.",
  },
];

// Honest, generic, unattributed sentiment — no fabricated names/cities/vehicles.
const TESTIMONIALS = [
  "Got approved fast and the whole process was refreshingly low-pressure. Every question was answered before I even came in.",
  "My credit wasn't perfect and they still found me a real rate. Honest people who actually listened to my budget.",
  "Fair trade offer and a clean, straightforward buying experience. No games, and they didn't waste my afternoon.",
];

const FAQS = [
  {
    q: "Will getting pre-approved hurt my credit score?",
    a: "No. Our pre-approval uses a soft credit check that has zero impact on your score. A hard inquiry only happens later, with your explicit permission, once you choose a vehicle and lender.",
  },
  {
    q: "Do you work with bad or rebuilding credit?",
    a: "Absolutely. We partner with major lenders across Central Florida who specialize in every credit tier — from 720+ to rebuilding under 620. Most of our customers are approved within minutes.",
  },
  {
    q: "How does the instant trade valuation work?",
    a: "Tell us your vehicle's year, make, model, and condition. We compare it against live regional market data and return a guaranteed cash offer you can apply directly to your next car — or take as a check.",
  },
  {
    q: "Can I complete the whole process online?",
    a: "Yes. Browse inventory, get your trade offer, secure financing, and sign paperwork from your phone. We offer home delivery throughout the Orlando metro, or you can finish up at our Landstreet Rd showroom.",
  },
  {
    q: "Who is Sage?",
    a: "Sage is our 24/7 AI concierge. Ask it anything — pricing, availability, financing questions, or to book a test drive — and it responds instantly, day or night.",
  },
];

type FormState = {
  name: string;
  email: string;
  phone: string;
  credit: string;
  vehicle: string;
};

type Status = "idle" | "loading" | "success" | "error";

const INITIAL_FORM: FormState = {
  name: "",
  email: "",
  phone: "",
  credit: "",
  vehicle: "",
};

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function Page() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setErrorMsg("");

    const endpoint = process.env.NEXT_PUBLIC_GHL_WEBHOOK_URL || "/api/leads";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          source: `${SITE.nameProper} Landing Page`,
          submittedAt: new Date().toISOString(),
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      setForm(INITIAL_FORM);
    } catch {
      setStatus("error");
      setErrorMsg(
        "We couldn't submit your request. Please try again or call us."
      );
    }
  };

  return (
    <div className="min-h-screen bg-surface text-ink selection:bg-primary/40">
      <AnnouncementBar />
      <Header mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <main>
        <Hero />
        <BrandMarquee />
        <ValuePillars />
        <Inventory />
        <HowItWorks />
        <TradeInBand />
        <SageSpotlight />
        <Testimonials />
        <LeadHub
          form={form}
          status={status}
          errorMsg={errorMsg}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onReset={() => setStatus("idle")}
        />
        <Faq />
        <FinalCta />
      </main>

      <Footer />
      <SageWidget />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Announcement bar                                                    */
/* ------------------------------------------------------------------ */

function AnnouncementBar() {
  return (
    <div className="bg-ink px-4 py-2 text-center text-xs font-medium text-white sm:text-sm">
      <span className="inline-flex flex-wrap items-center justify-center gap-x-2">
        <BadgeCheck className="h-4 w-4 text-primary" />
        Same-day approvals for every credit tier
        <span className="hidden text-stone-500 sm:inline">•</span>
        <span className="hidden sm:inline">
          Guaranteed trade offers — beat the big online dealers
        </span>
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Header                                                              */
/* ------------------------------------------------------------------ */

const NAV_LINKS: {
  label: string;
  href: string;
  external?: boolean;
  active?: boolean;
}[] = [
  { label: "Home", href: "#top", active: true },
  { label: "Inventory", href: SITE.links.inventory, external: true },
  { label: "Apply Online", href: SITE.links.apply, external: true },
  { label: "Car Finder", href: SITE.links.carFinder, external: true },
  { label: "About Us", href: SITE.links.aboutUs, external: true },
  { label: "Contact Us", href: SITE.links.contact, external: true },
];

function Header({
  mobileOpen,
  setMobileOpen,
}: {
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
}) {
  return (
    <header className="sticky top-0 z-40 shadow-sm">
      {/* ---- Top utility bar (white) ---- */}
      <div className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2.5 sm:px-8">
          <a href="#top" aria-label={SITE.nameProper} className="shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.jpg"
              alt={SITE.nameProper}
              className="h-14 w-auto sm:h-20"
            />
          </a>

          {/* Contact cluster — desktop only */}
          <div className="hidden items-center gap-7 lg:flex">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-white">
                <MapPin className="h-4 w-4" />
              </span>
              <span className="text-[13px] font-medium leading-tight text-ink">
                1375 W Landstreet Rd Ste 601,
                <br />
                Orlando, FL 32824
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-white">
                <Phone className="h-4 w-4" />
              </span>
              <span className="leading-tight">
                <span className="block text-[11px] font-semibold uppercase tracking-wide text-muted">
                  Sales:
                </span>
                <a
                  href={SITE.phoneTel}
                  className="text-lg font-bold text-ink transition-colors hover:text-primary-hover"
                >
                  {SITE.phone}
                </a>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={SITE.social.facebook}
                target="_blank"
                rel="noopener"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-white transition-colors hover:bg-stone-700"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href={SITE.social.instagram}
                target="_blank"
                rel="noopener"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-white transition-colors hover:bg-stone-700"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-stone-300 text-ink lg:hidden"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* ---- Yellow nav bar ---- */}
      <div className="bg-primary">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-2 sm:px-8">
          <nav className="hidden items-stretch lg:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener" : undefined}
                className={`px-5 py-4 text-[15px] font-semibold transition-colors ${
                  link.active
                    ? "bg-ink text-white"
                    : "text-ink hover:bg-black/10"
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <span className="py-3 pl-2 text-sm font-bold uppercase tracking-wide text-ink lg:hidden">
            Menu
          </span>

          <button
            type="button"
            aria-label="Search inventory"
            onClick={() =>
              window.open(SITE.links.inventory, "_blank", "noopener")
            }
            className="my-2 flex h-9 w-9 items-center justify-center rounded-full text-ink transition-colors hover:bg-black/10"
          >
            <Search className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* ---- Mobile dropdown ---- */}
      {mobileOpen && (
        <div className="border-t border-black/10 bg-primary px-4 py-3 lg:hidden">
          <nav className="flex flex-col">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener" : undefined}
                onClick={() => setMobileOpen(false)}
                className={`border-b border-black/10 py-3 text-base font-semibold last:border-0 ${
                  link.active ? "text-ink underline" : "text-ink"
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="mt-3 flex items-center gap-3 border-t border-black/10 pt-3">
            <a
              href={SITE.phoneTel}
              className="flex items-center gap-2 text-base font-bold text-ink"
            >
              <Phone className="h-4 w-4" />
              {SITE.phone}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="pointer-events-none absolute -right-32 -top-24 h-[420px] w-[420px] rounded-full bg-primary/30 blur-[120px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-14 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
        {/* Left */}
        <div className="animate-fade-in-up">
          <h1 className="font-serif text-5xl font-black leading-[0.95] tracking-tight text-ink md:text-7xl">
            The{" "}
            <span className="ink-mark">
              <span>smartest</span>
            </span>{" "}
            way to buy your next vehicle.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-stone-600">
            Browse our hand-selected luxury and family inventory in Orlando. Chat
            with our 24/7 virtual assistant, value your trade instantly, and get
            pre-approved for financing in under 3 minutes.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#pre-approval"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-4 text-base font-semibold text-ink shadow-xl shadow-primary/30 transition-all hover:bg-primary-hover hover:shadow-primary/40"
            >
              Get Pre-Approved
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href={SITE.links.inventory}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-300 bg-white px-7 py-4 text-base font-semibold text-ink transition-colors hover:border-stone-400 hover:bg-stone-50"
            >
              View {SITE.vehicleCount} Live Vehicles
            </a>
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-stone-500">
            <span className="flex items-center gap-1.5">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-primary text-primary"
                  />
                ))}
              </div>
              <span className="font-semibold text-ink">{SITE.rating}</span> ·{" "}
              {SITE.reviewCount} reviews
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-ink" />
              No credit-score impact
            </span>
          </div>
        </div>

        {/* Right */}
        <div className="relative animate-fade-in-up">
          <div className="relative overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-2xl shadow-stone-300/50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=1200"
              alt="Quality pre-owned vehicle at My Automóvil Corp"
              className="h-[340px] w-full object-cover sm:h-[460px]"
              loading="eager"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 to-transparent p-6">
              <p className="font-serif text-xl font-bold text-white">
                Quality pre-owned inventory · Orlando, FL
              </p>
            </div>
          </div>

          {/* Floating sticker badge */}
          <div className="absolute -left-4 -top-5 hidden rotate-[-8deg] rounded-2xl bg-primary px-4 py-3 text-center text-ink shadow-xl sm:block">
            <p className="font-serif text-2xl font-black leading-none">60s</p>
            <p className="text-[10px] font-semibold uppercase tracking-wider">
              Cash trade offer
            </p>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="mx-auto max-w-7xl px-5 pb-12 sm:px-8">
        <div className="grid grid-cols-2 divide-stone-200 rounded-3xl border border-stone-200 bg-white sm:grid-cols-4 sm:divide-x">
          {STATS.map((s) => (
            <div key={s.label} className="px-6 py-6 text-center">
              <p className="font-serif text-3xl font-black text-ink md:text-4xl">
                {s.value}
              </p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-stone-500">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Brand marquee                                                       */
/* ------------------------------------------------------------------ */

function BrandMarquee() {
  const track = [...BRANDS, ...BRANDS, ...BRANDS];
  return (
    <section className="border-y border-stone-200 bg-surface py-10">
      <p className="mb-8 text-center text-xs font-semibold uppercase tracking-[0.3em] text-stone-400">
        Brands We Stock
      </p>
      <div className="marquee-mask overflow-hidden">
        <div className="marquee-track flex w-max animate-marquee items-center gap-16 px-8">
          {track.map((brand, i) => (
            <span
              key={`${brand}-${i}`}
              className="select-none whitespace-nowrap font-serif text-2xl font-bold tracking-tight text-stone-300 transition-colors duration-300 hover:text-ink md:text-3xl"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Value pillars                                                       */
/* ------------------------------------------------------------------ */

function ValuePillars() {
  return (
    <section id="why" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-24">
      <SectionLabel index="01" text="Why My Automovil" />
      <div className="mt-4 max-w-2xl">
        <h2 className="font-serif text-4xl font-black tracking-tight text-ink md:text-5xl">
          A dealership built around{" "}
          <span className="ink-mark">
            <span>you</span>
          </span>
          .
        </h2>
        <p className="mt-4 text-lg text-stone-600">
          Powered by smart automation and backed by Central Florida&apos;s most
          trusted lenders.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {PILLARS.map(({ icon: Icon, title, body }) => (
          <div
            key={title}
            className="group rounded-3xl border border-stone-200 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/20"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-ink transition-colors group-hover:bg-primary group-hover:text-ink">
              <Icon className="h-7 w-7" />
            </div>
            <h3 className="mt-6 font-serif text-2xl font-bold text-ink">
              {title}
            </h3>
            <p className="mt-3 leading-relaxed text-stone-600">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Featured inventory (category cards)                                 */
/* ------------------------------------------------------------------ */

function Inventory() {
  return (
    <section className="border-y border-stone-200 bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <SectionLabel index="02" text="From the showroom" />
            <h2 className="mt-4 font-serif text-4xl font-black tracking-tight text-ink md:text-5xl">
              A taste of what&apos;s on the lot.
            </h2>
            <p className="mt-3 max-w-xl text-stone-600">
              Inventory updates daily. Browse our current lineup by budget —
              every vehicle inspection-certified, with live pricing on our
              showroom.
            </p>
          </div>
          <a
            href={SITE.links.inventory}
            target="_blank"
            rel="noopener"
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-stone-300 px-5 py-3 text-sm font-semibold text-ink transition-colors hover:border-primary hover:text-ink"
          >
            Browse full inventory
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {CATEGORIES.map(({ icon: Icon, title, sub, href }) => (
            <a
              key={title}
              href={href}
              target="_blank"
              rel="noopener"
              className="group flex flex-col overflow-hidden rounded-3xl border border-stone-200 bg-surface-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-stone-200"
            >
              <div className="flex h-44 items-center justify-center bg-ink">
                <Icon
                  className="h-16 w-16 text-primary transition-transform duration-500 group-hover:scale-110"
                  strokeWidth={1.5}
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-serif text-xl font-bold text-ink">
                  {title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-stone-600">
                  {sub}
                </p>
                <span className="mt-5 inline-flex w-fit items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-ink transition-colors group-hover:bg-primary-hover">
                  Browse
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* How it works                                                        */
/* ------------------------------------------------------------------ */

function HowItWorks() {
  // Drives the vertical line that "fills" with brand yellow as you scroll.
  const { ref: trackRef, progress } = useScrollProgress<HTMLDivElement>();

  return (
    <section id="how" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-24">
      <SectionLabel index="03" text="How it works" />
      <h2 className="mt-4 max-w-2xl font-serif text-4xl font-black tracking-tight text-ink md:text-5xl">
        Four steps from browsing to driving.
      </h2>

      <div ref={trackRef} className="relative mt-14 max-w-3xl">
        {/* Spine: grey track + yellow fill that grows with scroll progress */}
        <div
          className="absolute left-8 top-9 bottom-9 w-1 -translate-x-1/2 rounded-full bg-stone-200 sm:left-10"
          aria-hidden
        >
          <div
            className="h-full w-full origin-top rounded-full bg-primary transition-transform duration-150 ease-out"
            style={{ transform: `scaleY(${progress})` }}
          />
        </div>

        <ol className="space-y-6">
          {STEPS.map((step, i) => (
            <TimelineStep key={step.n} step={step} index={i} />
          ))}
        </ol>
      </div>
    </section>
  );
}

function TimelineStep({
  step,
  index,
}: {
  step: (typeof STEPS)[number];
  index: number;
}) {
  const { ref, inView } = useInView<HTMLLIElement>(0.5);

  return (
    <li
      ref={ref}
      className={`relative pl-20 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] sm:pl-28 ${
        inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
      style={{ transitionDelay: `${index * 90}ms` }}
    >
      {/* Number badge sitting on the spine */}
      <span
        className={`absolute left-0 top-0 flex h-16 w-16 items-center justify-center rounded-2xl border-2 font-serif text-2xl font-black transition-colors duration-500 sm:left-2 ${
          inView
            ? "border-primary bg-primary text-ink shadow-lg shadow-primary/30"
            : "border-stone-200 bg-white text-stone-300"
        }`}
      >
        {step.n}
      </span>

      <div className="rounded-3xl border border-stone-200 bg-white p-7 shadow-sm">
        <h3 className="font-serif text-xl font-bold text-ink">{step.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          {step.body}
        </p>
      </div>
    </li>
  );
}

/* ------------------------------------------------------------------ */
/* Trade-in band                                                       */
/* ------------------------------------------------------------------ */

function TradeInBand() {
  return (
    <section className="px-5 py-10 sm:px-8">
      <div className="dot-grid relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-ink px-8 py-14 text-white sm:px-14">
        <div className="relative grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
              <Coins className="h-4 w-4" />
              Instant Trade Valuation
            </span>
            <h2 className="mt-5 font-serif text-4xl font-black leading-tight md:text-5xl">
              Your current car is worth more than you think.
            </h2>
            <p className="mt-4 max-w-xl text-lg text-stone-300">
              Get a guaranteed cash offer in about 60 seconds — backed by live
              market data. Apply it to your next vehicle or walk away with a
              check. No obligation, ever.
            </p>
          </div>
          <div className="flex flex-col gap-3 lg:items-end">
            <a
              href="#pre-approval"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-4 text-base font-semibold text-ink shadow-xl transition-transform hover:scale-105"
            >
              Value My Trade
              <ArrowRight className="h-5 w-5" />
            </a>
            <a
              href={SITE.links.inventory}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 px-7 py-4 text-base font-semibold text-white transition-colors hover:bg-white/10"
            >
              Shop while I decide
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Sage spotlight                                                      */
/* ------------------------------------------------------------------ */

function SageSpotlight() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-24">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <SectionLabel index="04" text="Meet Sage" />
          <h2 className="mt-4 font-serif text-4xl font-black tracking-tight text-ink md:text-5xl">
            Your 24/7 car-buying concierge.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-stone-600">
            Sage is our AI assistant — and she never clocks out. Ask about
            pricing, availability, financing, or book a test drive at midnight if
            that&apos;s when you shop. Real answers, instantly, no pushy
            salesperson.
          </p>
          <ul className="mt-6 space-y-3">
            {[
              "Instant answers on pricing & availability",
              "Personalized vehicle matches in seconds",
              "Book test drives & appointments any hour",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-stone-700">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-ink">
                  <CheckCircle2 className="h-4 w-4" />
                </span>
                {item}
              </li>
            ))}
          </ul>
          <a
            href="#pre-approval"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-7 py-4 text-base font-semibold text-white transition-colors hover:bg-stone-800"
          >
            Chat with Sage
            <MessageSquare className="h-5 w-5" />
          </a>
        </div>

        {/* Chat mock */}
        <div className="rounded-[2rem] border border-stone-200 bg-white p-5 shadow-xl shadow-stone-200/60 sm:p-7">
          <div className="flex items-center gap-3 border-b border-stone-200 pb-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-ink">
              <Bot className="h-6 w-6" />
            </span>
            <div>
              <p className="font-serif text-lg font-bold text-ink">Sage</p>
              <p className="flex items-center gap-1.5 text-xs text-stone-500">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                Online now
              </p>
            </div>
          </div>
          <div className="mt-5 space-y-4">
            <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-stone-100 px-4 py-3 text-sm text-stone-700">
              Hi! Looking for something sporty or family-friendly? 🚗
            </div>
            <div className="ml-auto max-w-[80%] rounded-2xl rounded-tr-sm bg-primary px-4 py-3 text-sm text-ink">
              Family SUV under $30k, good on gas.
            </div>
            <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-stone-100 px-4 py-3 text-sm text-stone-700">
              Great pick! We have several family SUVs in that range right now —
              want me to pull today&apos;s options and set up a test drive?
            </div>
          </div>
          <div className="mt-5 flex items-center gap-2 rounded-full border border-stone-200 bg-surface-2 px-4 py-3 text-sm text-stone-400">
            Ask Sage anything…
            <span className="ml-auto flex h-8 w-8 items-center justify-center rounded-full bg-primary text-ink">
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Testimonials                                                        */
/* ------------------------------------------------------------------ */

function Testimonials() {
  return (
    <section id="reviews" className="border-y border-stone-200 bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <SectionLabel index="05" text="What customers say" />
          <h2 className="mt-4 font-serif text-4xl font-black tracking-tight text-ink md:text-5xl">
            Rated {SITE.rating} across {SITE.reviewCount} reviews.
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((quote, i) => (
            <figure
              key={i}
              className="flex flex-col rounded-3xl border border-stone-200 bg-surface-2 p-7"
            >
              <Quote className="h-8 w-8 text-primary" />
              <div className="mt-2 flex">
                {[...Array(5)].map((_, s) => (
                  <Star
                    key={s}
                    className="h-4 w-4 fill-primary text-primary"
                  />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-stone-700">
                “{quote}”
              </blockquote>
              <figcaption className="mt-6 border-t border-stone-200 pt-4 text-sm font-medium text-stone-500">
                Customer review
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Lead hub                                                            */
/* ------------------------------------------------------------------ */

function LeadHub({
  form,
  status,
  errorMsg,
  onChange,
  onSubmit,
  onReset,
}: {
  form: FormState;
  status: Status;
  errorMsg: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onReset: () => void;
}) {
  return (
    <section id="pre-approval" className="px-5 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-stone-200 bg-white p-8 shadow-xl shadow-stone-200/50 md:p-12">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-ink">
            <ShieldCheck className="h-4 w-4" />
            Express Credit Approval
          </span>
          <h2 className="mt-3 font-serif text-3xl font-black tracking-tight text-ink md:text-4xl">
            Get pre-approved in under 3 minutes.
          </h2>
          <p className="mt-3 text-stone-600">
            No impact to your credit score. Every tier welcome.
          </p>
        </div>

        {status === "success" ? (
          <div className="mt-10 flex flex-col items-center rounded-3xl border border-primary/30 bg-primary/10 p-10 text-center">
            <CheckCircle2 className="h-14 w-14 text-ink" />
            <h3 className="mt-4 font-serif text-2xl font-bold text-ink">
              Request received!
            </h3>
            <p className="mt-2 max-w-md text-stone-600">
              Thank you. A financing specialist will reach out shortly to
              finalize your pre-approval. Want to start browsing now?
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href={SITE.links.inventory}
                target="_blank"
                rel="noopener"
                className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-ink shadow-lg shadow-primary/30 transition-colors hover:bg-primary-hover"
              >
                Browse Inventory
              </a>
              <button
                type="button"
                onClick={onReset}
                className="rounded-full border border-stone-300 px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-stone-50"
              >
                Submit Another Request
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-10 space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Full Name"
                name="name"
                value={form.name}
                onChange={onChange}
                placeholder="Jane Doe"
                autoComplete="name"
              />
              <Field
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                placeholder="jane@email.com"
                autoComplete="email"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Phone Number"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={onChange}
                placeholder="(407) 555-0100"
                autoComplete="tel"
                required
              />
              <div>
                <label
                  htmlFor="credit"
                  className="mb-2 block text-sm font-medium text-stone-700"
                >
                  Estimated Credit Score
                </label>
                <select
                  id="credit"
                  name="credit"
                  value={form.credit}
                  onChange={onChange}
                  className="w-full appearance-none rounded-xl border border-stone-300 bg-surface-2 px-4 py-3 text-ink outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30"
                >
                  {CREDIT_OPTIONS.map((opt) => (
                    <option
                      key={opt.value}
                      value={opt.value}
                      disabled={opt.value === ""}
                    >
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Field
              label="Desired Vehicle"
              name="vehicle"
              value={form.vehicle}
              onChange={onChange}
              placeholder="e.g. SUV, sedan, truck, or a specific model…"
            />

            {status === "error" && (
              <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-base font-semibold text-ink shadow-xl shadow-primary/40 transition-all hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-70"
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Submitting…
                </>
              ) : (
                "Complete Pre-Approval Request"
              )}
            </button>

            <p className="text-center text-xs leading-relaxed text-stone-500">
              By submitting, you consent to be contacted by {SITE.nameProper} via
              call, text, and email regarding your inquiry. Message &amp; data
              rates may apply. Consent is not a condition of purchase.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  autoComplete,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-stone-700"
      >
        {label}
        {required && <span className="ml-0.5 text-ink">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        className="w-full rounded-xl border border-stone-300 bg-surface-2 px-4 py-3 text-ink placeholder-stone-400 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30"
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* FAQ                                                                 */
/* ------------------------------------------------------------------ */

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-20">
      <div className="text-center">
        <SectionLabel index="06" text="Good to know" center />
        <h2 className="mt-4 font-serif text-4xl font-black tracking-tight text-ink md:text-5xl">
          Questions, answered.
        </h2>
      </div>

      <div className="mt-10 space-y-3">
        {FAQS.map((faq, i) => {
          const isOpen = open === i;
          return (
            <div
              key={faq.q}
              className="overflow-hidden rounded-2xl border border-stone-200 bg-white"
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span className="font-semibold text-ink">{faq.q}</span>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-ink">
                  {isOpen ? (
                    <Minus className="h-4 w-4" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </span>
              </button>
              {isOpen && (
                <p className="px-6 pb-5 leading-relaxed text-stone-600">
                  {faq.a}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Final CTA                                                           */
/* ------------------------------------------------------------------ */

function FinalCta() {
  return (
    <section className="px-5 pb-20 sm:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-ink px-8 py-16 text-center text-white sm:px-14 sm:py-20">
        <h2 className="mx-auto max-w-3xl font-serif text-4xl font-black leading-tight md:text-6xl">
          Ready to drive home{" "}
          <span className="text-primary">happy</span>?
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-stone-300">
          Get pre-approved in minutes or browse {SITE.vehicleCount}{" "}
          inspection-certified vehicles. Orlando&apos;s smartest dealership is
          ready when you are.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <a
            href="#pre-approval"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-semibold text-ink shadow-xl shadow-primary/30 transition-colors hover:bg-primary-hover"
          >
            Get Pre-Approved
            <ArrowRight className="h-5 w-5" />
          </a>
          <a
            href={SITE.links.inventory}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-white/10"
          >
            Browse Inventory
          </a>
        </div>
        <a
          href={SITE.phoneTel}
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-stone-300 transition-colors hover:text-white"
        >
          <Phone className="h-4 w-4 text-primary" />
          Or call us: {SITE.phone}
        </a>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */

function Footer() {
  const footerLinks: { label: string; href: string; external?: boolean }[] = [
    { label: "HOME", href: "#top" },
    { label: "PRE OWNED VEHICLES", href: SITE.links.inventory, external: true },
    { label: "APPLY ONLINE", href: SITE.links.apply, external: true },
    { label: "CAR FINDER", href: SITE.links.carFinder, external: true },
    { label: "ABOUT US", href: SITE.links.aboutUs, external: true },
    { label: "CONTACT US", href: SITE.links.contact, external: true },
    { label: "PRIVACY POLICY", href: "/privacy" },
  ];

  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Visit us */}
          <div>
            <h4 className="text-lg font-bold uppercase tracking-wide text-white">
              Visit Us
            </h4>
            <div className="mt-5 flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/30 text-white">
                <MapPin className="h-5 w-5" />
              </span>
              <p className="text-sm font-semibold leading-relaxed text-white">
                1375 W Landstreet Rd Ste 601,
                <br />
                Orlando, FL 32824
              </p>
            </div>
            <a
              href={SITE.phoneTel}
              className="mt-5 flex items-center gap-2 text-sm font-semibold text-white transition-colors hover:text-primary"
            >
              <Phone className="h-4 w-4 text-primary" />
              {SITE.phone}
            </a>
          </div>

          {/* Store hours */}
          <div>
            <h4 className="text-lg font-bold uppercase tracking-wide text-white">
              Store Hours
            </h4>
            <dl className="mt-5 space-y-2.5 text-sm">
              <div className="flex gap-3">
                <dt className="w-24 font-bold text-white">Mon - Sat :</dt>
                <dd className="text-stone-300">9:00 AM - 7:30 PM</dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-24 font-bold text-white">Sun :</dt>
                <dd className="text-stone-300">Closed</dd>
              </div>
            </dl>
            <p className="mt-5 flex items-center gap-1.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-primary text-primary" />
              ))}
              <span className="ml-1 text-sm text-stone-400">
                {SITE.rating} · {SITE.reviewCount} reviews
              </span>
            </p>
          </div>

          {/* Socials */}
          <div className="md:flex md:flex-col md:items-end">
            <h4 className="text-lg font-bold uppercase tracking-wide text-white md:text-right">
              Follow Us
            </h4>
            <div className="mt-5 flex items-center gap-3">
              <a
                href={SITE.social.facebook}
                target="_blank"
                rel="noopener"
                aria-label="My Automóvil Corp on Facebook"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-ink transition-transform hover:scale-105"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href={SITE.social.instagram}
                target="_blank"
                rel="noopener"
                aria-label="My Automóvil Corp on Instagram"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-ink transition-transform hover:scale-105"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
            <a
              href={SITE.links.inventory}
              target="_blank"
              rel="noopener"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-ink shadow-lg shadow-primary/30 transition-colors hover:bg-primary-hover"
            >
              Browse All Vehicles
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Bottom link row */}
        <div className="mt-12 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-white/10 pt-8 text-xs font-semibold tracking-wide text-stone-300">
          {footerLinks.map((link, i) => (
            <span key={link.label} className="flex items-center gap-3">
              <a
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener" : undefined}
                className="transition-colors hover:text-primary"
              >
                {link.label}
              </a>
              {i < footerLinks.length - 1 && (
                <span className="text-stone-600">|</span>
              )}
            </span>
          ))}
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-2 text-xs text-stone-500 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <a href="/terms" className="transition-colors hover:text-white">
              Terms
            </a>
            <span className="text-stone-700">|</span>
            <a
              href="/sms-disclosure"
              className="transition-colors hover:text-white"
            >
              SMS Disclosure
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/* Sage floating widget                                                */
/* ------------------------------------------------------------------ */

function SageWidget() {
  return (
    <a
      href="#pre-approval"
      className="group fixed bottom-6 right-6 z-50 flex items-center gap-3"
      aria-label="Ask Sage to pre-approve now"
    >
      <span className="hidden rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-ink shadow-lg sm:block">
        Ask Sage: Pre-Approve Now
      </span>
      <span className="flex h-14 w-14 animate-pulse-glow items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/50 transition-transform group-hover:scale-105">
        <MessageSquare className="h-6 w-6 text-ink" />
      </span>
    </a>
  );
}

/* ------------------------------------------------------------------ */
/* Shared bits                                                         */
/* ------------------------------------------------------------------ */

function SectionLabel({
  index,
  text,
  center = false,
}: {
  index: string;
  text: string;
  center?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 ${center ? "justify-center" : ""}`}
    >
      <span className="font-serif text-sm font-bold text-ink">{index}</span>
      <span className="h-px w-8 bg-primary" />
      <span className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
        {text}
      </span>
    </div>
  );
}
