"use client";

import Image from "next/image";
import { Copy, Heart } from "lucide-react";
import { clsx } from "clsx";
import type { Message } from "@/lib/types";
import { looksLikeRecipe } from "@/lib/chat";

export function ChatMessage({
  message,
  onCopy,
  onFavorite
}: {
  message: Message;
  onCopy?: (content: string) => void;
  onFavorite?: (message: Message) => void;
}) {
  const isUser = message.role === "user";
  const canSave = message.role === "assistant" && looksLikeRecipe(message.content);

  return (
    <article className={clsx("flex w-full items-end gap-2", isUser ? "justify-end" : "justify-start")}>
      {!isUser && <PlenaAvatar size={32} />}
      <div
        className={clsx(
          "max-w-[88%] px-4 py-3 text-[0.96rem] leading-relaxed shadow-sm md:max-w-[76%] md:px-5 md:py-4 md:text-base",
          isUser
            ? "rounded-[1.45rem] rounded-br-sm bg-sage text-white"
            : "rounded-[1.45rem] rounded-bl-sm border border-white/75 bg-white text-ink"
        )}
      >
        {isUser && message.imageUrl && (
          <div className="relative mb-3 aspect-[4/3] w-full overflow-hidden rounded-[1rem] bg-white/10">
            <Image alt="Foto enviada pela usuaria" className="object-cover" fill sizes="(max-width: 768px) 88vw, 520px" src={message.imageUrl} unoptimized />
          </div>
        )}
        <FormattedMessage content={message.content} isUser={isUser} />
        {!isUser && (
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              className="inline-flex items-center gap-1 rounded-full bg-sand/20 px-3 py-1.5 text-xs font-semibold text-ink/70 hover:bg-sand/30"
              onClick={() => onCopy?.(message.content)}
              type="button"
            >
              <Copy size={14} aria-hidden />
              Copiar
            </button>
            {canSave && (
              <button
                className="inline-flex items-center gap-1 rounded-full bg-rose/15 px-3 py-1.5 text-xs font-semibold text-rose hover:bg-rose/20"
                onClick={() => onFavorite?.(message)}
                type="button"
              >
                <Heart size={14} aria-hidden />
                Salvar receita
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export function PlenaAvatar({ size = 36 }: { size?: number }) {
  return (
    <div
      className="relative shrink-0 overflow-hidden rounded-full bg-cream shadow-sm ring-1 ring-sage/15"
      style={{ height: size, width: size }}
    >
      <Image alt="Plena" className="object-cover" fill sizes={`${size}px`} src="/brand/plena-icon.png" />
    </div>
  );
}

function stripInlineMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/__(.+?)__/g, "$1")
    .replace(/_(.+?)_/g, "$1");
}

function FormattedMessage({ content, isUser }: { content: string; isUser: boolean }) {
  if (isUser) {
    return <div className="whitespace-pre-wrap">{content}</div>;
  }

  const lines = content.split("\n");

  return (
    <div className="space-y-2">
      {lines.map((line, index) => {
        const trimmed = line.trim();

        if (!trimmed || trimmed === "---") {
          return <div className="h-1" key={`${index}-space`} />;
        }

        // ## Heading or # Heading
        const headingMatch = trimmed.match(/^#{1,3}\s+(.+)/);
        if (headingMatch) {
          return (
            <p className="pt-1 font-serif text-xl leading-tight text-sage" key={`${index}-${trimmed}`}>
              {stripInlineMarkdown(headingMatch[1])}
            </p>
          );
        }

        const isSection = /^[\p{L}\sçãáéíóúâêôõà*]+:$/iu.test(trimmed) || trimmed.startsWith("Nome da receita");
        const isBullet = /^[-*]\s+/.test(trimmed);
        const isNumbered = /^\d+\.\s+/.test(trimmed);

        if (isSection) {
          return (
            <p className="pt-1 font-serif text-xl leading-tight text-sage" key={`${index}-${trimmed}`}>
              {stripInlineMarkdown(trimmed)}
            </p>
          );
        }

        if (isBullet || isNumbered) {
          const bulletText = trimmed.replace(/^[-*]\s+/, "").replace(/^\d+\.\s+/, "");
          return (
            <p className="pl-3 text-ink/76" key={`${index}-${trimmed}`}>
              <span className="mr-2 text-sage">{isNumbered ? trimmed.match(/^\d+\./)?.[0] : "-"}</span>
              {stripInlineMarkdown(bulletText)}
            </p>
          );
        }

        return (
          <p className="text-ink/78" key={`${index}-${trimmed}`}>
            {stripInlineMarkdown(trimmed)}
          </p>
        );
      })}
    </div>
  );
}
