"use client";

import { useEffect, useState } from "react";
import type { Doctor, Appointment } from "@/lib/types";
import { TIME_SLOTS } from "@/lib/constants";
import { createAppointment, verifyOtp } from "@/lib/api";

type Step = "details" | "otp" | "done";

interface Props {
  doctor: Doctor | null;
  open: boolean;
  onClose: () => void;
}

export default function BookingModal({ doctor, open, onClose }: Props) {
  const [step, setStep] = useState<Step>("details");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [type, setType] = useState<"in-person" | "online">("in-person");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState<Appointment | null>(null);

  useEffect(() => {
    if (open) {
      setStep("details");
      setName("");
      setPhone("");
      setDate("");
      setSlot("");
      setType("in-person");
      setOtp("");
      setError("");
      setBooking(null);
    }
  }, [open, doctor]);

  if (!open || !doctor) return null;

  const today = new Date().toISOString().slice(0, 10);

  async function submitDetails(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name || !phone || !date || !slot) {
      setError("Please fill in all fields.");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(phone.replace(/\D/g, "").slice(-10))) {
      setError("Enter a valid 10-digit Indian mobile number.");
      return;
    }
    // In production an OTP SMS would be sent here. We mock it.
    setStep("otp");
  }

  async function submitOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const verify = await verifyOtp(phone, otp);
    if (!verify.ok) {
      setError(verify.error ?? "Invalid code");
      setLoading(false);
      return;
    }
    const res = await createAppointment({
      doctorSlug: doctor!.slug,
      doctorName: doctor!.name,
      patientName: name,
      phone,
      date,
      timeSlot: slot,
      consultationType: type,
    });
    setLoading(false);
    if (!res.ok || !res.appointment) {
      setError(res.error ?? "Booking failed");
      return;
    }
    setBooking(res.appointment);
    setStep("done");
  }

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md animate-fade-in rounded-t-2xl bg-white p-6 shadow-2xl dark:bg-gray-900 sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Book Appointment
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {doctor.name} · ₹{doctor.consultation_fee}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {step === "details" && (
          <form onSubmit={submitDetails} className="space-y-3">
            <input
              className="input"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="input"
              placeholder="Phone number"
              inputMode="numeric"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <input
              className="input"
              type="date"
              min={today}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <div>
              <p className="mb-1 text-xs font-medium text-gray-500">Time slot</p>
              <div className="grid grid-cols-3 gap-2">
                {TIME_SLOTS.map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setSlot(s)}
                    className={`rounded-lg border px-2 py-1.5 text-xs font-medium transition ${
                      slot === s
                        ? "border-primary bg-primary text-white"
                        : "border-gray-300 text-gray-600 hover:border-primary dark:border-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            {doctor.available_online && (
              <div className="flex gap-2">
                {(["in-person", "online"] as const).map((t) => (
                  <button
                    type="button"
                    key={t}
                    onClick={() => setType(t)}
                    className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium capitalize transition ${
                      type === t
                        ? "border-accent bg-accent text-white"
                        : "border-gray-300 text-gray-600 dark:border-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {t === "in-person" ? "In-person" : "Online"}
                  </button>
                ))}
              </div>
            )}
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button
              type="submit"
              className="w-full rounded-lg bg-primary py-2.5 font-semibold text-white transition hover:bg-primary-600"
            >
              Continue
            </button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={submitOtp} className="space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              We sent a 6-digit code to <strong>{phone}</strong>.
            </p>
            <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
              Demo mode — use code <strong>123456</strong> (any 6 digits work).
            </p>
            <input
              className="input tracking-[0.5em]"
              placeholder="••••••"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-primary py-2.5 font-semibold text-white transition hover:bg-primary-600 disabled:opacity-60"
            >
              {loading ? "Confirming…" : "Verify & Book"}
            </button>
            <button
              type="button"
              onClick={() => setStep("details")}
              className="w-full text-sm text-gray-400 hover:text-gray-600"
            >
              ← Back
            </button>
          </form>
        )}

        {step === "done" && booking && (
          <div className="space-y-3 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent/15 text-3xl">
              ✅
            </div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white">
              Appointment Confirmed!
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {doctor.name} on{" "}
              <strong>
                {booking.date} at {booking.timeSlot}
              </strong>
            </p>
            <div className="rounded-xl border border-dashed border-primary/40 bg-primary/5 py-3">
              <p className="text-xs text-gray-500">Booking ID</p>
              <p className="text-xl font-extrabold tracking-wider text-primary">
                {booking.bookingId}
              </p>
            </div>
            <p className="text-xs text-gray-400">
              No account needed — keep this ID for your records.
            </p>
            <button
              onClick={onClose}
              className="w-full rounded-lg bg-primary py-2.5 font-semibold text-white transition hover:bg-primary-600"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
