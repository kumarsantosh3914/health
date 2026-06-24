/**
 * Google Places (New) → Doctor importer.
 *
 * Pulls REAL clinics/doctors per city + speciality from the Places API (New)
 * Text Search endpoint and maps them into the existing Doctor schema.
 *
 * Usage:
 *   1. Get a key from Google Cloud (enable "Places API (New)")
 *   2. Add GOOGLE_MAPS_API_KEY=... to .env.local
 *   3. npm run import:places            # all cities
 *      npm run import:places -- delhi   # one city
 *
 * Notes / honest limitations:
 *   - Places has NO consultation-fee data → we set fee_listed=false (UI shows
 *     "Fee on request") and consultation_fee=0.
 *   - "name" is the listing's business name (often the clinic, sometimes the
 *     doctor). Speciality is taken from the search query.
 *   - patient_count is approximated from Google's userRatingCount.
 *   - Imported docs are tagged source="google_places" and status="approved".
 *   - Respect Google's Places API Policies: cache duration limits, attribution,
 *     and do not store fields beyond what the policy allows.
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import mongoose from "mongoose";
import Doctor from "../lib/models/Doctor";
import { CITIES, SPECIALITIES, getCity } from "../lib/constants";

const MONGODB_URI =
  process.env.MONGODB_URI ?? "mongodb://localhost:27017/india-health-arena";
const API_KEY = process.env.GOOGLE_MAPS_API_KEY ?? "";

const PLACES_URL = "https://places.googleapis.com/v1/places:searchText";
const FIELD_MASK = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.location",
  "places.rating",
  "places.userRatingCount",
  "places.googleMapsUri",
  "places.currentOpeningHours.openNow",
  "places.nationalPhoneNumber",
].join(",");

interface PlaceResult {
  id: string;
  displayName?: { text: string };
  formattedAddress?: string;
  location?: { latitude: number; longitude: number };
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  currentOpeningHours?: { openNow?: boolean };
  nationalPhoneNumber?: string;
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

async function searchPlaces(
  query: string,
  lat: number,
  lng: number
): Promise<PlaceResult[]> {
  const res = await fetch(PLACES_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": API_KEY,
      "X-Goog-FieldMask": FIELD_MASK,
    },
    body: JSON.stringify({
      textQuery: query,
      includedType: "doctor",
      maxResultCount: 20,
      locationBias: {
        circle: { center: { latitude: lat, longitude: lng }, radius: 15000 },
      },
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Places API ${res.status}: ${body.slice(0, 300)}`);
  }
  const data = await res.json();
  return data.places ?? [];
}

async function run() {
  if (!API_KEY) {
    console.error(
      "\n✗ GOOGLE_MAPS_API_KEY is not set.\n" +
        "  1. Enable 'Places API (New)' in Google Cloud Console\n" +
        "  2. Add GOOGLE_MAPS_API_KEY=... to .env.local\n" +
        "  3. Re-run: npm run import:places\n"
    );
    process.exit(1);
  }

  const cityArg = process.argv[2];
  const cities = cityArg
    ? [getCity(cityArg)].filter(Boolean)
    : CITIES;
  if (cities.length === 0) {
    console.error(`Unknown city: ${cityArg}`);
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI);
  console.log("Connected. Removing previous Google Places imports…");
  await Doctor.deleteMany({ source: "google_places" });

  let total = 0;
  const seenIds = new Set<string>();

  for (const city of cities) {
    if (!city) continue;
    console.log(`\n— ${city.label} —`);
    for (const spec of SPECIALITIES) {
      const query = `${spec.name} doctor in ${city.label}, India`;
      try {
        const places = await searchPlaces(query, city.lat, city.lng);
        const docs = [];
        for (const p of places) {
          if (!p.location || seenIds.has(p.id)) continue;
          seenIds.add(p.id);
          const name = p.displayName?.text ?? "Unknown";
          docs.push({
            name,
            slug: `${slugify(name)}-${city.slug}-${p.id.slice(-6)}`,
            photo: "",
            qualifications: "See clinic for details",
            speciality: spec.name,
            experience_years: 0,
            consultation_fee: 0,
            fee_listed: false,
            clinic: {
              name,
              address: p.formattedAddress ?? city.label,
              city: city.slug,
              neighbourhood: "",
              lat: p.location.latitude,
              lng: p.location.longitude,
              timings: "See Google for hours",
            },
            rating: p.rating ?? 0,
            review_count: p.userRatingCount ?? 0,
            available_online: false,
            is_open_now: p.currentOpeningHours?.openNow ?? true,
            patient_count: p.userRatingCount ?? 0,
            tags: ["Imported from Google", spec.name],
            about: `${name} — ${spec.name} listing in ${city.label}, sourced from Google Places. Verify details before visiting.`,
            reviews: [],
            source: "google_places",
            status: "approved",
            submitted_by: p.nationalPhoneNumber ?? "",
          });
        }
        if (docs.length) {
          await Doctor.insertMany(docs, { ordered: false }).catch(() => {});
          total += docs.length;
          console.log(`  ${spec.name}: +${docs.length}`);
        }
      } catch (err) {
        console.error(`  ${spec.name}: ${(err as Error).message}`);
      }
    }
  }

  console.log(`\n✓ Imported ${total} real listings from Google Places.`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error("Import failed:", err);
  process.exit(1);
});
