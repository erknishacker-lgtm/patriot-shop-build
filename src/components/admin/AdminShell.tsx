import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/hooks/use-store";
import { logoutAdmin } from "@/lib/admin.functions";

export function AdminShell({
  children,
  title,
  action,
}: {
  children: React.ReactNode;
  title: string;
  action?: React.ReactNode;
}) {
  const store = useStore();
  const navigate = useNavigate();

  const logout = async () => {
    await logoutAdmin();
    await navigate({ to: "/a8f3c91e7b2d4f06" });
  };

  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-border bg-brand-deep text-brand-foreground">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link to="/a8f3c91e7b2d4f06/estoque" className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-lg bg-black/20">
              <Package className="size-4 text-gold" />
            </span>
            <span className="leading-tight">
              <span className="block font-display text-sm font-bold">{store.name}</span>
              <span className="block text-[10px] uppercase tracking-[0.16em] text-brand-foreground/70">
                Estoque interno
              </span>
            </span>
          </Link>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-brand-foreground hover:bg-white/10 hover:text-gold"
            onClick={() => void logout()}
          >
            <LogOut className="size-4" />
            Sair
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <h1 className="font-display text-2xl font-bold text-brand-deep">{title}</h1>
          {action}
        </div>
        {children}
      </main>
    </div>
  );
}
