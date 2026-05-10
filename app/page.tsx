import Image from "next/image";
import { AppShell } from "@/components/AppShell";
import { SafetyNote } from "@/components/SafetyNote";
import { Badge, Card, LinkButton } from "@/components/ui";

const examples = [
  "Tenho frango e legumes. O que posso fazer?",
  "Quero uma janta leve para hoje.",
  "Me ajuda com uma lista de compras.",
  "Quero um doce simples e mais leve.",
  "Monta receitas para a semana.",
  "Transforma essa receita em marmita."
];

const steps = [
  "Escreva o que você quer",
  "Conte seus ingredientes ou preferências",
  "Receba sugestões práticas da Plena"
];

export default function Home() {
  return (
    <AppShell>
      <main>
        <section className="mx-auto grid max-w-6xl gap-8 px-4 pb-12 pt-10 md:grid-cols-[1.05fr_0.95fr] md:items-center md:pb-18 md:pt-16">
          <div>
            <Badge>Chat culinário com IA</Badge>
            <h1 className="mt-5 max-w-3xl font-serif text-5xl leading-[1.02] text-ink md:text-7xl">
              Receitas leves para a sua nova fase
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink/70">
              Converse com a Plena e receba ideias de receitas, cardápios e listas de compras pensadas
              para uma rotina mais leve, prática e acolhedora.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <LinkButton href="/chat">Começar conversa</LinkButton>
              <LinkButton href="#exemplos" variant="secondary">Ver exemplos</LinkButton>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/60 p-6 shadow-soft">
            <div className="mx-auto max-w-sm">
              <Image
                alt="Logo Plena"
                className="h-auto w-full mix-blend-multiply"
                height={1200}
                priority
                src="/brand/plena-logo.png"
                width={1200}
              />
            </div>
            <div className="mt-2 space-y-3">
              <div className="ml-auto max-w-[82%] rounded-3xl rounded-br-md bg-sage px-4 py-3 text-sm text-white">
                Tenho frango, arroz e abobrinha. O que posso fazer?
              </div>
              <div className="max-w-[88%] rounded-3xl rounded-bl-md bg-cream px-4 py-3 text-sm leading-relaxed text-ink">
                Você pode preparar um frango leve com abobrinha e arroz soltinho. Dá para virar marmita e aceitar legumes que já estejam na geladeira.
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-10" id="exemplos">
          <h2 className="font-serif text-3xl text-ink md:text-4xl">Você pode pedir</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {examples.map((example) => (
              <Card className="p-4 text-sm font-medium text-ink/76" key={example}>{example}</Card>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-10">
          <h2 className="font-serif text-3xl text-ink md:text-4xl">Como funciona</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => (
              <Card key={step}>
                <span className="grid h-10 w-10 place-items-center rounded-full bg-rose/15 font-semibold text-rose">{index + 1}</span>
                <p className="mt-5 font-serif text-2xl text-ink">{step}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 py-10">
          <SafetyNote />
        </section>
      </main>
    </AppShell>
  );
}
