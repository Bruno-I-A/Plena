"use client";

import { initMercadoPago, Payment } from "@mercadopago/sdk-react";
import type { IPaymentBrickCustomization, IPaymentFormData } from "@mercadopago/sdk-react/esm/bricks/payment/type";
import { useEffect, useMemo, useState } from "react";
import { PLENA_PLANS, type PlenaPaidPlanId } from "@/lib/plans";

export function MercadoPagoPaymentBrick({
  checkoutId,
  email,
  planId,
  onBack
}: {
  checkoutId: string;
  email: string;
  planId: PlenaPaidPlanId;
  onBack: () => void;
}) {
  const [publicKey, setPublicKey] = useState(process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY ?? "");
  const [loadingPublicKey, setLoadingPublicKey] = useState(!publicKey);
  const [error, setError] = useState("");

  useEffect(() => {
    if (publicKey) {
      setLoadingPublicKey(false);
      return;
    }

    let active = true;

    fetch("/api/checkout/public-key", { cache: "no-store" })
      .then(async (response) => {
        const payload = (await response.json()) as { publicKey?: string };
        if (active) {
          setPublicKey(payload.publicKey ?? "");
        }
      })
      .catch(() => {
        if (active) {
          setPublicKey("");
        }
      })
      .finally(() => {
        if (active) {
          setLoadingPublicKey(false);
        }
      });

    return () => {
      active = false;
    };
  }, [publicKey]);

  useEffect(() => {
    if (publicKey) {
      initMercadoPago(publicKey, { locale: "pt-BR" });
    }
  }, [publicKey]);

  const initialization = useMemo(
    () => ({
      amount: PLENA_PLANS[planId].amount,
      payer: {
        email
      }
    }),
    [email, planId]
  );

  const customization = useMemo<IPaymentBrickCustomization>(
    () => ({
      visual: {
        style: {
          theme: "default"
        }
      },
      paymentMethods: {
        creditCard: "all",
        debitCard: "all",
        bankTransfer: "all",
        ticket: "all",
        maxInstallments: 6
      }
    }),
    []
  );

  if (loadingPublicKey) {
    return (
      <div className="rounded-2xl bg-sage/10 px-4 py-3 text-sm text-ink/70">
        Preparando pagamento seguro...
      </div>
    );
  }

  if (!publicKey) {
    return (
      <div className="rounded-2xl bg-rose/10 px-4 py-3 text-sm text-ink">
        Configure MERCADO_PAGO_PUBLIC_KEY ou NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY para exibir o pagamento na Plena.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-sage/10 px-4 py-3 text-sm leading-relaxed text-ink/70">
        Pagamento seguro processado pelo Mercado Pago, sem sair da Plena.
      </div>

      <Payment
        customization={customization}
        initialization={initialization}
        onError={(paymentError) => {
          console.error(paymentError);
          setError("Não consegui carregar o pagamento agora.");
        }}
        onReady={() => setError("")}
        onSubmit={({ formData }: IPaymentFormData) =>
          new Promise((resolve, reject) => {
            fetch("/api/checkout/payment", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                checkoutId,
                payment: formData as unknown as Record<string, unknown>
              })
            })
              .then(async (response) => {
                const payload = await response.json();
                if (!response.ok) {
                  throw new Error(payload.error ?? "Não consegui processar o pagamento.");
                }

                if (payload.status === "approved") {
                  window.location.href = "/ativar-acesso";
                  resolve(payload);
                  return;
                }

                if (payload.status === "pending" || payload.status === "in_process") {
                  window.location.href = "/checkout/pending";
                  resolve(payload);
                  return;
                }

                reject(new Error("Pagamento não aprovado. Tente outro método."));
              })
              .catch((submitError) => {
                setError(submitError instanceof Error ? submitError.message : "Não consegui processar o pagamento.");
                reject(submitError);
              });
          })
        }
      />

      {error && <p className="rounded-2xl bg-rose/10 px-4 py-3 text-sm text-ink">{error}</p>}

      <button className="text-sm font-semibold text-sage hover:underline" onClick={onBack} type="button">
        Voltar e alterar dados
      </button>
    </div>
  );
}
