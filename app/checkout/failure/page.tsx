import { XCircle } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Card, LinkButton } from "@/components/ui";

export default function CheckoutFailurePage() {
  return (
    <AppShell>
      <main className="mx-auto flex min-h-[calc(100dvh-9.35rem)] max-w-2xl items-center px-4 py-10 md:min-h-[calc(100dvh-4.25rem)]">
        <Card className="w-full text-center">
          <XCircle className="mx-auto text-rose" size={42} aria-hidden />
          <h1 className="mt-5 font-serif text-4xl text-ink">Pagamento não concluído</h1>
          <p className="mt-3 text-ink/68">
            Não houve confirmação do pagamento. Você pode tentar novamente escolhendo um plano.
          </p>
          <LinkButton className="mt-6" href="/premium">Tentar novamente</LinkButton>
        </Card>
      </main>
    </AppShell>
  );
}
