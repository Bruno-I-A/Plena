"use client";

import Link from "next/link";
import { Heart, MessageCircle, Sparkles, UserRound, Utensils } from "lucide-react";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

const items = [
  { href: "/chat", label: "Chat", icon: MessageCircle },
  { href: "/conversas", label: "Conversas", icon: Utensils },
  { href: "/favoritas", label: "Favoritas", icon: Heart },
  { href: "/premium", label: "Premium", icon: Sparkles },
  { href: "/login", label: "Perfil", icon: UserRound }
];

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-sand/30 bg-cream/94 px-2 py-2 shadow-[0_-10px_30px_rgba(63,58,53,0.08)] backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
        {items.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              className={clsx(
                "flex min-h-12 flex-col items-center justify-center gap-1 rounded-2xl text-[0.68rem] font-semibold transition",
                active ? "bg-sage text-white" : "text-ink/62 hover:bg-white/70"
              )}
              href={item.href}
              key={item.href}
            >
              <Icon size={18} aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
