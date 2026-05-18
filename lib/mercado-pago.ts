import crypto from "crypto";
import { PLENA_PLANS, type PlenaPaidPlanId } from "@/lib/plans";

export type MercadoPagoPayment = {
  id: number;
  status: string;
  status_detail?: string;
  external_reference?: string;
  metadata?: {
    user_id?: string;
    plan_id?: PlenaPaidPlanId;
    checkout_id?: string;
  };
};

type MercadoPagoPaymentRequest = {
  token?: string;
  transaction_amount: number;
  installments?: number;
  payment_method_id: string;
  issuer_id?: string | number;
  payer: {
    email: string;
    identification?: {
      type?: string;
      number?: string;
    };
  };
};

function getMercadoPagoAccessToken() {
  return process.env.MERCADO_PAGO_ACCESS_TOKEN;
}

export async function getMercadoPagoPayment(paymentId: string) {
  const accessToken = getMercadoPagoAccessToken();
  if (!accessToken) {
    throw new Error("MERCADO_PAGO_ACCESS_TOKEN não configurado.");
  }

  const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Não consegui consultar o pagamento no Mercado Pago: ${details}`);
  }

  return (await response.json()) as MercadoPagoPayment;
}

export async function createMercadoPagoPayment({
  payment,
  checkoutId,
  planId,
  email
}: {
  payment: MercadoPagoPaymentRequest;
  checkoutId: string;
  planId: PlenaPaidPlanId;
  email: string;
}) {
  const accessToken = getMercadoPagoAccessToken();
  if (!accessToken) {
    throw new Error("MERCADO_PAGO_ACCESS_TOKEN não configurado.");
  }

  const plan = PLENA_PLANS[planId];
  const response = await fetch("https://api.mercadopago.com/v1/payments", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "X-Idempotency-Key": crypto.randomUUID()
    },
    body: JSON.stringify({
      ...payment,
      transaction_amount: plan.amount,
      description: plan.name,
      external_reference: checkoutId,
      metadata: {
        checkout_id: checkoutId,
        plan_id: planId
      },
      payer: {
        ...payment.payer,
        email
      }
    })
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload?.message ?? "Mercado Pago recusou o pagamento.");
  }

  return payload as MercadoPagoPayment;
}

export function getPaymentDataId(request: Request, body: unknown) {
  const url = new URL(request.url);
  const queryDataId = url.searchParams.get("data.id");
  if (queryDataId) return queryDataId;

  if (
    body &&
    typeof body === "object" &&
    "data" in body &&
    body.data &&
    typeof body.data === "object" &&
    "id" in body.data
  ) {
    return String(body.data.id);
  }

  return null;
}

export function verifyMercadoPagoWebhookSignature(request: Request, dataId: string | null) {
  const secret = process.env.MERCADO_PAGO_WEBHOOK_SECRET;
  if (!secret) return true;

  const signature = request.headers.get("x-signature");
  const requestId = request.headers.get("x-request-id");
  if (!signature || !requestId) return false;

  const parts = Object.fromEntries(
    signature.split(",").map((part) => {
      const [key, value] = part.split("=", 2);
      return [key?.trim(), value?.trim()];
    })
  );

  const timestamp = parts.ts;
  const hash = parts.v1;
  if (!timestamp || !hash) return false;

  const manifest = `id:${dataId ?? ""};request-id:${requestId};ts:${timestamp};`;
  const expected = crypto.createHmac("sha256", secret).update(manifest).digest("hex");

  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(hash));
}
