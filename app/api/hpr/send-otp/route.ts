import { NextRequest, NextResponse } from "next/server";
import { sendMobileOtp } from "@/lib/hpr";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { hprId, mobile } = await req.json();
    const result = await sendMobileOtp(String(hprId ?? ""), String(mobile ?? ""));
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json({ ok: true, txnId: result.txnId, demo: result.demo });
  } catch {
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
