"use client";

import { Eye, EyeOff, Loader2, LogOut, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui";
import { isSupabaseConfigured, supabase } from "@/lib/supabase-browser";

type Feedback = {
  tone: "success" | "error";
  text: string;
};

export function AccessPasswordForm({
  initialEmail = "",
  redirectTo = "/chat"
}: {
  initialEmail?: string;
  redirectTo?: string;
}) {
  const router = useRouter();
  const normalizedInitialEmail = initialEmail.trim().toLowerCase();
  const [email, setEmail] = useState(normalizedInitialEmail);
  const [currentEmail, setCurrentEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const targetEmail = useMemo(
    () => (normalizedInitialEmail || email).trim().toLowerCase(),
    [email, normalizedInitialEmail]
  );
  const isConnectedToAnotherEmail = Boolean(
    currentEmail && targetEmail && currentEmail.toLowerCase() !== targetEmail
  );

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setFeedback({
        tone: "error",
        text: "Configure o Supabase para ativar o acesso."
      });
      return;
    }

    supabase.auth.getUser().then(({ data }) => {
      const sessionEmail = data.user?.email?.trim().toLowerCase() ?? "";
      setCurrentEmail(sessionEmail);
      if (!normalizedInitialEmail && sessionEmail) {
        setEmail(sessionEmail);
      }
    });
  }, [normalizedInitialEmail]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isSupabaseConfigured) {
      setFeedback({ tone: "error", text: "O Supabase ainda não está configurado." });
      return;
    }

    if (!targetEmail) {
      setFeedback({ tone: "error", text: "Informe o email usado na compra." });
      return;
    }

    if (isConnectedToAnotherEmail) {
      setFeedback({
        tone: "error",
        text: `Você está conectada com ${currentEmail}. Saia dessa conta para criar acesso com ${targetEmail}.`
      });
      return;
    }

    setLoading(true);
    setFeedback(null);

    try {
      const activatePurchase = async () => {
        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData.session?.access_token;
        if (!token) return;

        await fetch("/api/checkout/activate", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      };

      const { data: userData } = await supabase.auth.getUser();

      if (userData.user) {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;

        await activatePurchase();
        setFeedback({ tone: "success", text: "Senha criada. Redirecionando para a Plena..." });
        router.push(redirectTo);
        router.refresh();
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email: targetEmail,
        password
      });

      if (error) throw error;

      if (data.session) {
        await activatePurchase();
        setFeedback({ tone: "success", text: "Senha criada. Redirecionando para a Plena..." });
        router.push(redirectTo);
        router.refresh();
        return;
      }

      setFeedback({
        tone: "success",
        text: "Senha criada. Se a confirmação por email estiver ativa, confirme o email e entre na Plena."
      });
      setPassword("");
    } catch (error) {
      setFeedback({
        tone: "error",
        text: error instanceof Error ? error.message : "Não foi possível criar sua senha agora."
      });
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    if (!isSupabaseConfigured) return;
    setLoading(true);
    await supabase.auth.signOut();
    setCurrentEmail("");
    setLoading(false);
    setFeedback(null);
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {normalizedInitialEmail ? (
        <div className="rounded-2xl border border-sage/15 bg-sage/8 px-4 py-3 text-sm text-ink/70">
          Email da compra
          <strong className="mt-1 block break-all text-ink">{normalizedInitialEmail}</strong>
        </div>
      ) : (
        <label className="block text-sm font-semibold text-ink/72">
          Email usado na compra
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
      )}

      <label className="block text-sm font-semibold text-ink/72">
        Crie sua senha
        <span className="relative mt-2 block">
          <input
            autoComplete="new-password"
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

      <Button className="w-full" disabled={loading || isConnectedToAnotherEmail} type="submit">
        {loading && <Loader2 className="animate-spin" size={17} aria-hidden />}
        Criar senha e acessar
      </Button>

      {isConnectedToAnotherEmail && (
        <Button className="w-full" disabled={loading} onClick={logout} type="button" variant="secondary">
          <LogOut size={17} aria-hidden />
          Sair da conta atual
        </Button>
      )}

      {feedback && (
        <p
          className={`rounded-2xl border px-4 py-3 text-sm leading-relaxed ${
            feedback.tone === "error"
              ? "border-rose/20 bg-rose/10 text-ink"
              : "border-sage/20 bg-sage/10 text-ink"
          }`}
        >
          {feedback.text}
        </p>
      )}
    </form>
  );
}
