"use client";

import Link from "next/link";
import { CalendarDays, CheckSquare, ChefHat, Heart, MessageCircle, PackageOpen, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { LinkButton } from "@/components/ui";
import { isSupabaseConfigured, supabase } from "@/lib/supabase-browser";

type Usage = {
  limit: number;
  used: number;
  remaining: number;
};

type DashboardCounts = {
  menus: number;
  lists: number;
  pantry: number;
  favorites: number;
};

const actions = [
  {
    href: "/cardapio",
    title: "Montar cardapio",
    text: "Organize cafe, almoco, lanche e jantar da semana.",
    icon: CalendarDays
  },
  {
    href: "/compras",
    title: "Lista de compras",
    text: "Separe itens por categoria e marque o que ja comprou.",
    icon: CheckSquare
  },
  {
    href: "/despensa",
    title: "Tenho em casa",
    text: "Salve ingredientes disponiveis e gere ideias com eles.",
    icon: PackageOpen
  },
  {
    href: "/chat",
    title: "Conversar com a Plena",
    text: "Peca receitas, substituicoes, marmitas e cardapios.",
    icon: MessageCircle
  }
];

export function RoutineDashboardClient() {
  const [status, setStatus] = useState("Carregando sua rotina...");
  const [email, setEmail] = useState("");
  const [usage, setUsage] = useState<Usage | null>(null);
  const [counts, setCounts] = useState<DashboardCounts>({ menus: 0, lists: 0, pantry: 0, favorites: 0 });

  useEffect(() => {
    async function load() {
      if (!isSupabaseConfigured) {
        setStatus("Configure o Supabase para usar sua rotina.");
        return;
      }

      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user) {
        setStatus("Entre na sua conta para ver sua rotina.");
        return;
      }

      setEmail(user.email ?? "");
      setStatus("");

      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData.session?.access_token) {
        const response = await fetch("/api/usage", {
          headers: { Authorization: `Bearer ${sessionData.session.access_token}` }
        });
        if (response.ok) {
          const payload = await response.json();
          setUsage(payload.usage ?? null);
        }
      }

      const [menus, lists, pantry, favorites] = await Promise.all([
        supabase.from("weekly_menus").select("id", { count: "exact", head: true }),
        supabase.from("shopping_lists").select("id", { count: "exact", head: true }),
        supabase.from("pantry_items").select("id", { count: "exact", head: true }),
        supabase.from("favorites").select("id", { count: "exact", head: true })
      ]);

      setCounts({
        menus: menus.count ?? 0,
        lists: lists.count ?? 0,
        pantry: pantry.count ?? 0,
        favorites: favorites.count ?? 0
      });
    }

    load();
  }, []);

  if (status) {
    return (
      <div className="rounded-3xl border border-white/70 bg-white/64 p-5 text-sm text-ink/68 shadow-soft">
        <p>{status}</p>
        {status.includes("Entre") && <LinkButton className="mt-4" href="/login">Entrar</LinkButton>}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[1.35rem] border border-white/70 bg-white/70 p-5 shadow-soft">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-sage/12 text-sage">
              <UserRound size={20} aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-sage">Conta ativa</p>
              <p className="truncate text-sm text-ink/62">{email}</p>
            </div>
          </div>
          <p className="mt-5 font-serif text-3xl text-ink">O que vamos resolver hoje?</p>
          <p className="mt-2 text-sm leading-relaxed text-ink/64">
            Use a Plena para transformar conversas em cardapio, compras e ideias com o que voce ja tem.
          </p>
        </div>

        <div className="rounded-[1.35rem] border border-sage/15 bg-sage p-5 text-white shadow-soft">
          <p className="text-sm font-semibold text-white/78">Mensagens do mes</p>
          <p className="mt-3 font-serif text-5xl">{usage ? usage.remaining : "--"}</p>
          <p className="mt-2 text-sm text-white/75">
            {usage ? `${usage.used} usadas de ${usage.limit}` : "Carregando limite da assinatura"}
          </p>
          <LinkButton className="mt-5 bg-white text-sage hover:bg-cream" href="/chat">Abrir chat</LinkButton>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              className="rounded-[1.2rem] border border-white/70 bg-white/64 p-4 shadow-sm transition hover:-translate-y-0.5 hover:bg-white"
              href={action.href}
              key={action.href}
            >
              <span className="grid h-10 w-10 place-items-center rounded-full bg-sand/20 text-sage">
                <Icon size={19} aria-hidden />
              </span>
              <p className="mt-4 font-semibold text-ink">{action.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink/60">{action.text}</p>
            </Link>
          );
        })}
      </section>

      <section className="grid gap-3 sm:grid-cols-4">
        <Stat icon={CalendarDays} label="Cardapios" value={counts.menus} />
        <Stat icon={CheckSquare} label="Listas" value={counts.lists} />
        <Stat icon={ChefHat} label="Ingredientes" value={counts.pantry} />
        <Stat icon={Heart} label="Favoritas" value={counts.favorites} />
      </section>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof CalendarDays; label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/70 bg-white/56 p-4">
      <Icon className="text-sage" size={18} aria-hidden />
      <p className="mt-3 font-serif text-3xl text-ink">{value}</p>
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink/48">{label}</p>
    </div>
  );
}
