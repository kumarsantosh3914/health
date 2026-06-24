import Link from "next/link";
import type { Doctor } from "@/lib/types";
import { getSpecialityColor } from "@/lib/constants";
import RatingStars from "./RatingStars";
import SpecialityBadge from "./SpecialityBadge";
import FeeBadge from "./FeeBadge";

function initials(name: string): string {
  return name
    .replace(/^Dr\.?\s*/i, "")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

interface Props {
  doctor: Doctor;
  onBook?: (doctor: Doctor) => void;
}

export default function DoctorCard({ doctor, onBook }: Props) {
  const color = getSpecialityColor(doctor.speciality);

  return (
    <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-start gap-4">
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white"
          style={{ backgroundColor: color }}
        >
          {initials(doctor.name)}
        </div>
        <div className="min-w-0 flex-1">
          <Link
            href={`/${doctor.clinic.city}/doctor/${doctor.slug}`}
            className="block truncate font-bold text-gray-900 hover:text-primary dark:text-white"
          >
            {doctor.name}
          </Link>
          <p className="truncate text-xs text-gray-500 dark:text-gray-400">
            {doctor.qualifications}
          </p>
          <div className="mt-1">
            <SpecialityBadge speciality={doctor.speciality} />
          </div>
        </div>
      </div>

      <div className="mt-3 space-y-1 text-sm text-gray-600 dark:text-gray-300">
        <p className="truncate">🏥 {doctor.clinic.name}</p>
        <p className="truncate text-gray-500 dark:text-gray-400">
          📍 {doctor.clinic.address}
        </p>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <RatingStars rating={doctor.rating} count={doctor.review_count} />
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
          👥 {doctor.patient_count} patients
        </span>
      </div>

      <div className="mt-2 flex items-center gap-2">
        <FeeBadge fee={doctor.consultation_fee} feeListed={doctor.fee_listed} />
        {doctor.available_online && (
          <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent-700 dark:text-accent-300">
            Online
          </span>
        )}
        {doctor.hpr_verified && (
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
            ✓ HPR
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-800">
        <div className="text-sm">
          <span className="text-gray-400">Exp</span>{" "}
          <span className="font-semibold text-gray-700 dark:text-gray-200">
            {doctor.experience_years} yrs
          </span>
        </div>
        {onBook ? (
          <button
            onClick={() => onBook(doctor)}
            className="rounded-lg bg-primary px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-primary-600"
          >
            Book
          </button>
        ) : (
          <Link
            href={`/${doctor.clinic.city}/doctor/${doctor.slug}`}
            className="rounded-lg bg-primary px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-primary-600"
          >
            Book
          </Link>
        )}
      </div>
    </div>
  );
}
