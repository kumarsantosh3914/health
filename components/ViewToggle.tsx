"use client";

interface Props {
  view: "list" | "map";
  onChange: (v: "list" | "map") => void;
}

export default function ViewToggle({ view, onChange }: Props) {
  const base = "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition";
  const active = "bg-white text-primary shadow-sm dark:bg-gray-700 dark:text-white";
  const idle = "text-gray-500 hover:text-gray-700 dark:text-gray-400";

  return (
    <div className="inline-flex rounded-xl bg-gray-100 p-1 dark:bg-gray-800">
      <button
        onClick={() => onChange("list")}
        className={`${base} ${view === "list" ? active : idle}`}
      >
        ▦ List
      </button>
      <button
        onClick={() => onChange("map")}
        className={`${base} ${view === "map" ? active : idle}`}
      >
        🗺 Map
      </button>
    </div>
  );
}
