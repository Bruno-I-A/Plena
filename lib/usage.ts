import type { SupabaseClient } from "@supabase/supabase-js";
import { PLENA_MONTHLY_MESSAGE_LIMIT } from "@/lib/plans";

export type MonthlyUsage = {
  limit: number;
  used: number;
  remaining: number;
  resetAt: string;
};

export function getCurrentUsageWindow(date = new Date()) {
  const startAt = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
  const resetAt = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1));

  return {
    startAt: startAt.toISOString(),
    resetAt: resetAt.toISOString()
  };
}

export async function getMonthlyPlenaUsage(database: SupabaseClient, userId: string): Promise<MonthlyUsage> {
  const { startAt, resetAt } = getCurrentUsageWindow();
  const { count, error } = await database
    .from("messages")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("role", "assistant")
    .gte("created_at", startAt)
    .lt("created_at", resetAt);

  if (error) {
    throw error;
  }

  const used = count ?? 0;

  return {
    limit: PLENA_MONTHLY_MESSAGE_LIMIT,
    used,
    remaining: Math.max(PLENA_MONTHLY_MESSAGE_LIMIT - used, 0),
    resetAt
  };
}
