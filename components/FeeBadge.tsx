import { getFeeTier } from "@/lib/constants";

interface Props {
  fee: number;
  feeListed?: boolean;
  showAmount?: boolean;
  size?: "sm" | "md";
}

/**
 * Rupee-tier badge auto-derived from consultation_fee:
 *   Free → green · ₹ (<300) → blue · ₹₹ (300–700) → amber · ₹₹₹ (700+) → orange
 * When feeListed is false (e.g. Google Places imports have no fee data) we show
 * a neutral "Fee on request" badge instead of mislabeling it as Free.
 */
export default function FeeBadge({
  fee,
  feeListed = true,
  showAmount = true,
  size = "sm",
}: Props) {
  const pad = size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm";

  if (!feeListed) {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full font-bold text-gray-500 dark:text-gray-300 ${pad}`}
        style={{ backgroundColor: "#9ca3af22" }}
      >
        Fee on request
      </span>
    );
  }

  const t = getFeeTier(fee);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-bold ${pad}`}
      style={{ backgroundColor: t.bg, color: t.color }}
      title={t.sub}
    >
      <span>{t.label}</span>
      {showAmount && t.tier !== "free" && (
        <span className="font-semibold opacity-80">₹{fee}</span>
      )}
      {t.tier === "free" && <span className="font-semibold opacity-80">OPD</span>}
    </span>
  );
}
