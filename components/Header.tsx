import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { MADE_BY } from "@/lib/constants";

const NAV = [
  { href: "/delhi/map", label: "Map" },
  { href: "/delhi/events", label: "Events" },
  { href: "/delhi/list", label: "Doctors" },
  { href: "/delhi/guides", label: "Guides" },
  { href: "/pending", label: "Community" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-[1100] border-b border-gray-200 bg-white/85 backdrop-blur dark:border-gray-800 dark:bg-gray-900/85">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-2.5 sm:px-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-sm font-extrabold text-white">
            IH
          </span>
          <span className="text-lg font-extrabold tracking-tight text-gray-900 dark:text-white">
            India<span className="text-primary">Health</span>Arena
          </span>
          <span className="hidden text-xs font-medium text-gray-400 sm:inline">
            by {MADE_BY}
          </span>
        </Link>

        <Link
          href="/suggest"
          className="hidden items-center gap-1 text-sm font-semibold text-orange-500 hover:text-orange-600 md:flex"
        >
          🔔 Newsletter
        </Link>

        {/* Center nav */}
        <nav className="mx-auto hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <Link
              key={n.label}
              href={n.href}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <Link
            href="/community"
            className="flex items-center gap-1 rounded-lg border border-accent/40 bg-accent/10 px-3 py-1.5 text-sm font-semibold text-accent-700 transition hover:bg-accent/20 dark:text-accent-300"
          >
            + Add a Doctor
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
