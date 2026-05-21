import { NextRequest, NextResponse } from "next/server";
import { getMercadoPagoPayment } from "@/lib/mercado-pago";
import { isPlenaPaidPlanId } from "@/lib/plans";
import { createSupabaseAdmin } from "@/lib/supabase-admin";
import { activateApprovedPurchaseForUser, getPlanExpiration } from "@/lib/subscription";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { email?: unknown; password?: unknown };
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Informe o email usado na compra." }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "A senha precisa ter pelo menos 6 caracteres." }, { status: 400 });
    }

    const admin = createSupabaseAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Supabase admin nao configurado." }, { status: 500 });
    }

    const { data: pendingPurchases, error: pendingError } = await admin
      .from("pending_subscriptions")
      .select("id, name, email, plan, status, provider_payment_id")
      .ilike("email", email)
      .order("created_at", { ascending: false })
      .limit(5);

    if (pendingError) {
      throw pendingError;
    }

    let eligiblePurchase = pendingPurchases?.find((purchase) => {
      return isPlenaPaidPlanId(purchase.plan) && (purchase.status === "approved" || purchase.status === "activated");
    });

    for (const purchase of pendingPurchases ?? []) {
      if (eligiblePurchase || !isPlenaPaidPlanId(purchase.plan) || !purchase.provider_payment_id) continue;

      const payment = await getMercadoPagoPayment(String(purchase.provider_payment_id));
      if (payment.status !== "approved") continue;

      const approvedAt = new Date().toISOString();
      const expiresAt = getPlanExpiration(purchase.plan);

      await admin
        .from("pending_subscriptions")
        .update({
          status: "approved",
          raw_event: payment,
          approved_at: approvedAt,
          plan_expires_at: expiresAt,
          updated_at: approvedAt
        })
        .eq("id", purchase.id);

      eligiblePurchase = {
        ...purchase,
        status: "approved"
      };
    }

    if (!eligiblePurchase) {
      return NextResponse.json(
        { error: "Nao encontrei uma compra aprovada para este email." },
        { status: 403 }
      );
    }

    const { data: createdUser, error: createError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name: eligiblePurchase.name
      }
    });

    if (createError || !createdUser.user) {
      const message = createError?.message ?? "Nao foi possivel criar seu acesso agora.";
      const alreadyRegistered = /already|registered|exists/i.test(message);

      return NextResponse.json(
        {
          error: alreadyRegistered
            ? "Este email ja tem acesso criado. Entre com sua senha na tela de login."
            : message
        },
        { status: alreadyRegistered ? 409 : 500 }
      );
    }

    await activateApprovedPurchaseForUser(admin, {
      id: createdUser.user.id,
      email
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Nao foi possivel criar seu acesso agora." }, { status: 500 });
  }
}
