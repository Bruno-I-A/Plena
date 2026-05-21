import { AppShell } from "@/components/AppShell";
import { WeeklyMenuClient } from "@/components/WeeklyMenuClient";

export default function CardapioPage() {
  return (
    <AppShell>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="font-serif text-4xl text-ink md:text-5xl">Cardapio semanal</h1>
        <p className="mt-2 max-w-2xl text-ink/66">
          Planeje a semana em blocos simples. Depois, mande para a Plena gerar uma lista de compras.
        </p>
        <div className="mt-6">
          <WeeklyMenuClient />
        </div>
      </main>
    </AppShell>
  );
}
