import { NextRequest, NextResponse } from "next/server";
import { createMercadoPagoPayment } from "@/lib/mercado-pago";
import { isPlenaPaidPlanId, PLENA_PLANS } from "@/lib/plans";
import { getPlanExpiration } from "@/lib/subscription";
import { createSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

type PaymentBrickData = {
  token?: string;
  transaction_amount?: number;
  installments?: number;
  payment_method_id?: string;
  issuer_id?: string | number;
  payer?: {
    email?: string;
    identification?: {
      type?: string;
      number?: string;
    };
  };
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      checkoutId?: string;
      payment?: PaymentBrickData;
    };

    if (!body.checkoutId || !body.payment?.payment_method_id) {
      return NextResponse.json({ error: "Dados de pagamento incompletos." }, { status: 400 });
    }

    const admin = createSupabaseAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Supabase admin não configurado." }, { status: 500 });
    }

    const { data: pending, error: pendingError } = await admin
      .from("pending_subscriptions")
      .select("id, email, plan")
      .eq("id", body.checkoutId)
      .maybeSingle();

    if (pendingError || !pending || !isPlenaPaidPlanId(pending.plan)) {
      return NextResponse.json({ error: "Assinatura não encontrada." }, { status: 404 });
    }

    const payment = await createMercadoPagoPayment({
      checkoutId: pending.id,
      planId: pending.plan,
      email: pending.email,
      payment: {
        token: body.payment.token,
        transaction_amount: PLENA_PLANS[pending.plan].amount,
        installments: body.payment.installments,
        payment_method_id: body.payment.payment_method_id,
        issuer_id: body.payment.issuer_id,
        payer: {
          email: pending.email,
          identification: body.payment.payer?.identification
        }
      }
    });

    const approvedAt = payment.status === "approved" ? new Date().toISOString() : null;
    const expiresAt = payment.status === "approved" ? getPlanExpiration(pending.plan) : null;

    await admin
      .from("pending_subscriptions")
      .update({
        status: payment.status,
        provider_payment_id: String(payment.id),
        raw_event: payment,
        approved_at: approvedAt,
        plan_expires_at: expiresAt,
        updated_at: new Date().toISOString()
      })
      .eq("id", pending.id);

    return NextResponse.json({
      id: payment.id,
      status: payment.status,
      statusDetail: payment.status_detail
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Não consegui processar o pagamento." }, { status: 500 });
  }
}
