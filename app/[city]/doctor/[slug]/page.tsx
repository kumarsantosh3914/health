import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getCity, getSpecialityColor } from "@/lib/constants";
import { getDoctorBySlug } from "@/lib/data";
import RatingStars from "@/components/RatingStars";
import SpecialityBadge from "@/components/SpecialityBadge";
import FeeBadge from "@/components/FeeBadge";
import DoctorBooking from "@/components/DoctorBooking";
import SuggestEdit from "@/components/SuggestEdit";

export const dynamic = "force-dynamic";

interface PageProps {
  params: { city: string; slug: string };
}

function initials(name: string): string {
  return name
    .replace(/^Dr\.?\s*/i, "")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const doctor = await getDoctorBySlug(params.slug);
  if (!doctor) return { title: "Doctor not found" };
  const title = `${doctor.name} — ${doctor.speciality}`;
  const description = `${doctor.name}, ${doctor.qualifications}. ${doctor.speciality} at ${doctor.clinic.name}, ${doctor.clinic.address}. ${doctor.experience_years} yrs experience · ₹${doctor.consultation_fee}.`;
  return {
    title,
    description,
    openGraph: { title, description, type: "profile" },
  };
}

export default async function DoctorProfilePage({ params }: PageProps) {
  const city = getCity(params.city);
  const doctor = await getDoctorBySlug(params.slug);
  if (!city || !doctor) notFound();

  const color = getSpecialityColor(doctor.speciality);
  const bbox = `${doctor.clinic.lng - 0.01},${doctor.clinic.lat - 0.008},${
    doctor.clinic.lng + 0.01
  },${doctor.clinic.lat + 0.008}`;
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${doctor.clinic.lat},${doctor.clinic.lng}`;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <Link
        href={`/${city.slug}`}
        className="mb-6 inline-block text-sm text-gray-500 hover:text-primary dark:text-gray-400"
      >
        ← Back to {city.label}
      </Link>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Header card */}
          <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:flex-row sm:items-center">
            <div
              className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full text-2xl font-bold text-white"
              style={{ backgroundColor: color }}
            >
              {initials(doctor.name)}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
                {doctor.name}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {doctor.qualifications}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <SpecialityBadge speciality={doctor.speciality} />
                <RatingStars rating={doctor.rating} count={doctor.review_count} />
                <FeeBadge fee={doctor.consultation_fee} feeListed={doctor.fee_listed} />
                {doctor.hpr_verified && (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                    ✓ HPR Verified
                  </span>
                )}
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  👥 {doctor.patient_count} patients
                </span>
                {doctor.available_online && (
                  <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent-700 dark:text-accent-300">
                    Online consults
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* About */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h2 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">
              About
            </h2>
            <p className="text-gray-600 dark:text-gray-300">{doctor.about}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {doctor.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                >
                  {t}
                </span>
              ))}
            </div>
          </section>

          {/* Clinic + map */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h2 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">
              Clinic
            </h2>
            <p className="font-semibold text-gray-800 dark:text-gray-100">
              {doctor.clinic.name}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              📍 {doctor.clinic.address}
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              🕒 {doctor.clinic.timings}
            </p>
            <iframe
              title="Clinic location"
              className="mt-4 h-64 w-full rounded-xl border border-gray-200 dark:border-gray-800"
              src={mapSrc}
              loading="lazy"
            />
          </section>

          {/* Reviews */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
              Ratings &amp; Reviews ({doctor.review_count})
            </h2>
            <div className="space-y-4">
              {doctor.reviews.map((r, i) => (
                <div
                  key={i}
                  className="border-b border-gray-100 pb-4 last:border-0 dark:border-gray-800"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-800 dark:text-gray-100">
                      {r.author}
                    </span>
                    <RatingStars rating={r.rating} />
                  </div>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                    {r.comment}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">{r.date}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sticky booking sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-20 space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-baseline justify-between">
              <span className="text-gray-500 dark:text-gray-400">Consultation</span>
              <span className="text-2xl font-extrabold text-gray-900 dark:text-white">
                ₹{doctor.consultation_fee}
              </span>
            </div>
            <div className="flex items-baseline justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Experience</span>
              <span className="font-semibold text-gray-800 dark:text-gray-100">
                {doctor.experience_years} years
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Status</span>
              <span
                className={`font-semibold ${
                  doctor.is_open_now ? "text-accent" : "text-gray-400"
                }`}
              >
                {doctor.is_open_now ? "🟢 Open now" : "Closed"}
              </span>
            </div>
            <DoctorBooking doctor={doctor} />
            <p className="text-center text-xs text-gray-400">
              No account needed · Free to book
            </p>
            <div className="border-t border-gray-100 pt-3 text-center dark:border-gray-800">
              <SuggestEdit doctor={doctor} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
