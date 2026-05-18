import type { SupabaseClient } from "@supabase/supabase-js";
import { getMercadoPagoPayment } from "@/lib/mercado-pago";
import { isPlenaPaidPlanId, PLENA_PLANS } from "@/lib/plans";

export type SubscriptionStatus = {
  active: boolean;
  plan: "free" | "plena_monthly" | "plena_annual";
  expiresAt: string | null;
};

export async function getSubscriptionStatus(database: SupabaseClient, userId: string): Promise<SubscriptionStatus> {
  const { data, error } = await database
    .from("profiles")
    .select("plan, plan_expires_at")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  const plan = data?.plan === "plena_monthly" || data?.plan === "plena_annual" ? data.plan : "free";
  const expiresAt = typeof data?.plan_expires_at === "string" ? data.plan_expires_at : null;
  const active = plan !== "free" && (!expiresAt || new Date(expiresAt).getTime() > Date.now());

  return {
    active,
    plan,
    expiresAt
  };
}

export function getPlanExpiration(planId: "monthly" | "annual", from = new Date()) {
  const expiresAt = new Date(from);
  if (planId === "monthly") {
    expiresAt.setMonth(expiresAt.getMonth() + 1);
  } else {
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);
  }

  return expiresAt.toISOString();
}

export async function activateApprovedPurchaseForUser(
  database: SupabaseClient,
  user: { id: string; email?: string | null }
) {
  const email = user.email?.trim().toLowerCase();
  if (!email) return false;

  const { data: pendingPurchases, error } = await database
    .from("pending_subscriptions")
    .select("id, email, plan, status, provider_payment_id, approved_at, plan_expires_at, created_at")
    .ilike("email", email)
    .order("created_at", { ascending: false })
    .limit(5);

  if (error || !pendingPurchases?.length) {
    if (error) throw error;
    return false;
  }

  for (const pending of pendingPurchases) {
    if (!isPlenaPaidPlanId(pending.plan)) continue;

    let status = pending.status;
    let approvedAt = pending.approved_at as string | null;
    let expiresAt = pending.plan_expires_at as string | null;
    let rawEvent: unknown = null;

    if (status !== "approved" && status !== "activated" && pending.provider_payment_id) {
      const payment = await getMercadoPagoPayment(String(pending.provider_payment_id));
      status = payment.status;
      rawEvent = payment;

      if (payment.status === "approved") {
        approvedAt = new Date().toISOString();
        expiresAt = getPlanExpiration(pending.plan);

        await database
          .from("pending_subscriptions")
          .update({
            status,
            raw_event: payment,
            approved_at: approvedAt,
            plan_expires_at: expiresAt,
            updated_at: new Date().toISOString()
          })
          .eq("id", pending.id);
      }
    }

    if (status !== "approved" && status !== "activated") continue;

    await database.from("profiles").upsert(
      {
        id: user.id,
        email,
        plan: PLENA_PLANS[pending.plan].profilePlan,
        billing_cycle: pending.plan === "monthly" ? "monthly" : "annual",
        plan_started_at: approvedAt ?? new Date().toISOString(),
        plan_expires_at: expiresAt ?? getPlanExpiration(pending.plan)
      },
      { onConflict: "id" }
    );

    await database
      .from("pending_subscriptions")
      .update({
        status: "activated",
        activated_user_id: user.id,
        ...(rawEvent ? { raw_event: rawEvent } : {}),
        updated_at: new Date().toISOString()
      })
      .eq("id", pending.id);

    return true;
  }

  return false;
}
