import Link from "next/link";
import type { CityStats } from "@/lib/types";

export default function CityCard({ city }: { city: CityStats }) {
  return (
    <Link
      href={`/${city.slug}`}
      className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900"
    >
      <div className="relative h-36 w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/cities/${city.slug}.svg`}
          alt={`${city.label} skyline`}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <h3 className="absolute bottom-2 left-3 text-xl font-extrabold text-white drop-shadow">
          {city.label}
        </h3>
      </div>
      <div className="flex items-center justify-between px-4 py-3">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {city.doctorCount > 0
            ? `${city.doctorCount} doctors · ${city.specialities} specialities`
            : city.tagline}
        </p>
        <span className="text-primary transition group-hover:translate-x-1">→</span>
      </div>
    </Link>
  );
}
