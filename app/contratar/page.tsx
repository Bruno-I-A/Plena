import { PremiumCard } from "@/components/PremiumCard";
import { PublicShell } from "@/components/PublicShell";
import { SafetyNote } from "@/components/SafetyNote";
import { SalesDemo } from "@/components/SalesDemo";
import { Badge, LinkButton } from "@/components/ui";
import { PLENA_MONTHLY_MESSAGE_LIMIT, PLENA_PLANS } from "@/lib/plans";

const highlights = [
  "Ideias de receitas com o que já tem em casa",
  "Cardápios simples para variar a semana",
  "Lista de compras organizada",
  "Histórico e favoritos salvos"
];

export default function HirePage() {
  return (
    <PublicShell>
      <main>
        <section className="mx-auto max-w-6xl px-4 pb-8 pt-10 md:pb-12 md:pt-14">
          <div className="max-w-4xl">
            <Badge>Contratar Plena</Badge>
            <h1 className="mt-5 font-serif text-5xl leading-tight text-ink md:text-6xl">
              Uma assistente para decidir o que comer sem complicar a rotina
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-ink/68">
              A Plena ajuda a transformar ingredientes soltos em refeições possíveis, montar cardápios e organizar compras com leveza.
              Você paga por Pix, cria sua senha e entra direto no app.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <LinkButton href="#planos">Contratar agora</LinkButton>
              <LinkButton href="#demo" variant="secondary">
                Ver demonstração
              </LinkButton>
            </div>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map((highlight) => (
              <div className="rounded-2xl border border-sage/15 bg-white/62 px-4 py-3 text-sm font-semibold text-ink/72" key={highlight}>
                {highlight}
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-8" id="demo">
          <SalesDemo />
        </section>

        <section className="mx-auto max-w-6xl px-4 py-10" id="planos">
          <div className="max-w-2xl">
            <Badge>Planos</Badge>
            <h2 className="mt-4 font-serif text-4xl text-ink">Escolha o acesso</h2>
            <p className="mt-3 text-ink/68">
              O plano libera {PLENA_MONTHLY_MESSAGE_LIMIT} mensagens mensais para conversar com a Plena, salvar histórico e voltar às suas receitas favoritas.
            </p>
          </div>

          <div className="mt-7 grid gap-5 lg:grid-cols-2">
            <PremiumCard
              description={PLENA_PLANS.monthly.description}
              features={[
                `${PLENA_MONTHLY_MESSAGE_LIMIT} mensagens da Plena por mês`,
                "Histórico e receitas favoritas salvos",
                "Cardápios semanais",
                "Lista de compras",
                "Acesso por email e senha"
              ]}
              highlighted
              name={PLENA_PLANS.monthly.name}
              planId="monthly"
              price={PLENA_PLANS.monthly.price}
            />
            <PremiumCard
              description={PLENA_PLANS.annual.description}
              features={[
                `${PLENA_MONTHLY_MESSAGE_LIMIT} mensagens da Plena por mês`,
                "Mesmo limite mensal com melhor preço anual",
                "Histórico e receitas favoritas salvos",
                "Cardápios semanais",
                "Acesso por email e senha"
              ]}
              name={PLENA_PLANS.annual.name}
              planId="annual"
              price={PLENA_PLANS.annual.price}
            />
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-4 px-4 pb-12 pt-2 md:grid-cols-[1fr_auto] md:items-center">
          <SafetyNote />
          <LinkButton href="/ativar-acesso" variant="secondary">
            Já paguei, criar senha
          </LinkButton>
        </section>
      </main>
    </PublicShell>
  );
}
