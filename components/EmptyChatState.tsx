"use client";

import { PlenaAvatar } from "@/components/ChatMessage";
import { PromptSuggestions } from "@/components/PromptSuggestions";

export function EmptyChatState({ onSelect }: { onSelect: (value: string) => void }) {
  return (
    <div className="mx-auto flex min-h-full w-full max-w-2xl flex-col justify-center px-1 py-8">
      <div className="flex items-end gap-2">
        <PlenaAvatar size={38} />
        <div className="max-w-[88%] rounded-[1.55rem] rounded-bl-sm border border-white/75 bg-white px-5 py-4 text-[1.02rem] leading-relaxed text-ink shadow-sm">
          <p className="font-serif text-2xl leading-snug text-ink">Olá, eu sou a Plena.</p>
          <p className="mt-2 text-[0.98rem] text-ink/72">
            Me conte o que você tem em casa ou o que gostaria de preparar hoje.
          </p>
        </div>
      </div>
      <div className="mt-5 pl-12">
        <PromptSuggestions onSelect={onSelect} />
      </div>
    </div>
  );
}
