"use client";

import { useState } from "react";
import { SPECIALITIES } from "@/lib/constants";

export default function MapLegend() {
  const [open, setOpen] = useState(true);

  return (
    <div className="rounded-xl border border-gray-200 bg-white/95 p-3 shadow-lg backdrop-blur dark:border-gray-700 dark:bg-gray-900/95">
      <button
        onClick={() => setOpen((o) => !o)}
        className="mb-1 flex w-full items-center justify-between text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400"
      >
        Specialities
        <span className="ml-3 text-gray-400">{open ? "▾" : "▸"}</span>
      </button>
      {open && (
        <ul className="space-y-1">
          {SPECIALITIES.map((s) => (
            <li key={s.name} className="flex items-center gap-2 text-xs">
              <span
                className="flex h-4 w-4 items-center justify-center rounded-[5px] text-[9px]"
                style={{ backgroundColor: s.color }}
              >
                <span className="leading-none">{s.icon}</span>
              </span>
              <span className="text-gray-700 dark:text-gray-200">{s.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
