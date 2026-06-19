# My Automovil Corp — Landing Page

A high-converting, single-page marketing site for **My Automovil Corp**, a premium
pre-owned car dealership in Orlando, FL. Built with Next.js (App Router),
TypeScript, Tailwind CSS, and lucide-react.

## Features

- Sleek high-end dark theme (Zinc-950 / Black) with an Indigo accent for the "Sage AI" brand.
- Glassmorphic cards, ambient glows, animated brand marquee.
- **Pre-approval lead form** with React `useState`, loading + success + error states.
  - Posts to `NEXT_PUBLIC_GHL_WEBHOOK_URL` (GoHighLevel) if set, otherwise to `/api/leads`.
- All inventory CTAs link to the live DealerCenter site (`http://myautomovilcorp.mycarsonline.com`).
- Floating "Sage" AI concierge widget.
- Fully mobile-responsive (built for paid social ad traffic).
- Compliance-ready footer (Privacy / Terms / Opt-In SMS Disclosure).

## Getting Started

```bash
npm install
cp .env.example .env.local   # add your GHL webhook URL
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Configuration

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_GHL_WEBHOOK_URL` | Browser posts leads directly to this GHL webhook. |
| `GHL_WEBHOOK_URL` | Server-side fallback used by `/api/leads`. |

If neither is set, leads are logged to the server console so you can demo the flow end-to-end.

## Build

```bash
npm run build && npm start
```
