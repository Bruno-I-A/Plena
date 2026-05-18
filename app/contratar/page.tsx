import { PremiumCard } from "@/components/PremiumCard";
import { PublicShell } from "@/components/PublicShell";
import { SafetyNote } from "@/components/SafetyNote";
import { Badge, LinkButton } from "@/components/ui";
import { PLENA_MONTHLY_MESSAGE_LIMIT, PLENA_PLANS } from "@/lib/plans";

export default function HirePage() {
  return (
    <PublicShell>
      <main className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <section className="max-w-3xl">
          <Badge>Contratar Plena</Badge>
          <h1 className="mt-5 font-serif text-5xl leading-tight text-ink md:text-6xl">
            Contrate a Plena e crie seu acesso em seguida
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-ink/68">
            Escolha o plano, pague com segurança pelo Mercado Pago e crie uma senha usando o mesmo email da compra. Depois disso, você entra direto no app.
          </p>
        </section>

        <div className="mt-9 grid gap-5 lg:grid-cols-2">
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

        <div className="mt-8 grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
          <SafetyNote />
          <LinkButton href="/ativar-acesso" variant="secondary">
            Já paguei, criar senha
          </LinkButton>
        </div>
      </main>
    </PublicShell>
  );
}
