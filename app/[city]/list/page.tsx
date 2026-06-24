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
    title: `Doctors in ${city.label} — List`,
    description: `Browse the full list of doctors and clinics in ${city.label}.`,
  };
}

export default async function CityListPage({ params }: PageProps) {
  const city = getCity(params.city);
  if (!city) notFound();
  const doctors = await getDoctorsByCity(city.slug);
  return <CityExplorer city={city} doctors={doctors} initialView="list" />;
}
