import { Suspense } from "react";
import { AppShell } from "@/components/AppShell";
import { ChatWindow } from "@/components/ChatWindow";

export default function ChatPage() {
  return (
    <AppShell>
      <Suspense fallback={<div className="p-6 text-ink/60">Carregando chat...</div>}>
        <ChatWindow />
      </Suspense>
    </AppShell>
  );
}
