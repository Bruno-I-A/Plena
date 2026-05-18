"use client";

import { Check, ChefHat, MessageCircle, ShoppingBasket } from "lucide-react";
import { useMemo, useState } from "react";

const demos = [
  {
    id: "jantar",
    icon: ChefHat,
    label: "Jantar com poucos ingredientes",
    prompt: "Tenho ovos, arroz, tomate e abobrinha. Quero um jantar leve.",
    answer:
      "Você pode fazer uma tigela quente de arroz com abobrinha dourada, tomate refogado e ovo mexido cremoso. Fica simples, sacia bem e não exige muitos utensílios. Se quiser deixar mais completo, finalize com um fio de azeite e ervas secas."
  },
  {
    id: "cardapio",
    icon: MessageCircle,
    label: "Ideias para a semana",
    prompt: "Me ajuda a variar o almoço da semana sem complicar?",
    answer:
      "Claro. Uma base prática é alternar: frango desfiado com legumes, omelete com salada morna, arroz com feijão e abóbora, macarrão simples com atum e tomate, e uma sopa cremosa de legumes. A ideia é repetir bases, mas mudar temperos e acompanhamentos."
  },
  {
    id: "compras",
    icon: ShoppingBasket,
    label: "Lista de compras",
    prompt: "Quero comprar coisas para refeições leves e fáceis.",
    answer:
      "Uma lista boa para começar: ovos, frango ou atum, iogurte natural, aveia, arroz, feijão, abobrinha, cenoura, tomate, folhas, banana, maçã e castanhas. Com isso você monta café da manhã, lanches, almoço e jantar sem depender de receitas difíceis."
  }
];

export function SalesDemo() {
  const [selectedId, setSelectedId] = useState(demos[0].id);
  const selectedDemo = useMemo(
    () => demos.find((demo) => demo.id === selectedId) ?? demos[0],
    [selectedId]
  );
  const Icon = selectedDemo.icon;

  return (
    <section className="rounded-[1.35rem] border border-white/70 bg-white/72 p-5 shadow-soft backdrop-blur">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-semibold text-sage">Demonstração rápida</p>
          <h2 className="mt-2 font-serif text-3xl text-ink">Veja como seria conversar com a Plena</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink/68">
            Escolha uma situação comum e veja um exemplo do tipo de resposta que a Plena entrega no app.
          </p>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-sage/10 px-3 py-2 text-xs font-semibold text-sage">
          <Check className="h-4 w-4" />
          Sem cadastro
        </span>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-[0.82fr_1.18fr]">
        <div className="grid gap-2">
          {demos.map((demo) => {
            const DemoIcon = demo.icon;
            const active = demo.id === selectedId;
            return (
              <button
                className={`flex min-h-14 items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
                  active
                    ? "border-sage bg-sage text-white"
                    : "border-sage/15 bg-cream/70 text-ink/72 hover:border-sage/35 hover:bg-white"
                }`}
                key={demo.id}
                onClick={() => setSelectedId(demo.id)}
                type="button"
              >
                <DemoIcon className="h-5 w-5 shrink-0" />
                {demo.label}
              </button>
            );
          })}
        </div>

        <div className="min-h-[20rem] rounded-[1.2rem] border border-sage/15 bg-cream/70 p-4">
          <div className="ml-auto max-w-[88%] rounded-3xl rounded-br-md bg-sage px-4 py-3 text-sm leading-relaxed text-white">
            {selectedDemo.prompt}
          </div>
          <div className="mt-4 flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-sage shadow-sm">
              <Icon className="h-5 w-5" />
            </span>
            <div className="rounded-3xl rounded-tl-md bg-white px-4 py-3 text-sm leading-relaxed text-ink shadow-sm">
              {selectedDemo.answer}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
