import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Doctor from "@/lib/models/Doctor";
import { CITIES } from "@/lib/constants";
import type { CityStats } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await dbConnect();

    const agg = await Doctor.aggregate([
      {
        $group: {
          _id: "$clinic.city",
          doctorCount: { $sum: 1 },
          specialities: { $addToSet: "$speciality" },
        },
      },
    ]);

    const statsMap = new Map<string, { count: number; specs: number }>();
    for (const row of agg) {
      statsMap.set(row._id, {
        count: row.doctorCount,
        specs: row.specialities.length,
      });
    }

    const cities: CityStats[] = CITIES.map((c) => ({
      slug: c.slug,
      label: c.label,
      lat: c.lat,
      lng: c.lng,
      tagline: c.tagline,
      doctorCount: statsMap.get(c.slug)?.count ?? 0,
      specialities: statsMap.get(c.slug)?.specs ?? 0,
    }));

    return NextResponse.json({ cities });
  } catch (err) {
    console.error("GET /api/cities error:", err);
    // Graceful fallback so the landing page still renders without a DB.
    const cities: CityStats[] = CITIES.map((c) => ({
      slug: c.slug,
      label: c.label,
      lat: c.lat,
      lng: c.lng,
      tagline: c.tagline,
      doctorCount: 0,
      specialities: 0,
    }));
    return NextResponse.json({ cities });
  }
}
