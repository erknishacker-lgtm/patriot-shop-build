import { ArrowRight, BadgePercent, ShieldCheck, Truck } from "lucide-react";

export function TopBar() {
  return (
    <div className="bg-brand-deep text-primary-foreground">
      <div className="mx-auto flex max-w-[1200px] items-center justify-center gap-4 px-4 py-2.5 text-center sm:justify-between">
        <div className="hidden items-center gap-4 sm:flex">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-primary-foreground/80">
            <ShieldCheck className="size-4 text-gold" aria-hidden="true" />
            Compra 100% segura
          </p>
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-primary-foreground/80">
            <BadgePercent className="size-4 text-gold" aria-hidden="true" />
            Frete grátis acima de R$ 299
          </p>
        </div>
        <p className="text-[11px] font-semibold tracking-wide sm:text-sm">
          Faça parte do movimento que mais cresce no Brasil
          <ArrowRight className="ml-1.5 inline size-3.5 text-gold" aria-hidden="true" />
        </p>
        <p className="hidden items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-primary-foreground/80 sm:flex">
          <Truck className="size-4 text-gold" aria-hidden="true" />
          Envio para todo o Brasil
        </p>
      </div>
    </div>
  );
}
