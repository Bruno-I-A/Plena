"use client";

import { Check, Copy, Loader2, Plus, Save, Trash2 } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { Button, LinkButton } from "@/components/ui";
import { isSupabaseConfigured, supabase } from "@/lib/supabase-browser";
import type { ShoppingListItem } from "@/lib/types";

const categories = ["Hortifruti", "Proteinas", "Graos e massas", "Laticinios", "Despensa", "Temperos", "Outros"];

export function ShoppingListClient() {
  const [userId, setUserId] = useState<string | null>(null);
  const [listId, setListId] = useState<string | null>(null);
  const [title, setTitle] = useState("Lista de compras");
  const [items, setItems] = useState<ShoppingListItem[]>([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [status, setStatus] = useState("Carregando lista...");
  const [saving, setSaving] = useState(false);

  const groupedItems = useMemo(() => {
    return categories.map((currentCategory) => ({
      category: currentCategory,
      items: items.filter((item) => item.category === currentCategory)
    }));
  }, [items]);

  useEffect(() => {
    async function load() {
      if (!isSupabaseConfigured) {
        setStatus("Configure o Supabase para salvar listas.");
        return;
      }

      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user) {
        setStatus("Entre na sua conta para ver listas de compras.");
        return;
      }

      setUserId(user.id);

      const { data, error } = await supabase
        .from("shopping_lists")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        setStatus("Nao consegui carregar sua lista agora.");
        return;
      }

      if (data) {
        setListId(data.id);
        setTitle(data.title ?? "Lista de compras");
        setItems(Array.isArray(data.items) ? data.items : []);
      }

      setStatus("");
    }

    load();
  }, []);

  function addItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;

    setItems((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        name: trimmed,
        category,
        checked: false
      }
    ]);
    setName("");
  }

  function toggleItem(id: string) {
    setItems((current) => current.map((item) => item.id === id ? { ...item, checked: !item.checked } : item));
  }

  function removeItem(id: string) {
    setItems((current) => current.filter((item) => item.id !== id));
  }

  async function saveList() {
    if (!userId) return;

    setSaving(true);
    setStatus("");

    const payload = {
      user_id: userId,
      title: title.trim() || "Lista de compras",
      items,
      updated_at: new Date().toISOString()
    };

    const query = listId
      ? supabase.from("shopping_lists").update(payload).eq("id", listId).select("id").single()
      : supabase.from("shopping_lists").insert(payload).select("id").single();

    const { data, error } = await query;
    setSaving(false);

    if (error) {
      setStatus("Nao consegui salvar sua lista agora.");
      return;
    }

    setListId(data.id);
    setStatus("Lista salva.");
  }

  async function copyList() {
    const text = groupedItems
      .filter((group) => group.items.length > 0)
      .map((group) => {
        const rows = group.items.map((item) => `${item.checked ? "[x]" : "[ ]"} ${item.name}`).join("\n");
        return `${group.category}:\n${rows}`;
      })
      .join("\n\n");

    await navigator.clipboard.writeText(text || title);
    setStatus("Lista copiada.");
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
      <section className="rounded-[1.35rem] border border-white/70 bg-white/68 p-5 shadow-soft">
        <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
          <label className="block text-sm font-semibold text-ink/72">
            Nome da lista
            <input
              className="mt-2 w-full rounded-2xl border border-sage/18 bg-white px-4 py-3 text-ink outline-none focus:border-sage focus:ring-4 focus:ring-sage/10"
              onChange={(event) => setTitle(event.target.value)}
              value={title}
            />
          </label>
          <div className="flex gap-2">
            <Button disabled={saving} onClick={saveList} type="button">
              {saving ? <Loader2 className="animate-spin" size={17} aria-hidden /> : <Save size={17} aria-hidden />}
              Salvar
            </Button>
            <Button onClick={copyList} type="button" variant="secondary">
              <Copy size={17} aria-hidden />
              Copiar
            </Button>
          </div>
        </div>
        {status && <p className="mt-3 rounded-2xl bg-sage/10 px-4 py-3 text-sm text-ink/68">{status}</p>}
      </section>

      <form className="grid gap-2 rounded-[1.35rem] border border-white/70 bg-white/56 p-4 shadow-sm md:grid-cols-[1fr_13rem_auto]" onSubmit={addItem}>
        <input
          className="rounded-2xl border border-sage/18 bg-white px-4 py-3 text-sm text-ink outline-none focus:border-sage focus:ring-4 focus:ring-sage/10"
          onChange={(event) => setName(event.target.value)}
          placeholder="Adicionar item"
          value={name}
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

      <section className="grid gap-4 md:grid-cols-2">
        {groupedItems.map((group) => (
          <div className="rounded-[1.2rem] border border-white/70 bg-white/64 p-4 shadow-sm" key={group.category}>
            <p className="font-serif text-2xl text-ink">{group.category}</p>
            <div className="mt-3 space-y-2">
              {group.items.length === 0 && <p className="text-sm text-ink/48">Nenhum item.</p>}
              {group.items.map((item) => (
                <div className="flex items-center gap-2 rounded-2xl bg-cream/65 px-3 py-2" key={item.id}>
                  <button
                    className={`grid h-7 w-7 place-items-center rounded-full border ${item.checked ? "border-sage bg-sage text-white" : "border-sage/25 bg-white text-transparent"}`}
                    onClick={() => toggleItem(item.id)}
                    type="button"
                    aria-label={item.checked ? "Desmarcar item" : "Marcar item"}
                  >
                    <Check size={15} aria-hidden />
                  </button>
                  <span className={`flex-1 text-sm ${item.checked ? "text-ink/42 line-through" : "text-ink/76"}`}>{item.name}</span>
                  <button className="grid h-8 w-8 place-items-center rounded-full text-ink/44 hover:bg-rose/10 hover:text-rose" onClick={() => removeItem(item.id)} type="button" aria-label="Remover item">
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
