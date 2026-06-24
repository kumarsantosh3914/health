import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Doctor from "@/lib/models/Doctor";

export const dynamic = "force-dynamic";

const APPROVE_AT = 5; // upvotes
const REJECT_AT = 3; // downvotes

// Note: the [slug] segment carries the doctor's Mongo _id here.
export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await dbConnect();
    const { type } = await req.json();
    if (type !== "up" && type !== "down") {
      return NextResponse.json({ error: "Invalid vote type" }, { status: 400 });
    }

    const doctor = await Doctor.findById(params.slug);
    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    if (doctor.status !== "pending") {
      return NextResponse.json(
        { error: "This submission is already resolved.", doctor },
        { status: 409 }
      );
    }

    if (type === "up") doctor.upvotes += 1;
    else doctor.downvotes += 1;

    // Auto-moderation thresholds.
    if (doctor.upvotes >= APPROVE_AT) doctor.status = "approved";
    else if (doctor.downvotes >= REJECT_AT) doctor.status = "rejected";

    await doctor.save();

    return NextResponse.json({
      doctor: JSON.parse(JSON.stringify(doctor)),
      resolved: doctor.status !== "pending",
    });
  } catch (err) {
    console.error("POST /api/doctors/[slug]/vote error:", err);
    return NextResponse.json({ error: "Vote failed" }, { status: 500 });
  }
}
