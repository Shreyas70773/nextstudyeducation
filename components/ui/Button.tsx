"use client";

import Magnetic from "./Magnetic";
import { ArrowRight } from "./icons";

type Variant = "primary" | "ghost";

// Anchor-based CTA. Primary is the dominant brand-orange action; ghost is the
// quiet secondary. Press feedback via transform only (GPU), arrow nudges on hover.
export default function Button({
  href,
  children,
  variant = "primary",
  magnetic = false,
  showArrow = true,
  className = "",
  ...rest
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  magnetic?: boolean;
  showArrow?: boolean;
  className?: string;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const styles =
    variant === "primary"
      ? "bg-accent text-accent-ink hover:bg-accent-bright"
      : "border border-line text-bone hover:border-accent/60 hover:text-accent";

  const inner = (
    <a
      href={href}
      className={`group inline-flex items-center gap-2.5 rounded-full px-6 py-3.5 font-display text-[0.95rem] font-medium tracking-tight transition-[transform,background-color,color,border-color] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.97] ${styles} ${className}`}
      {...rest}
    >
      {children}
      {showArrow && (
        <ArrowRight
          size={18}
          className="transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
        />
      )}
    </a>
  );

  return magnetic ? <Magnetic strength={0.4}>{inner}</Magnetic> : inner;
}
