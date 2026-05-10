import { AppShell } from "@/components/AppShell";
import { AuthForm } from "@/components/AuthForm";
import { Card } from "@/components/ui";

export default function LoginPage() {
  return (
    <AppShell>
      <main className="mx-auto grid max-w-5xl gap-8 px-4 py-10 md:grid-cols-[0.9fr_1.1fr] md:items-center">
        <div>
          <h1 className="font-serif text-5xl leading-tight text-ink">Sua Plena, do seu jeito</h1>
          <p className="mt-4 text-lg leading-relaxed text-ink/68">
            Faça login para salvar histórico, favoritas e continuar conversas anteriores. Você também pode usar o chat sem entrar, só não terá salvamento automático.
          </p>
        </div>
        <Card>
          <AuthForm />
        </Card>
      </main>
    </AppShell>
  );
}
