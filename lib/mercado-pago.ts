import crypto from "crypto";
import { PLENA_PLANS, type PlenaPaidPlanId } from "@/lib/plans";

type MercadoPagoPreferenceResponse = {
  id: string;
  init_point?: string;
  sandbox_init_point?: string;
};

export type MercadoPagoPayment = {
  id: number;
  status: string;
  external_reference?: string;
  metadata?: {
    user_id?: string;
    plan_id?: PlenaPaidPlanId;
    checkout_id?: string;
  };
};

function getMercadoPagoAccessToken() {
  return process.env.MERCADO_PAGO_ACCESS_TOKEN;
}

export async function createMercadoPagoPreference({
  planId,
  userId,
  checkoutId,
  email,
  name,
  origin
}: {
  planId: PlenaPaidPlanId;
  userId?: string | null;
  checkoutId?: string | null;
  email?: string | null;
  name?: string | null;
  origin: string;
}) {
  const accessToken = getMercadoPagoAccessToken();
  if (!accessToken) {
    throw new Error("MERCADO_PAGO_ACCESS_TOKEN não configurado.");
  }

  const plan = PLENA_PLANS[planId];
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? origin;
  const notificationUrl = process.env.MERCADO_PAGO_NOTIFICATION_URL ?? `${siteUrl}/api/checkout/webhook`;
  const canUseNotificationUrl = notificationUrl.startsWith("https://");

  const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      items: [
        {
          id: `plena-${planId}`,
          title: plan.name,
          description: plan.description,
          quantity: 1,
          currency_id: "BRL",
          unit_price: plan.amount
        }
      ],
      payer: email ? { email, name: name ?? undefined } : undefined,
      external_reference: checkoutId ?? (userId ? `${userId}:${planId}` : undefined),
      metadata: {
        ...(userId ? { user_id: userId } : {}),
        ...(checkoutId ? { checkout_id: checkoutId } : {}),
        plan_id: planId
      },
      back_urls: {
        success: `${siteUrl}/checkout/success`,
        failure: `${siteUrl}/checkout/failure`,
        pending: `${siteUrl}/checkout/pending`
      },
      auto_return: "approved",
      ...(canUseNotificationUrl ? { notification_url: notificationUrl } : {})
    })
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Mercado Pago recusou a preferência: ${details}`);
  }

  return (await response.json()) as MercadoPagoPreferenceResponse;
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
