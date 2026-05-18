import { PublicHeader } from "@/components/PublicHeader";
import type { ReactNode } from "react";

export function PublicShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <PublicHeader />
      {children}
    </div>
  );
}
