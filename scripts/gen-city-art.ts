import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const CITY_ART: { slug: string; label: string; from: string; to: string }[] = [
  { slug: "delhi", label: "Delhi", from: "#f59e0b", to: "#ef4444" },
  { slug: "mumbai", label: "Mumbai", from: "#0EA5E9", to: "#6366f1" },
  { slug: "bangalore", label: "Bangalore", from: "#10B981", to: "#0EA5E9" },
  { slug: "chennai", label: "Chennai", from: "#f97316", to: "#ec4899" },
  { slug: "hyderabad", label: "Hyderabad", from: "#8b5cf6", to: "#d946ef" },
  { slug: "pune", label: "Pune", from: "#14b8a6", to: "#10B981" },
  { slug: "kolkata", label: "Kolkata", from: "#ef4444", to: "#f59e0b" },
];

// A simple repeating-building skyline silhouette.
function skyline(): string {
  const heights = [40, 70, 55, 90, 60, 110, 75, 50, 95, 65, 80, 45, 100, 58];
  let x = 0;
  const w = 600;
  const step = w / heights.length;
  let path = `M0,300 `;
  for (const h of heights) {
    path += `L${x},${300 - h} L${x + step},${300 - h} `;
    x += step;
  }
  path += `L${w},300 Z`;
  return path;
}

function svg(c: (typeof CITY_ART)[number]): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 300" width="600" height="300">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${c.from}"/>
      <stop offset="1" stop-color="${c.to}"/>
    </linearGradient>
  </defs>
  <rect width="600" height="300" fill="url(#bg)"/>
  <circle cx="500" cy="70" r="36" fill="#ffffff" opacity="0.25"/>
  <path d="${skyline()}" fill="#000000" opacity="0.18"/>
  <text x="30" y="60" font-family="system-ui, sans-serif" font-size="44" font-weight="800" fill="#ffffff" opacity="0.95">${c.label}</text>
</svg>`;
}

const dir = join(process.cwd(), "public", "cities");
mkdirSync(dir, { recursive: true });
for (const c of CITY_ART) {
  writeFileSync(join(dir, `${c.slug}.svg`), svg(c));
  console.log("wrote", `${c.slug}.svg`);
}
console.log("Done generating city art.");
