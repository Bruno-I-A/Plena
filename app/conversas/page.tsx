import { AppShell } from "@/components/AppShell";
import { ConversationsPageClient } from "@/components/ConversationsPageClient";

export default function ConversasPage() {
  return (
    <AppShell>
      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="font-serif text-4xl text-ink">Conversas</h1>
        <p className="mt-2 text-ink/66">Continue ideias anteriores, revise listas e organize receitas que ficaram boas para sua rotina.</p>
        <div className="mt-6">
          <ConversationsPageClient />
        </div>
      </main>
    </AppShell>
  );
}
