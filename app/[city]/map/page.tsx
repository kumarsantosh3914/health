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
  return {
    title: `Doctors in ${city.label} — Map`,
    description: `Explore doctors and clinics in ${city.label} on an interactive map.`,
  };
}

export default async function CityMapPage({ params }: PageProps) {
  const city = getCity(params.city);
  if (!city) notFound();
  const doctors = await getDoctorsByCity(city.slug);
  return <CityExplorer city={city} doctors={doctors} initialView="map" />;
}
