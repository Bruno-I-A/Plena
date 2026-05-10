import { BottomNavigation } from "@/components/BottomNavigation";
import { Header } from "@/components/Header";
import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Header />
      {children}
      <BottomNavigation />
    </div>
  );
}
