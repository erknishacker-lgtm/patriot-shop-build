import { Factory, Layers, Shirt, Sparkles } from "lucide-react";
import type { Product } from "@/data/product";

const ICONS = [Shirt, Layers, Sparkles, Factory];

export function ProductHighlights({ items }: { items: Product["highlights"] }) {
  return (
    <section aria-labelledby="beneficios-produto" className="mx-auto max-w-[1200px] px-4 py-12">
      <h2
        id="beneficios-produto"
        className="text-center font-display text-2xl font-bold text-brand-deep sm:text-3xl"
      >
        Por que escolher a Camiseta Clube Bolsonaro?
      </h2>
      <span
        className="mx-auto mt-3 block h-1 w-16 rounded-full bg-gold"
        aria-hidden="true"
      />
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, index) => {
          const Icon = ICONS[index % ICONS.length]!;
          return (
            <li key={item.title} className="rounded-xl border border-border bg-card p-6">
              <span className="grid size-10 place-items-center rounded-lg bg-brand-soft">
                <Icon className="size-5 text-brand-deep" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-base font-bold text-brand-deep">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
