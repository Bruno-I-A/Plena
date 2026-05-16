import { NextRequest, NextResponse } from "next/server";
import { createMercadoPagoPreference } from "@/lib/mercado-pago";
import { isPlenaPaidPlanId } from "@/lib/plans";
import { createSupabaseAdmin } from "@/lib/supabase-admin";
import { getAuthenticatedUser } from "@/lib/server-auth";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: "Entre na sua conta antes de escolher um plano." }, { status: 401 });
    }

    const body = (await request.json()) as { planId?: unknown };
    if (!isPlenaPaidPlanId(body.planId)) {
      return NextResponse.json({ error: "Escolha um plano válido." }, { status: 400 });
    }

    const preference = await createMercadoPagoPreference({
      planId: body.planId,
      userId: user.id,
      email: user.email,
      origin: request.nextUrl.origin
    });

    const admin = createSupabaseAdmin();
    if (admin) {
      await admin.from("payments").insert({
        user_id: user.id,
        plan: body.planId,
        provider: "mercado_pago",
        provider_preference_id: preference.id,
        status: "created"
      });
    }

    return NextResponse.json({
      checkoutUrl: preference.init_point ?? preference.sandbox_init_point
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Não consegui iniciar o checkout agora." }, { status: 500 });
  }
}
