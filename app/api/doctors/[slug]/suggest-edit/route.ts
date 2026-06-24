import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Suggestion from "@/lib/models/Suggestion";
import Doctor from "@/lib/models/Doctor";

export const dynamic = "force-dynamic";

// Note: the [slug] segment carries the doctor's Mongo _id here.
export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await dbConnect();
    const body = await req.json();
    const { changes, note } = body;

    if (!changes || typeof changes !== "object") {
      return NextResponse.json({ error: "No changes provided." }, { status: 400 });
    }

    // Best-effort link to the doctor's slug for admin context.
    const doctor = await Doctor.findById(params.slug).lean();

    const suggestion = await Suggestion.create({
      doctorId: params.slug,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      doctorSlug: (doctor as any)?.slug ?? "",
      changes,
      note: note ?? "",
      status: "open",
    });

    return NextResponse.json(
      { ok: true, suggestionId: suggestion._id },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/doctors/[slug]/suggest-edit error:", err);
    return NextResponse.json(
      { error: "Failed to submit suggestion." },
      { status: 500 }
    );
  }
}
