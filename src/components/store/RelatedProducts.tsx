import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import type { CollectionProduct } from "@/data/collections";
import { formatBRL } from "@/lib/format";

function discountOf(item: CollectionProduct) {
  return item.oldPrice ? Math.round((1 - item.price / item.oldPrice) * 100) : 0;
}

function RelatedCard({ item }: { item: CollectionProduct }) {
  const discount = discountOf(item);
  const slug = item.slug || item.id;

  return (
    <Link
      to="/produto/$slug"
      params={{ slug }}
      className="group min-w-[42%] snap-start sm:min-w-[30%] lg:min-w-0"
    >
      <article className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-card)] transition-shadow hover:shadow-md">
        <div className="relative overflow-hidden bg-muted">
          {discount > 0 && (
            <span className="absolute left-2 top-2 z-10 rounded-md bg-brand px-1.5 py-0.5 text-[10px] font-bold text-brand-foreground">
              -{discount}%
            </span>
          )}
          <img
            src={item.image}
            alt={item.alt}
            loading="lazy"
            className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-1 flex-col p-2.5 sm:p-3">
          <h3 className="line-clamp-2 min-h-10 text-[13px] leading-snug text-foreground/90 group-hover:text-brand">
            {item.name}
          </h3>
          <div className="mt-auto pt-2">
            <p className="text-base font-extrabold text-brand-deep">{formatBRL(item.price)}</p>
            {item.oldPrice ? (
              <p className="text-[11px] text-muted-foreground line-through">{formatBRL(item.oldPrice)}</p>
            ) : null}
          </div>
        </div>
      </article>
    </Link>
  );
}

export function RelatedProducts({ items }: { items: CollectionProduct[] }) {
  if (!items.length) return null;

  return (
    <section aria-labelledby="relacionados-titulo" className="border-t border-border bg-surface">
      <div className="mx-auto max-w-[1200px] px-4 py-8 sm:py-10">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <h2
              id="relacionados-titulo"
              className="font-display text-lg font-bold text-brand-deep sm:text-xl"
            >
              Você também pode gostar
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">Outras peças da loja</p>
          </div>
          <Link
            to="/colecao/mais-vendidas"
            className="inline-flex shrink-0 items-center gap-0.5 text-xs font-semibold text-brand hover:underline"
          >
            Ver todas
            <ChevronRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>

        <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0 lg:pb-0 xl:grid-cols-5">
          {items.slice(0, 10).map((item) => (
            <RelatedCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
