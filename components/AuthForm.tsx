"use client";

import { Eye, EyeOff, Loader2, LogOut, Mail, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { ProfilePreferencesForm } from "@/components/ProfilePreferencesForm";
import { Button } from "@/components/ui";
import { PLENA_MONTHLY_MESSAGE_LIMIT } from "@/lib/plans";
import { isSupabaseConfigured, supabase } from "@/lib/supabase-browser";

type AuthMode = "login" | "signup";
type Feedback = {
  tone: "neutral" | "success" | "error";
  text: string;
};

export function AuthForm({
  initialMode = "login",
  redirectTo = "/chat"
}: {
  initialMode?: AuthMode;
  redirectTo?: string;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const isSignup = mode === "signup";

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setFeedback({
        tone: "error",
        text: "Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY para ativar o login."
      });
      return;
    }

    supabase.auth.getUser().then(({ data }) => {
      setIsAuthenticated(Boolean(data.user));
      setEmail(data.user?.email ?? "");
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(Boolean(session?.user));
      setEmail(session?.user.email ?? "");
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  function switchMode(nextMode: AuthMode) {
    setMode(nextMode);
    setFeedback(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isSupabaseConfigured) {
      setFeedback({
        tone: "error",
        text: "O Supabase ainda não está configurado nesta instalação."
      });
      return;
    }

    setLoading(true);
    setFeedback(null);

    try {
      if (isSignup) {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { name: name.trim() }
          }
        });

        if (error) throw error;

        if (data.user) {
          await supabase.from("profiles").upsert({
            id: data.user.id,
            name: name.trim(),
            email: email.trim()
          });
        }

        setFeedback({
          tone: "success",
          text: "Conta criada. Se a confirmação por email estiver ativa no Supabase, confirme sua conta antes de entrar."
        });
        setMode("login");
        setPassword("");
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });

      if (error) throw error;

      setFeedback({ tone: "success", text: "Login feito. Redirecionando para a Plena..." });
      router.push(redirectTo);
      router.refresh();
    } catch (authError) {
      setFeedback({
        tone: "error",
        text: authError instanceof Error ? authError.message : "Não foi possível autenticar agora."
      });
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    if (!isSupabaseConfigured) return;

    setLoading(true);
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setPassword("");
    setFeedback({ tone: "success", text: "Você saiu da sua conta." });
    setLoading(false);
    router.refresh();
  }

  if (isAuthenticated) {
    return (
      <div className="space-y-5">
        <div className="rounded-3xl border border-sage/15 bg-sage/8 p-5">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-sage text-white">
              <UserRound size={20} aria-hidden />
            </span>
            <div>
              <p className="text-sm font-semibold text-sage">Conta conectada</p>
              <p className="break-all text-sm text-ink/68">{email}</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-ink/68">
            Seu histórico, conversas e receitas favoritas ficam salvos nesta conta. Você tem até {PLENA_MONTHLY_MESSAGE_LIMIT} mensagens da Plena por mês.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Button onClick={() => router.push("/chat")} type="button">
            Ir para o chat
          </Button>
          <Button disabled={loading} onClick={logout} type="button" variant="secondary">
            {loading ? <Loader2 className="animate-spin" size={17} aria-hidden /> : <LogOut size={17} aria-hidden />}
            Sair
          </Button>
        </div>

        {feedback && <FeedbackMessage feedback={feedback} />}

        <ProfilePreferencesForm />
      </div>
    );
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 rounded-full bg-sand/18 p-1">
        <button
          className={`rounded-full px-4 py-2.5 text-sm font-semibold transition ${
            mode === "login" ? "bg-white text-sage shadow-sm" : "text-ink/60 hover:text-ink"
          }`}
          onClick={() => switchMode("login")}
          type="button"
        >
          Entrar
        </button>
        <button
          className={`rounded-full px-4 py-2.5 text-sm font-semibold transition ${
            mode === "signup" ? "bg-white text-sage shadow-sm" : "text-ink/60 hover:text-ink"
          }`}
          onClick={() => switchMode("signup")}
          type="button"
        >
          Criar conta
        </button>
      </div>

      {isSignup && (
        <label className="block text-sm font-semibold text-ink/72">
          Nome
          <input
            autoComplete="name"
            className="mt-2 w-full rounded-2xl border border-sage/18 bg-white px-4 py-3 text-ink outline-none transition placeholder:text-ink/35 focus:border-sage focus:ring-4 focus:ring-sage/10"
            onChange={(event) => setName(event.target.value)}
            placeholder="Como quer ser chamada?"
            required
            value={name}
          />
        </label>
      )}

      <label className="block text-sm font-semibold text-ink/72">
        Email
        <span className="relative mt-2 block">
          <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/38" size={18} aria-hidden />
          <input
            autoComplete="email"
            className="w-full rounded-2xl border border-sage/18 bg-white py-3 pl-11 pr-4 text-ink outline-none transition placeholder:text-ink/35 focus:border-sage focus:ring-4 focus:ring-sage/10"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="voce@email.com"
            required
            type="email"
            value={email}
          />
        </span>
      </label>

      <label className="block text-sm font-semibold text-ink/72">
        Senha
        <span className="relative mt-2 block">
          <input
            autoComplete={isSignup ? "new-password" : "current-password"}
            className="w-full rounded-2xl border border-sage/18 bg-white px-4 py-3 pr-12 text-ink outline-none transition placeholder:text-ink/35 focus:border-sage focus:ring-4 focus:ring-sage/10"
            minLength={6}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Mínimo de 6 caracteres"
            required
            type={showPassword ? "text" : "password"}
            value={password}
          />
          <button
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-ink/55 transition hover:bg-sand/20 hover:text-ink"
            onClick={() => setShowPassword((current) => !current)}
            type="button"
          >
            {showPassword ? <EyeOff size={18} aria-hidden /> : <Eye size={18} aria-hidden />}
          </button>
        </span>
      </label>

      <Button className="w-full" disabled={loading} type="submit">
        {loading && <Loader2 className="animate-spin" size={17} aria-hidden />}
        {isSignup ? "Criar minha conta" : "Entrar na Plena"}
      </Button>

      {feedback && <FeedbackMessage feedback={feedback} />}
    </form>
  );
}

function FeedbackMessage({ feedback }: { feedback: Feedback }) {
  return (
    <p
      className={`rounded-2xl border px-4 py-3 text-sm leading-relaxed ${
        feedback.tone === "error"
          ? "border-rose/20 bg-rose/10 text-ink"
          : feedback.tone === "success"
            ? "border-sage/20 bg-sage/10 text-ink"
            : "border-sand/25 bg-sand/12 text-ink/72"
      }`}
    >
      {feedback.text}
    </p>
  );
}
