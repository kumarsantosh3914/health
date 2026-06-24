import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCity, EVENT_TYPES } from "@/lib/constants";
import { getEventsByCity } from "@/lib/data";
import CityTabs from "@/components/CityTabs";
import NewsletterSection from "@/components/NewsletterSection";

export const dynamic = "force-dynamic";

interface PageProps {
  params: { city: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const city = getCity(params.city);
  if (!city) return { title: "City not found" };
  return {
    title: `Health Events in ${city.label}`,
    description: `Free health camps, blood donation drives, vaccination camps and OPD days in ${city.label}.`,
  };
}

function formatDate(d: string): string {
  return new Date(d).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export default async function EventsPage({ params }: PageProps) {
  const city = getCity(params.city);
  if (!city) notFound();
  const events = await getEventsByCity(city.slug);

  return (
    <>
      <CityTabs city={city.slug} cityLabel={city.label} />
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
          Health Events in {city.label}
        </h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          {events.length} upcoming camps, drives and free OPD days.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {events.map((ev) => {
            const meta = EVENT_TYPES[ev.type];
            return (
              <div
                key={ev._id}
                className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="flex items-center justify-between">
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold"
                    style={{ backgroundColor: `${meta.color}1a`, color: meta.color }}
                  >
                    {meta.icon} {meta.label}
                  </span>
                  {ev.isFree && (
                    <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-bold text-accent-700 dark:text-accent-300">
                      FREE
                    </span>
                  )}
                </div>
                <h3 className="mt-3 font-bold text-gray-900 dark:text-white">
                  {ev.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  📅 {formatDate(ev.date)} · 📍 {ev.neighbourhood}
                </p>
                {ev.description && (
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    {ev.description}
                  </p>
                )}
                <a
                  href={ev.registrationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-primary-600"
                >
                  Register →
                </a>
              </div>
            );
          })}
        </div>

        {events.length === 0 && (
          <div className="mt-6 rounded-2xl border border-dashed border-gray-300 py-16 text-center text-gray-400 dark:border-gray-700">
            No events listed yet for {city.label}.
          </div>
        )}
      </div>
      <NewsletterSection city={city.slug} />
    </>
  );
}
