import Image from "next/image";
import { CheckCircle2, Heart, MessageCircle, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { AuthForm } from "@/components/AuthForm";
import { Badge, Card } from "@/components/ui";

const benefits = [
  {
    icon: MessageCircle,
    title: "Continue conversas",
    text: "Retome ideias de cardápio, receitas e listas sem começar do zero."
  },
  {
    icon: Heart,
    title: "Salve favoritas",
    text: "Guarde respostas boas para cozinhar de novo quando quiser."
  },
  {
    icon: ShieldCheck,
    title: "Dados protegidos",
    text: "A autenticação usa Supabase e mantém cada conta separada."
  }
];

export default function LoginPage() {
  return (
    <AppShell>
      <main className="mx-auto grid min-h-[calc(100dvh-9.35rem)] max-w-6xl gap-8 px-4 py-8 md:min-h-[calc(100dvh-4.25rem)] md:grid-cols-[1fr_0.92fr] md:items-center md:py-12">
        <section className="order-2 space-y-7 md:order-1">
          <div>
            <Badge>Perfil Plena</Badge>
            <h1 className="mt-5 max-w-2xl font-serif text-5xl leading-[1.04] text-ink md:text-6xl">
              Entre para guardar sua cozinha do seu jeito
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink/68">
              Use sua conta para salvar histórico, favoritas e continuar conversas anteriores com a Plena.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <div className="rounded-3xl border border-white/70 bg-white/52 p-4 shadow-sm backdrop-blur" key={benefit.title}>
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-sage/12 text-sage">
                    <Icon size={19} aria-hidden />
                  </span>
                  <h2 className="mt-4 text-sm font-bold text-ink">{benefit.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-ink/62">{benefit.text}</p>
                </div>
              );
            })}
          </div>

          <div className="flex items-start gap-3 rounded-3xl bg-cream/70 p-4 text-sm leading-relaxed text-ink/65">
            <CheckCircle2 className="mt-0.5 shrink-0 text-sage" size={18} aria-hidden />
            <p>
              Depois de entrar, escolha um plano para liberar suas mensagens mensais, favoritos e histórico.
            </p>
          </div>
        </section>

        <section className="order-1 md:order-2">
          <Card className="relative overflow-hidden p-0">
            <div className="border-b border-sand/18 bg-white/72 px-6 py-6">
              <div className="flex items-center gap-4">
                <span className="relative h-14 w-14 overflow-hidden rounded-full bg-cream ring-1 ring-sage/15">
                  <Image alt="Ícone Plena" fill sizes="56px" src="/brand/plena-icon.png" className="object-cover" />
                </span>
                <div>
                  <p className="font-serif text-3xl leading-none text-ink">Plena</p>
                  <p className="mt-1 text-sm text-ink/58">Acesse sua conta</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <AuthForm />
            </div>
          </Card>
        </section>
      </main>
    </AppShell>
  );
}
