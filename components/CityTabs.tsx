"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  city: string;
  cityLabel: string;
}

export default function CityTabs({ city, cityLabel }: Props) {
  const pathname = usePathname();
  const tabs = [
    { href: `/${city}`, label: "Doctors", match: (p: string) => p === `/${city}` || p.startsWith(`/${city}/list`) || p.startsWith(`/${city}/map`) },
    { href: `/${city}/events`, label: "Events", match: (p: string) => p.startsWith(`/${city}/events`) },
    { href: `/${city}/guides`, label: "Guides", match: (p: string) => p.startsWith(`/${city}/guides`) },
  ];

  return (
    <div className="border-b border-gray-200 dark:border-gray-800">
      <div className="mx-auto flex max-w-7xl gap-1 px-4 sm:px-6">
        {tabs.map((t) => {
          const active = t.match(pathname);
          return (
            <Link
              key={t.href}
              href={t.href}
              className={`relative px-4 py-3 text-sm font-semibold transition ${
                active
                  ? "text-primary"
                  : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              {t.label}
              {active && (
                <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
        <span className="ml-auto hidden self-center text-xs text-gray-400 sm:block">
          {cityLabel}
        </span>
      </div>
    </div>
  );
}
