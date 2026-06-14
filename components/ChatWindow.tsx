"use client";

import { RotateCcw } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChatInput } from "@/components/ChatInput";
import { ChatMessage } from "@/components/ChatMessage";
import { EmptyChatState } from "@/components/EmptyChatState";
import { LoadingBubble } from "@/components/LoadingBubble";
import { Button, LinkButton } from "@/components/ui";
import { PLENA_MONTHLY_MESSAGE_LIMIT } from "@/lib/plans";
import { favoriteTitle, recentHistory } from "@/lib/chat";
import { isSupabaseConfigured, supabase } from "@/lib/supabase-browser";
import type { ChatImageAttachment, Message } from "@/lib/types";

type Usage = {
  limit: number;
  used: number;
  remaining: number;
  resetAt: string;
};

export function ChatWindow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialConversationId = searchParams.get("id");
  const initialPrompt = searchParams.get("prompt") ?? "";
  const [conversationId, setConversationId] = useState<string | null>(initialConversationId);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [selectedImage, setSelectedImage] = useState<ChatImageAttachment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [usage, setUsage] = useState<Usage | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const isEmpty = messages.length === 0;
  const history = useMemo(() => recentHistory(messages), [messages]);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user.id ?? null);
      if (!session?.user) setUsage(null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!userId || !isSupabaseConfigured) return;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session?.access_token) return;

      const response = await fetch("/api/usage", {
        headers: {
          Authorization: `Bearer ${data.session.access_token}`
        }
      });

      if (!response.ok) return;

      const payload = await response.json();
      setUsage(payload.usage ?? null);
    });
  }, [userId]);

  useEffect(() => {
    if (!initialConversationId || !isSupabaseConfigured) return;

    setConversationId(initialConversationId);
    supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", initialConversationId)
      .order("created_at", { ascending: true })
      .then(({ data, error: loadError }) => {
        if (loadError) {
          setError("Não consegui carregar essa conversa agora.");
          return;
        }
        setMessages((data ?? []) as Message[]);
      });
  }, [initialConversationId]);

  useEffect(() => {
    if (!initialPrompt || input) return;
    setInput(initialPrompt.slice(0, 1200));
  }, [initialPrompt, input]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  function startNewConversation() {
    setConversationId(null);
    setMessages([]);
    setInput("");
    setSelectedImage(null);
    setError("");
    router.replace("/chat");
  }

  async function sendMessage(value = input) {
    const content = value.trim();
    const imageToSend = selectedImage;
    if ((!content && !imageToSend) || loading) return;

    if (content.length > 1200) {
      setError("Sua mensagem ficou um pouco longa. Tente enviar em partes menores.");
      return;
    }

    if (!userId) {
      setError("Entre na sua conta para conversar com a Plena e acompanhar seus créditos mensais.");
      return;
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      conversation_id: conversationId,
      role: "user",
      content: content || "Foto enviada para estimativa de calorias.",
      imageUrl: imageToSend?.dataUrl ?? null,
      created_at: new Date().toISOString()
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setSelectedImage(null);
    setError("");
    setLoading(true);

    try {
      const { data: sessionData } = isSupabaseConfigured ? await supabase.auth.getSession() : { data: { session: null } };
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(sessionData.session?.access_token ? { Authorization: `Bearer ${sessionData.session.access_token}` } : {})
        },
        body: JSON.stringify({
          conversationId,
          message: content,
          image: imageToSend,
          history
        })
      });

      const payload = await response.json();

      if (!response.ok) {
        if (payload.usage) setUsage(payload.usage);
        throw new Error(payload.error ?? "Não consegui responder agora.");
      }

      const assistantMessage: Message = {
        id: payload.messageId ?? crypto.randomUUID(),
        conversation_id: payload.conversationId ?? conversationId,
        role: "assistant",
        content: payload.reply,
        created_at: new Date().toISOString()
      };

      setConversationId(payload.conversationId ?? conversationId);
      if (payload.usage) setUsage(payload.usage);
      if (payload.conversationId && payload.conversationId !== conversationId) {
        router.replace(`/chat?id=${payload.conversationId}`);
      }
      setMessages((current) => [...current, assistantMessage]);
    } catch (chatError) {
      setError(chatError instanceof Error ? chatError.message : "Algo saiu do ritmo. Tente novamente em instantes.");
      setMessages((current) => current.filter((message) => message.id !== userMessage.id));
      setSelectedImage(imageToSend);
    } finally {
      setLoading(false);
    }
  }

  async function copyMessage(content: string) {
    await navigator.clipboard.writeText(content);
  }

  async function saveFavorite(message: Message) {
    if (!userId || !isSupabaseConfigured) {
      setError("Entre na sua conta para salvar receitas favoritas.");
      return;
    }

    const { error: favoriteError } = await supabase.from("favorites").insert({
      user_id: userId,
      conversation_id: conversationId,
      message_id: message.id,
      title: favoriteTitle(message.content),
      content: message.content
    });

    if (favoriteError) {
      setError("Não consegui salvar essa receita agora.");
      return;
    }

    setError("Receita salva nas favoritas.");
  }

  return (
    <section className="mx-auto flex h-[calc(100dvh-9.35rem)] max-w-4xl flex-col px-3 pt-3 md:h-[calc(100dvh-4.25rem)] md:px-6 md:pt-4">
      <div className="mb-2 flex items-center justify-between gap-3 px-1">
        <div>
          <p className="text-sm font-semibold text-sage">Plena</p>
          <p className="text-xs text-ink/58">
            {userId
              ? usage
                ? `${usage.remaining} de ${usage.limit} mensagens da Plena restantes neste mês.`
                : `Até ${PLENA_MONTHLY_MESSAGE_LIMIT} mensagens da Plena por mês.`
              : "Entre na sua conta para usar suas mensagens mensais."}
          </p>
        </div>
        <Button className="min-h-10 px-4 shadow-none" onClick={startNewConversation} type="button" variant="secondary">
          <RotateCcw size={16} aria-hidden />
          Nova conversa
        </Button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-1 py-3 plena-scrollbar md:px-2 md:py-5">
        {isEmpty ? (
          <EmptyChatState onSelect={(suggestion) => sendMessage(suggestion)} />
        ) : (
          <div className="mx-auto max-w-3xl space-y-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} onCopy={copyMessage} onFavorite={saveFavorite} />
            ))}
            {loading && <LoadingBubble />}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <div className="z-20 mx-auto w-full max-w-3xl space-y-2 bg-gradient-to-t from-cream via-cream/95 to-cream/0 pb-3 pt-4 md:pb-4">
        {error && (
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-rose/12 px-4 py-3 text-sm text-ink/76 shadow-sm">
            <span>{error}</span>
            {error.includes("Escolha um plano") && <LinkButton href="/contratar" variant="ghost">Ver planos</LinkButton>}
            {!userId && error.includes("Entre") && <LinkButton href="/login" variant="ghost">Entrar</LinkButton>}
          </div>
        )}
        <ChatInput
          disabled={loading}
          image={selectedImage}
          onChange={setInput}
          onImageChange={setSelectedImage}
          onSubmit={() => sendMessage()}
          value={input}
        />
      </div>
    </section>
  );
}
