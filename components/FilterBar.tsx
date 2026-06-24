"use client";

import { SPECIALITIES, getSpecialityIcon, type FeeTier } from "@/lib/constants";

export interface Filters {
  speciality: string | null;
  minRating: number | null;
  openNow: boolean;
  online: boolean;
  feeTier: FeeTier | null;
}

export const EMPTY_FILTERS: Filters = {
  speciality: null,
  minRating: null,
  openNow: false,
  online: false,
  feeTier: null,
};

const FEE_CHIPS: { tier: FeeTier | null; label: string }[] = [
  { tier: null, label: "Any fee" },
  { tier: "free", label: "Free" },
  { tier: "low", label: "Under ₹300" },
  { tier: "mid", label: "₹300–700" },
  { tier: "high", label: "₹700+" },
];

interface Props {
  filters: Filters;
  onChange: (f: Filters) => void;
  /** compact = smaller chips for the map overlay panel */
  compact?: boolean;
}

export default function FilterBar({ filters, onChange, compact = false }: Props) {
  function toggleSpeciality(name: string) {
    onChange({
      ...filters,
      speciality: filters.speciality === name ? null : name,
    });
  }

  const pad = compact ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-sm";
  const chipBase = `whitespace-nowrap rounded-full border font-medium transition ${pad}`;
  const active = "border-primary bg-primary text-white";
  const idle =
    "border-gray-300 bg-white text-gray-600 hover:border-primary hover:text-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300";

  const hasFilters =
    filters.speciality ||
    filters.minRating ||
    filters.openNow ||
    filters.online ||
    filters.feeTier;

  return (
    <div className={compact ? "space-y-2" : "space-y-3"}>
      {/* speciality chips */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {SPECIALITIES.map((s) => (
          <button
            key={s.name}
            onClick={() => toggleSpeciality(s.name)}
            className={`${chipBase} ${filters.speciality === s.name ? active : idle}`}
          >
            <span className="mr-1" aria-hidden>
              {getSpecialityIcon(s.name)}
            </span>
            {s.name}
          </button>
        ))}
      </div>

      {/* fee tier chips */}
      <div className="flex flex-wrap items-center gap-2">
        {FEE_CHIPS.map((f) => (
          <button
            key={f.label}
            onClick={() => onChange({ ...filters, feeTier: f.tier })}
            className={`${chipBase} ${filters.feeTier === f.tier ? active : idle}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* secondary filters */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() =>
            onChange({ ...filters, minRating: filters.minRating === 4 ? null : 4 })
          }
          className={`${chipBase} ${filters.minRating === 4 ? active : idle}`}
        >
          ⭐ 4+
        </button>
        <button
          onClick={() =>
            onChange({ ...filters, minRating: filters.minRating === 3 ? null : 3 })
          }
          className={`${chipBase} ${filters.minRating === 3 ? active : idle}`}
        >
          ⭐ 3+
        </button>
        <button
          onClick={() => onChange({ ...filters, openNow: !filters.openNow })}
          className={`${chipBase} ${filters.openNow ? active : idle}`}
        >
          🟢 Open Now
        </button>
        <button
          onClick={() => onChange({ ...filters, online: !filters.online })}
          className={`${chipBase} ${filters.online ? active : idle}`}
        >
          💻 Online
        </button>

        {hasFilters && (
          <button
            onClick={() => onChange(EMPTY_FILTERS)}
            className="ml-1 text-xs font-medium text-gray-400 underline-offset-2 hover:text-primary hover:underline"
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  );
}
