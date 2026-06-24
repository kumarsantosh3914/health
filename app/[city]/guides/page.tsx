import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getCity } from "@/lib/constants";
import { getGuidesForCity } from "@/lib/guides";
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
    title: `Health Guides for ${city.label}`,
    description: `Practical guides to finding budget doctors, free hospitals and online consultations in ${city.label}.`,
  };
}

export default function GuidesPage({ params }: PageProps) {
  const city = getCity(params.city);
  if (!city) notFound();
  const guides = getGuidesForCity(city.slug);

  return (
    <>
      <CityTabs city={city.slug} cityLabel={city.label} />
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
          Health Guides for {city.label}
        </h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          Hand-written guides to getting the best, most affordable care in {city.label}.
        </p>

        <div className="mt-6 space-y-4">
          {guides.map((g) => (
            <Link
              key={g.slug}
              href={`/${city.slug}/guides/${g.slug}`}
              className="block rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="text-xs font-semibold uppercase tracking-wide text-primary">
                {g.frontmatter.readTime}
              </div>
              <h2 className="mt-1 text-lg font-bold text-gray-900 dark:text-white">
                {g.frontmatter.title}
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {g.frontmatter.description}
              </p>
              <span className="mt-2 inline-block text-sm font-semibold text-primary">
                Read guide →
              </span>
            </Link>
          ))}

          {guides.length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-300 py-16 text-center text-gray-400 dark:border-gray-700">
              No guides yet for {city.label}.
            </div>
          )}
        </div>
      </div>
      <NewsletterSection city={city.slug} />
    </>
  );
}
