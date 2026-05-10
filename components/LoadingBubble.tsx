import { PlenaAvatar } from "@/components/ChatMessage";

export function LoadingBubble() {
  return (
    <div className="flex items-end gap-2">
      <PlenaAvatar size={32} />
      <div className="mr-auto max-w-[86%] rounded-[1.45rem] rounded-bl-sm border border-white/75 bg-white px-4 py-3 text-sm text-ink/62 shadow-sm">
        <div className="flex items-center gap-3">
          <span>Plena está pensando em uma sugestão</span>
          <span className="flex items-center gap-1" aria-hidden>
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-sage/70 [animation-delay:-0.2s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-sage/70 [animation-delay:-0.1s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-sage/70" />
          </span>
        </div>
      </div>
    </div>
  );
}
