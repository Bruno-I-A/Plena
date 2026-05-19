"use client";

import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { MercadoPagoPaymentBrick } from "@/components/MercadoPagoPaymentBrick";
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
  const [checkoutId, setCheckoutId] = useState<string | null>(null);

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
      if (!response.ok || !payload.checkoutId) {
        throw new Error(payload.error ?? "Não consegui preparar o pagamento.");
      }

      setCheckoutId(payload.checkoutId);
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : "Não consegui preparar o pagamento.");
    } finally {
      setLoading(false);
    }
  }

  if (checkoutId) {
    return (
      <MercadoPagoPaymentBrick
        checkoutId={checkoutId}
        email={email.trim().toLowerCase()}
        onBack={() => setCheckoutId(null)}
        planId={planId}
      />
    );
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid gap-3 sm:grid-cols-2">
        <PlanButton active={planId === "monthly"} onClick={() => setPlanId("monthly")} price={PLENA_PLANS.monthly.price} title="Mensal" />
        <PlanButton active={planId === "annual"} onClick={() => setPlanId("annual")} price={PLENA_PLANS.annual.price} title="Anual" />
      </div>

      <label className="block text-sm font-bold text-[#2a261f]/80">
        Nome
        <input
          autoComplete="name"
          className="mt-2 w-full rounded-2xl border border-[#dbcfb4] bg-white px-4 py-3 text-[#2a261f] outline-none transition placeholder:text-[#7a6f5e]/45 focus:border-[#5e6b3f] focus:ring-4 focus:ring-[#5e6b3f]/10"
          onChange={(event) => setName(event.target.value)}
          placeholder="Seu nome"
          required
          value={name}
        />
      </label>

      <label className="block text-sm font-bold text-[#2a261f]/80">
        Email de acesso
        <input
          autoComplete="email"
          className="mt-2 w-full rounded-2xl border border-[#dbcfb4] bg-white px-4 py-3 text-[#2a261f] outline-none transition placeholder:text-[#7a6f5e]/45 focus:border-[#5e6b3f] focus:ring-4 focus:ring-[#5e6b3f]/10"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="voce@email.com"
          required
          type="email"
          value={email}
        />
      </label>

      <div className="rounded-2xl bg-[#ece1c8] px-4 py-3 text-sm leading-relaxed text-[#7a6f5e]">
        Você vai pagar o plano {selectedPlan.name.toLowerCase()} por Pix. Depois do pagamento, crie sua senha usando este mesmo email.
      </div>

      <Button className="w-full bg-[#3f4a2a] hover:bg-[#344020]" disabled={loading} type="submit">
        {loading && <Loader2 className="animate-spin" size={17} aria-hidden />}
        Continuar para pagamento
      </Button>

      {error && <p className="rounded-2xl bg-rose/10 px-4 py-3 text-sm text-ink">{error}</p>}
    </form>
  );
}

function PlanButton({ active, onClick, price, title }: { active: boolean; onClick: () => void; price: string; title: string }) {
  return (
    <button
      className={`rounded-2xl border px-4 py-4 text-left transition ${
        active
          ? "border-[#3f4a2a] bg-[#ece1c8] ring-4 ring-[#5e6b3f]/15"
          : "border-[#dbcfb4] bg-white/80 hover:border-[#5e6b3f]/45"
      }`}
      onClick={onClick}
      type="button"
    >
      <span className="block font-serif text-3xl text-[#2a261f]">{title}</span>
      <span className="mt-2 block text-sm font-bold text-[#5e6b3f]">{price}</span>
    </button>
  );
}
