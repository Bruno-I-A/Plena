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
    const checkoutId = payment.metadata?.checkout_id ?? payment.external_reference;
    const userId = payment.metadata?.user_id ?? externalUserId;
    const planId = payment.metadata?.plan_id ?? externalPlanId;

    if (!isPlenaPaidPlanId(planId)) {
      return NextResponse.json({ error: "Pagamento sem referência de usuário ou plano." }, { status: 400 });
    }

    if (checkoutId) {
      const { data: pending } = await admin
        .from("pending_subscriptions")
        .select("id, email")
        .eq("id", checkoutId)
        .maybeSingle();

      if (pending) {
        const approvedAt = payment.status === "approved" ? new Date().toISOString() : null;
        const expiresAt = payment.status === "approved" ? getPlanExpiration(planId) : null;

        await admin
          .from("pending_subscriptions")
          .update({
            plan: planId,
            status: payment.status,
            provider_payment_id: String(payment.id),
            raw_event: payment,
            approved_at: approvedAt,
            plan_expires_at: expiresAt,
            updated_at: new Date().toISOString()
          })
          .eq("id", pending.id);

        if (payment.status === "approved") {
          const { data: profile } = await admin
            .from("profiles")
            .select("id")
            .ilike("email", pending.email)
            .maybeSingle();

          if (profile) {
            await admin
              .from("profiles")
              .update({
                plan: PLENA_PLANS[planId].profilePlan,
                billing_cycle: planId === "monthly" ? "monthly" : "annual",
                plan_started_at: approvedAt,
                plan_expires_at: expiresAt
              })
              .eq("id", profile.id);

            await admin
              .from("pending_subscriptions")
              .update({ status: "activated", activated_user_id: profile.id })
              .eq("id", pending.id);
          }
        }

        return NextResponse.json({ received: true });
      }
    }

    if (!userId) {
      return NextResponse.json({ error: "Pagamento sem usuário ou assinatura pendente." }, { status: 400 });
    }

    const { data: existingPayment } = await admin
      .from("payments")
      .select("id")
      .eq("provider", "mercado_pago")
      .eq("provider_payment_id", String(payment.id))
      .maybeSingle();

    if (existingPayment) {
      await admin
        .from("payments")
        .update({
          plan: planId,
          provider_payment_id: String(payment.id),
          status: payment.status,
          raw_event: payment,
          updated_at: new Date().toISOString()
        })
        .eq("id", existingPayment.id);
    } else {
      await admin.from("payments").insert({
        user_id: userId,
        plan: planId,
        provider: "mercado_pago",
        provider_payment_id: String(payment.id),
        status: payment.status,
        raw_event: payment,
        updated_at: new Date().toISOString()
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
