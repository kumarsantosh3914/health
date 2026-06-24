import Link from "next/link";
import { SITE_NAME, MADE_BY } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-gray-500 dark:text-gray-400 sm:flex-row sm:px-6">
        <div className="flex flex-col items-center gap-1 sm:items-start">
          <span className="font-bold text-gray-700 dark:text-gray-200">
            {SITE_NAME}
          </span>
          <span>
            made by <span className="font-medium text-primary">{MADE_BY}</span>
          </span>
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/suggest" className="hover:text-primary">
            Suggest a Doctor
          </Link>
          <Link href="/suggest" className="hover:text-primary">
            Advertise
          </Link>
          <span className="text-gray-300 dark:text-gray-700">·</span>
          <span>Always Updated · No Sign-in · Free Forever</span>
        </nav>
      </div>
      <div className="border-t border-gray-200 px-4 py-2 text-center text-xs text-amber-600 dark:border-gray-800 dark:text-amber-400">
        ⚠️ Doctor listings are sample/demo data, not real practitioners. See README for real-data sources (ABDM HFR, data.gov.in, Google Places).
      </div>
    </footer>
  );
}
