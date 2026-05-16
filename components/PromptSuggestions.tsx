"use client";

const suggestions = [
  "Tenho poucos ingredientes",
  "Quero um jantar leve",
  "Quero um doce mais leve",
  "Cardápio da semana",
  "Lista de compras da semana",
  "Café da manhã com saciedade"
];

export function PromptSuggestions({ onSelect }: { onSelect: (value: string) => void }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 plena-scrollbar" aria-label="Sugestões rápidas">
      {suggestions.map((suggestion) => (
        <button
          className="shrink-0 rounded-full border border-sage/20 bg-white/86 px-4 py-2.5 text-sm font-semibold text-ink/74 shadow-sm transition hover:border-sage/45 hover:bg-white"
          key={suggestion}
          onClick={() => onSelect(suggestion)}
          type="button"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
}
