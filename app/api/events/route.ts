import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Event from "@/lib/models/Event";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city");
    const type = searchParams.get("type");

    const query: Record<string, unknown> = {};
    if (city) query.city = city.toLowerCase();
    if (type) query.type = type;

    const events = await Event.find(query).sort({ date: 1 }).lean();
    return NextResponse.json({ events, count: events.length });
  } catch (err) {
    console.error("GET /api/events error:", err);
    return NextResponse.json(
      { error: "Failed to fetch events", events: [] },
      { status: 500 }
    );
  }
}
