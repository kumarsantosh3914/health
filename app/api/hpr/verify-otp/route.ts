import { NextRequest, NextResponse } from "next/server";
import { verifyMobileOtp } from "@/lib/hpr";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { txnId, otp, hprId } = await req.json();
    const result = await verifyMobileOtp(
      String(txnId ?? ""),
      String(otp ?? ""),
      String(hprId ?? "")
    );
    if (!result.ok || !result.verified) {
      return NextResponse.json(
        { error: result.error ?? "Verification failed" },
        { status: 400 }
      );
    }
    return NextResponse.json({
      ok: true,
      verified: true,
      demo: result.demo,
      professional: result.professional,
    });
  } catch {
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
