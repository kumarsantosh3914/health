import { getSpecialityColor, getSpecialityIcon } from "@/lib/constants";

interface Props {
  speciality: string;
  withIcon?: boolean;
}

export default function SpecialityBadge({ speciality, withIcon = true }: Props) {
  const color = getSpecialityColor(speciality);
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold"
      style={{ backgroundColor: `${color}1a`, color }}
    >
      {withIcon && <span aria-hidden>{getSpecialityIcon(speciality)}</span>}
      {speciality}
    </span>
  );
}
