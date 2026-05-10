"use client";

import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Copy, Trash2 } from "lucide-react";
import { Card } from "@/components/ui";
import type { Favorite } from "@/lib/types";

export function FavoriteCard({
  favorite,
  onCopy,
  onRemove
}: {
  favorite: Favorite;
  onCopy: (content: string) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <Card className="p-4">
      <p className="font-serif text-xl text-ink">{favorite.title ?? "Receita salva"}</p>
      <p className="mt-1 text-xs font-medium text-ink/48">
        {format(new Date(favorite.created_at), "dd 'de' MMMM, HH:mm", { locale: ptBR })}
      </p>
      <p className="mt-3 line-clamp-4 whitespace-pre-wrap text-sm leading-relaxed text-ink/68">{favorite.content}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button className="rounded-full bg-sand/20 px-3 py-2 text-xs font-semibold text-ink/70" onClick={() => onCopy(favorite.content)} type="button">
          <Copy className="mr-1 inline" size={14} aria-hidden />
          Copiar
        </button>
        {favorite.conversation_id && (
          <Link className="rounded-full bg-sage/10 px-3 py-2 text-xs font-semibold text-sage" href={`/chat?id=${favorite.conversation_id}`}>
            Abrir conversa
          </Link>
        )}
        <button className="rounded-full bg-rose/12 px-3 py-2 text-xs font-semibold text-rose" onClick={() => onRemove(favorite.id)} type="button">
          <Trash2 className="mr-1 inline" size={14} aria-hidden />
          Remover
        </button>
      </div>
    </Card>
  );
}
