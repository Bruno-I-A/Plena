import Image from "next/image";
import { Check, Heart, MessageCircle, Sparkles } from "lucide-react";
import { PremiumCard } from "@/components/PremiumCard";
import { PublicShell } from "@/components/PublicShell";
import { SafetyNote } from "@/components/SafetyNote";
import { SalesDemo } from "@/components/SalesDemo";
import { Badge, Card, LinkButton } from "@/components/ui";
import { PLENA_MONTHLY_MESSAGE_LIMIT, PLENA_PLANS } from "@/lib/plans";

const pains = [
  "Abrir a geladeira e não saber o que fazer",
  "Comprar alimentos soltos e perder parte deles",
  "Repetir sempre o mesmo jantar por falta de ideia",
  "Querer comer melhor, mas sem entrar em dieta radical"
];

const transformations = [
  "Transforma ingredientes comuns em ideias simples",
  "Sugere variações para café, almoço, jantar e lanche",
  "Ajuda a montar lista de compras com mais intenção",
  "Salva histórico e favoritos para você voltar depois"
];

const stories = [
  {
    name: "Marina, 48",
    context: "Chegava cansada do trabalho e acabava beliscando qualquer coisa.",
    result:
      "Com a Plena, começou a pedir jantares de 15 minutos com o que já tinha em casa. O ganho não foi perfeição: foi parar de decidir tudo sozinha no fim do dia."
  },
  {
    name: "Cláudia, 55",
    context: "Comprava legumes com boa intenção, mas eles ficavam esquecidos.",
    result:
      "Passou a pedir ideias para usar três ingredientes antes de estragar. A rotina ficou mais econômica e menos pesada."
  },
  {
    name: "Renata, 51",
    context: "Queria variar o cardápio sem transformar a cozinha em projeto.",
    result:
      "Usa a Plena para montar bases da semana: uma proteína, dois acompanhamentos e lanches possíveis. Simples, repetível e realista."
  }
];

const creationNotes = [
  "A Plena nasceu da pergunta que aparece todos os dias: o que eu faço para comer agora?",
  "Ela foi pensada para mulheres que querem mais organização, mas não querem viver presas a cardápios rígidos.",
  "A proposta é culinária, não médica: ideias, combinações, compras e rotina alimentar com mais calma."
];

export default function HirePage() {
  return (
    <PublicShell>
      <main>
        <section className="mx-auto grid max-w-6xl gap-8 px-4 pb-10 pt-10 md:grid-cols-[1fr_0.9fr] md:items-center md:pb-14 md:pt-14">
          <div>
            <Badge>Contratar Plena</Badge>
            <h1 className="mt-5 font-serif text-5xl leading-tight text-ink md:text-6xl">
              Pare de carregar sozinha a pergunta: “o que eu vou comer hoje?”
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-ink/70">
              A Plena é uma assistente de receitas leves para organizar refeições, aproveitar o que você tem em casa e diminuir o peso mental da cozinha.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <LinkButton href="#planos">Quero contratar</LinkButton>
              <LinkButton href="#demo" variant="secondary">
                Testar demonstração
              </LinkButton>
            </div>
            <p className="mt-4 text-sm text-ink/58">
              Pagamento por Pix. Depois você cria uma senha e acessa o app com o mesmo email da compra.
            </p>
          </div>

          <div className="rounded-[1.35rem] border border-white/70 bg-white/72 p-5 shadow-soft">
            <div className="flex items-center gap-3 border-b border-sage/10 pb-4">
              <span className="relative h-12 w-12 overflow-hidden rounded-full bg-cream ring-1 ring-sage/15">
                <Image alt="Plena" className="object-cover" fill sizes="48px" src="/brand/plena-icon.png" />
              </span>
              <div>
                <p className="font-serif text-2xl text-ink">Plena</p>
                <p className="text-xs text-ink/58">Uma resposta calma para a cozinha real</p>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              <div className="ml-auto max-w-[86%] rounded-3xl rounded-br-md bg-sage px-4 py-3 text-sm leading-relaxed text-white">
                Tenho arroz, ovo, tomate e pouca energia. O que faço?
              </div>
              <div className="max-w-[92%] rounded-3xl rounded-bl-md bg-cream px-4 py-3 text-sm leading-relaxed text-ink">
                Vamos simplificar: arroz aquecido, tomate refogado e ovos mexidos cremosos. Se tiver azeite ou ervas, finaliza com um toque. Jantar pronto sem transformar a noite em tarefa.
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-sand/25 bg-white/42">
          <div className="mx-auto grid max-w-6xl gap-4 px-4 py-9 md:grid-cols-4">
            {pains.map((pain) => (
              <div className="flex gap-3 rounded-2xl bg-cream/70 px-4 py-4 text-sm font-semibold text-ink/72" key={pain}>
                <Heart className="mt-0.5 h-4 w-4 shrink-0 text-rose" />
                {pain}
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-[0.85fr_1.15fr] md:items-start">
          <div>
            <Badge>Por que a Plena existe</Badge>
            <h2 className="mt-4 font-serif text-4xl text-ink">Ela nasceu para ajudar no momento mais comum e mais cansativo do dia</h2>
          </div>
          <div className="grid gap-3">
            {creationNotes.map((note, index) => (
              <Card className="flex gap-4 bg-white/76" key={note}>
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-rose/15 text-sm font-bold text-rose">
                  {index + 1}
                </span>
                <p className="text-sm leading-relaxed text-ink/74">{note}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-10">
          <div className="max-w-3xl">
            <Badge>Casos ilustrativos</Badge>
            <h2 className="mt-4 font-serif text-4xl text-ink">Histórias parecidas com a rotina de quem usa</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink/62">
              Os exemplos abaixo são ilustrativos, criados para mostrar situações reais de uso da Plena no dia a dia.
            </p>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {stories.map((story) => (
              <Card className="bg-white/76" key={story.name}>
                <p className="font-serif text-2xl text-ink">{story.name}</p>
                <p className="mt-3 text-sm font-semibold leading-relaxed text-ink/72">{story.context}</p>
                <p className="mt-4 text-sm leading-relaxed text-ink/64">{story.result}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-10" id="demo">
          <SalesDemo />
        </section>

        <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-[0.9fr_1.1fr] md:items-center">
          <div>
            <Badge>O que muda</Badge>
            <h2 className="mt-4 font-serif text-4xl text-ink">Você continua decidindo. Só não precisa começar do zero.</h2>
            <p className="mt-4 text-ink/68">
              A Plena não promete cura, dieta perfeita ou milagre. Ela entrega clareza culinária: ideias possíveis, próximas da sua rotina e fáceis de adaptar.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {transformations.map((item) => (
              <div className="flex gap-3 rounded-2xl border border-sage/15 bg-white/70 px-4 py-4 text-sm font-semibold text-ink/72" key={item}>
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-10" id="planos">
          <div className="grid gap-6 md:grid-cols-[0.8fr_1.2fr] md:items-end">
            <div>
              <Badge>Planos</Badge>
              <h2 className="mt-4 font-serif text-4xl text-ink">Escolha seu acesso</h2>
              <p className="mt-3 text-ink/68">
                O plano libera {PLENA_MONTHLY_MESSAGE_LIMIT} mensagens mensais para conversar com a Plena, salvar histórico e voltar às suas receitas favoritas.
              </p>
            </div>
            <div className="rounded-2xl bg-sage/10 px-4 py-3 text-sm leading-relaxed text-ink/68">
              <Sparkles className="mr-2 inline h-4 w-4 text-sage" />
              Para teste, o mensal está temporariamente em {PLENA_PLANS.monthly.price}. Depois é só ajustar o valor final.
            </div>
          </div>

          <div className="mt-7 grid gap-5 lg:grid-cols-2">
            <PremiumCard
              description={PLENA_PLANS.monthly.description}
              features={[
                `${PLENA_MONTHLY_MESSAGE_LIMIT} mensagens da Plena por mês`,
                "Histórico e receitas favoritas salvos",
                "Cardápios semanais",
                "Lista de compras",
                "Acesso por email e senha"
              ]}
              highlighted
              name={PLENA_PLANS.monthly.name}
              planId="monthly"
              price={PLENA_PLANS.monthly.price}
            />
            <PremiumCard
              description={PLENA_PLANS.annual.description}
              features={[
                `${PLENA_MONTHLY_MESSAGE_LIMIT} mensagens da Plena por mês`,
                "Mesmo limite mensal com melhor preço anual",
                "Histórico e receitas favoritas salvos",
                "Cardápios semanais",
                "Acesso por email e senha"
              ]}
              name={PLENA_PLANS.annual.name}
              planId="annual"
              price={PLENA_PLANS.annual.price}
            />
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-4 px-4 pb-12 pt-2 md:grid-cols-[1fr_auto] md:items-center">
          <SafetyNote />
          <LinkButton href="/ativar-acesso" variant="secondary">
            Já paguei, criar senha
          </LinkButton>
        </section>
      </main>
    </PublicShell>
  );
}
