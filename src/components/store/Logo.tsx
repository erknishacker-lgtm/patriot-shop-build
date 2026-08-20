import { Link } from "@tanstack/react-router";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="flex min-w-0 items-center gap-2" aria-label="Clube Bolsonaro — início">
      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-brand-deep">
        <span className="font-display text-sm font-bold text-gold">CB</span>
      </span>
      {!compact && (
        <span className="min-w-0 leading-tight">
          <span className="block truncate font-display text-sm font-bold text-brand-deep sm:text-base">
            Clube Bolsonaro
          </span>
          <span className="hidden text-[10px] uppercase tracking-[0.18em] text-muted-foreground sm:block">
            Loja Oficial
          </span>
        </span>
      )}
    </Link>
  );
}
