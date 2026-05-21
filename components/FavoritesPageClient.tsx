"use client";

import { useEffect, useState } from "react";
import { FavoriteCard } from "@/components/FavoriteCard";
import { LinkButton } from "@/components/ui";
import { isSupabaseConfigured, supabase } from "@/lib/supabase-browser";
import type { Favorite } from "@/lib/types";

export function FavoritesPageClient() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [status, setStatus] = useState("Carregando favoritas...");
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    async function load() {
      if (!isSupabaseConfigured) {
        setStatus("Configure o Supabase para salvar receitas favoritas.");
        return;
      }

      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        setStatus("Entre na sua conta para ver suas favoritas.");
        return;
      }

      setAuthenticated(true);
      const { data, error } = await supabase
        .from("favorites")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        setStatus("Não consegui carregar suas favoritas agora.");
        return;
      }

      setFavorites((data ?? []) as Favorite[]);
      setStatus(data?.length ? "" : "Nenhuma receita favorita ainda.");
    }

    load();
  }, []);

  async function removeFavorite(id: string) {
    const { error } = await supabase.from("favorites").delete().eq("id", id);
    if (error) {
      setStatus("Não consegui remover essa favorita.");
      return;
    }
    setFavorites((current) => current.filter((favorite) => favorite.id !== id));
  }

  return (
    <div className="space-y-4">
      {status && <p className="rounded-2xl bg-white/60 p-4 text-sm text-ink/68">{status}</p>}
      {!authenticated && <LinkButton href="/login">Entrar</LinkButton>}
      <div className="grid gap-4 md:grid-cols-2">
        {favorites.map((favorite) => (
          <FavoriteCard
            favorite={favorite}
            key={favorite.id}
            onCopy={(content) => navigator.clipboard.writeText(content)}
            onRemove={removeFavorite}
          />
        ))}
      </div>
    </div>
  );
}
