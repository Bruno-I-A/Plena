import { AppShell } from "@/components/AppShell";
import { PantryClient } from "@/components/PantryClient";

export default function DespensaPage() {
  return (
    <AppShell>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="font-serif text-4xl text-ink md:text-5xl">Tenho em casa</h1>
        <p className="mt-2 max-w-2xl text-ink/66">
          Salve ingredientes disponiveis e peca ideias para aproveitar melhor o que ja esta na cozinha.
        </p>
        <div className="mt-6">
          <PantryClient />
        </div>
      </main>
    </AppShell>
  );
}
