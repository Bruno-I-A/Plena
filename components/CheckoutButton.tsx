"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui";
import type { PlenaPaidPlanId } from "@/lib/plans";

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

  function startCheckout() {
    setLoading(true);
    setError("");
    router.push(`/assinar?plano=${planId}`);
    setTimeout(() => setLoading(false), 1000);
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
