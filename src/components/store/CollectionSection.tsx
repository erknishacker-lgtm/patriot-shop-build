import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { bestSellers, type CollectionItem } from "@/data/collection";
import { formatBRL } from "@/lib/format";

function Card({ item }: { item: CollectionItem }) {
  const installment = item.price / 12;

  return (
    <li className="group flex w-[72vw] max-w-[260px] shrink-0 snap-start flex-col overflow-hidden rounded-xl border border-border bg-card sm:w-auto sm:max-w-none">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={item.image}
          alt={item.alt}
          loading="lazy"
          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {item.badge && (
          <span className="absolute left-2 top-2 rounded-full bg-brand px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-brand-foreground">
            {item.badge}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3">
        <h3 className="line-clamp-2 text-sm font-semibold text-brand-deep">{item.name}</h3>

        <div className="mt-1.5 flex items-center gap-1 text-[11px] text-muted-foreground">
          <span className="flex" aria-hidden="true">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`size-3 ${i < Math.round(item.rating) ? "fill-gold text-gold" : "text-muted-foreground/40"}`}
              />
            ))}
          </span>
          <span>
            {item.rating.toFixed(1).replace(".", ",")} ({item.reviews})
          </span>
        </div>

        <div className="mt-2">
          {item.oldPrice && (
            <p className="text-[11px] text-muted-foreground line-through">
              {formatBRL(item.oldPrice)}
            </p>
          )}
          <p className="text-lg font-bold text-brand-deep">{formatBRL(item.price)}</p>
          <p className="text-[11px] text-muted-foreground">
            ou 12x de {formatBRL(installment)} sem juros
          </p>
        </div>

        <Button variant="brand" size="sm" className="mt-3 w-full" asChild>
          <a href="/">Ver produto</a>
        </Button>
      </div>
    </li>
  );
}

export function CollectionSection() {
  return (
    <section aria-labelledby="colecao-mais-vendidas" className="bg-brand-soft/40 py-12">
      <div className="mx-auto max-w-[1200px] px-4">
        <h2
          id="colecao-mais-vendidas"
          className="text-center font-display text-2xl font-bold text-brand-deep sm:text-3xl"
        >
          Mais vendidas
        </h2>
        <span className="mx-auto mt-3 block h-1 w-16 rounded-full bg-gold" aria-hidden="true" />
        <p className="mx-auto mt-3 max-w-xl text-center text-sm text-muted-foreground">
          As peças preferidas de quem veste o movimento. Envio para todo o Brasil com Nota Fiscal.
        </p>

        <ul className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible lg:grid-cols-5">
          {bestSellers.map((item) => (
            <Card key={item.id} item={item} />
          ))}
        </ul>
      </div>
    </section>
  );
}
