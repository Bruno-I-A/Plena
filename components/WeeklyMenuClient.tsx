"use client";

import Link from "next/link";
import { Loader2, Plus, Save, ShoppingBasket } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button, LinkButton } from "@/components/ui";
import { isSupabaseConfigured, supabase } from "@/lib/supabase-browser";
import type { MealSlot, WeeklyMenuMeals } from "@/lib/types";

const days = [
  ["monday", "Segunda"],
  ["tuesday", "Terca"],
  ["wednesday", "Quarta"],
  ["thursday", "Quinta"],
  ["friday", "Sexta"],
  ["saturday", "Sabado"],
  ["sunday", "Domingo"]
] as const;

const slots: Array<[MealSlot, string]> = [
  ["breakfast", "Cafe"],
  ["lunch", "Almoco"],
  ["snack", "Lanche"],
  ["dinner", "Jantar"]
];

const emptyMeals = days.reduce((acc, [day]) => {
  acc[day] = {};
  return acc;
}, {} as WeeklyMenuMeals);

export function WeeklyMenuClient() {
  const [userId, setUserId] = useState<string | null>(null);
  const [menuId, setMenuId] = useState<string | null>(null);
  const [title, setTitle] = useState("Cardapio da semana");
  const [notes, setNotes] = useState("");
  const [meals, setMeals] = useState<WeeklyMenuMeals>(emptyMeals);
  const [status, setStatus] = useState("Carregando cardapio...");
  const [saving, setSaving] = useState(false);

  const chatPrompt = useMemo(() => {
    const filled = days.flatMap(([dayKey, dayLabel]) =>
      slots
        .map(([slotKey, slotLabel]) => {
          const value = meals[dayKey]?.[slotKey]?.trim();
          return value ? `${dayLabel} - ${slotLabel}: ${value}` : "";
        })
        .filter(Boolean)
    );

    const base = filled.length
      ? `Com base neste cardapio, gere uma lista de compras organizada por categoria:\n${filled.join("\n")}`
      : "Monte um cardapio semanal simples para mim e depois gere uma lista de compras organizada por categoria.";

    return `/chat?prompt=${encodeURIComponent(base)}`;
  }, [meals]);

  useEffect(() => {
    async function load() {
      if (!isSupabaseConfigured) {
        setStatus("Configure o Supabase para salvar cardapios.");
        return;
      }

      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user) {
        setStatus("Entre na sua conta para montar cardapios.");
        return;
      }

      setUserId(user.id);

      const { data, error } = await supabase
        .from("weekly_menus")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        setStatus("Nao consegui carregar seu cardapio agora.");
        return;
      }

      if (data) {
        setMenuId(data.id);
        setTitle(data.title ?? "Cardapio da semana");
        setNotes(data.notes ?? "");
        setMeals({ ...emptyMeals, ...(data.meals ?? {}) });
      }

      setStatus("");
    }

    load();
  }, []);

  function updateMeal(day: string, slot: MealSlot, value: string) {
    setMeals((current) => ({
      ...current,
      [day]: {
        ...(current[day] ?? {}),
        [slot]: value
      }
    }));
  }

  async function saveMenu() {
    if (!userId) return;

    setSaving(true);
    setStatus("");

    const payload = {
      user_id: userId,
      title: title.trim() || "Cardapio da semana",
      notes: notes.trim() || null,
      meals,
      updated_at: new Date().toISOString()
    };

    const query = menuId
      ? supabase.from("weekly_menus").update(payload).eq("id", menuId).select("id").single()
      : supabase.from("weekly_menus").insert(payload).select("id").single();

    const { data, error } = await query;
    setSaving(false);

    if (error) {
      setStatus("Nao consegui salvar o cardapio agora.");
      return;
    }

    setMenuId(data.id);
    setStatus("Cardapio salvo.");
  }

  function clearMenu() {
    setMeals(emptyMeals);
    setNotes("");
  }

  if (status && !userId) {
    return (
      <div className="rounded-3xl border border-white/70 bg-white/64 p-5 text-sm text-ink/68 shadow-soft">
        <p>{status}</p>
        {status.includes("Entre") && <LinkButton className="mt-4" href="/login">Entrar</LinkButton>}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-[1.35rem] border border-white/70 bg-white/68 p-5 shadow-soft">
        <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
          <label className="block text-sm font-semibold text-ink/72">
            Nome do cardapio
            <input
              className="mt-2 w-full rounded-2xl border border-sage/18 bg-white px-4 py-3 text-ink outline-none focus:border-sage focus:ring-4 focus:ring-sage/10"
              onChange={(event) => setTitle(event.target.value)}
              value={title}
            />
          </label>
          <div className="flex gap-2">
            <Button disabled={saving} onClick={saveMenu} type="button">
              {saving ? <Loader2 className="animate-spin" size={17} aria-hidden /> : <Save size={17} aria-hidden />}
              Salvar
            </Button>
            <Button onClick={clearMenu} type="button" variant="secondary">
              <Plus size={17} aria-hidden />
              Limpar
            </Button>
          </div>
        </div>
        {status && <p className="mt-3 rounded-2xl bg-sage/10 px-4 py-3 text-sm text-ink/68">{status}</p>}
      </div>

      <div className="overflow-hidden rounded-[1.35rem] border border-white/70 bg-white/70 shadow-soft">
        <div className="hidden grid-cols-[0.8fr_repeat(4,1fr)] border-b border-sand/20 bg-cream/70 text-xs font-bold uppercase tracking-[0.1em] text-ink/52 md:grid">
          <div className="p-3">Dia</div>
          {slots.map(([slot, label]) => <div className="p-3" key={slot}>{label}</div>)}
        </div>
        <div className="divide-y divide-sand/18">
          {days.map(([dayKey, dayLabel]) => (
            <div className="grid gap-3 p-4 md:grid-cols-[0.8fr_repeat(4,1fr)] md:gap-0 md:p-0" key={dayKey}>
              <div className="font-serif text-2xl text-ink md:border-r md:border-sand/18 md:p-3 md:text-lg">{dayLabel}</div>
              {slots.map(([slotKey, slotLabel]) => (
                <label className="block md:border-r md:border-sand/18 md:p-2" key={slotKey}>
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.1em] text-ink/46 md:hidden">{slotLabel}</span>
                  <textarea
                    className="min-h-20 w-full resize-none rounded-2xl border border-sage/14 bg-white/82 px-3 py-2 text-sm leading-relaxed text-ink outline-none focus:border-sage focus:ring-4 focus:ring-sage/10 md:border-transparent md:bg-transparent"
                    onChange={(event) => updateMeal(dayKey, slotKey, event.target.value)}
                    placeholder="Planejar..."
                    value={meals[dayKey]?.[slotKey] ?? ""}
                  />
                </label>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-start">
        <label className="block text-sm font-semibold text-ink/72">
          Observacoes da semana
          <textarea
            className="mt-2 min-h-28 w-full resize-none rounded-3xl border border-sage/18 bg-white px-4 py-3 text-sm leading-relaxed text-ink outline-none focus:border-sage focus:ring-4 focus:ring-sage/10"
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Ex: preparar feijao no domingo, deixar legumes lavados, evitar desperdicio..."
            value={notes}
          />
        </label>
        <Link className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-sage px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-[#5f705b]" href={chatPrompt}>
          <ShoppingBasket size={17} aria-hidden />
          Gerar compras
        </Link>
      </div>
    </div>
  );
}
