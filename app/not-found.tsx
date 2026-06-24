import Link from "next/link";
import { CITIES } from "@/lib/constants";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <div className="mb-4 text-6xl">🩺</div>
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
        Page not found
      </h1>
      <p className="mt-2 text-gray-500 dark:text-gray-400">
        We couldn&apos;t find what you were looking for. Pick a city to start
        exploring doctors near you.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {CITIES.map((c) => (
          <Link
            key={c.slug}
            href={`/${c.slug}`}
            className="rounded-full border border-gray-300 px-4 py-1.5 text-sm font-medium text-gray-600 transition hover:border-primary hover:text-primary dark:border-gray-700 dark:text-gray-300"
          >
            {c.label}
          </Link>
        ))}
      </div>
      <Link
        href="/"
        className="mt-8 inline-block rounded-xl bg-primary px-6 py-3 font-semibold text-white transition hover:bg-primary-600"
      >
        Back to Home
      </Link>
    </div>
  );
}
