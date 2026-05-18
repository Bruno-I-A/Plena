import { Suspense } from "react";
import { PublicShell } from "@/components/PublicShell";
import { SubscribeForm } from "@/components/SubscribeForm";
import { Badge, Card } from "@/components/ui";

export default function SubscribePage() {
  return (
    <PublicShell>
      <main className="mx-auto grid min-h-[calc(100dvh-9.35rem)] max-w-5xl gap-8 px-4 py-10 md:min-h-[calc(100dvh-4.25rem)] md:grid-cols-[0.9fr_1.1fr] md:items-center">
        <section>
          <Badge>Assinar Plena</Badge>
          <h1 className="mt-5 font-serif text-5xl leading-tight text-ink">Comece pelo pagamento. O acesso vem em seguida.</h1>
          <p className="mt-5 text-lg leading-relaxed text-ink/68">
            Informe seu nome e email, escolha o plano e finalize no Mercado Pago. Depois você cria sua senha com o mesmo email usado na compra.
          </p>
        </section>
        <Card className="bg-white/76">
          <Suspense fallback={<div className="p-6 text-ink/60">Carregando assinatura...</div>}>
            <SubscribeForm />
          </Suspense>
        </Card>
      </main>
    </PublicShell>
  );
}
