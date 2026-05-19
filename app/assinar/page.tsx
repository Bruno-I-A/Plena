import { Suspense } from "react";
import { ShieldCheck, Sparkles } from "lucide-react";
import { PublicShell } from "@/components/PublicShell";
import { SubscribeForm } from "@/components/SubscribeForm";
import { Badge, Card } from "@/components/ui";

export default function SubscribePage() {
  return (
    <PublicShell>
      <main className="bg-[#f3ead6] px-4 py-10">
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-[0.85fr_1.15fr] md:items-center">
          <section>
            <Badge className="bg-[#ecc6bc] text-[#8e4a40]">Pagamento Pix</Badge>
            <h1 className="mt-5 font-serif text-5xl leading-tight text-[#2a261f] md:text-6xl">
              Falta pouco para tirar esse peso da cozinha.
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-[#7a6f5e]">
              Informe nome e email, escolha o plano e gere seu Pix. Depois do pagamento, você cria uma senha com esse mesmo email e entra direto na Plena.
            </p>

            <div className="mt-6 grid gap-3">
              <div className="flex gap-3 rounded-2xl border border-[#dbcfb4] bg-[#fbf6e9] px-4 py-3 text-sm font-semibold text-[#2a261f]/75">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#5e6b3f]" />
                Pagamento processado com segurança pelo Mercado Pago.
              </div>
              <div className="flex gap-3 rounded-2xl border border-[#dbcfb4] bg-[#fbf6e9] px-4 py-3 text-sm font-semibold text-[#2a261f]/75">
                <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-[#b8665a]" />
                O acesso é liberado pelo email usado nesta compra.
              </div>
            </div>
          </section>

          <Card className="border-[#dbcfb4] bg-[#fbf6e9] p-6 shadow-[0_24px_70px_rgba(60,40,20,0.12)]">
            <Suspense fallback={<div className="p-6 text-[#7a6f5e]">Carregando assinatura...</div>}>
              <SubscribeForm />
            </Suspense>
          </Card>
        </div>
      </main>
    </PublicShell>
  );
}
