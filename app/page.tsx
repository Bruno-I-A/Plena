import Image from "next/image";
import { AppShell } from "@/components/AppShell";
import { CheckoutButton } from "@/components/CheckoutButton";
import { SafetyNote } from "@/components/SafetyNote";
import { Badge, Card, LinkButton } from "@/components/ui";
import { PLENA_MONTHLY_MESSAGE_LIMIT, PLENA_PLANS } from "@/lib/plans";

const examples = [
  "Tenho frango, abobrinha e arroz. O que faço hoje?",
  "Quero um café da manhã com mais saciedade.",
  "Me ajuda com uma lista de compras da semana.",
  "Quero um doce simples para comer à noite.",
  "Monta um cardápio leve para 5 dias.",
  "Como variar o jantar sem fazer sempre a mesma coisa?"
];

const steps = [
  "Conte o que tem em casa",
  "Escolha o tipo de refeição",
  "Receba ideias simples da Plena"
];

const benefits = [
  "Receitas com ingredientes que você já tem",
  "Ideias para café, almoço, jantar e lanche",
  "Cardápio da semana sem dieta maluca",
  "Lista de compras organizada",
  "Favoritos e histórico salvos",
  "Sugestões culinárias com linguagem acolhedora"
];

export default function Home() {
  return (
    <AppShell>
      <main>
        <section className="mx-auto grid max-w-6xl gap-8 px-4 pb-10 pt-10 md:grid-cols-[1.08fr_0.92fr] md:items-center md:pb-16 md:pt-16">
          <div>
            <Badge>Para mulheres na menopausa</Badge>
            <h1 className="mt-5 max-w-3xl font-serif text-5xl leading-[1.02] text-ink md:text-7xl">
              Comer melhor na menopausa sem complicar a cozinha
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink/70">
              A Plena ajuda você a decidir o que comer hoje, variar as refeições e montar cardápios simples com o que já existe na sua casa.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <LinkButton href="/login">Começar agora</LinkButton>
              <LinkButton href="#planos" variant="secondary">Ver planos</LinkButton>
            </div>
            <p className="mt-4 text-sm text-ink/58">
              {PLENA_MONTHLY_MESSAGE_LIMIT} mensagens da Plena por mês no plano pago.
            </p>
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
                Quero um jantar leve, mas só tenho ovos, arroz e tomate.
              </div>
              <div className="max-w-[88%] rounded-3xl rounded-bl-md bg-cream px-4 py-3 text-sm leading-relaxed text-ink">
                Você pode fazer uma tigela de arroz com ovos mexidos cremosos e tomate refogado. Se quiser, eu também monto uma versão para o café da manhã ou uma lista de compras para a semana.
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-sand/25 bg-white/42">
          <div className="mx-auto grid max-w-6xl gap-5 px-4 py-10 md:grid-cols-3">
            <div>
              <p className="font-serif text-3xl text-ink">Menos dúvida</p>
              <p className="mt-2 text-sm leading-relaxed text-ink/66">Quando bate aquela pergunta de todo dia: “o que eu faço agora?”</p>
            </div>
            <div>
              <p className="font-serif text-3xl text-ink">Mais leveza</p>
              <p className="mt-2 text-sm leading-relaxed text-ink/66">Ideias culinárias simples, sem promessa milagrosa e sem radicalismo.</p>
            </div>
            <div>
              <p className="font-serif text-3xl text-ink">Com praticidade</p>
              <p className="mt-2 text-sm leading-relaxed text-ink/66">Receitas, cardápios e compras pensados para caber na rotina real.</p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-10" id="exemplos">
          <h2 className="font-serif text-3xl text-ink md:text-4xl">Quando você não sabe o que preparar, pergunte para a Plena</h2>
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

        <section className="mx-auto max-w-6xl px-4 py-10">
          <div className="grid gap-8 md:grid-cols-[0.85fr_1.15fr] md:items-start">
            <div>
              <Badge>O que vem na Plena</Badge>
              <h2 className="mt-4 font-serif text-3xl text-ink md:text-4xl">Um apoio calmo para organizar suas refeições</h2>
              <p className="mt-4 text-ink/68">
                A Plena não substitui nutricionista ou médico. Ela organiza ideias culinárias para você comer com mais intenção e menos peso mental.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {benefits.map((benefit) => (
                <Card className="p-4 text-sm font-medium text-ink/74" key={benefit}>{benefit}</Card>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-10" id="planos">
          <div className="max-w-2xl">
            <Badge>Planos</Badge>
            <h2 className="mt-4 font-serif text-3xl text-ink md:text-4xl">Escolha como quer usar a Plena</h2>
            <p className="mt-3 text-ink/68">
              O plano pago libera {PLENA_MONTHLY_MESSAGE_LIMIT} mensagens mensais para conversar com a Plena e organizar sua rotina alimentar.
            </p>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Card className="relative overflow-hidden border-sand/70 bg-white/90 shadow-[0_20px_54px_rgba(63,74,42,0.18)]">
              <span className="absolute right-0 top-0 rounded-bl-2xl bg-sand px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-ink">
                mais escolhido
              </span>
              <p className="pr-28 text-xs font-bold uppercase tracking-[0.14em] text-sage">melhor valor</p>
              <p className="mt-3 font-serif text-3xl text-ink">{PLENA_PLANS.annual.name}</p>
              <p className="mt-3 text-4xl font-bold text-sage">{PLENA_PLANS.annual.price}</p>
              <p className="mt-3 text-sm leading-relaxed text-ink/66">{PLENA_PLANS.annual.description}</p>
              <CheckoutButton className="mt-6" planId="annual">Começar anual</CheckoutButton>
            </Card>
            <Card className="bg-white/58">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-serif text-2xl text-ink">{PLENA_PLANS.monthly.name}</p>
                  <p className="mt-3 text-3xl font-bold text-sage">{PLENA_PLANS.monthly.price}</p>
                </div>
                <span className="rounded-full bg-sage/10 px-3 py-1 text-xs font-semibold text-sage">flexível</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink/66">{PLENA_PLANS.monthly.description}</p>
              <CheckoutButton className="mt-6" planId="monthly" variant="secondary">Começar mensal</CheckoutButton>
            </Card>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 py-10">
          <SafetyNote />
        </section>
      </main>
    </AppShell>
  );
}
