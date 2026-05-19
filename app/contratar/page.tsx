import Image from "next/image";
import { ArrowRight, Check, Clock3, Heart, Leaf, MessageCircle, ShieldCheck, ShoppingBasket, Sparkles, Star } from "lucide-react";
import { CheckoutButton } from "@/components/CheckoutButton";
import { PublicShell } from "@/components/PublicShell";
import { SafetyNote } from "@/components/SafetyNote";
import { SalesDemo } from "@/components/SalesDemo";
import { SalesFAQ } from "@/components/SalesFAQ";
import { SalesStickyCTA } from "@/components/SalesStickyCTA";
import { Badge, Card, LinkButton } from "@/components/ui";
import { PLENA_MONTHLY_MESSAGE_LIMIT, PLENA_PLANS } from "@/lib/plans";

const pains = [
  "Abrir a geladeira e não saber o que fazer",
  "Comprar alimentos com boa intenção e esquecer no fundo da gaveta",
  "Repetir sempre o mesmo prato por falta de ideia",
  "Querer comer melhor sem entrar numa dieta radical"
];

const audience = [
  "Você cozinha o básico quase todos os dias, mesmo cansada.",
  "Quer comer melhor, mas não quer uma rotina rígida.",
  "Gosta de ideias práticas, não de receitas impossíveis.",
  "Quer menos peso mental na cozinha.",
  "Prefere uma linguagem acolhedora e direta."
];

const cases = [
  {
    name: "Marina, 48",
    role: "chegava sem energia para decidir",
    body:
      "Voltava do trabalho e beliscava qualquer coisa. Começou a pedir jantares de 15 minutos com o que já tinha em casa. O ganho foi parar de decidir tudo sozinha no fim do dia."
  },
  {
    name: "Cláudia, 55",
    role: "comprava com boa intenção",
    body:
      "Legumes ficavam esquecidos no fundo da gaveta. Hoje pede três ideias antes de estragar. A rotina ficou mais econômica e menos pesada."
  },
  {
    name: "Renata, 51",
    role: "queria variar sem virar projeto",
    body:
      "Usa a Plena para montar bases da semana: uma proteína, dois acompanhamentos e lanches possíveis. Simples, repetível e realista."
  }
];

const features = [
  `${PLENA_MONTHLY_MESSAGE_LIMIT} mensagens por mês com a Plena`,
  "Cardápios semanais montados para você",
  "Lista de compras organizada",
  "Histórico e receitas favoritas salvas",
  "Acesso por email e senha"
];

export default function HirePage() {
  return (
    <PublicShell>
      <main className="bg-[#f3ead6] pb-20 text-[#2a261f]">
        <div className="mx-auto max-w-[480px] overflow-hidden bg-[#f3ead6] shadow-[0_0_70px_rgba(60,40,20,0.10)] md:my-8 md:rounded-[2rem]">
          <section className="relative px-6 pb-10 pt-9">
            <div className="pointer-events-none absolute right-[-4rem] top-14 h-64 w-64 rounded-full bg-[#ecc6bc]/45 blur-3xl" />
            <Badge className="relative bg-[#ecc6bc] text-[#8e4a40]">feito para mulheres 35+</Badge>

            <h1 className="relative mt-5 font-serif text-[3.25rem] leading-[0.98] tracking-tight text-[#2a261f]">
              Descubra em <em className="text-[#b8665a]">15 segundos</em> o que cozinhar hoje
            </h1>
            <p className="relative mt-5 text-lg leading-relaxed text-[#7a6f5e]">
              Conte pra Plena o que você já tem em casa. Ela te devolve uma receita prática e leve, com o que cabe na sua rotina, sem dieta e sem sair para comprar nada.
            </p>

            <div className="relative mt-6 space-y-3">
              <LinkButton className="w-full justify-between bg-[#3f4a2a] text-[#fbf6e9] hover:bg-[#344020]" href="#planos">
                Quero contratar a Plena
                <span className="grid h-9 w-9 place-items-center rounded-full bg-[#d6b67a] text-[#2a261f]">
                  <ArrowRight className="h-5 w-5" />
                </span>
              </LinkButton>
              <LinkButton className="w-full border-[#dbcfb4] bg-[#fbf6e9]" href="#demo" variant="secondary">
                Ver demonstração
              </LinkButton>
            </div>

            <div className="relative mt-5 rounded-[1.2rem] border border-[#dbcfb4] bg-[#fbf6e9] p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#3f4a2a]">
                <ShieldCheck className="h-5 w-5" />
                Sem fidelidade. Cancela quando quiser.
              </div>
              <div className="mt-3 flex items-center gap-2 text-sm text-[#7a6f5e]">
                <span className="flex text-[#b89557]">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star className="h-4 w-4 fill-current" key={index} />
                  ))}
                </span>
                <strong className="text-[#2a261f]">4,8/5</strong> entre as primeiras usuárias
              </div>
            </div>

            <div className="relative mt-6 rounded-[1.6rem] border border-[#dbcfb4] bg-[#fbf6e9] p-4">
              <div className="flex items-center gap-3 border-b border-[#dbcfb4] pb-3">
                <span className="relative h-10 w-10 overflow-hidden rounded-full bg-[#ece1c8] ring-1 ring-[#dbcfb4]">
                  <Image alt="Plena" className="object-cover" fill sizes="40px" src="/brand/plena-icon.png" />
                </span>
                <div>
                  <p className="font-serif text-2xl text-[#3f4a2a]">plena</p>
                  <p className="text-xs text-[#5e6b3f]">chat de receitas leves</p>
                </div>
              </div>
              <div className="mt-4 space-y-3">
                <div className="ml-auto max-w-[86%] rounded-3xl rounded-br-md bg-[#5e6b3f] px-4 py-3 text-sm leading-relaxed text-[#fbf6e9]">
                  Tenho ovos, arroz, tomate e abobrinha. Quero um jantar leve.
                </div>
                <div className="rounded-3xl rounded-bl-md border border-[#dbcfb4] bg-white px-4 py-3 text-sm leading-relaxed text-[#2a261f]">
                  Tigela quente de arroz com abobrinha dourada, tomate refogado e ovos mexidos cremosos. Pronta em 15 minutos.
                </div>
              </div>
            </div>
          </section>

          <section className="border-y border-[#dbcfb4] bg-[#fbf6e9]/70 px-6 py-9">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b8665a]">se você já passou por isso</p>
            <h2 className="mt-3 font-serif text-4xl leading-tight">O cansaço invisível de quem decide tudo na cozinha</h2>
            <div className="mt-5 space-y-3">
              {pains.map((pain) => (
                <div className="flex gap-3 rounded-2xl bg-[#f3ead6] px-4 py-4 text-sm font-semibold text-[#2a261f]/75" key={pain}>
                  <Heart className="mt-0.5 h-4 w-4 shrink-0 text-[#b8665a]" />
                  {pain}
                </div>
              ))}
            </div>
          </section>

          <section className="px-6 py-10">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b8665a]">não é só buscar receita</p>
            <h2 className="mt-3 font-serif text-4xl leading-tight">Google te dá opções. A Plena te dá um próximo passo.</h2>
            <div className="mt-5 grid gap-3">
              <Card className="border-[#ecc6bc] bg-[#fbf6e9]">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8e4a40]">buscando sozinha</p>
                <p className="mt-3 text-sm leading-relaxed text-[#7a6f5e]">
                  Você abre 12 abas, vê anúncios, receitas longas e ainda precisa adaptar tudo ao que tem em casa.
                </p>
              </Card>
              <Card className="border-[#7c8a5a]/35 bg-[#f8f1de]">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#3f4a2a]">perguntando pra Plena</p>
                <p className="mt-3 text-sm leading-relaxed text-[#7a6f5e]">
                  Você diz os ingredientes, o tempo e o tipo de refeição. Ela responde direto, com uma ideia possível.
                </p>
              </Card>
            </div>
          </section>

          <section className="px-6 py-10" id="demo">
            <SalesDemo />
          </section>

          <section className="bg-[#fbf6e9] px-6 py-10" id="historia">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b8665a]">nossa história</p>
            <h2 className="mt-3 font-serif text-4xl leading-tight">A Plena nasceu de uma geladeira aberta às 19h</h2>
            <blockquote className="mt-5 border-l-4 border-[#b8665a] pl-4 font-serif text-2xl italic leading-tight text-[#3f4a2a]">
              “Por que decidir o que comer parece a tarefa mais cansativa do dia?”
            </blockquote>
            <div className="mt-5 space-y-4 text-sm leading-relaxed text-[#7a6f5e]">
              <p>
                A pergunta veio depois de mais um dia cheio. Havia comida em casa, mas faltava energia mental para transformar aquilo em jantar.
              </p>
              <p>
                A Plena foi criada para esse momento: olhar para o que você já tem, reduzir o excesso de opções e sugerir uma saída simples.
              </p>
              <p>
                Ela não substitui nutricionista ou médico. Ela tira um peso culinário do seu dia.
              </p>
            </div>
          </section>

          <section className="px-6 py-10">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b8665a]">para quem foi feita</p>
            <h2 className="mt-3 font-serif text-4xl leading-tight">Para mulheres que já fazem demais</h2>
            <div className="mt-5 space-y-3">
              {audience.map((item) => (
                <div className="flex gap-3 rounded-2xl border border-[#dbcfb4] bg-[#fbf6e9] px-4 py-3 text-sm leading-relaxed text-[#2a261f]/75" key={item}>
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#5e6b3f]" />
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="bg-[#fbf6e9] px-6 py-10">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b8665a]">histórias ilustrativas</p>
            <h2 className="mt-3 font-serif text-4xl leading-tight">Rotinas reais, decisões mais leves</h2>
            <div className="mt-5 space-y-4">
              {cases.map((story) => (
                <Card className="bg-white" key={story.name}>
                  <div className="flex items-center gap-3">
                    <span className="grid h-12 w-12 place-items-center rounded-full bg-[#ecc6bc] font-serif text-2xl text-[#8e4a40]">
                      {story.name[0]}
                    </span>
                    <div>
                      <p className="font-serif text-2xl text-[#2a261f]">{story.name}</p>
                      <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#7a6f5e]">{story.role}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-[#7a6f5e]">{story.body}</p>
                </Card>
              ))}
            </div>
          </section>

          <section className="bg-[#3f4a2a] px-6 py-10 text-[#fbf6e9]" id="planos">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d6b67a]">escolha seu acesso</p>
            <h2 className="mt-3 font-serif text-4xl leading-tight">Comece hoje a tirar esse peso da rotina</h2>
            <p className="mt-4 text-sm leading-relaxed text-[#fbf6e9]/75">
              {PLENA_MONTHLY_MESSAGE_LIMIT} mensagens por mês com a sua assistente de cozinha. Pagamento por Pix e acesso por email e senha.
            </p>

            <div className="mt-5 space-y-2 rounded-[1.2rem] border border-[#d6b67a]/35 bg-[#2f381f] p-4 text-sm">
              <p><strong className="text-[#d6b67a]">R$ 80</strong> — um delivery de quarta-feira</p>
              <p><strong className="text-[#d6b67a]">R$ 250</strong> — uma consulta avulsa</p>
              <p><strong className="text-[#d6b67a]">R$ 29,33/mês</strong> — 1 mês com Plena no plano anual</p>
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-[1.5rem] bg-[#fbf6e9] p-5 text-[#2a261f] shadow-[0_18px_40px_rgba(0,0,0,0.20)]">
                <p className="font-serif text-3xl">Plena Mensal</p>
                <p className="mt-2 text-3xl font-bold text-[#5e6b3f]">{PLENA_PLANS.monthly.price}</p>
                <ul className="mt-5 space-y-3 text-sm text-[#7a6f5e]">
                  {features.map((feature) => (
                    <li className="flex gap-2" key={feature}>
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#5e6b3f]" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <CheckoutButton className="mt-6" planId="monthly">Contratar mensal</CheckoutButton>
              </div>

              <div className="rounded-[1.5rem] border border-[#d6b67a]/35 bg-[#2f381f] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-serif text-3xl">Plena Anual</p>
                    <p className="mt-2 text-4xl font-bold text-[#d6b67a]">R$ 29,33/mês</p>
                  </div>
                  <span className="rounded-full bg-[#d6b67a] px-3 py-1 text-xs font-bold text-[#2a261f]">mais escolhido</span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[#fbf6e9]/70">
                  {PLENA_PLANS.annual.price} cobrados anualmente. Economize pagando o ano inteiro de uma vez.
                </p>
                <CheckoutButton className="mt-6" planId="annual" variant="secondary">Contratar anual</CheckoutButton>
              </div>
            </div>

            <div className="mt-6 flex gap-3 rounded-[1.2rem] border border-[#d6b67a]/35 bg-[#2f381f] p-4 text-sm leading-relaxed text-[#fbf6e9]/78">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#d6b67a]" />
              Sem fidelidade. Se não for para você, cancela depois sem ligação e sem complicação.
            </div>
          </section>

          <section className="px-6 py-10">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b8665a]">perguntas frequentes</p>
            <h2 className="mt-3 font-serif text-4xl leading-tight">Antes de contratar</h2>
            <div className="mt-5">
              <SalesFAQ />
            </div>
          </section>

          <section className="bg-[#3f4a2a] px-6 py-12 text-center text-[#fbf6e9]">
            <MessageCircle className="mx-auto h-9 w-9 text-[#d6b67a]" />
            <h2 className="mt-4 font-serif text-4xl leading-tight">Hoje à noite, alguém decide com você.</h2>
            <p className="mt-4 text-sm leading-relaxed text-[#fbf6e9]/76">
              Conte para a Plena o que tem em casa. Em segundos, saia do “não sei” para uma refeição possível.
            </p>
            <LinkButton className="mt-6 w-full justify-between bg-[#b8665a] text-white hover:bg-[#8e4a40]" href="#planos">
              Quero contratar
              <ArrowRight className="h-5 w-5" />
            </LinkButton>
          </section>

          <section className="px-6 py-8">
            <SafetyNote />
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-xs text-[#7a6f5e]">
              <span className="inline-flex items-center gap-1"><Clock3 className="h-4 w-4" /> rápido</span>
              <span className="inline-flex items-center gap-1"><Leaf className="h-4 w-4" /> leve</span>
              <span className="inline-flex items-center gap-1"><ShoppingBasket className="h-4 w-4" /> prático</span>
              <span className="inline-flex items-center gap-1"><Sparkles className="h-4 w-4" /> feito com cuidado</span>
            </div>
          </section>
        </div>
        <SalesStickyCTA />
      </main>
    </PublicShell>
  );
}
