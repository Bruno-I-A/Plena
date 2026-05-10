import { AppShell } from "@/components/AppShell";
import { FavoritesPageClient } from "@/components/FavoritesPageClient";

export default function FavoritasPage() {
  return (
    <AppShell>
      <main className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="font-serif text-4xl text-ink">Favoritas</h1>
        <p className="mt-2 text-ink/66">Guarde respostas com receitas, substituições e ideias para repetir com calma.</p>
        <div className="mt-6">
          <FavoritesPageClient />
        </div>
      </main>
    </AppShell>
  );
}
