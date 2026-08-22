import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { CatalogProductCard } from "@/components/store/CatalogProductCard";
import { BenefitsStrip } from "@/components/store/BenefitsStrip";
import { StoreLayout } from "@/components/store/StoreLayout";
import { TrustBlock } from "@/components/store/TrustBlock";
import type { CollectionProduct } from "@/data/collections";
import { useStore } from "@/hooks/use-store";

type Filter = "todos" | "amarelas" | "pretas" | "ofertas" | string;

function matchesFilter(item: CollectionProduct, filter: Filter) {
  if (filter === "todos") return true;
  if (filter === "amarelas") return /amarela/i.test(item.name);
  if (filter === "pretas") return /preta/i.test(item.name);
  if (filter === "ofertas") return Boolean(item.oldPrice);
  return item.categorySlug === filter || item.category === filter;
}

export function HomeCatalog({ items }: { items: CollectionProduct[] }) {
  const store = useStore();
  const patriot = store.key === "patriot";
  const [filter, setFilter] = useState<Filter>("todos");

  const hasAmarelas = items.some((item) => /amarela/i.test(item.name));
  const hasPretas = items.some((item) => /preta/i.test(item.name));
  const hasOfertas = items.some((item) => item.oldPrice);
  const categories = useMemo(() => {
    const seen = new Map<string, string>();
    for (const item of items) {
      const slug = item.categorySlug || item.category;
      const label = item.category;
      if (slug && label && !seen.has(slug)) seen.set(slug, label);
    }
    return [...seen.entries()];
  }, [items]);

  const visible = items.filter((item) => matchesFilter(item, filter));

  return (
    <StoreLayout>
      <section className="relative isolate overflow-hidden bg-brand-deep">
        {patriot && (
          <img
            src="/home/hero.jpg"
            alt=""
            className="absolute inset-0 size-full object-cover object-right"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-deep via-brand-deep/85 to-brand-deep/25" />
        <div className="relative mx-auto flex min-h-[280px] max-w-[1200px] flex-col justify-center gap-4 px-4 py-12 sm:min-h-[380px] sm:py-16 lg:min-h-[440px]">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-gold">{store.tagline}</p>
          <h1 className="max-w-xl font-display text-3xl font-extrabold leading-tight text-primary-foreground sm:text-5xl">
            {patriot ? "Vista o movimento." : store.name}
          </h1>
          <p className="max-w-md text-sm text-primary-foreground/80 sm:text-base">
            {patriot
              ? "Camisetas oficiais Clube Bolsonaro. Tecido premium, envio para todo o Brasil."
              : store.description}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="#catalogo"
              className="inline-flex h-11 items-center rounded-full bg-gold px-6 text-sm font-bold text-gold-foreground shadow-[var(--shadow-cta)] hover:brightness-105"
            >
              Ver todas as peças
            </a>
            <Link
              to="/colecao/mais-vendidas"
              className="inline-flex h-11 items-center rounded-full border border-primary-foreground/25 px-6 text-sm font-semibold text-primary-foreground hover:bg-white/10"
            >
              Mais vendidas
            </Link>
          </div>
          <img
            src="/brand/stampabr-wordmark.png"
            alt="Stampabr — camisetas personalizadas"
            className="mt-4 h-10 w-auto object-contain object-left opacity-95 sm:h-12"
          />
        </div>
      </section>

      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-[1200px] px-4 py-6">
          <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
            <CategoryTile
              active={filter === "todos"}
              onClick={() => setFilter("todos")}
              label="Todas as peças"
              hint={`${items.length} produtos`}
              image={patriot ? "/home/hero.jpg" : store.logoSrc}
            />
            {hasAmarelas && (
              <CategoryTile
                active={filter === "amarelas"}
                onClick={() => setFilter("amarelas")}
                label="Camisetas amarelas"
                hint="Linha ouro"
                image={patriot ? "/home/cat-amarelas.jpg" : store.logoSrc}
              />
            )}
            {hasPretas && (
              <CategoryTile
                active={filter === "pretas"}
                onClick={() => setFilter("pretas")}
                label="Camisetas pretas"
                hint="Linha dark"
                image={patriot ? "/home/cat-pretas.jpg" : store.logoSrc}
              />
            )}
            {hasOfertas && (
              <CategoryTile
                active={filter === "ofertas"}
                onClick={() => setFilter("ofertas")}
                label="Ofertas"
                hint="Com desconto"
                image={patriot ? "/home/promo.jpg" : store.logoSrc}
              />
            )}
            {categories
              .filter(([slug]) => slug && slug !== "vestuario")
              .map(([slug, label]) => (
                <CategoryTile
                  key={slug}
                  active={filter === slug}
                  onClick={() => setFilter(slug)}
                  label={label}
                  hint="Categoria"
                  image={store.logoSrc}
                />
              ))}
          </div>
        </div>
      </section>

      {patriot && (
        <section className="mx-auto max-w-[1200px] px-4 py-8">
          <Link
            to="/colecao/mais-vendidas"
            className="relative block overflow-hidden rounded-2xl"
          >
            <img src="/home/promo.jpg" alt="" className="h-44 w-full object-cover sm:h-56" />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-deep/90 via-brand-deep/50 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-10">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold">Oferta da loja</p>
              <p className="mt-1 font-display text-2xl font-extrabold text-primary-foreground sm:text-3xl">
                Até 25% off nas mais pedidas
              </p>
              <span className="mt-3 inline-flex w-fit rounded-full bg-gold px-4 py-2 text-xs font-bold text-gold-foreground">
                Conferir coleção
              </span>
            </div>
          </Link>
        </section>
      )}

      <section id="catalogo" className="mx-auto max-w-[1200px] scroll-mt-24 px-4 pb-12">
        <div className="mb-5 flex items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-bold text-brand-deep">
              {filter === "todos" ? "Todas as peças" : "Seleção"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {visible.length} {visible.length === 1 ? "produto" : "produtos"}
            </p>
          </div>
        </div>

        {visible.length === 0 ? (
          <p className="rounded-2xl border border-border bg-card py-16 text-center text-sm text-muted-foreground">
            Nenhuma peça nesta categoria ainda.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {visible.map((item) => (
              <CatalogProductCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>

      <BenefitsStrip />
      <TrustBlock />
    </StoreLayout>
  );
}

function CategoryTile({
  label,
  hint,
  image,
  active,
  onClick,
}: {
  label: string;
  hint: string;
  image: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-w-[70%] snap-start overflow-hidden rounded-2xl border text-left sm:min-w-0 ${
        active ? "border-brand ring-2 ring-brand/30" : "border-border"
      }`}
    >
      <span className="relative block h-28 overflow-hidden bg-muted sm:h-32">
        <img src={image} alt="" className="size-full object-cover" />
        <span className="absolute inset-0 bg-gradient-to-t from-brand-deep/80 to-transparent" />
        <span className="absolute bottom-2 left-3 right-3">
          <span className="block font-display text-sm font-bold text-primary-foreground">{label}</span>
          <span className="block text-[11px] text-primary-foreground/75">{hint}</span>
        </span>
      </span>
    </button>
  );
}
