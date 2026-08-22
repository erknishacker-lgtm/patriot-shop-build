import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { readCookieConsent, writeCookieConsent } from "@/lib/cookies";

export function CookieBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(readCookieConsent() === null);
  }, []);

  if (!open) return null;

  const choose = (value: "all" | "necessary") => {
    writeCookieConsent(value);
    setOpen(false);
  };

  return (
    <div
      role="dialog"
      aria-label="Aviso de cookies"
      className="fixed inset-x-0 bottom-0 z-[60] p-3 sm:p-4"
    >
      <div className="mx-auto flex max-w-[1200px] flex-col gap-4 rounded-2xl border border-border bg-background/95 p-4 shadow-[var(--shadow-card)] backdrop-blur sm:flex-row sm:items-end sm:p-5">
        <div className="min-w-0 flex-1">
          <p className="font-display text-sm font-bold text-brand-deep">Cookies nesta loja</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
            Usamos cookies necessários para o carrinho e o funcionamento do site. Se você aceitar
            todos, também medimos visitas (incluindo o Pixel da Meta) para melhorar anúncios. Veja a{" "}
            <Link to="/privacidade" className="font-semibold text-brand underline-offset-2 hover:underline">
              Política de privacidade
            </Link>
            .
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <Button type="button" variant="outline" onClick={() => choose("necessary")}>
            Só o necessário
          </Button>
          <Button type="button" variant="brand" onClick={() => choose("all")}>
            Aceitar todos
          </Button>
        </div>
      </div>
    </div>
  );
}
