"use client";

import { SendHorizontal } from "lucide-react";
import { FormEvent } from "react";
import { Button } from "@/components/ui";

export function ChatInput({
  value,
  disabled,
  onChange,
  onSubmit
}: {
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
}) {
  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <form
      className="flex items-end gap-2 rounded-[1.6rem] border border-sage/18 bg-white/96 p-2 shadow-[0_16px_50px_rgba(63,58,53,0.14)] backdrop-blur"
      onSubmit={handleSubmit}
    >
      <textarea
        className="max-h-32 min-h-12 flex-1 resize-none rounded-[1.2rem] bg-transparent px-3 py-3 text-[1rem] leading-relaxed text-ink outline-none placeholder:text-ink/42"
        disabled={disabled}
        maxLength={1200}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            onSubmit();
          }
        }}
        placeholder="Conte o que você tem em casa ou quer comer hoje..."
        value={value}
      />
      <Button aria-label="Enviar mensagem" className="h-12 w-12 shrink-0 px-0 shadow-none" disabled={disabled || !value.trim()} type="submit">
        <SendHorizontal size={19} aria-hidden />
      </Button>
    </form>
  );
}
