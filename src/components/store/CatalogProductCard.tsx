import { Link } from "@tanstack/react-router";
import { CreditCard } from "lucide-react";
import type { CollectionProduct } from "@/data/collections";
import { formatBRL } from "@/lib/format";

function discountOf(item: CollectionProduct) {
  return item.oldPrice ? Math.round((1 - item.price / item.oldPrice) * 100) : 0;
}

export function CatalogProductCard({ item }: { item: CollectionProduct }) {
  const discount = discountOf(item);
  const installment = item.price / Math.max(1, item.maxInstallments);
  const slug = item.slug;

  const card = (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-card)] transition-shadow hover:shadow-md">
      <div className="relative overflow-hidden bg-muted">
        {discount > 0 && (
          <span className="absolute left-2 top-2 z-10 rounded-md bg-brand px-2 py-1 text-[11px] font-bold text-brand-foreground">
            - {discount}%
          </span>
        )}
        {!item.inStock && (
          <span className="absolute right-2 top-2 z-10 rounded-md bg-foreground/80 px-2 py-1 text-[11px] font-semibold text-background">
            Esgotado
          </span>
        )}
        <img
          src={item.image}
          alt={item.alt}
          loading="lazy"
          className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-3">
        <h2 className="line-clamp-2 min-h-10 text-sm leading-snug text-foreground/90 group-hover:text-brand">
          {item.name}
        </h2>
        <div className="mt-auto pt-2">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-extrabold text-brand-deep">{formatBRL(item.price)}</span>
            {item.oldPrice ? (
              <span className="text-xs text-muted-foreground line-through">{formatBRL(item.oldPrice)}</span>
            ) : null}
          </div>
          <p className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
            <CreditCard className="size-3" aria-hidden="true" />
            Até {item.maxInstallments}x de {formatBRL(installment)}
          </p>
        </div>
      </div>
    </article>
  );

  if (slug) {
    return (
      <Link to="/produto/$slug" params={{ slug }} className="block h-full">
        {card}
      </Link>
    );
  }
  return item.to ? (
    <Link to={item.to} className="block h-full">
      {card}
    </Link>
  ) : (
    card
  );
}
