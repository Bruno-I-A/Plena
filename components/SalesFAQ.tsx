"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

const questions = [
  {
    question: "A Plena substitui nutricionista ou médico?",
    answer:
      "Não. A Plena oferece sugestões culinárias informativas: ideias de receitas, substituições e organização da rotina alimentar. Para orientação individualizada, procure um profissional de saúde."
  },
  {
    question: "Como funciona o pagamento?",
    answer:
      "Você escolhe o plano, paga por Pix com segurança pelo Mercado Pago e cria sua senha usando o mesmo email informado na compra."
  },
  {
    question: "Depois de pagar eu entro como?",
    answer:
      "Assim que o pagamento for aprovado, a tela leva você para criar uma senha. Depois disso, é só entrar no app com email e senha."
  },
  {
    question: "O que são as mensagens mensais?",
    answer:
      "São as conversas que você troca com a Plena durante o mês. Elas servem para pedir receitas, cardápios, substituições, listas de compras e ideias para a rotina."
  },
  {
    question: "Funciona no celular?",
    answer:
      "Sim. A Plena foi pensada para usar pelo navegador do celular, sem baixar aplicativo."
  },
  {
    question: "Posso cancelar depois?",
    answer:
      "Sim. A proposta é sem fidelidade. Você pode cancelar quando quiser."
  }
];

export function SalesFAQ() {
  const [open, setOpen] = useState(0);

  return (
    <div className="space-y-3">
      {questions.map((item, index) => {
        const isOpen = open === index;

        return (
          <div className="rounded-[1.2rem] border border-[#dbcfb4] bg-[#fbf6e9]" key={item.question}>
            <button
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left text-sm font-bold text-[#2a261f]"
              onClick={() => setOpen(isOpen ? -1 : index)}
              type="button"
            >
              {item.question}
              <Plus className={`h-5 w-5 shrink-0 transition ${isOpen ? "rotate-45" : ""}`} />
            </button>
            {isOpen && <p className="px-4 pb-4 text-sm leading-relaxed text-[#7a6f5e]">{item.answer}</p>}
          </div>
        );
      })}
    </div>
  );
}
