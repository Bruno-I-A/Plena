"use client";

import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Trash2 } from "lucide-react";
import { Card, LinkButton } from "@/components/ui";
import type { Conversation } from "@/lib/types";

export function ConversationList({
  conversations,
  onDelete
}: {
  conversations: Conversation[];
  onDelete: (id: string) => void;
}) {
  if (conversations.length === 0) {
    return (
      <Card className="text-center">
        <p className="font-serif text-2xl">Nenhuma conversa salva ainda</p>
        <p className="mt-2 text-sm text-ink/64">Entre na sua conta e converse com a Plena para manter seu histórico.</p>
        <LinkButton className="mt-5" href="/chat">Começar conversa</LinkButton>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {conversations.map((conversation) => (
        <Card className="p-4" key={conversation.id}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Link className="block truncate font-serif text-xl text-ink hover:text-sage" href={`/chat?id=${conversation.id}`}>
                {conversation.title ?? "Conversa com a Plena"}
              </Link>
              <p className="mt-1 text-xs font-medium text-ink/48">
                {format(new Date(conversation.updated_at), "dd 'de' MMMM, HH:mm", { locale: ptBR })}
              </p>
              <p className="mt-3 line-clamp-2 text-sm text-ink/68">
                {conversation.last_message ?? "Abra para continuar a conversa."}
              </p>
            </div>
            <button
              aria-label="Deletar conversa"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-rose hover:bg-rose/12"
              onClick={() => onDelete(conversation.id)}
              type="button"
            >
              <Trash2 size={17} aria-hidden />
            </button>
          </div>
        </Card>
      ))}
    </div>
  );
}
