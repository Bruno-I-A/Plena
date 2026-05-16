export const PLENA_MONTHLY_MESSAGE_LIMIT = 120;

export type PlenaPaidPlanId = "monthly" | "annual";

export const PLENA_PLANS = {
  monthly: {
    id: "monthly",
    profilePlan: "plena_monthly",
    name: "Plena Mensal",
    price: "R$ 34,99/mês",
    amount: 34.99,
    description: "Para usar a Plena com flexibilidade mês a mês."
  },
  annual: {
    id: "annual",
    profilePlan: "plena_annual",
    name: "Plena Anual",
    price: "R$ 352/ano",
    amount: 352,
    description: "Economize pagando o ano inteiro de uma vez."
  }
} as const;

export function isPlenaPaidPlanId(value: unknown): value is PlenaPaidPlanId {
  return value === "monthly" || value === "annual";
}
