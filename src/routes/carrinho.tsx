import { Link, createFileRoute } from "@tanstack/react-router";
import { Loader2, ShoppingBag, Trash2 } from "lucide-react";
import { Breadcrumbs } from "@/components/store/Breadcrumbs";
import { QuantitySelector } from "@/components/store/QuantitySelector";
import { StoreLayout } from "@/components/store/StoreLayout";
import { TrustBlock } from "@/components/store/TrustBlock";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import { paymentUrlForItem, useCartCheckout } from "@/hooks/use-cart-checkout";
import { useStore } from "@/hooks/use-store";
import { formatBRL } from "@/lib/format";
import { resolveStoreKey } from "@/lib/resolve-store-key";
import { STORES } from "@/lib/stores";

export const Route = createFileRoute("/carrinho")({
  loader: async () => ({ storeKey: await resolveStoreKey() }),
  head: ({ loaderData }) => {
    const store = STORES[loaderData?.storeKey ?? "patriot"];
    const title = `Carrinho | ${store.name}`;
    const description = `Confira as peças no carrinho da ${store.name} antes de finalizar a compra.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "robots", content: "noindex" },
      ],
    };
  },
  component: CartPage,
});

function CartPage() {
  const store = useStore();
  const { items, count, subtotal, removeItem, updateQuantity } = useCart();
  const { checkout, loading } = useCartCheckout();
  const mixedLinks = items.filter((item) => paymentUrlForItem(item)).length > 1;

  return (
    <StoreLayout>
      <div className="mx-auto max-w-[1200px] px-4 pb-16">
        <Breadcrumbs items={[{ label: "Página inicial", to: "/" }, { label: "Carrinho" }]} />

        <header className="pb-6">
          <h1 className="font-display text-2xl font-bold text-brand-deep sm:text-3xl">Carrinho</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {count === 0
              ? `Nenhuma peça na ${store.name} ainda.`
              : `${count} ${count === 1 ? "peça" : "peças"} · ${formatBRL(subtotal)}`}
          </p>
        </header>

        {items.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card px-6 py-16 text-center shadow-[var(--shadow-card)]">
            <ShoppingBag className="mx-auto size-12 text-muted-foreground/50" aria-hidden="true" />
            <h2 className="mt-4 font-display text-xl font-bold text-brand-deep">
              Seu carrinho está vazio
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Escolha um tamanho na vitrine e toque em adicionar. As peças aparecem aqui, juntas,
              antes do pagamento.
            </p>
            <Button asChild variant="brand" size="lg" className="mt-6">
              <Link to="/colecao/mais-vendidas">Ver produtos</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
            <section aria-label="Itens do carrinho">
              <div className="hidden border-b border-border pb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground md:grid md:grid-cols-[minmax(0,1fr)_140px_100px_40px] md:gap-4">
                <span>Produto</span>
                <span>Quantidade</span>
                <span className="text-right">Total</span>
                <span />
              </div>

              <ul className="divide-y divide-border">
                {items.map((item) => (
                  <li
                    key={item.key}
                    className="flex flex-col gap-3 py-5 md:grid md:grid-cols-[minmax(0,1fr)_140px_100px_40px] md:items-center md:gap-4"
                  >
                    <div className="flex min-w-0 gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        width={96}
                        height={96}
                        className="size-20 shrink-0 rounded-xl border border-border object-cover sm:size-24"
                      />
                      <div className="min-w-0">
                        <p className="font-semibold leading-snug text-foreground">{item.name}</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Tamanho {item.size} · {formatBRL(item.unitPrice)}
                        </p>
                        {mixedLinks && paymentUrlForItem(item) && (
                          <button
                            type="button"
                            className="mt-2 text-xs font-semibold text-brand underline-offset-2 hover:underline"
                            onClick={() => void checkout(item)}
                          >
                            Pagar só esta peça
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 md:contents">
                      <div className="w-fit justify-self-start">
                        <QuantitySelector
                          size="sm"
                          value={item.quantity}
                          onChange={(quantity) => updateQuantity(item.key, quantity)}
                        />
                      </div>
                      <p className="text-right text-base font-bold text-brand-deep">
                        {formatBRL(item.unitPrice * item.quantity)}
                      </p>
                      <button
                        type="button"
                        aria-label={`Remover ${item.name}`}
                        onClick={() => removeItem(item.key)}
                        className="grid size-10 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <aside className="lg:sticky lg:top-28 lg:self-start">
              <section className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)] sm:p-6">
                <h2 className="font-display text-lg font-bold text-brand-deep">Resumo</h2>
                <dl className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Subtotal</dt>
                    <dd className="font-medium">{formatBRL(subtotal)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Frete</dt>
                    <dd className="text-muted-foreground">no pagamento</dd>
                  </div>
                </dl>
                <Separator className="my-4" />
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-semibold text-foreground">Total</span>
                  <span className="font-display text-2xl font-extrabold text-brand-deep">
                    {formatBRL(subtotal)}
                  </span>
                </div>
                {mixedLinks && (
                  <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
                    Cada peça desta cesta tem um pagamento próprio. O botão abaixo abre a primeira;
                    as outras continuam aqui.
                  </p>
                )}
                <Button
                  variant="cta"
                  size="xl"
                  className="mt-5 w-full"
                  disabled={loading}
                  onClick={() => void checkout()}
                >
                  {loading && <Loader2 className="animate-spin" />}
                  {loading ? "Abrindo pagamento…" : "Finalizar compra"}
                </Button>
                <Button asChild variant="ghost" className="mt-2 w-full">
                  <Link to="/colecao/mais-vendidas">Continuar comprando</Link>
                </Button>
              </section>
            </aside>
          </div>
        )}
      </div>
      <TrustBlock />
    </StoreLayout>
  );
}
