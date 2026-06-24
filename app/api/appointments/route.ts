import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Appointment from "@/lib/models/Appointment";

export const dynamic = "force-dynamic";

function generateBookingId(): string {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let id = "";
  for (let i = 0; i < 6; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return `IHA-${id}`;
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const {
      doctorSlug,
      doctorName,
      patientName,
      phone,
      date,
      timeSlot,
      consultationType,
    } = body;

    if (!doctorSlug || !patientName || !phone || !date || !timeSlot) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!/^[6-9]\d{9}$/.test(String(phone).replace(/\D/g, "").slice(-10))) {
      return NextResponse.json(
        { error: "Please enter a valid 10-digit Indian mobile number" },
        { status: 400 }
      );
    }

    const bookingId = generateBookingId();
    const appointment = await Appointment.create({
      bookingId,
      doctorSlug,
      doctorName: doctorName ?? "",
      patientName,
      phone,
      date,
      timeSlot,
      consultationType: consultationType === "online" ? "online" : "in-person",
      status: "confirmed",
    });

    return NextResponse.json({ appointment }, { status: 201 });
  } catch (err) {
    console.error("POST /api/appointments error:", err);
    return NextResponse.json(
      { error: "Failed to create appointment" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await dbConnect();
    const appointments = await Appointment.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    return NextResponse.json({ appointments });
  } catch (err) {
    console.error("GET /api/appointments error:", err);
    return NextResponse.json({ appointments: [] }, { status: 500 });
  }
}
