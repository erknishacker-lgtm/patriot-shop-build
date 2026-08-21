import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronDown, CreditCard } from "lucide-react";
import { Breadcrumbs } from "@/components/store/Breadcrumbs";
import { StoreLayout } from "@/components/store/StoreLayout";
import { TrustBlock } from "@/components/store/TrustBlock";
import { BenefitsStrip } from "@/components/store/BenefitsStrip";
import { type CollectionProduct } from "@/data/collections";
import { formatBRL } from "@/lib/format";
import { fetchPublishedProducts, toCollectionProduct } from "@/lib/products";
import { cn } from "@/lib/utils";

const TITLE = "Mais Vendidas | Clube Bolsonaro";
const DESCRIPTION =
  "Coleção Mais Vendidas do Clube Bolsonaro: camisetas patrióticas em tecido Dry 3D, com descontos, parcelamento em até 12x e envio para todo o Brasil.";

export const Route = createFileRoute("/colecao/mais-vendidas")({
  loader: async () => {
    const products = await fetchPublishedProducts();
    return { items: products.map(toCollectionProduct) };
  },
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CollectionPage,
});

type SortKey = "mais-vendidos" | "menor-preco" | "maior-preco" | "maior-desconto";

const SORTS: { value: SortKey; label: string }[] = [
  { value: "mais-vendidos", label: "Mais vendidos" },
  { value: "menor-preco", label: "Menor preço" },
  { value: "maior-preco", label: "Maior preço" },
  { value: "maior-desconto", label: "Maior desconto" },
];

const PRICE_RANGES = [
  { id: "ate-200", label: "Até R$ 200", test: (p: number) => p <= 200 },
  { id: "200-300", label: "R$ 200 a R$ 300", test: (p: number) => p > 200 && p <= 300 },
  { id: "acima-300", label: "Acima de R$ 300", test: (p: number) => p > 300 },
];

const discountOf = (p: CollectionProduct) =>
  p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;

function FilterGroup({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border py-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between text-sm font-semibold text-foreground"
      >
        {title}
        <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} />
      </button>
      {open && <div className="mt-3 space-y-2">{children}</div>}
    </div>
  );
}

function Check({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="size-4 accent-[var(--brand)] rounded border-border"
      />
      {label}
    </label>
  );
}

function ProductCard({ item }: { item: CollectionProduct }) {
  const discount = discountOf(item);
  const installment = item.price / item.maxInstallments;

  const card = (
    <article className="group flex h-full flex-col">
      <div className="relative overflow-hidden rounded-xl bg-muted">
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
      <h2 className="mt-3 text-center text-sm leading-snug text-foreground/90 transition-colors group-hover:text-brand">
        {item.name}
      </h2>
      <div className="mt-2 flex items-center justify-center gap-2">
        <span className="text-base font-bold text-foreground">{formatBRL(item.price)}</span>
        {item.oldPrice && (
          <span className="text-xs text-muted-foreground line-through">
            {formatBRL(item.oldPrice)}
          </span>
        )}
      </div>
      <p className="mt-1 flex items-center justify-center gap-1 text-[11px] text-muted-foreground">
        <CreditCard className="size-3" aria-hidden="true" />
        Até {item.maxInstallments}x de {formatBRL(installment)}
      </p>
    </article>
  );

  if (item.slug) {
    return (
      <Link to="/produto/$slug" params={{ slug: item.slug }} className="block h-full">
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

function CollectionPage() {
  const { items: catalog } = Route.useLoaderData();
  const [sort, setSort] = useState<SortKey>("mais-vendidos");
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [ranges, setRanges] = useState<string[]>([]);

  const items = useMemo(() => {
    let list = catalog.filter((p) => (onlyInStock ? p.inStock : true));
    if (ranges.length) {
      list = list.filter((p) =>
        ranges.some((id) => PRICE_RANGES.find((r) => r.id === id)?.test(p.price)),
      );
    }
    const sorted = [...list];
    if (sort === "menor-preco") sorted.sort((a, b) => a.price - b.price);
    else if (sort === "maior-preco") sorted.sort((a, b) => b.price - a.price);
    else if (sort === "maior-desconto") sorted.sort((a, b) => discountOf(b) - discountOf(a));
    else sorted.sort((a, b) => a.rank - b.rank);
    return sorted;
  }, [catalog, onlyInStock, ranges, sort]);

  return (
    <StoreLayout>
      <div className="mx-auto max-w-[1200px] px-4">
        <Breadcrumbs items={[{ label: "Página inicial", to: "/" }, { label: "Mais Vendidas" }]} />

        <header className="py-4 text-center">
          <h1 className="font-display text-2xl font-bold text-brand-deep sm:text-3xl">
            Mais Vendidas
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
            As peças preferidas dos patriotas: tecido Dry 3D, acabamento premium e envio para todo o
            Brasil.
          </p>
        </header>

        <div className="grid gap-8 pb-12 lg:grid-cols-[220px_1fr]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <h2 className="font-display text-lg font-semibold text-foreground">Filtros</h2>
            <FilterGroup title="Disponibilidade">
              <Check
                checked={onlyInStock}
                onChange={setOnlyInStock}
                label="Somente em estoque"
              />
            </FilterGroup>
            <FilterGroup title="Preço">
              {PRICE_RANGES.map((r) => (
                <Check
                  key={r.id}
                  checked={ranges.includes(r.id)}
                  onChange={(v) =>
                    setRanges((prev) => (v ? [...prev, r.id] : prev.filter((x) => x !== r.id)))
                  }
                  label={r.label}
                />
              ))}
            </FilterGroup>
          </aside>

          <section>
            <div className="mb-5 flex items-center justify-between gap-3 border-b border-border pb-3">
              <p className="text-sm text-muted-foreground">
                {items.length} {items.length === 1 ? "produto" : "produtos"}
              </p>
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="hidden sm:inline">Ordenar por</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="rounded-md border border-border bg-background px-2 py-1.5 text-sm font-medium text-foreground"
                  aria-label="Ordenar produtos"
                >
                  {SORTS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {items.length === 0 ? (
              <p className="py-12 text-center text-sm text-muted-foreground">
                Nenhum produto encontrado com os filtros selecionados.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3">
                {items.map((item) => (
                  <ProductCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      <BenefitsStrip />
      <TrustBlock />
    </StoreLayout>
  );
}
