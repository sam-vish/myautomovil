/**
 * Single source of truth for My Automóvil Corp business facts, links, and
 * brands. All values VERIFIED from the live dealer site. Update here only —
 * no business facts should be hardcoded in JSX.
 */
export const SITE = {
  /** Wordmark / logo form (all caps). */
  name: "MY AUTOMÓVIL CORP",
  /** Natural sentence-case form for body copy (keeps the Ó accent + CORP). */
  nameProper: "My Automóvil Corp",

  phone: "(786) 608-9518",
  phoneTel: "tel:+17866089518",
  address: "1375 W Landstreet Rd, Ste 601, Orlando, FL 32824",
  hours: "Mon–Sat 9:00 AM – 7:30 PM · Sun Closed",

  rating: "4.1",
  reviewCount: 53,
  yearsServing: "14 yrs", // established 2012
  vehicleCount: "25+", // real lot ~27; safe rounded-down number

  social: {
    facebook: "https://www.facebook.com/myautomovil.corp",
    instagram: "https://www.instagram.com/myautomovilcorp/",
  },

  links: {
    inventory: "https://myautomovilcorp.mycarsonline.com/inventory/",
    apply: "https://myautomovilcorp.mycarsonline.com/apply-online/",
    carFinder: "https://myautomovilcorp.mycarsonline.com/car-finder/",
    aboutUs: "https://myautomovilcorp.mycarsonline.com/about-us/",
    contact: "https://myautomovilcorp.mycarsonline.com/contact-us/",
    under5k:
      "https://myautomovilcorp.mycarsonline.com/inventory/?price_min=0&price_max=5000",
    under10k:
      "https://myautomovilcorp.mycarsonline.com/inventory/?price_min=0&price_max=10000",
    under20k:
      "https://myautomovilcorp.mycarsonline.com/inventory/?price_min=0&price_max=20000",
  },

  /** Makes actually stocked on the lot. */
  makes: [
    "Ford",
    "Toyota",
    "Jeep",
    "Chevrolet",
    "Dodge",
    "Kia",
    "Volkswagen",
    "Mercedes-Benz",
  ],
} as const;
