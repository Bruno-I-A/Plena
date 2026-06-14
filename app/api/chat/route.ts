import Anthropic from "@anthropic-ai/sdk";
import type { ContentBlockParam, MessageParam } from "@anthropic-ai/sdk/resources/messages/messages";
import { NextRequest, NextResponse } from "next/server";
import { PLENA_MONTHLY_MESSAGE_LIMIT } from "@/lib/plans";
import { createConversationTitle, createPersonalizedSystemPrompt } from "@/lib/chat";
import { createSupabaseFromRequest, getAuthenticatedUser } from "@/lib/server-auth";
import { createSupabaseAdmin } from "@/lib/supabase-admin";
import { activateApprovedPurchaseForUser, getSubscriptionStatus } from "@/lib/subscription";
import { getMonthlyPlenaUsage } from "@/lib/usage";
import type { ProfilePreferences } from "@/lib/types";

export const runtime = "nodejs";

type IncomingMessage = {
  role: "user" | "assistant";
  content: string;
};

type IncomingImage = {
  dataUrl?: string;
  mediaType?: "image/jpeg" | "image/png" | "image/webp" | "image/gif";
};

const MAX_IMAGE_BASE64_BYTES = 4 * 1024 * 1024;
const SUPPORTED_IMAGE_MEDIA_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

function parseImageAttachment(image?: IncomingImage | null) {
  if (!image?.dataUrl || !image.mediaType) return null;

  if (!SUPPORTED_IMAGE_MEDIA_TYPES.has(image.mediaType)) {
    throw new Error("Envie uma imagem JPG, PNG, WebP ou GIF.");
  }

  const match = image.dataUrl.match(/^data:(image\/(?:jpeg|png|webp|gif));base64,([A-Za-z0-9+/=]+)$/);
  if (!match || match[1] !== image.mediaType) {
    throw new Error("Nao consegui ler essa foto. Tente enviar outra imagem.");
  }

  const base64Data = match[2];
  const estimatedBytes = Math.ceil((base64Data.length * 3) / 4);
  if (estimatedBytes > MAX_IMAGE_BASE64_BYTES) {
    throw new Error("A foto precisa ter ate 4 MB.");
  }

  return {
    data: base64Data,
    mediaType: image.mediaType
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      conversationId?: string;
      message?: string;
      image?: IncomingImage | null;
      history?: IncomingMessage[];
    };

    const message = body.message?.trim();
    let image;
    try {
      image = parseImageAttachment(body.image);
    } catch (imageError) {
      return jsonError(imageError instanceof Error ? imageError.message : "Nao consegui ler essa foto.");
    }

    if (!message && !image) return jsonError("Escreva uma mensagem ou envie uma foto para a Plena responder.");
    if ((message?.length ?? 0) > 1200) return jsonError("Sua mensagem ficou muito longa. Envie em partes menores.");

    const user = await getAuthenticatedUser(request);
    if (!user) {
      return jsonError("Entre na sua conta para conversar com a Plena e acompanhar seus créditos mensais.", 401);
    }

    const admin = createSupabaseAdmin();
    const database = admin ?? createSupabaseFromRequest(request);
    if (!database) {
      return jsonError("O Supabase ainda não foi configurado no servidor.", 500);
    }

    let subscription = await getSubscriptionStatus(database, user.id);
    if (!subscription.active && admin) {
      const activated = await activateApprovedPurchaseForUser(admin, {
        id: user.id,
        email: user.email
      });

      if (activated) {
        subscription = await getSubscriptionStatus(admin, user.id);
      }
    }

    if (!subscription.active) {
      return NextResponse.json(
        {
          error: "Escolha um plano da Plena para conversar e usar suas mensagens mensais.",
          code: "payment_required"
        },
        { status: 402 }
      );
    }

    const usage = await getMonthlyPlenaUsage(database, user.id);
    if (usage.remaining <= 0) {
      return NextResponse.json(
        {
          error: `Você usou as ${PLENA_MONTHLY_MESSAGE_LIMIT} mensagens da Plena deste mês. Seus créditos renovam no próximo mês.`,
          usage
        },
        { status: 429 }
      );
    }

    let conversationId = body.conversationId ?? null;
    if (conversationId) {
      const { data: conversation, error: conversationLookupError } = await database
        .from("conversations")
        .select("id")
        .eq("id", conversationId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (conversationLookupError) {
        return jsonError("Não consegui validar essa conversa agora.", 500);
      }

      if (!conversation) {
        return jsonError("Essa conversa não pertence à sua conta.", 403);
      }
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return jsonError("A chave da Anthropic ainda não foi configurada no servidor.", 500);
    }

    const anthropic = new Anthropic({ apiKey });
    const { data: profilePreferences } = await database
      .from("profiles")
      .select("dietary_restrictions, disliked_ingredients, food_goal, meal_focus, cooking_time, preference_notes")
      .eq("id", user.id)
      .maybeSingle();

    const history = (body.history ?? [])
      .filter((item) => (item.role === "user" || item.role === "assistant") && item.content?.trim())
      .slice(-8);

    const userText = image
      ? `${message || "Estime as calorias desta refeicao pela foto."}

Analise a foto da comida e responda em portugues com:
- alimentos que parecem estar no prato
- estimativa visual da porcao
- faixa aproximada de calorias
- principais incertezas da estimativa
- uma dica simples para equilibrar a refeicao, se fizer sentido

Nao trate como calculo exato nem orientacao clinica.`
      : message ?? "";

    const userContent: string | ContentBlockParam[] = image
      ? ([
          {
            type: "image" as const,
            source: {
              type: "base64" as const,
              media_type: image.mediaType,
              data: image.data
            }
          },
          {
            type: "text" as const,
            text: userText
          }
        ] satisfies ContentBlockParam[])
      : userText;

    const anthropicMessages: MessageParam[] = [
      ...history,
      { role: "user", content: userContent }
    ];

    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 850,
      system: createPersonalizedSystemPrompt(profilePreferences as ProfilePreferences | null),
      messages: anthropicMessages
    });

    const replyBlock = response.content.find((b) => b.type === "text");
    const reply =
      (replyBlock?.type === "text" ? replyBlock.text.trim() : null) ??
      "Não consegui montar uma sugestão agora. Tente me contar os ingredientes de outro jeito.";

    let assistantMessageId: string | null = null;

    if (!conversationId) {
      const { data: conversation, error: conversationError } = await database
        .from("conversations")
        .insert({
          user_id: user.id,
          title: createConversationTitle(message || "Foto para estimativa de calorias")
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
        content: message || "Foto enviada para estimativa de calorias."
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

    return NextResponse.json({
      reply,
      conversationId,
      messageId: assistantMessageId,
      usage: {
        ...usage,
        used: usage.used + 1,
        remaining: Math.max(usage.remaining - 1, 0)
      }
    });
  } catch (error) {
    console.error(error);
    return jsonError("Não consegui responder agora. Tente novamente em instantes.", 500);
  }
}
