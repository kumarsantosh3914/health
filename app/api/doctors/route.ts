import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Doctor from "@/lib/models/Doctor";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);

    const city = searchParams.get("city");
    const speciality = searchParams.get("speciality");
    const rating = searchParams.get("rating");
    const online = searchParams.get("online");
    const openNow = searchParams.get("openNow");
    const q = searchParams.get("q");

    const query: Record<string, unknown> = { status: "approved" };
    if (city) query["clinic.city"] = city.toLowerCase();
    if (speciality) query.speciality = speciality;
    if (rating) query.rating = { $gte: Number(rating) };
    if (online === "true") query.available_online = true;
    if (openNow === "true") query.is_open_now = true;
    if (q) {
      const re = new RegExp(q, "i");
      query.$or = [
        { name: re },
        { speciality: re },
        { "clinic.name": re },
        { tags: re },
      ];
    }

    const doctors = await Doctor.find(query).sort({ rating: -1 }).lean();
    return NextResponse.json({ doctors, count: doctors.length });
  } catch (err) {
    console.error("GET /api/doctors error:", err);
    return NextResponse.json(
      { error: "Failed to fetch doctors", doctors: [] },
      { status: 500 }
    );
  }
}
