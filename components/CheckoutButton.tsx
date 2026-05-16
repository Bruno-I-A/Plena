"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui";
import type { PlenaPaidPlanId } from "@/lib/plans";
import { isSupabaseConfigured, supabase } from "@/lib/supabase-browser";

export function CheckoutButton({
  planId,
  children,
  className,
  variant = "primary"
}: {
  planId: PlenaPaidPlanId;
  children: string;
  className?: string;
  variant?: "primary" | "secondary" | "ghost";
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function startCheckout() {
    if (!isSupabaseConfigured) {
      setError("O login ainda não foi configurado.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data } = await supabase.auth.getSession();
      if (!data.session?.access_token) {
        router.push("/login");
        return;
      }

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.session.access_token}`
        },
        body: JSON.stringify({ planId })
      });

      const payload = await response.json();
      if (!response.ok || !payload.checkoutUrl) {
        throw new Error(payload.error ?? "Não consegui abrir o checkout.");
      }

      window.location.href = payload.checkoutUrl;
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : "Não consegui abrir o checkout.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={className}>
      <Button className="w-full" disabled={loading} onClick={startCheckout} type="button" variant={variant}>
        {loading && <Loader2 className="animate-spin" size={17} aria-hidden />}
        {children}
      </Button>
      {error && <p className="mt-2 text-sm text-rose">{error}</p>}
    </div>
  );
}
