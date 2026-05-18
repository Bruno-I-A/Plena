"use client";

import { initMercadoPago, Payment } from "@mercadopago/sdk-react";
import type { IPaymentBrickCustomization, IPaymentFormData } from "@mercadopago/sdk-react/esm/bricks/payment/type";
import { Check, Copy } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { PLENA_PLANS, type PlenaPaidPlanId } from "@/lib/plans";

type PaymentResponse = {
  id: number;
  status: string;
  statusDetail?: string;
  pix?: {
    qrCode?: string;
    qrCodeBase64?: string;
    ticketUrl?: string;
  } | null;
};

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
  const [generatingPix, setGeneratingPix] = useState(false);
  const [pixPayment, setPixPayment] = useState<PaymentResponse | null>(null);
  const [copiedPix, setCopiedPix] = useState(false);

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
        bankTransfer: [],
        ticket: "all",
        maxInstallments: 6
      }
    }),
    []
  );

  const copyPixCode = useCallback(async (code: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedPix(true);
    window.setTimeout(() => setCopiedPix(false), 2500);
  }, []);

  const createPixPayment = useCallback(async () => {
    setGeneratingPix(true);
    setError("");

    try {
      const response = await fetch("/api/checkout/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          checkoutId,
          payment: {
            payment_method_id: "pix"
          }
        })
      });

      const payload = (await response.json()) as PaymentResponse & { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Nao consegui gerar o Pix.");
      }

      if (payload.status === "approved") {
        window.location.href = "/ativar-acesso";
        return;
      }

      if (!payload.pix?.qrCode) {
        throw new Error("O Mercado Pago nao retornou o codigo Pix. Tente novamente.");
      }

      setPixPayment(payload);
    } catch (pixError) {
      setError(pixError instanceof Error ? pixError.message : "Nao consegui gerar o Pix.");
    } finally {
      setGeneratingPix(false);
    }
  }, [checkoutId]);

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

      <div className="space-y-4 rounded-2xl border border-sage/20 bg-white/70 p-4">
        <div>
          <h2 className="font-serif text-2xl text-ink">Pix copia e cola</h2>
          <p className="mt-1 text-sm leading-relaxed text-ink/70">
            Gere o codigo Pix agora e pague pelo app do seu banco. Depois da aprovacao, use este mesmo email para ativar o acesso.
          </p>
        </div>

        {!pixPayment?.pix?.qrCode ? (
          <button
            className="rounded-full bg-sage px-5 py-3 text-sm font-semibold text-white transition hover:bg-sage/90 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={generatingPix}
            onClick={createPixPayment}
            type="button"
          >
            {generatingPix ? "Gerando Pix..." : "Gerar Pix copia e cola"}
          </button>
        ) : (
          <div className="space-y-3">
            {pixPayment.pix.qrCodeBase64 && (
              <img
                alt="QR Code Pix"
                className="h-48 w-48 rounded-xl border border-ink/10 bg-white p-2"
                src={`data:image/png;base64,${pixPayment.pix.qrCodeBase64}`}
              />
            )}

            <textarea
              className="min-h-28 w-full resize-none rounded-xl border border-sage/20 bg-white px-3 py-3 text-sm text-ink outline-none focus:border-sage"
              readOnly
              value={pixPayment.pix.qrCode}
            />

            <button
              className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-ink/90"
              onClick={() => copyPixCode(pixPayment.pix?.qrCode ?? "")}
              type="button"
            >
              {copiedPix ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copiedPix ? "Codigo copiado" : "Copiar codigo Pix"}
            </button>
          </div>
        )}
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
                const payload = (await response.json()) as PaymentResponse & { error?: string };
                if (!response.ok) {
                  throw new Error(payload.error ?? "Não consegui processar o pagamento.");
                }

                if (payload.pix?.qrCode) {
                  setPixPayment(payload);
                  resolve(payload);
                  return;
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
