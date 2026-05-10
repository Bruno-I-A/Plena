import Link from "next/link";
import { clsx } from "clsx";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
}) {
  return (
    <button
      className={clsx(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-55",
        variant === "primary" && "bg-sage text-white shadow-soft hover:bg-[#5f705b]",
        variant === "secondary" && "border border-sage/25 bg-white/70 text-ink hover:bg-white",
        variant === "ghost" && "text-sage hover:bg-sage/10",
        className
      )}
      {...props}
    />
  );
}

export function LinkButton({
  className,
  variant = "primary",
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: "primary" | "secondary" | "ghost";
}) {
  return (
    <Link
      className={clsx(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition",
        variant === "primary" && "bg-sage text-white shadow-soft hover:bg-[#5f705b]",
        variant === "secondary" && "border border-sage/25 bg-white/70 text-ink hover:bg-white",
        variant === "ghost" && "text-sage hover:bg-sage/10",
        className
      )}
      {...props}
    />
  );
}

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={clsx("rounded-[1.35rem] border border-white/70 bg-white/68 p-5 shadow-soft backdrop-blur", className)}>
      {children}
    </div>
  );
}

export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={clsx("inline-flex rounded-full bg-rose/15 px-3 py-1 text-xs font-semibold text-rose", className)}>
      {children}
    </span>
  );
}
