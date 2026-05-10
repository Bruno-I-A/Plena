import { AppShell } from "@/components/AppShell";
import { PremiumCard } from "@/components/PremiumCard";
import { SafetyNote } from "@/components/SafetyNote";
import { Badge } from "@/components/ui";

export default function PremiumPage() {
  return (
    <AppShell>
      <main className="mx-auto max-w-5xl px-4 py-10">
        <Badge>Plena Plus</Badge>
        <h1 className="mt-4 font-serif text-5xl leading-tight text-ink">Mais organização para cozinhar com leveza</h1>
        <p className="mt-4 max-w-2xl text-ink/68">
          Planos pensados para ampliar conversas, favoritas, cardápios simples e listas de compras, sempre no campo culinário e informativo.
        </p>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <PremiumCard
            features={["Conversas limitadas", "Histórico básico", "Algumas favoritas"]}
            name="Gratuito"
            price="R$ 0"
          />
          <PremiumCard
            features={[
              "Conversas ilimitadas",
              "Favoritos ilimitados",
              "Cardápios semanais",
              "Lista de compras",
              "Exportar receitas em PDF em breve",
              "Sugestões de rotina sem prescrição médica"
            ]}
            highlighted
            name="Plena Plus"
            price="R$ 19,90/mês"
          />
        </div>
        <div className="mt-8">
          <SafetyNote />
        </div>
      </main>
    </AppShell>
  );
}
