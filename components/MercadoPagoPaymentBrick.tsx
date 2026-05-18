"use client";

import { Check, Copy } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { PlenaPaidPlanId } from "@/lib/plans";

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

type CheckoutStatusResponse = {
  status: string;
  statusDetail?: string;
  error?: string;
};

export function MercadoPagoPaymentBrick({
  checkoutId,
  email,
  onBack
}: {
  checkoutId: string;
  email: string;
  planId: PlenaPaidPlanId;
  onBack: () => void;
}) {
  const [error, setError] = useState("");
  const [generatingPix, setGeneratingPix] = useState(false);
  const [pixPayment, setPixPayment] = useState<PaymentResponse | null>(null);
  const [copiedPix, setCopiedPix] = useState(false);
  const [pixStatus, setPixStatus] = useState("");
  const activationUrl = useMemo(
    () => `/ativar-acesso?email=${encodeURIComponent(email.trim().toLowerCase())}`,
    [email]
  );

  const checkPixStatus = useCallback(async () => {
    try {
      const response = await fetch(`/api/checkout/status?checkoutId=${encodeURIComponent(checkoutId)}`, {
        cache: "no-store"
      });
      const payload = (await response.json()) as CheckoutStatusResponse;

      if (!response.ok) {
        throw new Error(payload.error ?? "Nao consegui consultar o pagamento.");
      }

      setPixStatus(payload.status);

      if (payload.status === "approved" || payload.status === "activated") {
        window.location.href = activationUrl;
      }
    } catch {
      setPixStatus("checking_failed");
    }
  }, [activationUrl, checkoutId]);

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
            payment_method_id: "pix",
            payer: {
              email
            }
          }
        })
      });

      const payload = (await response.json()) as PaymentResponse & { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Nao consegui gerar o Pix.");
      }

      if (payload.status === "approved") {
        window.location.href = activationUrl;
        return;
      }

      if (!payload.pix?.qrCode) {
        throw new Error("O Mercado Pago nao retornou o codigo Pix. Tente novamente.");
      }

      setPixPayment(payload);
      setPixStatus(payload.status);
    } catch (pixError) {
      setError(pixError instanceof Error ? pixError.message : "Nao consegui gerar o Pix.");
    } finally {
      setGeneratingPix(false);
    }
  }, [activationUrl, checkoutId, email]);

  useEffect(() => {
    if (!pixPayment?.pix?.qrCode || pixPayment.status === "approved") return;

    checkPixStatus();
    const interval = window.setInterval(checkPixStatus, 4000);

    return () => window.clearInterval(interval);
  }, [checkPixStatus, pixPayment]);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-sage/10 px-4 py-3 text-sm leading-relaxed text-ink/70">
        Pagamento seguro por Pix processado pelo Mercado Pago.
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

            <p className="rounded-xl bg-sage/10 px-3 py-2 text-sm text-ink/70">
              {pixStatus === "checking_failed"
                ? "Pagamento gerado. Se voce ja pagou, aguarde alguns instantes ou atualize a pagina para consultar novamente."
                : "Aguardando confirmacao do pagamento Pix..."}
            </p>

            <button className="text-sm font-semibold text-sage hover:underline" onClick={checkPixStatus} type="button">
              Ja paguei, verificar agora
            </button>
          </div>
        )}
      </div>

      {error && <p className="rounded-2xl bg-rose/10 px-4 py-3 text-sm text-ink">{error}</p>}

      <button className="text-sm font-semibold text-sage hover:underline" onClick={onBack} type="button">
        Voltar e alterar dados
      </button>
    </div>
  );
}
