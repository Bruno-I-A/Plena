import { AppShell } from "@/components/AppShell";
import { RoutineDashboardClient } from "@/components/RoutineDashboardClient";

export default function RotinaPage() {
  return (
    <AppShell>
      <main className="mx-auto max-w-6xl px-4 py-5 md:py-8">
        <h1 className="font-serif text-4xl leading-tight text-ink md:text-5xl">Minha rotina</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink/66 md:text-base">
          Um painel simples para organizar cardapio, compras, ingredientes e conversas com a Plena.
        </p>
        <div className="mt-6">
          <RoutineDashboardClient />
        </div>
      </main>
    </AppShell>
  );
}
