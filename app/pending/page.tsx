"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Doctor } from "@/lib/types";
import SpecialityBadge from "@/components/SpecialityBadge";
import FeeBadge from "@/components/FeeBadge";

export default function PendingPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");

  async function load() {
    const res = await fetch("/api/community", { cache: "no-store" });
    const data = await res.json();
    setDoctors(data.doctors ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function vote(id: string, type: "up" | "down") {
    const res = await fetch(`/api/doctors/${id}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type }),
    });
    const data = await res.json();
    if (res.ok) {
      if (data.resolved) {
        const status = data.doctor.status;
        setToast(
          status === "approved"
            ? "✅ Approved and now live!"
            : "❌ Rejected by the community."
        );
        setTimeout(() => setToast(""), 2500);
      }
      // Refresh list (resolved items drop out of the pending queue).
      load();
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="mb-2 flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
          Pending Queue
        </h1>
        <Link
          href="/community"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-600"
        >
          + Add a Doctor
        </Link>
      </div>
      <p className="mb-8 text-gray-500 dark:text-gray-400">
        Community-submitted doctors. <strong>5 upvotes</strong> auto-approves ·{" "}
        <strong>3 downvotes</strong> auto-rejects.
      </p>

      {toast && (
        <div className="mb-4 rounded-xl bg-accent/10 px-4 py-3 text-center font-semibold text-accent">
          {toast}
        </div>
      )}

      {loading ? (
        <p className="py-16 text-center text-gray-400">Loading…</p>
      ) : doctors.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 py-16 text-center text-gray-400 dark:border-gray-700">
          No pending submissions. Be the first to{" "}
          <Link href="/community" className="text-primary hover:underline">
            add a doctor
          </Link>
          !
        </div>
      ) : (
        <div className="space-y-4">
          {doctors.map((d) => (
            <div
              key={d._id}
              className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:flex-row sm:items-center"
            >
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-gray-900 dark:text-white">
                    {d.name}
                  </span>
                  <SpecialityBadge speciality={d.speciality} />
                  <FeeBadge fee={d.consultation_fee} />
                </div>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  🏥 {d.clinic.name} · 📍{" "}
                  {d.clinic.neighbourhood || d.clinic.city} ·{" "}
                  {d.clinic.city.charAt(0).toUpperCase() + d.clinic.city.slice(1)}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => vote(d._id!, "up")}
                  className="flex items-center gap-1.5 rounded-lg border border-accent/40 bg-accent/5 px-3 py-2 text-sm font-semibold text-accent transition hover:bg-accent/10"
                >
                  ▲ {d.upvotes}
                </button>
                <button
                  onClick={() => vote(d._id!, "down")}
                  className="flex items-center gap-1.5 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-100 dark:border-red-900 dark:bg-red-900/20"
                >
                  ▼ {d.downvotes}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
