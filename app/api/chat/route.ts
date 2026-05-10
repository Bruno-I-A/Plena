import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createConversationTitle, SYSTEM_PROMPT } from "@/lib/chat";
import { createSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

type IncomingMessage = {
  role: "user" | "assistant";
  content: string;
};

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

async function getAuthenticatedUser(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!token || !url || !anonKey) {
    return null;
  }

  const supabase = createClient(url, anonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  });

  const { data, error } = await supabase.auth.getUser(token);
  if (error) return null;
  return data.user;
}

function createSupabaseFromRequest(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!token || !url || !anonKey) {
    return null;
  }

  return createClient(url, anonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`
      }
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      conversationId?: string;
      message?: string;
      history?: IncomingMessage[];
    };

    const message = body.message?.trim();
    if (!message) return jsonError("Escreva uma mensagem para a Plena responder.");
    if (message.length > 1200) return jsonError("Sua mensagem ficou muito longa. Envie em partes menores.");

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return jsonError("A chave da Anthropic ainda não foi configurada no servidor.", 500);
    }

    const anthropic = new Anthropic({ apiKey });
    const history = (body.history ?? [])
      .filter((item) => (item.role === "user" || item.role === "assistant") && item.content?.trim())
      .slice(-8);

    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 850,
      system: SYSTEM_PROMPT,
      messages: [
        ...history,
        { role: "user", content: message }
      ]
    });

    const replyBlock = response.content.find((b) => b.type === "text");
    const reply =
      (replyBlock?.type === "text" ? replyBlock.text.trim() : null) ??
      "Não consegui montar uma sugestão agora. Tente me contar os ingredientes de outro jeito.";

    const user = await getAuthenticatedUser(request);
    const admin = createSupabaseAdmin();
    const database = admin ?? createSupabaseFromRequest(request);
    let conversationId = body.conversationId ?? null;
    let assistantMessageId: string | null = null;

    if (user && database) {
      if (!conversationId) {
        const { data: conversation, error: conversationError } = await database
          .from("conversations")
          .insert({
            user_id: user.id,
            title: createConversationTitle(message)
          })
          .select("id")
          .single();

        if (conversationError) {
          return jsonError("A Plena respondeu, mas não consegui salvar a conversa.", 500);
        }

        conversationId = conversation.id;
      }

      const { data: userMessage, error: userMessageError } = await database
        .from("messages")
        .insert({
          conversation_id: conversationId,
          user_id: user.id,
          role: "user",
          content: message
        })
        .select("id")
        .single();

      if (userMessageError || !userMessage) {
        return jsonError("A Plena respondeu, mas não consegui salvar sua mensagem.", 500);
      }

      const { data: assistantMessage, error: assistantMessageError } = await database
        .from("messages")
        .insert({
          conversation_id: conversationId,
          user_id: user.id,
          role: "assistant",
          content: reply
        })
        .select("id")
        .single();

      if (assistantMessageError || !assistantMessage) {
        return jsonError("A Plena respondeu, mas não consegui salvar a resposta.", 500);
      }

      assistantMessageId = assistantMessage.id;

      await database
        .from("conversations")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", conversationId)
        .eq("user_id", user.id);
    }

    return NextResponse.json({
      reply,
      conversationId,
      messageId: assistantMessageId
    });
  } catch (error) {
    console.error(error);
    return jsonError("Não consegui responder agora. Tente novamente em instantes.", 500);
  }
}
