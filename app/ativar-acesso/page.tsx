import { AppShell } from "@/components/AppShell";
import { AuthForm } from "@/components/AuthForm";
import { Badge, Card } from "@/components/ui";

export default async function ActivateAccessPage({
  searchParams
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email = "" } = await searchParams;

  return (
    <AppShell>
      <main className="mx-auto grid min-h-[calc(100dvh-9.35rem)] max-w-5xl gap-8 px-4 py-10 md:min-h-[calc(100dvh-4.25rem)] md:grid-cols-[0.9fr_1.1fr] md:items-center">
        <section>
          <Badge>Acesso Plena</Badge>
          <h1 className="mt-5 font-serif text-5xl leading-tight text-ink">Crie sua senha para entrar</h1>
          <p className="mt-5 text-lg leading-relaxed text-ink/68">
            Use o mesmo email informado na compra. Se o pagamento já foi aprovado, seu plano será vinculado automaticamente à conta.
          </p>
        </section>
        <Card className="bg-white/76">
          <AuthForm initialEmail={email} initialMode="signup" redirectTo="/chat" />
        </Card>
      </main>
    </AppShell>
  );
}
