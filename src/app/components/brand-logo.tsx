import { Aperture } from "lucide-react";

type BrandLogoProps = {
  className?: string;
  iconClassName?: string;
  showWordmark?: boolean;
};

export default function BrandLogo({
  className = "",
  iconClassName = "",
  showWordmark = true,
}: BrandLogoProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span
        className={`grid h-9 w-9 place-items-center rounded-xl bg-amber-400 text-black shadow-sm ${iconClassName}`}
      >
        <Aperture className="h-5 w-5" strokeWidth={2.2} aria-hidden="true" />
      </span>
      {showWordmark ? (
        <span className="text-lg font-bold tracking-tight">
          Studio<span className="text-amber-500">Space</span>
        </span>
      ) : null}
    </span>
  );
}
