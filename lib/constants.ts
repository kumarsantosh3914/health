export interface City {
  slug: string;
  label: string;
  lat: number;
  lng: number;
  zoom: number;
  tagline: string;
}

export const CITIES: City[] = [
  { slug: "delhi", label: "Delhi", lat: 28.6139, lng: 77.209, zoom: 11, tagline: "The heart of India's healthcare" },
  { slug: "mumbai", label: "Mumbai", lat: 19.076, lng: 72.8777, zoom: 11, tagline: "Care that never sleeps" },
  { slug: "bangalore", label: "Bangalore", lat: 12.9716, lng: 77.5946, zoom: 11, tagline: "Smart care in the Silicon City" },
  { slug: "chennai", label: "Chennai", lat: 13.0827, lng: 80.2707, zoom: 11, tagline: "Trusted medicine by the coast" },
  { slug: "hyderabad", label: "Hyderabad", lat: 17.385, lng: 78.4867, zoom: 11, tagline: "World-class care in the City of Pearls" },
  { slug: "pune", label: "Pune", lat: 18.5204, lng: 73.8567, zoom: 11, tagline: "Healthier living, the Pune way" },
  { slug: "kolkata", label: "Kolkata", lat: 22.5726, lng: 88.3639, zoom: 11, tagline: "Compassionate care in the City of Joy" },
];

export const CITY_SLUGS = CITIES.map((c) => c.slug);

export function getCity(slug: string): City | undefined {
  return CITIES.find((c) => c.slug === slug.toLowerCase());
}

export interface Speciality {
  name: string;
  color: string;
  icon: string;
}

// Color-coded specialities — used for map markers and badges.
export const SPECIALITIES: Speciality[] = [
  { name: "Cardiology", color: "#ef4444", icon: "❤️" },
  { name: "Orthopaedics", color: "#f59e0b", icon: "🦴" },
  { name: "Dermatology", color: "#ec4899", icon: "✨" },
  { name: "Paediatrics", color: "#8b5cf6", icon: "🧸" },
  { name: "Gynaecology", color: "#d946ef", icon: "🌸" },
  { name: "Neurology", color: "#6366f1", icon: "🧠" },
  { name: "General Physician", color: "#0EA5E9", icon: "🩺" },
  { name: "Dentistry", color: "#14b8a6", icon: "🦷" },
  { name: "ENT", color: "#f97316", icon: "👂" },
  { name: "Ophthalmology", color: "#10B981", icon: "👁️" },
];

export const SPECIALITY_NAMES = SPECIALITIES.map((s) => s.name);

export function getSpecialityColor(name: string): string {
  return SPECIALITIES.find((s) => s.name === name)?.color ?? "#0EA5E9";
}

export function getSpecialityIcon(name: string): string {
  return SPECIALITIES.find((s) => s.name === name)?.icon ?? "🩺";
}

const SPECIALITY_PLURAL: Record<string, string> = {
  Cardiology: "cardiologists",
  Orthopaedics: "orthopaedic surgeons",
  Dermatology: "dermatologists",
  Paediatrics: "paediatricians",
  Gynaecology: "gynaecologists",
  Neurology: "neurologists",
  "General Physician": "general physicians",
  Dentistry: "dentists",
  ENT: "ENT specialists",
  Ophthalmology: "ophthalmologists",
};

export function getSpecialityPlural(name: string): string {
  return SPECIALITY_PLURAL[name] ?? "doctors";
}

export const TIME_SLOTS = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "12:00 PM",
  "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM",
  "06:00 PM", "06:30 PM", "07:00 PM",
];

// Fee tiers — auto-calculated from consultation_fee.
export type FeeTier = "free" | "low" | "mid" | "high";

export interface FeeTierMeta {
  tier: FeeTier;
  label: string;
  sub: string;
  color: string; // text/border color
  bg: string; // background tint
}

export function getFeeTier(fee: number): FeeTierMeta {
  if (fee <= 0)
    return { tier: "free", label: "Free", sub: "Govt / CGHS / Free OPD", color: "#059669", bg: "#10B98122" };
  if (fee < 300)
    return { tier: "low", label: "₹", sub: "Under ₹300", color: "#0284c7", bg: "#0EA5E922" };
  if (fee <= 700)
    return { tier: "mid", label: "₹₹", sub: "₹300–₹700", color: "#b45309", bg: "#f59e0b22" };
  return { tier: "high", label: "₹₹₹", sub: "₹700+", color: "#c2410c", bg: "#f9731622" };
}

// Event types with display metadata.
export const EVENT_TYPES: Record<
  string,
  { label: string; icon: string; color: string }
> = {
  camp: { label: "Health Camp", icon: "⛺", color: "#0EA5E9" },
  donation: { label: "Blood / Organ Donation", icon: "🩸", color: "#ef4444" },
  "free-opd": { label: "Free OPD", icon: "🏥", color: "#10B981" },
  vaccination: { label: "Vaccination Drive", icon: "💉", color: "#8b5cf6" },
  awareness: { label: "Awareness", icon: "📢", color: "#f59e0b" },
};

// Representative neighbourhoods per city (used for seeds + submissions).
export const NEIGHBOURHOODS: Record<string, string[]> = {
  delhi: ["Connaught Place", "Saket", "Dwarka", "Rohini", "Lajpat Nagar", "Vasant Kunj"],
  mumbai: ["Andheri", "Bandra", "Dadar", "Powai", "Borivali", "Colaba"],
  bangalore: ["Indiranagar", "Koramangala", "Whitefield", "Jayanagar", "HSR Layout", "Malleshwaram"],
  chennai: ["T. Nagar", "Adyar", "Anna Nagar", "Velachery", "Mylapore", "Nungambakkam"],
  hyderabad: ["Banjara Hills", "Jubilee Hills", "Gachibowli", "Madhapur", "Kukatpally", "Secunderabad"],
  pune: ["Kothrud", "Viman Nagar", "Hinjewadi", "Baner", "Aundh", "Camp"],
  kolkata: ["Salt Lake", "Park Street", "Ballygunge", "New Town", "Howrah", "Behala"],
};

export function getNeighbourhoods(citySlug: string): string[] {
  return NEIGHBOURHOODS[citySlug] ?? [];
}

export const SITE_NAME = "India Health Arena";
export const SITE_TAGLINE = "Find the right doctor, right now. Zero friction.";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
export const MADE_BY = "Arpit Rautela";
