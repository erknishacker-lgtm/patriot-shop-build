import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ADMIN_EMAIL } from "@/lib/admin";
import { getAdminSession, loginAdmin } from "@/lib/admin.functions";
import { clearBrowserAuthJunk } from "@/lib/clear-browser-auth";
import { getSupabaseConfig } from "@/lib/supabase";

export const Route = createFileRoute("/a8f3c91e7b2d4f06/")({
  head: () => ({
    meta: [{ title: "Acesso interno" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: InternalLoginPage,
});

function InternalLoginPage() {
  const navigate = useNavigate();
  const configured = Boolean(getSupabaseConfig());
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    clearBrowserAuthJunk();
    void getAdminSession().then((session) => {
      if (session.email) void navigate({ to: "/a8f3c91e7b2d4f06/estoque" });
    });
  }, [navigate]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!getSupabaseConfig()) {
      toast.error("O cofre ainda não foi conectado.");
      return;
    }
    setLoading(true);
    try {
      const result = await loginAdmin({ data: { email, password } });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      await navigate({ to: "/a8f3c91e7b2d4f06/estoque" });
    } catch {
      toast.error("Não entrou. Confira a senha.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-brand-deep px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-background p-6 shadow-[var(--shadow-card)] sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-lg bg-brand-deep">
            <span className="font-display text-sm font-bold text-gold">CB</span>
          </span>
          <div>
            <p className="font-display text-lg font-bold text-brand-deep">Acesso interno</p>
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
              Estoque da loja
            </p>
          </div>
        </div>

        {!configured ? (
          <ol className="grid gap-3 text-sm text-foreground">
            <li>1. Crie o projeto gratuito em supabase.com</li>
            <li>2. Copie a URL e a chave anon</li>
            <li>3. Me envie os dois valores nesta conversa</li>
            <li>4. Cole o arquivo supabase/schema.sql no SQL Editor</li>
            <li>5. Crie o usuário {ADMIN_EMAIL} em Authentication → Users</li>
          </ol>
        ) : (
          <form className="grid gap-4" onSubmit={(event) => void submit(event)}>
            <label className="grid gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                E-mail
              </span>
              <Input
                type="email"
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>
            <label className="grid gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Senha
              </span>
              <Input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>
            <Button type="submit" variant="cta" size="lg" disabled={loading}>
              {loading ? "Entrando…" : "Entrar"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
