import { CheckCircle2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Card, LinkButton } from "@/components/ui";

export default function CheckoutSuccessPage() {
  return (
    <AppShell>
      <main className="mx-auto flex min-h-[calc(100dvh-9.35rem)] max-w-2xl items-center px-4 py-10 md:min-h-[calc(100dvh-4.25rem)]">
        <Card className="w-full text-center">
          <CheckCircle2 className="mx-auto text-sage" size={42} aria-hidden />
          <h1 className="mt-5 font-serif text-4xl text-ink">Pagamento recebido</h1>
          <p className="mt-3 text-ink/68">
            Seu plano será liberado para o email usado na compra assim que o Mercado Pago confirmar. Agora crie sua senha para acessar a Plena.
          </p>
          <LinkButton className="mt-6" href="/ativar-acesso">Criar meu acesso</LinkButton>
        </Card>
      </main>
    </AppShell>
  );
}
