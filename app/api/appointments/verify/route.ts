import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Mock OTP verification. No SMS is sent — any 6-digit code is accepted, and the
 * demo code 123456 always works. Swap this for Twilio Verify in production.
 */
export async function POST(req: NextRequest) {
  try {
    const { phone, code } = await req.json();

    if (!phone) {
      return NextResponse.json({ error: "Phone is required" }, { status: 400 });
    }

    if (!code || !/^\d{6}$/.test(String(code))) {
      return NextResponse.json(
        { error: "Enter the 6-digit code (hint: 123456)" },
        { status: 400 }
      );
    }

    return NextResponse.json({ ok: true, verified: true });
  } catch {
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
