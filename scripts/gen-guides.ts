import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const CITIES = [
  { slug: "delhi", label: "Delhi" },
  { slug: "mumbai", label: "Mumbai" },
  { slug: "bangalore", label: "Bangalore" },
  { slug: "chennai", label: "Chennai" },
  { slug: "hyderabad", label: "Hyderabad" },
  { slug: "pune", label: "Pune" },
  { slug: "kolkata", label: "Kolkata" },
];

interface Topic {
  key: string;
  title: (c: string) => string;
  desc: (c: string) => string;
  body: (c: string) => string;
}

const TOPICS: Topic[] = [
  {
    key: "best-budget-doctors",
    title: (c) => `Best Budget Doctors in ${c}`,
    desc: (c) => `How to find affordable, well-rated doctors in ${c} without compromising on quality.`,
    body: (c) => `Finding a good doctor in ${c} on a budget is easier than you think. Here's how.

## Start with the fee tiers

On India Health Arena every doctor card shows a **fee-tier badge**:

- **Free** — government, CGHS and free OPD clinics
- **₹** — under ₹300
- **₹₹** — ₹300–₹700
- **₹₹₹** — ₹700 and above

Filter for **₹** and **Free** tiers first, then sort by rating.

## Use the "Open Now" + rating filters

Combine the **4+ rating** chip with **Open Now** to get a shortlist of trusted doctors
you can visit today. Most general physicians in ${c} fall in the ₹ to ₹₹ range.

## Consider online consultations

Look for the **Online** badge. Video consults are often cheaper than in-person visits and
save you travel time across ${c}.

> Always consult a qualified doctor for any medical concern. This guide is informational only.`,
  },
  {
    key: "free-hospitals",
    title: (c) => `Free & Government Hospitals in ${c}`,
    desc: (c) => `A practical guide to free OPD, government and CGHS healthcare options in ${c}.`,
    body: (c) => `Government and charitable hospitals in ${c} offer quality care at little or no cost.

## What "Free" means here

Doctors tagged **Free** on India Health Arena are typically attached to government OPDs,
CGHS panels, or charitable trusts. Consultation is free; some tests may carry a nominal fee.

## How to find them

1. Open the ${c} listings
2. Tap the **Free** fee tier
3. Check the clinic timings — government OPDs usually run mornings

## What to carry

- A government ID (Aadhaar)
- Any previous prescriptions or reports
- Your CGHS card if applicable

## Health camps

Don't miss the free **health camps and OPD days** on the Events tab — these bring
specialists to neighbourhoods across ${c} at no cost.

> For emergencies, always call your nearest hospital directly.`,
  },
  {
    key: "online-consultation",
    title: (c) => `Your Guide to Online Doctor Consultations in ${c}`,
    desc: (c) => `When online consults make sense and how to book one with a ${c} doctor.`,
    body: (c) => `Online consultations are a fast, affordable way to reach doctors in ${c}.

## When online works well

- Follow-ups and prescription renewals
- Skin, general medicine and mental-health concerns
- Second opinions before an in-person visit

## When to go in person

Anything needing a physical exam, tests, or urgent care. **When in doubt, see a doctor in person.**

## How to book

1. Filter ${c} doctors by the **Online** badge
2. Open a profile and tap **Book Appointment**
3. Pick a slot and verify with the OTP — no account needed

## Make the most of your call

- Note your symptoms and their timeline beforehand
- Keep a list of current medicines handy
- Have good lighting if the doctor needs to see something

> Online consultations don't replace emergency care. Always consult a real doctor.`,
  },
];

const dir = join(process.cwd(), "content", "guides");
mkdirSync(dir, { recursive: true });

let count = 0;
for (const city of CITIES) {
  for (const topic of TOPICS) {
    const slug = `${topic.key}-${city.slug}`;
    const fm = [
      "---",
      `title: "${topic.title(city.label)}"`,
      `description: "${topic.desc(city.label)}"`,
      `city: "${city.slug}"`,
      `cityLabel: "${city.label}"`,
      `topic: "${topic.key}"`,
      `readTime: "3 min read"`,
      "---",
      "",
      topic.body(city.label),
      "",
    ].join("\n");
    writeFileSync(join(dir, `${slug}.mdx`), fm);
    count++;
  }
}
console.log(`Generated ${count} guide files in content/guides/`);
