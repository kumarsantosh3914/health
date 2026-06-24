interface Props {
  rating: number;
  count?: number;
  size?: "sm" | "md";
}

export default function RatingStars({ rating, count, size = "sm" }: Props) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const dim = size === "sm" ? "text-sm" : "text-lg";

  return (
    <div className={`flex items-center gap-1 ${dim}`}>
      <span className="text-amber-400" aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => {
          if (i < full) return <span key={i}>★</span>;
          if (i === full && half) return <span key={i}>⯨</span>;
          return (
            <span key={i} className="text-gray-300 dark:text-gray-600">
              ★
            </span>
          );
        })}
      </span>
      <span className="font-semibold text-gray-700 dark:text-gray-200">
        {rating.toFixed(1)}
      </span>
      {count !== undefined && (
        <span className="text-gray-400 dark:text-gray-500">({count})</span>
      )}
    </div>
  );
}
