"use client";

import Link from "next/link";
import { ChefHat, Plus, Trash2 } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { Button, LinkButton } from "@/components/ui";
import { isSupabaseConfigured, supabase } from "@/lib/supabase-browser";
import type { PantryItem } from "@/lib/types";

const categories = ["Geladeira", "Freezer", "Hortifruti", "Despensa", "Temperos", "Outros"];

export function PantryClient() {
  const [userId, setUserId] = useState<string | null>(null);
  const [items, setItems] = useState<PantryItem[]>([]);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [status, setStatus] = useState("Carregando ingredientes...");

  const groupedItems = useMemo(() => {
    return categories.map((currentCategory) => ({
      category: currentCategory,
      items: items.filter((item) => (item.category ?? "Outros") === currentCategory)
    }));
  }, [items]);

  const ideaPrompt = useMemo(() => {
    const ingredientList = items
      .map((item) => `${item.quantity ? `${item.quantity} de ` : ""}${item.name}`)
      .join(", ");

    const prompt = ingredientList
      ? `Tenho em casa: ${ingredientList}. Me de 3 ideias de refeicoes simples usando principalmente esses ingredientes.`
      : "Me ajude a pensar em ideias de refeicoes simples com poucos ingredientes.";

    return `/chat?prompt=${encodeURIComponent(prompt)}`;
  }, [items]);

  useEffect(() => {
    async function load() {
      if (!isSupabaseConfigured) {
        setStatus("Configure o Supabase para salvar ingredientes.");
        return;
      }

      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user) {
        setStatus("Entre na sua conta para salvar ingredientes.");
        return;
      }

      setUserId(user.id);

      const { data, error } = await supabase
        .from("pantry_items")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        setStatus("Nao consegui carregar seus ingredientes agora.");
        return;
      }

      setItems((data ?? []) as PantryItem[]);
      setStatus("");
    }

    load();
  }, []);

  async function addItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!userId || !name.trim()) return;

    const payload = {
      user_id: userId,
      name: name.trim(),
      quantity: quantity.trim() || null,
      category
    };

    const { data, error } = await supabase
      .from("pantry_items")
      .insert(payload)
      .select("*")
      .single();

    if (error) {
      setStatus("Nao consegui adicionar esse ingrediente.");
      return;
    }

    setItems((current) => [data as PantryItem, ...current]);
    setName("");
    setQuantity("");
    setStatus("");
  }

  async function removeItem(id: string) {
    const { error } = await supabase.from("pantry_items").delete().eq("id", id);
    if (error) {
      setStatus("Nao consegui remover esse ingrediente.");
      return;
    }
    setItems((current) => current.filter((item) => item.id !== id));
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
      <form className="grid gap-2 rounded-[1.35rem] border border-white/70 bg-white/64 p-4 shadow-soft md:grid-cols-[1fr_10rem_11rem_auto]" onSubmit={addItem}>
        <input
          className="rounded-2xl border border-sage/18 bg-white px-4 py-3 text-sm text-ink outline-none focus:border-sage focus:ring-4 focus:ring-sage/10"
          onChange={(event) => setName(event.target.value)}
          placeholder="Ingrediente"
          value={name}
        />
        <input
          className="rounded-2xl border border-sage/18 bg-white px-4 py-3 text-sm text-ink outline-none focus:border-sage focus:ring-4 focus:ring-sage/10"
          onChange={(event) => setQuantity(event.target.value)}
          placeholder="Qtd."
          value={quantity}
        />
        <select
          className="rounded-2xl border border-sage/18 bg-white px-4 py-3 text-sm text-ink outline-none focus:border-sage focus:ring-4 focus:ring-sage/10"
          onChange={(event) => setCategory(event.target.value)}
          value={category}
        >
          {categories.map((item) => <option key={item}>{item}</option>)}
        </select>
        <Button type="submit">
          <Plus size={17} aria-hidden />
          Adicionar
        </Button>
      </form>

      {status && <p className="rounded-2xl bg-sage/10 px-4 py-3 text-sm text-ink/68">{status}</p>}

      <div className="flex justify-end">
        <Link className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-sage px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-[#5f705b]" href={ideaPrompt}>
          <ChefHat size={17} aria-hidden />
          Gerar ideias com o que tenho
        </Link>
      </div>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {groupedItems.map((group) => (
          <div className="rounded-[1.2rem] border border-white/70 bg-white/64 p-4 shadow-sm" key={group.category}>
            <p className="font-serif text-2xl text-ink">{group.category}</p>
            <div className="mt-3 space-y-2">
              {group.items.length === 0 && <p className="text-sm text-ink/48">Vazio.</p>}
              {group.items.map((item) => (
                <div className="flex items-center gap-2 rounded-2xl bg-cream/65 px-3 py-2" key={item.id}>
                  <span className="flex-1 text-sm text-ink/76">
                    {item.name}
                    {item.quantity && <span className="ml-2 text-ink/42">{item.quantity}</span>}
                  </span>
                  <button className="grid h-8 w-8 place-items-center rounded-full text-ink/44 hover:bg-rose/10 hover:text-rose" onClick={() => removeItem(item.id)} type="button" aria-label="Remover ingrediente">
                    <Trash2 size={15} aria-hidden />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
