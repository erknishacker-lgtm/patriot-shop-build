import type { ProductSpec } from "@/data/product";

export function ProductSpecifications({ specs }: { specs: ProductSpec[] }) {
  return (
    <section className="rounded-xl border border-border bg-card shadow-[var(--shadow-card)] p-6 sm:p-8" aria-labelledby="specs-titulo">
      <h2 id="specs-titulo" className="text-xl font-bold text-brand-deep sm:text-2xl">
        Especificações
      </h2>
      <span className="mt-3 block h-1 w-16 rounded-full bg-gradient-to-br from-gold to-gold-strong" aria-hidden="true" />
      <dl className="mt-6 grid gap-3 sm:grid-cols-2">
        {specs.map((spec) => (
          <div
            key={spec.label}
            className="rounded-xl border border-border bg-surface p-4 transition-colors hover:border-brand/30"
          >
            <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {spec.label}
            </dt>
            <dd className="mt-1 text-sm font-medium text-foreground">{spec.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
