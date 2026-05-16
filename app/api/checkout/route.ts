import { NextRequest, NextResponse } from "next/server";
import { createMercadoPagoPreference } from "@/lib/mercado-pago";
import { isPlenaPaidPlanId } from "@/lib/plans";
import { createSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { planId?: unknown; name?: string; email?: string };
    if (!isPlenaPaidPlanId(body.planId)) {
      return NextResponse.json({ error: "Escolha um plano válido." }, { status: 400 });
    }

    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();

    if (!name || name.length < 2) {
      return NextResponse.json({ error: "Informe seu nome para continuar." }, { status: 400 });
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Informe um email válido para liberar seu acesso depois do pagamento." }, { status: 400 });
    }

    const admin = createSupabaseAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Supabase admin não configurado." }, { status: 500 });
    }

    const { data: pendingCheckout, error: pendingError } = await admin
      .from("pending_subscriptions")
      .insert({
        name,
        email,
        plan: body.planId,
        status: "created"
      })
      .select("id")
      .single();

    if (pendingError || !pendingCheckout) {
      return NextResponse.json({ error: "Não consegui preparar sua assinatura agora." }, { status: 500 });
    }

    const preference = await createMercadoPagoPreference({
      planId: body.planId,
      checkoutId: pendingCheckout.id,
      email,
      name,
      origin: request.nextUrl.origin
    });

    await admin
      .from("pending_subscriptions")
      .update({ provider_preference_id: preference.id })
      .eq("id", pendingCheckout.id);

    return NextResponse.json({
      checkoutUrl: preference.init_point ?? preference.sandbox_init_point
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Não consegui iniciar o checkout agora." }, { status: 500 });
  }
}
