"use client";

import { Loader2, Save } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui";
import { isSupabaseConfigured, supabase } from "@/lib/supabase-browser";
import type { CookingTime, FoodGoal, ProfilePreferences } from "@/lib/types";

type Feedback = {
  tone: "success" | "error";
  text: string;
};

const restrictionOptions = ["Lactose", "Glúten", "Ovo", "Soja", "Amendoim", "Castanhas", "Peixe", "Frutos do mar"];
const mealFocusOptions = ["Café da manhã", "Almoço", "Jantar", "Lanches", "Doces mais leves", "Marmitas", "Lista de compras"];

const goalOptions: { value: FoodGoal; label: string }[] = [
  { value: "balanced", label: "Equilíbrio" },
  { value: "lighter", label: "Mais leve" },
  { value: "cutting", label: "Cutting" },
  { value: "bulking", label: "Bulking" },
  { value: "more_protein", label: "Mais proteína" },
  { value: "maintain_weight", label: "Manutenção" }
];

const cookingTimeOptions: { value: CookingTime; label: string }[] = [
  { value: "quick", label: "Rápido" },
  { value: "medium", label: "Moderado" },
  { value: "flexible", label: "Flexível" }
];

const defaultPreferences: ProfilePreferences = {
  dietary_restrictions: [],
  disliked_ingredients: [],
  food_goal: "balanced",
  meal_focus: [],
  cooking_time: "flexible",
  preference_notes: ""
};

function parseList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 30);
}

function toggleItem(items: string[], item: string) {
  return items.includes(item) ? items.filter((current) => current !== item) : [...items, item];
}

export function ProfilePreferencesForm() {
  const [userId, setUserId] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<ProfilePreferences>(defaultPreferences);
  const [customRestrictions, setCustomRestrictions] = useState("");
  const [dislikedText, setDislikedText] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    supabase.auth.getUser().then(async ({ data }) => {
      const id = data.user?.id ?? null;
      setUserId(id);

      if (!id) {
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("dietary_restrictions, disliked_ingredients, food_goal, meal_focus, cooking_time, preference_notes")
        .eq("id", id)
        .maybeSingle();

      if (profile) {
        const loadedPreferences = {
          dietary_restrictions: profile.dietary_restrictions ?? [],
          disliked_ingredients: profile.disliked_ingredients ?? [],
          food_goal: profile.food_goal ?? "balanced",
          meal_focus: profile.meal_focus ?? [],
          cooking_time: profile.cooking_time ?? "flexible",
          preference_notes: profile.preference_notes ?? ""
        } as ProfilePreferences;

        setPreferences(loadedPreferences);
        setDislikedText(loadedPreferences.disliked_ingredients.join(", "));
        setCustomRestrictions(
          loadedPreferences.dietary_restrictions
            .filter((item) => !restrictionOptions.includes(item))
            .join(", ")
        );
      }

      setLoading(false);
    });
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!userId) return;

    setSaving(true);
    setFeedback(null);

    const selectedRestrictions = preferences.dietary_restrictions.filter((item) => restrictionOptions.includes(item));
    const payload: ProfilePreferences = {
      ...preferences,
      dietary_restrictions: [...selectedRestrictions, ...parseList(customRestrictions)],
      disliked_ingredients: parseList(dislikedText),
      preference_notes: preferences.preference_notes?.trim() ?? ""
    };

    const { error } = await supabase
      .from("profiles")
      .update(payload)
      .eq("id", userId);

    setSaving(false);

    if (error) {
      setFeedback({ tone: "error", text: "Não consegui salvar suas preferências agora." });
      return;
    }

    setPreferences(payload);
    setFeedback({ tone: "success", text: "Preferências salvas. A Plena vai considerar isso nas próximas respostas." });
  }

  if (loading) {
    return (
      <div className="rounded-3xl border border-sage/15 bg-white/68 p-5 text-sm text-ink/62">
        Carregando preferências...
      </div>
    );
  }

  if (!userId) return null;

  return (
    <form className="space-y-5 rounded-3xl border border-sage/15 bg-white/68 p-5 shadow-sm" onSubmit={handleSubmit}>
      <div>
        <p className="font-serif text-2xl text-ink">Preferências da Plena</p>
        <p className="mt-2 text-sm leading-relaxed text-ink/64">
          Conte o que você evita, não gosta ou busca no momento. A Plena usa isso como contexto culinário, sem substituir orientação profissional.
        </p>
      </div>

      <fieldset>
        <legend className="text-sm font-semibold text-ink/72">Intolerâncias, alergias ou restrições</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {restrictionOptions.map((option) => (
            <ToggleButton
              active={preferences.dietary_restrictions.includes(option)}
              key={option}
              label={option}
              onClick={() =>
                setPreferences((current) => ({
                  ...current,
                  dietary_restrictions: toggleItem(current.dietary_restrictions, option)
                }))
              }
            />
          ))}
        </div>
        <input
          className="mt-3 w-full rounded-2xl border border-sage/18 bg-white px-4 py-3 text-sm text-ink outline-none placeholder:text-ink/35 focus:border-sage focus:ring-4 focus:ring-sage/10"
          onChange={(event) => setCustomRestrictions(event.target.value)}
          placeholder="Outras, separadas por vírgula"
          value={customRestrictions}
        />
      </fieldset>

      <label className="block text-sm font-semibold text-ink/72">
        Ingredientes que não gosta ou prefere evitar
        <input
          className="mt-2 w-full rounded-2xl border border-sage/18 bg-white px-4 py-3 text-sm text-ink outline-none placeholder:text-ink/35 focus:border-sage focus:ring-4 focus:ring-sage/10"
          onChange={(event) => setDislikedText(event.target.value)}
          placeholder="Ex: coentro, berinjela, pimentão"
          value={dislikedText}
        />
      </label>

      <fieldset>
        <legend className="text-sm font-semibold text-ink/72">Objetivo culinário atual</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {goalOptions.map((option) => (
            <ToggleButton
              active={preferences.food_goal === option.value}
              key={option.value}
              label={option.label}
              onClick={() => setPreferences((current) => ({ ...current, food_goal: option.value }))}
            />
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-semibold text-ink/72">O que você quer usar mais</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {mealFocusOptions.map((option) => (
            <ToggleButton
              active={preferences.meal_focus.includes(option)}
              key={option}
              label={option}
              onClick={() =>
                setPreferences((current) => ({
                  ...current,
                  meal_focus: toggleItem(current.meal_focus, option)
                }))
              }
            />
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-semibold text-ink/72">Tempo de preparo preferido</legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {cookingTimeOptions.map((option) => (
            <ToggleButton
              active={preferences.cooking_time === option.value}
              key={option.value}
              label={option.label}
              onClick={() => setPreferences((current) => ({ ...current, cooking_time: option.value }))}
            />
          ))}
        </div>
      </fieldset>

      <label className="block text-sm font-semibold text-ink/72">
        Observações importantes
        <textarea
          className="mt-2 min-h-24 w-full resize-none rounded-2xl border border-sage/18 bg-white px-4 py-3 text-sm leading-relaxed text-ink outline-none placeholder:text-ink/35 focus:border-sage focus:ring-4 focus:ring-sage/10"
          maxLength={500}
          onChange={(event) => setPreferences((current) => ({ ...current, preference_notes: event.target.value }))}
          placeholder="Ex: moro sozinha, almoço fora, prefiro receitas econômicas, não tenho forno..."
          value={preferences.preference_notes ?? ""}
        />
      </label>

      <Button className="w-full" disabled={saving} type="submit">
        {saving ? <Loader2 className="animate-spin" size={17} aria-hidden /> : <Save size={17} aria-hidden />}
        Salvar preferências
      </Button>

      {feedback && (
        <p className={`rounded-2xl px-4 py-3 text-sm ${feedback.tone === "error" ? "bg-rose/10 text-ink" : "bg-sage/10 text-ink"}`}>
          {feedback.text}
        </p>
      )}
    </form>
  );
}

function ToggleButton({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
        active ? "border-sage bg-sage text-white" : "border-sage/20 bg-white/80 text-ink/70 hover:border-sage/45"
      }`}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}
