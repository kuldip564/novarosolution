import Link from "next/link";
import { NMark } from "@/components/NMark";

type BrandLogoProps = {
  href?: string;
  iconSize?: number;
  showText?: boolean;
  name?: string;
  tagline?: string;
  className?: string;
  label?: string;
  onClick?: () => void;
};

export function BrandLogo({
  href,
  iconSize = 34,
  showText = true,
  name = "Novaro",
  tagline = "SOLUTION",
  className = "",
  label = "Novaro Solution home",
  onClick,
}: BrandLogoProps) {
  const content = (
    <>
      <NMark size={iconSize} />
      {showText && (
        <span className="txt">
          <span className="nm">{name}</span>
          <span className="sl">{tagline}</span>
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={`brand ${className}`.trim()}
        aria-label={label}
        onClick={onClick}
      >
        {content}
      </Link>
    );
  }

  return (
    <div className={`brand ${className}`.trim()} aria-label={label}>
      {content}
    </div>
  );
}
