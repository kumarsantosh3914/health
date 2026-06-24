import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Doctor from "@/lib/models/Doctor";
import { getCity } from "@/lib/constants";

export const dynamic = "force-dynamic";

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// GET — list pending (community-submitted) doctors for the /pending voting page.
export async function GET() {
  try {
    await dbConnect();
    const doctors = await Doctor.find({ status: "pending" })
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json({ doctors });
  } catch (err) {
    console.error("GET /api/community error:", err);
    return NextResponse.json({ doctors: [] }, { status: 500 });
  }
}

// POST — submit a new doctor (goes to the pending queue).
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const {
      name,
      clinicName,
      city,
      neighbourhood,
      speciality,
      phone,
      fee,
      timings,
      hprId,
      hprVerified,
    } = body;

    if (!name || !clinicName || !city || !speciality) {
      return NextResponse.json(
        { error: "Name, clinic, city and speciality are required." },
        { status: 400 }
      );
    }

    const cityMeta = getCity(city);
    if (!cityMeta) {
      return NextResponse.json({ error: "Unknown city." }, { status: 400 });
    }

    const baseSlug = slugify(`${name}-${city}`);
    const slug = `${baseSlug}-${Date.now().toString(36)}`;

    // HPR-verified professionals are trusted → go live immediately.
    // Unverified submissions enter the community voting queue.
    const verified = hprVerified === true && Boolean(hprId);
    const feeNum = Number(fee);
    const hasFee = !Number.isNaN(feeNum) && fee !== "" && fee != null;

    const doctor = await Doctor.create({
      name: name.startsWith("Dr") ? name : `Dr. ${name}`,
      slug,
      photo: "",
      qualifications: verified ? "Verified via ABDM HPR" : "Community submitted",
      speciality,
      experience_years: 0,
      consultation_fee: hasFee ? feeNum : 0,
      fee_listed: hasFee,
      clinic: {
        name: clinicName,
        address: neighbourhood ? `${neighbourhood}, ${cityMeta.label}` : cityMeta.label,
        city: cityMeta.slug,
        neighbourhood: neighbourhood ?? "",
        lat: cityMeta.lat,
        lng: cityMeta.lng,
        timings: timings || "Not specified",
      },
      rating: 0,
      review_count: 0,
      available_online: false,
      is_open_now: true,
      patient_count: 0,
      tags: verified ? ["HPR Verified"] : ["Community submitted"],
      about: verified
        ? `${name} is a verified healthcare professional (ABDM HPR).`
        : `${name} was submitted by the India Health Arena community and is pending verification.`,
      reviews: [],
      source: "community",
      upvotes: 0,
      downvotes: 0,
      status: verified ? "approved" : "pending",
      submitted_by: phone ?? "",
      hpr_id: verified ? hprId : "",
      hpr_verified: verified,
    });

    return NextResponse.json(
      { doctor, autoApproved: verified },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/community error:", err);
    return NextResponse.json(
      { error: "Failed to submit doctor." },
      { status: 500 }
    );
  }
}
