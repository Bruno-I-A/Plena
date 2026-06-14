"use client";

import { ImagePlus, SendHorizontal, X } from "lucide-react";
import Image from "next/image";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { Button } from "@/components/ui";
import type { ChatImageAttachment } from "@/lib/types";

const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const;

export function ChatInput({
  value,
  disabled,
  image,
  onChange,
  onImageChange,
  onSubmit
}: {
  value: string;
  disabled?: boolean;
  image?: ChatImageAttachment | null;
  onChange: (value: string) => void;
  onImageChange?: (image: ChatImageAttachment | null) => void;
  onSubmit: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageError, setImageError] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSubmit();
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    setImageError("");

    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type as ChatImageAttachment["mediaType"])) {
      setImageError("Envie uma imagem JPG, PNG, WebP ou GIF.");
      return;
    }

    if (file.size > MAX_IMAGE_BYTES) {
      setImageError("A foto precisa ter ate 4 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        setImageError("Nao consegui ler essa foto.");
        return;
      }

      onImageChange?.({
        dataUrl: reader.result,
        mediaType: file.type as ChatImageAttachment["mediaType"]
      });
    };
    reader.onerror = () => setImageError("Nao consegui ler essa foto.");
    reader.readAsDataURL(file);
  }

  const canSend = Boolean(value.trim() || image);

  return (
    <div className="space-y-2">
      <form
        className="rounded-[1.6rem] border border-sage/18 bg-white/96 p-2 shadow-[0_16px_50px_rgba(63,58,53,0.14)] backdrop-blur"
        onSubmit={handleSubmit}
      >
        {image && (
          <div className="mb-2 flex items-center gap-3 rounded-[1.1rem] bg-cream/75 p-2">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-sand/20">
              <Image alt="Foto da comida selecionada" className="object-cover" fill sizes="64px" src={image.dataUrl} unoptimized />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink">Foto da refeicao</p>
              <p className="text-xs text-ink/56">A Plena vai estimar ingredientes, porcao e calorias.</p>
            </div>
            <button
              aria-label="Remover foto"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink/60 hover:bg-white"
              disabled={disabled}
              onClick={() => onImageChange?.(null)}
              type="button"
            >
              <X size={17} aria-hidden />
            </button>
          </div>
        )}

        <div className="flex items-end gap-2">
          <input
            accept={ACCEPTED_IMAGE_TYPES.join(",")}
            className="hidden"
            disabled={disabled}
            onChange={handleImageChange}
            ref={fileInputRef}
            type="file"
          />
          <button
            aria-label="Adicionar foto da comida"
            className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sage transition hover:bg-sage/10 disabled:cursor-not-allowed disabled:opacity-55"
            disabled={disabled}
            onClick={() => fileInputRef.current?.click()}
            type="button"
          >
            <ImagePlus size={20} aria-hidden />
          </button>
          <textarea
            className="max-h-32 min-h-12 flex-1 resize-none rounded-[1.2rem] bg-transparent px-2 py-3 text-[1rem] leading-relaxed text-ink outline-none placeholder:text-ink/42"
            disabled={disabled}
            maxLength={1200}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                onSubmit();
              }
            }}
            placeholder="Conte o que voce tem em casa ou envie uma foto da comida..."
            value={value}
          />
          <Button aria-label="Enviar mensagem" className="h-12 w-12 shrink-0 px-0 shadow-none" disabled={disabled || !canSend} type="submit">
            <SendHorizontal size={19} aria-hidden />
          </Button>
        </div>
      </form>
      {imageError && <p className="px-2 text-xs font-semibold text-rose">{imageError}</p>}
    </div>
  );
}
