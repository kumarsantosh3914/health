"use client";

import { useState } from "react";
import Link from "next/link";
import { CITIES, SPECIALITIES, getNeighbourhoods } from "@/lib/constants";
import HprVerify from "@/components/HprVerify";

export default function CommunityPage() {
  const [city, setCity] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [hprId, setHprId] = useState("");
  const [hprVerified, setHprVerified] = useState(false);
  const [autoApproved, setAutoApproved] = useState(false);
  const neighbourhoods = city ? getNeighbourhoods(city) : [];

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: data.get("name"),
      clinicName: data.get("clinicName"),
      city: data.get("city"),
      neighbourhood: data.get("neighbourhood"),
      speciality: data.get("speciality"),
      phone: data.get("phone"),
      fee: data.get("fee"),
      timings: data.get("timings"),
      hprId: hprVerified ? hprId : "",
      hprVerified,
    };
    setState("loading");
    try {
      const res = await fetch("/api/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        setState("error");
        setError(json.error ?? "Submission failed.");
      } else {
        setAutoApproved(Boolean(json.autoApproved));
        setState("done");
        form.reset();
      }
    } catch {
      setState("error");
      setError("Network error. Please try again.");
    }
  }

  if (state === "done") {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/15 text-3xl">
          {autoApproved ? "✅" : "🎉"}
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {autoApproved ? "Verified & published!" : "Submitted for review!"}
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          {autoApproved ? (
            <>
              HPR verification confirmed — the listing is{" "}
              <strong>live now</strong> and visible to patients.
            </>
          ) : (
            <>
              Your doctor is now in the community queue. Once it gets{" "}
              <strong>5 upvotes</strong> it goes live automatically.
            </>
          )}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href={autoApproved ? "/" : "/pending"}
            className="rounded-xl bg-primary px-6 py-3 font-semibold text-white transition hover:bg-primary-600"
          >
            {autoApproved ? "Back Home" : "View Pending Queue"}
          </Link>
          <button
            onClick={() => {
              setState("idle");
              setHprVerified(false);
              setHprId("");
              setAutoApproved(false);
            }}
            className="rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-600 dark:border-gray-700 dark:text-gray-300"
          >
            Add Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
        Add a Doctor
      </h1>
      <p className="mt-2 text-gray-500 dark:text-gray-400">
        Help your city find better care. Submissions are reviewed by the community —
        5 upvotes auto-approves, 3 downvotes rejects.
      </p>

      <form onSubmit={submit} className="mt-8 space-y-4">
        <Field label="Doctor name *">
          <input name="name" required className="input" placeholder="Dr. ..." />
        </Field>
        <Field label="Clinic / Hospital name *">
          <input name="clinicName" required className="input" placeholder="..." />
        </Field>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="City *">
            <select
              name="city"
              required
              className="input"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            >
              <option value="" disabled>
                Select city
              </option>
              {CITIES.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Neighbourhood">
            <select name="neighbourhood" className="input" disabled={!city}>
              <option value="">{city ? "Select area" : "Pick a city first"}</option>
              {neighbourhoods.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Speciality *">
            <select name="speciality" required className="input" defaultValue="">
              <option value="" disabled>
                Select speciality
              </option>
              {SPECIALITIES.map((s) => (
                <option key={s.name} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Consultation fee (₹)">
            <input
              name="fee"
              type="number"
              min={0}
              className="input"
              placeholder="0 for free / Govt"
            />
          </Field>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Phone">
            <input name="phone" className="input" placeholder="Clinic contact" />
          </Field>
          <Field label="Timings">
            <input
              name="timings"
              className="input"
              placeholder="Mon-Sat 9 AM - 6 PM"
            />
          </Field>
        </div>

        <HprVerify
          verified={hprVerified}
          onVerified={(id) => {
            setHprId(id);
            setHprVerified(true);
          }}
          onReset={() => {
            setHprId("");
            setHprVerified(false);
          }}
        />

        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={state === "loading"}
          className="w-full rounded-xl bg-primary py-3 font-semibold text-white transition hover:bg-primary-600 disabled:opacity-60"
        >
          {state === "loading"
            ? "Submitting…"
            : hprVerified
              ? "Verify & Publish"
              : "Submit for Review"}
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      {children}
    </div>
  );
}
