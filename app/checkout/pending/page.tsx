import { Clock3 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Card, LinkButton } from "@/components/ui";

export default function CheckoutPendingPage() {
  return (
    <AppShell>
      <main className="mx-auto flex min-h-[calc(100dvh-9.35rem)] max-w-2xl items-center px-4 py-10 md:min-h-[calc(100dvh-4.25rem)]">
        <Card className="w-full text-center">
          <Clock3 className="mx-auto text-sage" size={42} aria-hidden />
          <h1 className="mt-5 font-serif text-4xl text-ink">Pagamento pendente</h1>
          <p className="mt-3 text-ink/68">
            Estamos aguardando a confirmação do Mercado Pago. Se você pagou por Pix ou boleto, pode levar alguns minutos.
          </p>
          <LinkButton className="mt-6" href="/premium" variant="secondary">Voltar aos planos</LinkButton>
        </Card>
      </main>
    </AppShell>
  );
}
