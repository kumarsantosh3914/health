import type { Doctor, CityStats, Appointment } from "./types";
import { SITE_URL } from "./constants";

function baseUrl() {
  // On the server we need an absolute URL; on the client relative is fine.
  if (typeof window === "undefined") return SITE_URL;
  return "";
}

export interface DoctorFilters {
  city?: string;
  speciality?: string;
  rating?: number;
  online?: boolean;
  openNow?: boolean;
  q?: string;
}

export async function fetchDoctors(filters: DoctorFilters): Promise<Doctor[]> {
  const params = new URLSearchParams();
  if (filters.city) params.set("city", filters.city);
  if (filters.speciality) params.set("speciality", filters.speciality);
  if (filters.rating) params.set("rating", String(filters.rating));
  if (filters.online) params.set("online", "true");
  if (filters.openNow) params.set("openNow", "true");
  if (filters.q) params.set("q", filters.q);

  const res = await fetch(`${baseUrl()}/api/doctors?${params.toString()}`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.doctors ?? [];
}

export async function fetchDoctor(slug: string): Promise<Doctor | null> {
  const res = await fetch(`${baseUrl()}/api/doctors/${slug}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.doctor ?? null;
}

export async function fetchCities(): Promise<CityStats[]> {
  const res = await fetch(`${baseUrl()}/api/cities`, { cache: "no-store" });
  if (!res.ok) return [];
  const data = await res.json();
  return data.cities ?? [];
}

export interface BookingPayload {
  doctorSlug: string;
  doctorName: string;
  patientName: string;
  phone: string;
  date: string;
  timeSlot: string;
  consultationType: "in-person" | "online";
}

export async function createAppointment(
  payload: BookingPayload
): Promise<{ ok: boolean; appointment?: Appointment; error?: string }> {
  const res = await fetch(`/api/appointments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) return { ok: false, error: data.error ?? "Booking failed" };
  return { ok: true, appointment: data.appointment };
}

export async function verifyOtp(
  phone: string,
  code: string
): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch(`/api/appointments/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, code }),
  });
  const data = await res.json();
  if (!res.ok) return { ok: false, error: data.error ?? "Verification failed" };
  return { ok: true };
}
