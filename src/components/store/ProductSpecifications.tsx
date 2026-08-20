import type { ProductSpec } from "@/data/product";

export function ProductSpecifications({ specs }: { specs: ProductSpec[] }) {
  return (
    <section aria-labelledby="specs-titulo" className="mx-auto max-w-[1200px] px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <h2
          id="specs-titulo"
          className="text-center font-display text-2xl font-bold text-brand-deep sm:text-3xl"
        >
          Especificações
        </h2>
        <span className="mx-auto mt-3 block h-1 w-16 rounded-full bg-gold" aria-hidden="true" />
        <dl className="mt-8 overflow-hidden rounded-xl border border-border">
          {specs.map((spec, index) => (
            <div
              key={spec.label}
              className={`grid gap-1 px-5 py-4 sm:grid-cols-[220px_minmax(0,1fr)] sm:gap-4 ${
                index % 2 === 1 ? "bg-surface" : "bg-card"
              }`}
            >
              <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground sm:text-xs">
                {spec.label}
              </dt>
              <dd className="text-sm font-medium text-foreground">{spec.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
