export interface Review {
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Clinic {
  name: string;
  address: string;
  city: string;
  neighbourhood?: string;
  lat: number;
  lng: number;
  timings: string;
}

export type DoctorStatus = "approved" | "pending" | "rejected";

export interface Doctor {
  _id?: string;
  name: string;
  slug: string;
  photo: string;
  qualifications: string;
  speciality: string;
  experience_years: number;
  consultation_fee: number;
  clinic: Clinic;
  rating: number;
  review_count: number;
  available_online: boolean;
  is_open_now: boolean;
  patient_count: number;
  fee_listed: boolean;
  tags: string[];
  about: string;
  reviews: Review[];
  source: "seed" | "google_places" | "community";
  upvotes: number;
  downvotes: number;
  status: DoctorStatus;
  submitted_by?: string;
  hpr_id?: string;
  hpr_verified?: boolean;
}

export interface HealthEvent {
  _id?: string;
  title: string;
  city: string;
  neighbourhood: string;
  date: string;
  type: "camp" | "donation" | "free-opd" | "vaccination" | "awareness";
  isFree: boolean;
  registrationLink: string;
  description?: string;
}

export interface Appointment {
  _id?: string;
  bookingId: string;
  doctorSlug: string;
  doctorName: string;
  patientName: string;
  phone: string;
  date: string;
  timeSlot: string;
  consultationType: "in-person" | "online";
  status: "confirmed" | "cancelled";
  createdAt?: string;
}

export interface CityStats {
  slug: string;
  label: string;
  lat: number;
  lng: number;
  doctorCount: number;
  specialities: number;
  tagline: string;
}
