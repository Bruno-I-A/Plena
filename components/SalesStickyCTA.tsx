"use client";

import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

export function SalesStickyCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.7);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-50 bg-gradient-to-t from-[#f3ead6] via-[#f3ead6]/95 to-transparent px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-8 transition duration-300 md:hidden ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-5 opacity-0"
      }`}
    >
      <a
        className="mx-auto flex max-w-md items-center justify-between rounded-full bg-[#3f4a2a] px-5 py-3 text-sm font-bold text-[#fbf6e9] shadow-[0_14px_30px_rgba(60,50,30,0.22)]"
        href="#planos"
      >
        Quero contratar
        <span className="grid h-9 w-9 place-items-center rounded-full bg-[#d6b67a] text-[#2a261f]">
          <ArrowRight className="h-5 w-5" />
        </span>
      </a>
    </div>
  );
}
