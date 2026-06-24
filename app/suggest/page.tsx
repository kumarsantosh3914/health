"use client";

import { useState } from "react";
import Link from "next/link";
import { CITIES, SPECIALITIES } from "@/lib/constants";

export default function SuggestPage() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/15 text-3xl">
          🙏
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Thank you!
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Your suggestion has been received. Our team reviews submissions weekly
          to keep India Health Arena always updated.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-xl bg-primary px-6 py-3 font-semibold text-white transition hover:bg-primary-600"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
        Suggest a Doctor
      </h1>
      <p className="mt-2 text-gray-500 dark:text-gray-400">
        Know a great doctor or clinic we&apos;re missing? Tell us and we&apos;ll
        add them. No account needed.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
        className="mt-8 space-y-4"
      >
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Doctor / Clinic name
          </label>
          <input className="input" required placeholder="Dr. ..." />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              City
            </label>
            <select className="input" required defaultValue="">
              <option value="" disabled>
                Select city
              </option>
              {CITIES.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Speciality
            </label>
            <select className="input" required defaultValue="">
              <option value="" disabled>
                Select speciality
              </option>
              {SPECIALITIES.map((s) => (
                <option key={s.name} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Anything else? (optional)
          </label>
          <textarea
            className="input min-h-[100px]"
            placeholder="Clinic address, contact, why you recommend them…"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-xl bg-primary py-3 font-semibold text-white transition hover:bg-primary-600"
        >
          Submit Suggestion
        </button>
        <p className="text-center text-xs text-gray-400">
          This is a demo form — submissions are not stored.
        </p>
      </form>
    </div>
  );
}
