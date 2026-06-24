"use client";

import { useState } from "react";
import type { Doctor } from "@/lib/types";

export default function SuggestEdit({ doctor }: { doctor: Doctor }) {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const data = new FormData(e.currentTarget);
    const changes = {
      clinicName: data.get("clinicName"),
      address: data.get("address"),
      timings: data.get("timings"),
      consultation_fee: data.get("fee"),
    };
    setState("loading");
    try {
      const res = await fetch(`/api/doctors/${doctor._id}/suggest-edit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ changes, note: data.get("note") }),
      });
      const json = await res.json();
      if (!res.ok) {
        setState("error");
        setError(json.error ?? "Failed to submit.");
      } else {
        setState("done");
      }
    } catch {
      setState("error");
      setError("Network error.");
    }
  }

  return (
    <>
      <button
        onClick={() => {
          setOpen(true);
          setState("idle");
        }}
        className="text-xs font-medium text-gray-400 underline-offset-2 hover:text-primary hover:underline"
      >
        ✏️ Suggest an edit
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[2000] flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-t-2xl bg-white p-6 text-left shadow-2xl dark:bg-gray-900 sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Suggest an edit
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {doctor.name}
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {state === "done" ? (
              <div className="py-6 text-center">
                <div className="mb-2 text-3xl">🙏</div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  Thanks! Your suggestion was sent for review.
                </p>
                <button
                  onClick={() => setOpen(false)}
                  className="mt-4 rounded-lg bg-primary px-5 py-2 font-semibold text-white"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-3">
                <input
                  name="clinicName"
                  className="input"
                  defaultValue={doctor.clinic.name}
                  placeholder="Clinic name"
                />
                <input
                  name="address"
                  className="input"
                  defaultValue={doctor.clinic.address}
                  placeholder="Address"
                />
                <input
                  name="timings"
                  className="input"
                  defaultValue={doctor.clinic.timings}
                  placeholder="Timings"
                />
                <input
                  name="fee"
                  type="number"
                  className="input"
                  defaultValue={doctor.consultation_fee}
                  placeholder="Consultation fee"
                />
                <textarea
                  name="note"
                  className="input min-h-[70px]"
                  placeholder="What needs fixing? (optional)"
                />
                {error && <p className="text-sm text-red-500">{error}</p>}
                <button
                  type="submit"
                  disabled={state === "loading"}
                  className="w-full rounded-lg bg-primary py-2.5 font-semibold text-white transition hover:bg-primary-600 disabled:opacity-60"
                >
                  {state === "loading" ? "Sending…" : "Submit suggestion"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
