import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCity } from "@/lib/constants";
import { getDoctorsByCity } from "@/lib/data";
import CityExplorer from "@/components/CityExplorer";

export const dynamic = "force-dynamic";

interface PageProps {
  params: { city: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const city = getCity(params.city);
  if (!city) return { title: "City not found" };
  const title = `Doctors in ${city.label}`;
  const description = `Find and book trusted doctors, clinics and hospitals in ${city.label}. ${city.tagline}. No sign-in, free forever.`;
  const ogImage = `/api/og?city=${city.slug}`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [ogImage] },
    alternates: { canonical: `/${city.slug}` },
  };
}

export default async function CityPage({ params }: PageProps) {
  const city = getCity(params.city);
  if (!city) notFound();
  const doctors = await getDoctorsByCity(city.slug);
  return <CityExplorer city={city} doctors={doctors} initialView="list" />;
}
