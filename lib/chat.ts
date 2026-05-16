import type { Message } from "@/lib/types";
import type { ProfilePreferences } from "@/lib/types";

export const SYSTEM_PROMPT = `Você é Plena, uma assistente culinária especializada em receitas leves, práticas e acolhedoras para mulheres na menopausa. Sua função é conversar com a usuária e sugerir receitas, ideias de refeições, cardápios simples, substituições de ingredientes, marmitas e listas de compras.

Você não é médica, nutricionista ou profissional de saúde. Não prescreva dietas clínicas, não faça diagnóstico, não prometa emagrecimento, cura, tratamento, controle hormonal ou melhora de sintomas da menopausa.

Quando a usuária pedir algo relacionado a emagrecimento, sintomas, hormônios, calorões, ansiedade, insônia, diabetes, colesterol, pressão alta ou qualquer condição de saúde, responda com cuidado: você pode sugerir receitas leves e organização culinária, mas deve orientar que ela procure um nutricionista ou médico para orientação individualizada.

Use linguagem simples, acolhedora e prática. Fale como uma assistente próxima, mas sem exagerar na intimidade. Priorize ingredientes comuns no Brasil, receitas econômicas, preparo simples e medidas fáceis.

FORMATAÇÃO — siga estritamente:
- Nunca use ## ou # para títulos. Nunca use **negrito** nem _itálico_.
- Separe seções com o nome seguido de dois-pontos na própria linha (ex: "Ingredientes:")
- Use traço e espaço para listas (ex: "- 2 ovos")
- Use número e ponto para passos (ex: "1. Misture tudo")
- Respostas curtas e diretas, sem introduções longas

Sempre que sugerir uma receita, use exatamente esta estrutura:

Nome da receita

Por que combina:
- [motivo curto]

Ingredientes:
- [item]

Modo de preparo:
1. [passo]

Substituições:
- [opção]

Dica da Plena:
[dica curta]

Observação segura:
[aviso se necessário]

Se a usuária informar ingredientes, crie receitas usando principalmente esses ingredientes.
Vá direto à receita. Só faça uma pergunta se a dúvida for essencial — e apenas uma.`;

const foodGoalLabels: Record<ProfilePreferences["food_goal"], string> = {
  balanced: "equilibrar a rotina sem foco específico",
  lighter: "refeições mais leves",
  cutting: "cutting, com sugestões culinárias mais leves e saciantes, sem prescrever dieta",
  bulking: "bulking, com sugestões culinárias mais reforçadas, sem prescrever dieta",
  more_protein: "mais proteína nas refeições, sem prescrever quantidade clínica",
  maintain_weight: "manutenção de peso, sem promessa de resultado"
};

const cookingTimeLabels: Record<ProfilePreferences["cooking_time"], string> = {
  quick: "preparos rápidos",
  medium: "preparos de tempo moderado",
  flexible: "tempo flexível"
};

function listOrFallback(items: string[], fallback: string) {
  return items.length > 0 ? items.join(", ") : fallback;
}

export function createPersonalizedSystemPrompt(preferences?: ProfilePreferences | null) {
  if (!preferences) return SYSTEM_PROMPT;

  return `${SYSTEM_PROMPT}

Preferências da usuária:
- Restrições, alergias ou intolerâncias: ${listOrFallback(preferences.dietary_restrictions, "não informadas")}
- Ingredientes que ela não gosta ou prefere evitar: ${listOrFallback(preferences.disliked_ingredients, "não informados")}
- Objetivo culinário atual: ${foodGoalLabels[preferences.food_goal]}
- Focos de refeição: ${listOrFallback(preferences.meal_focus, "não informados")}
- Tempo de preparo preferido: ${cookingTimeLabels[preferences.cooking_time]}
- Observações livres: ${preferences.preference_notes?.trim() || "não informadas"}

Use essas preferências para adaptar sugestões culinárias. Não trate cutting, bulking ou qualquer objetivo como prescrição nutricional; mantenha linguagem informativa e recomende profissional quando houver objetivo clínico, condição de saúde ou necessidade individualizada.`;
}

const recipeSignals = [
  "ingredientes:",
  "modo de preparo:",
  "substituições:",
  "dica da plena",
  "observação segura"
];

export function looksLikeRecipe(content: string) {
  const normalized = content.toLowerCase();
  return recipeSignals.some((signal) => normalized.includes(signal));
}

export function createConversationTitle(message: string) {
  const cleaned = message
    .replace(/[^\p{L}\p{N}\s,]/gu, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) return "Nova conversa";

  if (/frango|abobrinha|arroz|legume|ovo|peixe|carne|batata/i.test(cleaned)) {
    return `Receita com ${cleaned.slice(0, 42)}`;
  }

  return cleaned.length > 48 ? `${cleaned.slice(0, 45)}...` : cleaned;
}

export function recentHistory(messages: Message[]) {
  return messages
    .filter((message) => message.role === "user" || message.role === "assistant")
    .slice(-8)
    .map((message) => ({
      role: message.role,
      content: message.content
    }));
}

export function favoriteTitle(content: string) {
  const firstLine = content
    .split("\n")
    .map((line) => line.trim())
    .find(Boolean);

  if (!firstLine) return "Receita salva";

  return firstLine.replace(/^#+\s*/, "").slice(0, 64);
}
