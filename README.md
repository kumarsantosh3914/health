# India Health Arena

Pan-India doctor, clinic & hospital discovery platform. **Zero friction — no login, no paywall.**
Find the right doctor, right now, across 7 major Indian cities.

> Inspired by BLR Startup Arena, built for healthcare.

## Features

- **Landing page** — full-screen hero, city selector, USP badges, city cards
- **City pages** (`/[city]`) — list ⇄ map toggle, fuzzy search, speciality + rating + Open-Now + online filters
- **Map view** (`/[city]/map`) — Leaflet map, color-coded markers per speciality, clustering, booking popovers
- **List view** (`/[city]/list`) — responsive doctor card grid
- **Doctor profiles** (`/[city]/doctor/[slug]`) — qualifications, about, clinic map embed, reviews, booking
- **Booking flow** — name + phone + date + slot → mock OTP → booking ID confirmation. No account needed.
- **Ask AI** ✨ — chat assistant (OpenAI `gpt-4o-mini`) that answers using the live city + filtered doctor list as context. Suggested prompt chips; English + Hinglish; never diagnoses.
- **Fee-tier badges** — auto-derived from `consultation_fee`: Free (green) · ₹ (blue) · ₹₹ (amber) · ₹₹₹ (orange).
- **Live count header** — "43 cardiologists in Delhi" updates as filters change.
- **Social proof** — "👥 N patients" on every card and profile.
- **Community** — `/community` to submit doctors (status `pending`); `/pending` to upvote/downvote. Auto-approve at 5 upvotes, auto-reject at 3 downvotes.
- **Events** — `/[city]/events` with 10 seeded camps/drives per city.
- **Guides** — `/[city]/guides` MDX articles (3 per city).
- **Newsletter** — "The Health Pulse" signup on every city page → Subscribers collection.
- **Suggest an edit** — on every doctor profile → Suggestions collection.
- **Dynamic OG images** — `/api/og?city=` renders a per-city share image with the live doctor count.
- **API** — `/api/doctors`, `/api/doctors/[slug]`, `/api/appointments`, `/api/cities`, `/api/ask`, `/api/events`, `/api/community`, `/api/doctors/[slug]/vote`, `/api/doctors/[slug]/suggest-edit`, `/api/subscribe`, `/api/og`
- **Polish** — SEO metadata + OG tags, `robots.txt`, `sitemap.xml`, PWA `manifest`, dark mode, analytics placeholder

## Tech Stack

Next.js 14 (App Router) · TypeScript · Tailwind CSS · MongoDB + Mongoose · Leaflet · Fuse.js

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment** — copy `.env.example` to `.env.local` and set your MongoDB URI
   (the default points at a local MongoDB / Compass instance):
   ```bash
   cp .env.example .env.local
   ```
   ```
   MONGODB_URI=mongodb://localhost:27017/india-health-arena
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   # Optional — enables the ✨ Ask AI feature (gpt-4o-mini):
   OPENAI_API_KEY=sk-...
   ```
   > Ask AI is the only feature needing a key. Without it, the Ask AI panel shows a
   > friendly "not configured" message and everything else works.

3. **Seed the database** (doctors + events across 7 cities) and generate guide files
   ```bash
   npm run seed        # 56 doctors + 70 events
   npm run gen:guides  # 21 MDX guides (3 per city)
   ```

4. **Run the dev server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

## Booking demo

The OTP step is mocked — use code **`123456`** (any 6 digits work). Bookings are stored in the
`appointments` collection and you'll get an `IHA-XXXXXX` booking ID.

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run seed` | Seed MongoDB with mock doctors |
| `npm run lint` | Lint |

## Real data

The seed data is **sample/demo** (clearly labeled in the footer). Two paths bring in real data:

### 1. Google Places → map listings
Pulls real clinics/doctors per city + speciality into the `Doctor` schema.
```bash
# 1. Enable "Places API (New)" in Google Cloud, get a key
# 2. Add GOOGLE_MAPS_API_KEY=... to .env.local
npm run import:places            # all cities
npm run import:places -- delhi   # one city
```
Imported records are tagged `source: "google_places"`, `status: "approved"`.
**Note:** Places has no consultation-fee data, so imports set `fee_listed: false`
(the UI shows a neutral "Fee on request" badge instead of mislabeling them as free).
Respect Google's Places API caching/attribution policies.

### 2. ABDM HPR → verified community submissions
On `/community`, a doctor can verify their identity via the ABDM Healthcare
Professionals Registry (HPR ID + mobile OTP). **Verified submissions auto-publish**
(`status: approved`, `hpr_verified: true`, ✓ HPR badge); unverified ones go to the
`/pending` community vote queue.

- **Demo mode (default):** no credentials needed — OTP **123456** verifies.
- **Live mode:** set `HPR_BASE_URL` + `HPR_AUTH_TOKEN` (your ABDM gateway session
  token) in `.env.local`. The calls in `lib/hpr.ts` follow ABDM's Generate/Verify
  Mobile OTP + Fetch Professional Details shape — confirm exact paths against your
  sandbox docs when partner credentials arrive.

> Why HPR isn't used to *seed* listings: the HPR APIs are consent-based onboarding
> endpoints (keyed to a person's HPR ID / Aadhaar) with no by-city search, so they
> verify submissions rather than provide a bulk dataset.

## Deployment

- **Frontend + API:** Vercel (set `MONGODB_URI` + `NEXT_PUBLIC_SITE_URL` env vars)
- **Database:** MongoDB Atlas (free tier) or any MongoDB host

---

made by **Arpit Rautela**
