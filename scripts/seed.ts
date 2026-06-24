import { config } from "dotenv";
config({ path: ".env.local" });

import mongoose from "mongoose";
import Doctor from "../lib/models/Doctor";
import Event from "../lib/models/Event";
import { CITIES, SPECIALITIES, getNeighbourhoods, EVENT_TYPES } from "../lib/constants";

const MONGODB_URI =
  process.env.MONGODB_URI ?? "mongodb://localhost:27017/india-health-arena";

// ~51 demo doctors per city × 7 cities ≈ 357 total.
const PER_CITY = 51;

const FIRST_NAMES = [
  "Aarav", "Priya", "Rohan", "Ananya", "Vikram", "Sneha", "Arjun", "Kavya",
  "Rahul", "Meera", "Aditya", "Divya", "Karan", "Pooja", "Siddharth", "Neha",
  "Manish", "Riya", "Sanjay", "Anjali", "Vivek", "Shruti", "Nikhil", "Ishita",
  "Rajesh", "Tanya", "Amit", "Deepa", "Suresh", "Lakshmi", "Harish", "Nisha",
  "Gaurav", "Swati", "Varun", "Aishwarya", "Prakash", "Kiran", "Mohan", "Ritu",
  "Sameer", "Payal", "Tarun", "Sunita", "Naveen", "Rekha", "Yash", "Megha",
  "Abhishek", "Komal", "Deepak", "Sonia", "Ravi", "Preeti", "Akash", "Bhavna",
  "Nitin", "Geeta", "Sandeep", "Madhuri", "Vishal", "Arti", "Rohit", "Sheetal",
];

const LAST_NAMES = [
  "Sharma", "Verma", "Iyer", "Reddy", "Nair", "Gupta", "Mehta", "Patel",
  "Rao", "Joshi", "Banerjee", "Chopra", "Kapoor", "Menon", "Bose", "Sinha",
  "Desai", "Pillai", "Malhotra", "Khanna", "Chatterjee", "Naidu",
  "Agarwal", "Bhat", "Chauhan", "Deshpande", "Ghosh", "Hegde", "Jain", "Kulkarni",
  "Mukherjee", "Nanda", "Prasad", "Saxena", "Shetty", "Tiwari", "Varma", "Yadav",
  "Bedi", "Dutta", "Krishnan", "Mathur", "Pandey", "Rana", "Sethi", "Trivedi",
];

const CLINIC_SUFFIX = [
  "Clinic", "Healthcare", "Medical Centre", "Speciality Hospital",
  "Care Centre", "Polyclinic", "Wellness Centre", "Diagnostics & Clinic",
];

const QUALIFICATIONS: Record<string, string[]> = {
  Cardiology: ["MBBS, MD, DM (Cardiology)", "MBBS, DNB Cardiology"],
  Orthopaedics: ["MBBS, MS (Orthopaedics)", "MBBS, D.Ortho, MS"],
  Dermatology: ["MBBS, MD (Dermatology)", "MBBS, DDVL"],
  Paediatrics: ["MBBS, MD (Paediatrics)", "MBBS, DCH"],
  Gynaecology: ["MBBS, MS (Obstetrics & Gynaecology)", "MBBS, DGO"],
  Neurology: ["MBBS, MD, DM (Neurology)", "MBBS, DNB Neurology"],
  "General Physician": ["MBBS, MD (General Medicine)", "MBBS, FCGP"],
  Dentistry: ["BDS, MDS", "BDS"],
  ENT: ["MBBS, MS (ENT)", "MBBS, DLO"],
  Ophthalmology: ["MBBS, MS (Ophthalmology)", "MBBS, DO"],
};

const TAG_POOL = [
  "Experienced", "Highly Recommended", "Friendly", "Quick Appointments",
  "Affordable", "Senior Consultant", "Trusted", "Modern Equipment",
];

const REVIEW_COMMENTS = [
  "Very thorough and patient. Explained everything clearly.",
  "Great experience, minimal waiting time.",
  "Knowledgeable doctor, highly recommend.",
  "Clinic is clean and staff is helpful.",
  "Took time to understand my concerns.",
  "Reasonable fees and effective treatment.",
];

function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length];
}

function rand(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function makeReviews(count: number) {
  const reviews = [];
  for (let i = 0; i < count; i++) {
    reviews.push({
      author: `${pick(FIRST_NAMES, i + 3)} ${pick(LAST_NAMES, i + 5)}`,
      rating: Math.round(rand(3.5, 5)),
      comment: pick(REVIEW_COMMENTS, i),
      date: new Date(Date.now() - i * 86400000 * 11).toISOString().slice(0, 10),
    });
  }
  return reviews;
}

async function seed() {
  console.log("Connecting to", MONGODB_URI);
  await mongoose.connect(MONGODB_URI);
  console.log("Connected. Clearing existing doctors...");
  await Doctor.deleteMany({});

  const docs = [];
  let n = 0;

  for (const city of CITIES) {
    for (let i = 0; i < PER_CITY; i++) {
      // Offset the last-name index per-doctor so first/last pairings vary widely.
      const first = pick(FIRST_NAMES, n);
      const last = pick(LAST_NAMES, n * 3 + i);
      const speciality = pick(SPECIALITIES, n + i).name;
      const name = `Dr. ${first} ${last}`;
      const baseSlug = slugify(`${first}-${last}-${city.slug}`);
      const slug = `${baseSlug}-${n}`;

      const reviewCount = Math.floor(rand(12, 320));
      const rating = Math.round(rand(3.6, 5) * 10) / 10;
      const experience = Math.floor(rand(4, 32));
      // Spread across all fee tiers: every 8th doctor is a free Govt/OPD clinic,
      // the rest range from low to high.
      const fee =
        n % 8 === 0 ? 0 : Math.round(rand(150, 1400) / 50) * 50;

      const neighbourhoods = getNeighbourhoods(city.slug);
      const neighbourhood = pick(neighbourhoods, n);
      const clinicName = `${last} ${pick(CLINIC_SUFFIX, n)}`;
      const lat = city.lat + rand(-0.06, 0.06);
      const lng = city.lng + rand(-0.06, 0.06);

      docs.push({
        name,
        slug,
        photo: "",
        qualifications: pick(QUALIFICATIONS[speciality], n),
        speciality,
        experience_years: experience,
        consultation_fee: fee,
        clinic: {
          name: clinicName,
          address: `${Math.floor(rand(1, 200))}, ${pick(
            ["MG Road", "Sector 12", "Park Street", "Linking Road", "Anna Salai", "Banjara Hills", "FC Road", "Salt Lake"],
            n
          )}, ${city.label}`,
          city: city.slug,
          neighbourhood,
          lat,
          lng,
          timings: pick(
            ["Mon-Sat: 9:00 AM - 7:00 PM", "Mon-Fri: 10:00 AM - 6:00 PM", "Mon-Sun: 9:00 AM - 9:00 PM"],
            n
          ),
        },
        rating,
        review_count: reviewCount,
        available_online: n % 2 === 0,
        is_open_now: n % 3 !== 0,
        patient_count: Math.floor(rand(10, 500)),
        tags: [pick(TAG_POOL, n), pick(TAG_POOL, n + 4)],
        about: `${name} is a ${speciality} specialist with ${experience} years of experience based in ${city.label}. Known for a patient-first approach, ${first} focuses on accurate diagnosis and clear communication.`,
        reviews: makeReviews(3),
        upvotes: 0,
        downvotes: 0,
        status: "approved",
      });
      n++;
    }
  }

  await Doctor.insertMany(docs);
  console.log(`Seeded ${docs.length} doctors across ${CITIES.length} cities.`);

  // --- Events: 10 per city ---
  console.log("Clearing existing events...");
  await Event.deleteMany({});
  const eventTypeKeys = Object.keys(EVENT_TYPES);
  const EVENT_TITLES: Record<string, string> = {
    camp: "Free Health Check-up Camp",
    donation: "Blood Donation Drive",
    "free-opd": "Free OPD Day",
    vaccination: "Vaccination Drive",
    awareness: "Health Awareness Session",
  };
  const events = [];
  let e = 0;
  for (const city of CITIES) {
    const hoods = getNeighbourhoods(city.slug);
    for (let i = 0; i < 10; i++) {
      const type = pick(eventTypeKeys, e) as keyof typeof EVENT_TITLES;
      const daysAhead = 2 + i * 3;
      const date = new Date(Date.now() + daysAhead * 86400000)
        .toISOString()
        .slice(0, 10);
      const isFree = type !== "donation" ? true : i % 2 === 0;
      events.push({
        title: `${EVENT_TITLES[type]} — ${pick(hoods, i)}`,
        city: city.slug,
        neighbourhood: pick(hoods, i),
        date,
        type,
        isFree,
        registrationLink: "https://example.com/register",
        description: `Organised in ${pick(hoods, i)}, ${city.label}. Open to all residents. ${
          isFree ? "Entry is free." : "Nominal registration applies."
        }`,
      });
      e++;
    }
  }
  await Event.insertMany(events);
  console.log(`Seeded ${events.length} events across ${CITIES.length} cities.`);

  await mongoose.disconnect();
  console.log("Done.");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
