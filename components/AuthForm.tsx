"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui";
import { isSupabaseConfigured, supabase } from "@/lib/supabase-browser";

export function AuthForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    supabase.auth.getUser().then(({ data }) => setIsAuthenticated(Boolean(data.user)));
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!isSupabaseConfigured) {
      setMessage("Configure o Supabase no arquivo .env para ativar login e cadastro.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name }
          }
        });

        if (error) throw error;

        if (data.user) {
          await supabase.from("profiles").upsert({
            id: data.user.id,
            name,
            email
          });
        }

        setMessage("Cadastro criado. Se seu Supabase exigir confirmação por email, confirme antes de entrar.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/chat");
        router.refresh();
      }
    } catch (authError) {
      setMessage(authError instanceof Error ? authError.message : "Não foi possível autenticar agora.");
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    if (!isSupabaseConfigured) return;
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setMessage("Você saiu da sua conta.");
  }

  if (isAuthenticated) {
    return (
      <div className="space-y-4">
        <p className="text-ink/70">Você está conectada. Seu histórico e favoritas podem ser salvos com segurança.</p>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => router.push("/chat")} type="button">Ir para o chat</Button>
          <Button onClick={logout} type="button" variant="secondary">Sair</Button>
        </div>
        {message && <p className="text-sm text-ink/60">{message}</p>}
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 rounded-full bg-sand/18 p-1">
        <button
          className={`rounded-full px-4 py-2 text-sm font-semibold ${mode === "login" ? "bg-white text-sage shadow-sm" : "text-ink/60"}`}
          onClick={() => setMode("login")}
          type="button"
        >
          Login
        </button>
        <button
          className={`rounded-full px-4 py-2 text-sm font-semibold ${mode === "signup" ? "bg-white text-sage shadow-sm" : "text-ink/60"}`}
          onClick={() => setMode("signup")}
          type="button"
        >
          Cadastro
        </button>
      </div>

      {mode === "signup" && (
        <label className="block text-sm font-semibold text-ink/72">
          Nome
          <input className="mt-2 w-full rounded-2xl border border-sage/18 bg-white px-4 py-3 outline-none focus:border-sage" onChange={(event) => setName(event.target.value)} required value={name} />
        </label>
      )}

      <label className="block text-sm font-semibold text-ink/72">
        Email
        <input className="mt-2 w-full rounded-2xl border border-sage/18 bg-white px-4 py-3 outline-none focus:border-sage" onChange={(event) => setEmail(event.target.value)} required type="email" value={email} />
      </label>

      <label className="block text-sm font-semibold text-ink/72">
        Senha
        <input className="mt-2 w-full rounded-2xl border border-sage/18 bg-white px-4 py-3 outline-none focus:border-sage" minLength={6} onChange={(event) => setPassword(event.target.value)} required type="password" value={password} />
      </label>

      <Button className="w-full" disabled={loading} type="submit">
        {mode === "login" ? "Entrar" : "Criar conta"}
      </Button>
      {message && <p className="rounded-2xl bg-sand/15 p-3 text-sm text-ink/68">{message}</p>}
    </form>
  );
}
