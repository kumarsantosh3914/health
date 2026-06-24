"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import type { Doctor } from "@/lib/types";
import type { City } from "@/lib/constants";
import { getSpecialityPlural, getFeeTier } from "@/lib/constants";
import { searchDoctors } from "@/lib/search";
import SearchBar from "./SearchBar";
import FilterBar, { Filters, EMPTY_FILTERS } from "./FilterBar";
import ViewToggle from "./ViewToggle";
import DoctorCard from "./DoctorCard";
import BookingModal from "./BookingModal";
import AskAIModal from "./AskAIModal";
import CityTabs from "./CityTabs";
import NewsletterSection from "./NewsletterSection";
import MapLegend from "./MapLegend";

// Leaflet needs `window`; load the map only on the client.
const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400 dark:bg-gray-900">
      Loading map…
    </div>
  ),
});

interface Props {
  city: City;
  doctors: Doctor[];
  initialView: "list" | "map";
}

export default function CityExplorer({ city, doctors, initialView }: Props) {
  const [view, setView] = useState<"list" | "map">(initialView);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [bookDoctor, setBookDoctor] = useState<Doctor | null>(null);
  const [askOpen, setAskOpen] = useState(false);

  const filtered = useMemo(() => {
    let result = doctors;
    if (filters.speciality)
      result = result.filter((d) => d.speciality === filters.speciality);
    if (filters.minRating)
      result = result.filter((d) => d.rating >= filters.minRating!);
    if (filters.openNow) result = result.filter((d) => d.is_open_now);
    if (filters.online) result = result.filter((d) => d.available_online);
    if (filters.feeTier)
      result = result.filter(
        (d) => getFeeTier(d.consultation_fee).tier === filters.feeTier
      );
    result = searchDoctors(result, query);
    return result;
  }, [doctors, filters, query]);

  const countLabel = useMemo(() => {
    const n = filtered.length.toLocaleString("en-IN");
    if (filters.speciality) {
      return `${n} ${getSpecialityPlural(filters.speciality)} in ${city.label}`;
    }
    return `${n} of ${doctors.length.toLocaleString("en-IN")} doctors`;
  }, [filtered.length, doctors.length, filters.speciality, city.label]);

  // Floating Ask AI pill (bottom-left), shared across both views.
  const askButton = (
    <button
      onClick={() => setAskOpen(true)}
      className="fixed bottom-5 left-5 z-[1000] flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-gray-800 shadow-xl ring-1 ring-gray-200 transition hover:shadow-2xl dark:bg-gray-800 dark:text-white dark:ring-gray-700"
    >
      <span className="text-base">💬</span> Ask AI
    </button>
  );

  return (
    <>
      <CityTabs city={city.slug} cityLabel={city.label} />

      {view === "map" ? (
        /* ---------- Immersive map view ---------- */
        <div className="relative h-[calc(100vh-104px)] w-full overflow-hidden">
          <MapView
            doctors={filtered}
            center={[city.lat, city.lng]}
            zoom={city.zoom}
            onBook={(d) => setBookDoctor(d)}
          />

          {/* Top-left: search + filters */}
          <div className="absolute left-3 top-3 z-[600] w-[330px] max-w-[calc(100%-1.5rem)] space-y-2">
            <div className="rounded-xl bg-white/95 p-1.5 shadow-lg ring-1 ring-gray-200 backdrop-blur dark:bg-gray-900/95 dark:ring-gray-700">
              <SearchBar
                value={query}
                onChange={setQuery}
                placeholder={`Search ${doctors.length} doctors in ${city.label}…`}
              />
            </div>
            <div className="rounded-xl bg-white/95 p-2.5 shadow-lg ring-1 ring-gray-200 backdrop-blur dark:bg-gray-900/95 dark:ring-gray-700">
              <FilterBar filters={filters} onChange={setFilters} compact />
            </div>
            <div className="inline-flex rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-gray-700 shadow-lg ring-1 ring-gray-200 backdrop-blur dark:bg-gray-900/95 dark:text-gray-200 dark:ring-gray-700">
              {countLabel}
            </div>
          </div>

          {/* Top-right: view toggle + legend */}
          <div className="absolute right-3 top-3 z-[600] flex flex-col items-end gap-2">
            <ViewToggle view={view} onChange={setView} />
            <MapLegend />
          </div>

          {askButton}
        </div>
      ) : (
        /* ---------- List view ---------- */
        <>
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                  Doctors in {city.label}
                </h1>
                <p className="text-gray-500 dark:text-gray-400">{city.tagline}</p>
              </div>
              <ViewToggle view={view} onChange={setView} />
            </div>

            <div className="space-y-4">
              <SearchBar value={query} onChange={setQuery} />
              <FilterBar filters={filters} onChange={setFilters} />
            </div>

            <div className="mb-4 mt-5 flex items-center justify-between">
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {countLabel}
              </p>
              <Link
                href="/community"
                className="text-sm font-semibold text-primary hover:underline"
              >
                + Add a Doctor
              </Link>
            </div>

            {filtered.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 py-16 text-center text-gray-400 dark:border-gray-700">
                No doctors match your filters. Try clearing them.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((d) => (
                  <DoctorCard
                    key={d.slug}
                    doctor={d}
                    onBook={(doc) => setBookDoctor(doc)}
                  />
                ))}
              </div>
            )}
          </div>

          <NewsletterSection city={city.slug} />
          {askButton}
        </>
      )}

      <BookingModal
        doctor={bookDoctor}
        open={!!bookDoctor}
        onClose={() => setBookDoctor(null)}
      />
      <AskAIModal
        open={askOpen}
        onClose={() => setAskOpen(false)}
        city={city.slug}
        cityLabel={city.label}
        doctors={filtered}
      />
    </>
  );
}
