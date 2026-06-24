import dbConnect from "./mongodb";
import Doctor from "./models/Doctor";
import Event from "./models/Event";
import { CITIES } from "./constants";
import type { Doctor as DoctorType, CityStats, HealthEvent } from "./types";

// Strip Mongo internals so data is safe to pass to client components.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function serialize<T>(doc: any): T {
  return JSON.parse(JSON.stringify(doc));
}

export async function getCityStats(): Promise<CityStats[]> {
  try {
    await dbConnect();
    const agg = await Doctor.aggregate([
      { $match: { status: "approved" } },
      {
        $group: {
          _id: "$clinic.city",
          doctorCount: { $sum: 1 },
          specialities: { $addToSet: "$speciality" },
        },
      },
    ]);
    const map = new Map<string, { count: number; specs: number }>();
    for (const r of agg) map.set(r._id, { count: r.doctorCount, specs: r.specialities.length });

    return CITIES.map((c) => ({
      slug: c.slug,
      label: c.label,
      lat: c.lat,
      lng: c.lng,
      tagline: c.tagline,
      doctorCount: map.get(c.slug)?.count ?? 0,
      specialities: map.get(c.slug)?.specs ?? 0,
    }));
  } catch (err) {
    console.error("getCityStats failed:", err);
    return CITIES.map((c) => ({
      slug: c.slug,
      label: c.label,
      lat: c.lat,
      lng: c.lng,
      tagline: c.tagline,
      doctorCount: 0,
      specialities: 0,
    }));
  }
}

export async function getDoctorsByCity(city: string): Promise<DoctorType[]> {
  try {
    await dbConnect();
    const docs = await Doctor.find({
      "clinic.city": city.toLowerCase(),
      status: "approved",
    })
      .sort({ rating: -1 })
      .lean();
    return serialize<DoctorType[]>(docs);
  } catch (err) {
    console.error("getDoctorsByCity failed:", err);
    return [];
  }
}

export async function getDoctorBySlug(slug: string): Promise<DoctorType | null> {
  try {
    await dbConnect();
    const doc = await Doctor.findOne({ slug }).lean();
    return doc ? serialize<DoctorType>(doc) : null;
  } catch (err) {
    console.error("getDoctorBySlug failed:", err);
    return null;
  }
}

export async function getAllDoctorSlugs(): Promise<
  { slug: string; city: string }[]
> {
  try {
    await dbConnect();
    const docs = await Doctor.find(
      { status: "approved" },
      { slug: 1, "clinic.city": 1 }
    ).lean();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return docs.map((d: any) => ({ slug: d.slug, city: d.clinic.city }));
  } catch {
    return [];
  }
}

export async function getEventsByCity(city: string): Promise<HealthEvent[]> {
  try {
    await dbConnect();
    const events = await Event.find({ city: city.toLowerCase() })
      .sort({ date: 1 })
      .lean();
    return serialize<HealthEvent[]>(events);
  } catch (err) {
    console.error("getEventsByCity failed:", err);
    return [];
  }
}

export async function getDoctorCountByCity(city: string): Promise<number> {
  try {
    await dbConnect();
    return Doctor.countDocuments({
      "clinic.city": city.toLowerCase(),
      status: "approved",
    });
  } catch {
    return 0;
  }
}
