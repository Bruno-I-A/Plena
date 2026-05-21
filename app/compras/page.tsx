import { AppShell } from "@/components/AppShell";
import { ShoppingListClient } from "@/components/ShoppingListClient";

export default function ComprasPage() {
  return (
    <AppShell>
      <main className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="font-serif text-4xl text-ink md:text-5xl">Lista de compras</h1>
        <p className="mt-2 max-w-2xl text-ink/66">
          Organize compras por categoria, marque o que ja pegou e copie a lista para levar ao mercado.
        </p>
        <div className="mt-6">
          <ShoppingListClient />
        </div>
      </main>
    </AppShell>
  );
}
