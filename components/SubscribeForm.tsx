"use client";

import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { Button } from "@/components/ui";
import { isPlenaPaidPlanId, PLENA_PLANS, type PlenaPaidPlanId } from "@/lib/plans";

export function SubscribeForm({ initialPlan = "monthly" }: { initialPlan?: PlenaPaidPlanId }) {
  const searchParams = useSearchParams();
  const planFromUrl = searchParams.get("plano");
  const [planId, setPlanId] = useState<PlenaPaidPlanId>(isPlenaPaidPlanId(planFromUrl) ? planFromUrl : initialPlan);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedPlan = useMemo(() => PLENA_PLANS[planId], [planId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          planId,
          name,
          email
        })
      });

      const payload = await response.json();
      if (!response.ok || !payload.checkoutUrl) {
        throw new Error(payload.error ?? "Não consegui abrir o checkout.");
      }

      window.location.href = payload.checkoutUrl;
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : "Não consegui abrir o checkout.");
      setLoading(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid gap-3 sm:grid-cols-2">
        <PlanButton active={planId === "monthly"} onClick={() => setPlanId("monthly")} price={PLENA_PLANS.monthly.price} title="Mensal" />
        <PlanButton active={planId === "annual"} onClick={() => setPlanId("annual")} price={PLENA_PLANS.annual.price} title="Anual" />
      </div>

      <label className="block text-sm font-semibold text-ink/72">
        Nome
        <input
          autoComplete="name"
          className="mt-2 w-full rounded-2xl border border-sage/18 bg-white px-4 py-3 text-ink outline-none transition placeholder:text-ink/35 focus:border-sage focus:ring-4 focus:ring-sage/10"
          onChange={(event) => setName(event.target.value)}
          placeholder="Seu nome"
          required
          value={name}
        />
      </label>

      <label className="block text-sm font-semibold text-ink/72">
        Email de acesso
        <input
          autoComplete="email"
          className="mt-2 w-full rounded-2xl border border-sage/18 bg-white px-4 py-3 text-ink outline-none transition placeholder:text-ink/35 focus:border-sage focus:ring-4 focus:ring-sage/10"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="voce@email.com"
          required
          type="email"
          value={email}
        />
      </label>

      <div className="rounded-2xl bg-sage/10 px-4 py-3 text-sm leading-relaxed text-ink/70">
        Você vai pagar o plano {selectedPlan.name.toLowerCase()} no Mercado Pago. Depois do pagamento, crie sua senha usando este mesmo email.
      </div>

      <Button className="w-full" disabled={loading} type="submit">
        {loading && <Loader2 className="animate-spin" size={17} aria-hidden />}
        Ir para pagamento
      </Button>

      {error && <p className="rounded-2xl bg-rose/10 px-4 py-3 text-sm text-ink">{error}</p>}
    </form>
  );
}

function PlanButton({ active, onClick, price, title }: { active: boolean; onClick: () => void; price: string; title: string }) {
  return (
    <button
      className={`rounded-2xl border px-4 py-4 text-left transition ${
        active ? "border-sage bg-sage/10 ring-4 ring-sage/10" : "border-sage/15 bg-white/70 hover:border-sage/35"
      }`}
      onClick={onClick}
      type="button"
    >
      <span className="block font-serif text-2xl text-ink">{title}</span>
      <span className="mt-1 block text-sm font-semibold text-sage">{price}</span>
    </button>
  );
}
