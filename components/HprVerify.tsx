"use client";

import { useState } from "react";

interface Props {
  onVerified: (hprId: string) => void;
  onReset: () => void;
  verified: boolean;
}

type Step = "idle" | "otp" | "verified";

export default function HprVerify({ onVerified, onReset, verified }: Props) {
  const [step, setStep] = useState<Step>("idle");
  const [hprId, setHprId] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [txnId, setTxnId] = useState("");
  const [demo, setDemo] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendOtp() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/hpr/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hprId, mobile }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error ?? "Could not send OTP");
      else {
        setTxnId(data.txnId);
        setDemo(Boolean(data.demo));
        setStep("otp");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  async function verify() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/hpr/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ txnId, otp, hprId }),
      });
      const data = await res.json();
      if (!res.ok || !data.verified) setError(data.error ?? "Verification failed");
      else {
        setStep("verified");
        onVerified(hprId);
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setStep("idle");
    setOtp("");
    setTxnId("");
    setError("");
    onReset();
  }

  if (verified || step === "verified") {
    return (
      <div className="flex items-center justify-between rounded-xl border border-primary/30 bg-primary/5 px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
          ✓ Verified via ABDM HPR ({hprId})
          <span className="rounded-full bg-accent/15 px-2 py-0.5 text-xs text-accent-700 dark:text-accent-300">
            Auto-approved
          </span>
        </div>
        <button
          type="button"
          onClick={reset}
          className="text-xs text-gray-400 hover:text-gray-600"
        >
          Undo
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
      <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
        Are you this professional?{" "}
        <span className="font-normal text-gray-500 dark:text-gray-400">
          Verify with ABDM HPR to go live instantly (optional).
        </span>
      </p>

      {step === "idle" ? (
        <div className="mt-3 space-y-2">
          <input
            className="input"
            placeholder="HPR ID (e.g. username@hpr)"
            value={hprId}
            onChange={(e) => setHprId(e.target.value)}
          />
          <input
            className="input"
            placeholder="Registered mobile number"
            inputMode="numeric"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="button"
            onClick={sendOtp}
            disabled={loading || !hprId || !mobile}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-600 disabled:opacity-50"
          >
            {loading ? "Sending…" : "Send OTP"}
          </button>
        </div>
      ) : (
        <div className="mt-3 space-y-2">
          {demo && (
            <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
              Demo mode (no HPR credentials configured) — use OTP <strong>123456</strong>.
            </p>
          )}
          <input
            className="input tracking-[0.4em]"
            placeholder="••••••"
            inputMode="numeric"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={verify}
              disabled={loading || otp.length !== 6}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-600 disabled:opacity-50"
            >
              {loading ? "Verifying…" : "Verify"}
            </button>
            <button
              type="button"
              onClick={() => setStep("idle")}
              className="text-sm text-gray-400 hover:text-gray-600"
            >
              ← Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
