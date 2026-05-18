import { NextRequest, NextResponse } from "next/server";
import { getMercadoPagoPayment } from "@/lib/mercado-pago";
import { isPlenaPaidPlanId, PLENA_PLANS } from "@/lib/plans";
import { getPlanExpiration } from "@/lib/subscription";
import { createSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const checkoutId = request.nextUrl.searchParams.get("checkoutId");
    if (!checkoutId) {
      return NextResponse.json({ error: "Checkout não informado." }, { status: 400 });
    }

    const admin = createSupabaseAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Supabase admin não configurado." }, { status: 500 });
    }

    const { data: pending, error } = await admin
      .from("pending_subscriptions")
      .select("id, email, plan, status, provider_payment_id")
      .eq("id", checkoutId)
      .maybeSingle();

    if (error || !pending || !isPlenaPaidPlanId(pending.plan)) {
      return NextResponse.json({ error: "Assinatura não encontrada." }, { status: 404 });
    }

    if (!pending.provider_payment_id || pending.status === "approved" || pending.status === "activated") {
      return NextResponse.json({
        status: pending.status,
        providerPaymentId: pending.provider_payment_id
      });
    }

    const payment = await getMercadoPagoPayment(pending.provider_payment_id);
    const planId = payment.metadata?.plan_id ?? pending.plan;
    if (!isPlenaPaidPlanId(planId)) {
      return NextResponse.json({ error: "Pagamento sem plano válido." }, { status: 400 });
    }

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

    return NextResponse.json({
      status: payment.status,
      statusDetail: payment.status_detail,
      providerPaymentId: String(payment.id)
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Não consegui consultar o pagamento." }, { status: 500 });
  }
}
