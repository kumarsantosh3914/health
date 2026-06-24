"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CITIES, SITE_TAGLINE } from "@/lib/constants";

const USPS = [
  { icon: "🔄", label: "Always Updated" },
  { icon: "🔓", label: "No Sign-in" },
  { icon: "💸", label: "Free Forever" },
];

export default function HeroSection() {
  const router = useRouter();
  const [city, setCity] = useState("delhi");

  return (
    <section className="relative flex min-h-[88vh] flex-col items-center justify-center overflow-hidden px-4 text-center">
      {/* soft background accents */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
      </div>

      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary-700 dark:text-primary-300">
        🩺 Pan-India doctor & clinic discovery
      </div>

      <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white sm:text-6xl">
        Find the right doctor,{" "}
        <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          right now.
        </span>
      </h1>
      <p className="mt-4 max-w-xl text-lg text-gray-600 dark:text-gray-300">
        {SITE_TAGLINE}
      </p>

      {/* city selector */}
      <div className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row">
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-base font-medium text-gray-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        >
          {CITIES.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.label}
            </option>
          ))}
        </select>
        <button
          onClick={() => router.push(`/${city}`)}
          className="rounded-xl bg-primary px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-primary-600"
        >
          Find doctors →
        </button>
      </div>

      {/* USP badges */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        {USPS.map((u) => (
          <span
            key={u.label}
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            <span aria-hidden>{u.icon}</span>
            {u.label}
          </span>
        ))}
      </div>
    </section>
  );
}
