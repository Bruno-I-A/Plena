import type { SupabaseClient } from "@supabase/supabase-js";

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
