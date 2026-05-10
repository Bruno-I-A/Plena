"use client";

import { useEffect, useState } from "react";
import { ConversationList } from "@/components/ConversationList";
import { LinkButton } from "@/components/ui";
import { isSupabaseConfigured, supabase } from "@/lib/supabase-browser";
import type { Conversation } from "@/lib/types";

export function ConversationsPageClient() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [status, setStatus] = useState("Carregando conversas...");
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    async function load() {
      if (!isSupabaseConfigured) {
        setStatus("Configure o Supabase para salvar e listar conversas.");
        return;
      }

      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        setStatus("Entre na sua conta para ver seu histórico.");
        return;
      }

      setAuthenticated(true);
      const { data, error } = await supabase
        .from("conversations")
        .select("*, messages(content, created_at)")
        .order("updated_at", { ascending: false });

      if (error) {
        setStatus("Não consegui carregar suas conversas agora.");
        return;
      }

      const rows = ((data ?? []) as Array<Conversation & { messages?: Array<{ content: string; created_at: string }> }>).map((conversation) => {
        const messages = Array.isArray(conversation.messages) ? conversation.messages : [];
        const last = [...messages].sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)))[0];
        return { ...conversation, last_message: last?.content ?? null };
      }) as Conversation[];

      setConversations(rows);
      setStatus(rows.length ? "" : "Nenhuma conversa salva ainda.");
    }

    load();
  }, []);

  async function deleteConversation(id: string) {
    const { error } = await supabase.from("conversations").delete().eq("id", id);
    if (error) {
      setStatus("Não consegui deletar essa conversa.");
      return;
    }
    setConversations((current) => current.filter((conversation) => conversation.id !== id));
  }

  return (
    <div className="space-y-4">
      {status && <p className="rounded-2xl bg-white/60 p-4 text-sm text-ink/68">{status}</p>}
      {!authenticated && <LinkButton href="/login">Entrar ou cadastrar</LinkButton>}
      <ConversationList conversations={conversations} onDelete={deleteConversation} />
    </div>
  );
}
