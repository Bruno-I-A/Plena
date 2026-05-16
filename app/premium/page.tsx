import { AppShell } from "@/components/AppShell";
import { PremiumCard } from "@/components/PremiumCard";
import { SafetyNote } from "@/components/SafetyNote";
import { Badge } from "@/components/ui";
import { PLENA_MONTHLY_MESSAGE_LIMIT, PLENA_PLANS } from "@/lib/plans";

export default function PremiumPage() {
  return (
    <AppShell>
      <main className="mx-auto max-w-5xl px-4 py-10">
        <Badge>Plena Plus</Badge>
        <h1 className="mt-4 font-serif text-5xl leading-tight text-ink">Mais organização para cozinhar com leveza</h1>
        <p className="mt-4 max-w-2xl text-ink/68">
          O plano pago da Plena inclui {PLENA_MONTHLY_MESSAGE_LIMIT} mensagens da assistente por mês para receitas, substituições,
          cardápios simples e listas de compras.
        </p>
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          <PremiumCard
            cta="Criar login"
            description="Para experimentar a Plena e manter seu histórico salvo."
            features={["Login com email e senha", "Histórico básico", "Receitas favoritas"]}
            name="Gratuito"
            price="R$ 0"
          />
          <PremiumCard
            description={PLENA_PLANS.monthly.description}
            features={[
              `${PLENA_MONTHLY_MESSAGE_LIMIT} mensagens da Plena por mês`,
              "Histórico e favoritas salvos",
              "Cardápios semanais",
              "Lista de compras",
              "Sugestões de rotina sem prescrição médica"
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
              "Histórico e favoritas salvos",
              "Cardápios semanais",
              "Lista de compras"
            ]}
            name={PLENA_PLANS.annual.name}
            planId="annual"
            price={PLENA_PLANS.annual.price}
          />
        </div>
        <div className="mt-8">
          <SafetyNote />
        </div>
      </main>
    </AppShell>
  );
}
