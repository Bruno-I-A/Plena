import { NextRequest, NextResponse } from "next/server";
import {
  getMercadoPagoPayment,
  getPaymentDataId,
  verifyMercadoPagoWebhookSignature
} from "@/lib/mercado-pago";
import { isPlenaPaidPlanId, PLENA_PLANS } from "@/lib/plans";
import { getPlanExpiration } from "@/lib/subscription";
import { createSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

type MercadoPagoWebhookBody = {
  type?: string;
  topic?: string;
  data?: {
    id?: string | number;
  };
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as MercadoPagoWebhookBody;
    const paymentId = getPaymentDataId(request, body);

    if (!verifyMercadoPagoWebhookSignature(request, paymentId)) {
      return NextResponse.json({ error: "Assinatura inválida." }, { status: 401 });
    }

    const topic = body.type ?? body.topic ?? request.nextUrl.searchParams.get("topic");
    if (topic !== "payment" || !paymentId) {
      return NextResponse.json({ received: true });
    }

    const admin = createSupabaseAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Supabase admin não configurado." }, { status: 500 });
    }

    const payment = await getMercadoPagoPayment(paymentId);
    const [externalUserId, externalPlanId] = payment.external_reference?.split(":") ?? [];
    const userId = payment.metadata?.user_id ?? externalUserId;
    const planId = payment.metadata?.plan_id ?? externalPlanId;

    if (!userId || !isPlenaPaidPlanId(planId)) {
      return NextResponse.json({ error: "Pagamento sem referência de usuário ou plano." }, { status: 400 });
    }

    const paymentRecord = {
      user_id: userId,
      plan: planId,
      provider: "mercado_pago",
      provider_payment_id: String(payment.id),
      status: payment.status,
      raw_event: payment,
      updated_at: new Date().toISOString()
    };

    const { data: existingPayment } = await admin
      .from("payments")
      .select("id")
      .eq("provider", "mercado_pago")
      .eq("provider_payment_id", String(payment.id))
      .maybeSingle();

    if (existingPayment) {
      await admin
        .from("payments")
        .update(paymentRecord)
        .eq("id", existingPayment.id);
    } else {
      await admin.from("payments").insert({
        ...paymentRecord,
        user_id: userId,
        plan: planId
      });
    }

    if (payment.status === "approved") {
      await admin
        .from("profiles")
        .update({
          plan: PLENA_PLANS[planId].profilePlan,
          billing_cycle: planId === "monthly" ? "monthly" : "annual",
          plan_started_at: new Date().toISOString(),
          plan_expires_at: getPlanExpiration(planId)
        })
        .eq("id", userId);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Não consegui processar o webhook." }, { status: 500 });
  }
}
