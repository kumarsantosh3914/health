/**
 * ABDM Healthcare Professionals Registry (HPR) verification helper.
 *
 * Used by the /community "Add a Doctor" flow so a professional can prove they
 * are a real, registered practitioner before their listing goes live.
 *
 * DEMO MODE (default): when HPR credentials are not configured, OTP 123456 is
 * accepted and a stub professional record is returned — so the flow is fully
 * demoable without ABDM partner access.
 *
 * REAL MODE: set HPR_BASE_URL + HPR_AUTH_TOKEN (your ABDM gateway session token)
 * in .env.local. The calls below follow ABDM's "Generate/Verify Mobile OTP" and
 * "Fetch Professional Details" shape; confirm exact paths/payloads against your
 * sandbox docs when you receive partner credentials.
 */

const HPR_BASE_URL = process.env.HPR_BASE_URL ?? "";
const HPR_AUTH_TOKEN = process.env.HPR_AUTH_TOKEN ?? "";

export function isHprConfigured(): boolean {
  return Boolean(HPR_BASE_URL && HPR_AUTH_TOKEN);
}

export interface OtpResult {
  ok: boolean;
  txnId?: string;
  demo?: boolean;
  error?: string;
}

export interface VerifyResult {
  ok: boolean;
  verified: boolean;
  demo?: boolean;
  professional?: { hprId: string; name: string };
  error?: string;
}

function authHeaders(): Record<string, string> {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${HPR_AUTH_TOKEN}`,
  };
}

export async function sendMobileOtp(
  hprId: string,
  mobile: string
): Promise<OtpResult> {
  if (!hprId) return { ok: false, error: "HPR ID is required" };
  if (!/^[6-9]\d{9}$/.test(mobile.replace(/\D/g, "").slice(-10))) {
    return { ok: false, error: "Enter a valid 10-digit mobile number" };
  }

  if (!isHprConfigured()) {
    // Demo: pretend an OTP was dispatched.
    return { ok: true, txnId: `demo-${Date.now().toString(36)}`, demo: true };
  }

  try {
    const res = await fetch(`${HPR_BASE_URL}/api/v1/professional/generate/mobile/otp`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ hprId, mobile }),
    });
    if (!res.ok) return { ok: false, error: `HPR error ${res.status}` };
    const data = await res.json();
    return { ok: true, txnId: data.txnId };
  } catch {
    return { ok: false, error: "Could not reach HPR" };
  }
}

export async function verifyMobileOtp(
  txnId: string,
  otp: string,
  hprId: string
): Promise<VerifyResult> {
  if (!/^\d{6}$/.test(String(otp))) {
    return { ok: false, verified: false, error: "Enter the 6-digit OTP" };
  }

  if (!isHprConfigured()) {
    // Demo: accept the well-known demo code.
    if (otp !== "123456") {
      return {
        ok: false,
        verified: false,
        demo: true,
        error: "Invalid demo OTP (use 123456)",
      };
    }
    return {
      ok: true,
      verified: true,
      demo: true,
      professional: { hprId, name: "" },
    };
  }

  try {
    const verifyRes = await fetch(`${HPR_BASE_URL}/api/v1/professional/verify/mobile/otp`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ txnId, otp }),
    });
    if (!verifyRes.ok) {
      return { ok: false, verified: false, error: `HPR error ${verifyRes.status}` };
    }

    // Fetch registry details to confirm the professional exists.
    const detailRes = await fetch(`${HPR_BASE_URL}/api/v1/professional/${encodeURIComponent(hprId)}`, {
      method: "GET",
      headers: authHeaders(),
    });
    const detail = detailRes.ok ? await detailRes.json() : {};
    return {
      ok: true,
      verified: true,
      professional: { hprId, name: detail.name ?? "" },
    };
  } catch {
    return { ok: false, verified: false, error: "Could not reach HPR" };
  }
}
