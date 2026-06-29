# Master Prompt — My Automóvil Corp landing page (for GHL AI Studio "vibe")

> Paste everything below the line into the **"Describe what you want to build…"** box.
> If AI Studio lets you import/paste code instead, use `ghl/index.html` — it's the exact site in one file.

---

Build a single-page, conversion-focused landing page for a used-car dealership called **My Automóvil Corp** in Orlando, FL. Premium but approachable. Mobile-first, fully responsive, fast, accessible.

## Brand & style
- **Palette:** brand yellow `#F0E84C` (primary, used for accents/CTAs, hover `#E4DB33`), near-black "ink" `#0A0A0A`, white `#FFFFFF` background, off-white panels `#F7F7F4`, muted grey text `#5A5A5A`. Yellow + black + white only — no other accent colors.
- **Fonts:** body = **Inter**; all headings = **Bricolage Grotesque** (heavy/black weight, tight tracking).
- **Look:** rounded cards (rounded-3xl), soft shadows, generous whitespace, hairline `stone-200` borders. CTAs are pill-shaped yellow buttons with black text. Dark "ink" sections use a subtle dotted texture.
- **Signature detail:** a hand-drawn yellow highlight swipe behind one key word in big headings (e.g. "the **smartest** way", "built around **you**").
- **Logo:** wordmark image (black sports car + yellow italic "MY AUTOMÓVIL CORP."): `https://dcdws.blob.core.windows.net/dws-5611260-9716-media/2019/11/IMG-6991.jpg`

## Business facts (use exactly)
- Name: **My Automóvil Corp** (wordmark: MY AUTOMÓVIL CORP)
- Address: **1375 W Landstreet Rd Ste 601, Orlando, FL 32824**
- Phone (Sales): **(786) 608-9518** → `tel:+17866089518`
- Hours: **Mon–Sat 9:00 AM – 7:30 PM, Sun Closed**
- Rating: **4.1 ★ across 53 Google reviews**
- ~**25+** vehicles in stock; serving Orlando **14 years**
- Brands stocked: Ford, Toyota, Jeep, Chevrolet, Dodge, Kia, Volkswagen, Mercedes-Benz
- Facebook: https://www.facebook.com/myautomovil.corp · Instagram: https://www.instagram.com/myautomovilcorp/
- Nav/footer external links:
  - Inventory → https://myautomovilcorp.mycarsonline.com/inventory/
  - Apply Online → https://myautomovilcorp.mycarsonline.com/apply-online/
  - Car Finder → https://myautomovilcorp.mycarsonline.com/car-finder/
  - About Us → https://myautomovilcorp.mycarsonline.com/about-us/
  - Contact Us → https://myautomovilcorp.mycarsonline.com/contact-us/
  - Privacy Policy → https://myautomovilcorp.mycarsonline.com/privacy-policy/

## Header (two tiers, sticky)
1. **White top bar:** logo image on the left (large). On desktop, right side shows: address with a black circular pin icon; "SALES:" label + bold phone number with a black circular phone icon; black circular Facebook + Instagram icons.
2. **Yellow nav bar** directly below: nav items **Home · Inventory · Apply Online · Car Finder · About Us · Contact Us**. The active **Home** item is a solid black block with white text; the rest are black text on yellow with a subtle dark hover. A search icon on the far right links to Inventory.
3. Mobile: collapse the contact row + nav into a hamburger that opens a yellow dropdown menu.
- Thin black announcement bar above everything: "Same-day approvals for every credit tier • Guaranteed trade offers — beat the big online dealers".

## Sections (in order)
1. **Hero** — Big headline "The **smartest** way to buy your next vehicle." (highlight "smartest"). Subcopy about browsing Orlando inventory, 24/7 AI assistant, instant trade value, pre-approval under 3 minutes. Two CTAs: yellow "Get Pre-Approved" (scrolls to form) + outline "View 25+ Live Vehicles" (inventory link). Trust row: 5 yellow stars, "4.1 · 53 reviews", "No credit-score impact". Right side: a rounded car photo with a small rotated yellow "60s / Cash trade offer" sticker badge. Below hero: a 4-up stats strip — **25+** Vehicles in stock · **4.1★** Google rating · **3 min** To pre-approval · **14 yrs** Serving Orlando.
2. **Brand marquee** — "Brands We Stock", infinite horizontal scrolling row of the brand names in grey, pausing on hover.
3. **Why My Automovil (01)** — heading "A dealership built around **you**." + 3 feature cards: *Instant Trade Valuation*, *24/7 Virtual Concierge*, *Express Credit Approval*, each with an icon and short blurb; cards lift on hover.
4. **From the showroom (02)** — heading "A taste of what's on the lot." + 3 category cards with black icon headers: **Under $5K**, **Under $10K**, **Under $20K**, each linking to the inventory filtered by price, with a yellow "Browse" pill.
5. **How it works (03)** — heading "Four steps from browsing to driving." Render as a **vertical timeline with a scroll-triggered animation**: a grey vertical spine on the left whose **yellow fill grows as the user scrolls** through the section; four numbered badge tiles (01–04) that **flip from grey to yellow** as each step enters the viewport, and each step card **fades + slides up** with a slight stagger. Steps: (01) Browse the showroom; (02) Value your trade; (03) Get pre-approved (no credit-score impact); (04) Drive home happy. Respect `prefers-reduced-motion`.
6. **Trade-in band** — full-width black rounded panel, dotted texture: "Your current car is worth more than you think." + guaranteed 60-second cash offer copy + yellow "Value My Trade" CTA and an outline "Shop while I decide".
7. **Meet Sage (04)** — "Your 24/7 car-buying concierge." Left: copy + 3 checkmark bullets + black "Chat with Sage" button. Right: a mock chat card with Sage (online), 2–3 sample messages, and a fake input bar.
8. **Reviews (05)** — "Rated 4.1 across 53 reviews." + 3 testimonial cards (quote icon, 5 stars, unattributed quote, "Customer review"). Keep testimonials generic — **no fabricated names/cities/vehicles**.
9. **Pre-approval form (06 anchor `#pre-approval`)** — "Get pre-approved in under 3 minutes. No impact to your credit score." Fields: Full Name, Email, Phone (required), Estimated Credit Score (Excellent 720+ / Good 680–719 / Fair 620–679 / Rebuilding <620), Desired Vehicle. Yellow submit button → success state ("Request received!"). Include consent microcopy about being contacted via call/text/email, msg & data rates, consent not a condition of purchase. **Wire submission to a GHL inbound webhook.**
10. **FAQ** — "Questions, answered." Accordion with 5 items (credit impact of pre-approval, bad/rebuilding credit, how trade valuation works, can it be done online, who is Sage). First item open by default; yellow +/− toggle.
11. **Final CTA** — black rounded panel: "Ready to drive home **happy**?" (yellow "happy") + yellow "Get Pre-Approved" + outline "Browse Inventory" + a "call us" phone line.

## Footer (black)
Three columns: **VISIT US** (pin + address + phone), **STORE HOURS** (Mon–Sat 9:00 AM – 7:30 PM / Sun Closed + 5 stars "4.1 · 53 reviews"), **FOLLOW US** (yellow circular Facebook + Instagram + a yellow "Browse All Vehicles" pill). Below, a single link row: **HOME | PRE OWNED VEHICLES | APPLY ONLINE | CAR FINDER | ABOUT US | CONTACT US | PRIVACY POLICY** (PRE OWNED VEHICLES → inventory), then "© [year] MY AUTOMÓVIL CORP. All rights reserved."

## Extras
- Floating bottom-right "Ask Sage: Pre-Approve Now" pill with a pulsing yellow chat button that scrolls to the form.
- Smooth in-page scrolling for anchor links. External links open in a new tab. Use Lucide-style icons throughout.
