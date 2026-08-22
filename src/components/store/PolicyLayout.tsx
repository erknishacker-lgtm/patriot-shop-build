import type { ReactNode } from "react";
import { StoreLayout } from "@/components/store/StoreLayout";

export function PolicyLayout({
  kicker,
  title,
  children,
}: {
  kicker: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <StoreLayout>
      <article className="mx-auto max-w-[720px] px-4 py-12 sm:py-16">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand">{kicker}</p>
        <h1 className="mt-2 font-display text-3xl font-extrabold text-brand-deep sm:text-4xl">
          {title}
        </h1>
        <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
          {children}
        </div>
        <p className="mt-10 text-[11px] leading-relaxed text-muted-foreground/80">
          Estas regras descrevem o funcionamento da loja. Direitos previstos no Código de Defesa do
          Consumidor prevalecem quando aplicáveis.
        </p>
      </article>
    </StoreLayout>
  );
}

export function PolicySection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-lg font-bold text-brand-deep">{title}</h2>
      <div className="mt-2 space-y-3">{children}</div>
    </section>
  );
}
