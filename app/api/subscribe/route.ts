import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Subscriber from "@/lib/models/Subscriber";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { email, city } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
      return NextResponse.json(
        { error: "Please enter a valid email." },
        { status: 400 }
      );
    }

    const normalized = String(email).toLowerCase().trim();
    const existing = await Subscriber.findOne({ email: normalized });
    if (existing) {
      return NextResponse.json({
        ok: true,
        message: "You're already on the list! 💌",
      });
    }

    await Subscriber.create({ email: normalized, city: city ?? "" });
    return NextResponse.json(
      { ok: true, message: "Subscribed to The Health Pulse! 🎉" },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/subscribe error:", err);
    return NextResponse.json(
      { error: "Subscription failed. Please try again." },
      { status: 500 }
    );
  }
}
