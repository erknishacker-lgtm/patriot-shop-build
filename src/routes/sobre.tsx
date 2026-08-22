import { Link, createFileRoute } from "@tanstack/react-router";
import { StoreLayout } from "@/components/store/StoreLayout";
import { useStore } from "@/hooks/use-store";
import { resolveStoreKey } from "@/lib/resolve-store-key";
import { STORES } from "@/lib/stores";

export const Route = createFileRoute("/sobre")({
  loader: async () => ({ storeKey: await resolveStoreKey() }),
  head: ({ loaderData }) => {
    const store = STORES[loaderData?.storeKey ?? "patriot"];
    const title = `Sobre | ${store.name}`;
    return {
      meta: [
        { title },
        { name: "description", content: `Conheça a ${store.name}.` },
        { name: "robots", content: "index,follow" },
      ],
    };
  },
  component: SobrePage,
});

function SobrePage() {
  const store = useStore();
  const patriot = store.key === "patriot";

  return (
    <StoreLayout>
      <div className="mx-auto max-w-[720px] px-4 py-12 sm:py-16">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand">Sobre a loja</p>
        <h1 className="mt-2 font-display text-3xl font-extrabold text-brand-deep sm:text-4xl">
          {store.name}
        </h1>

        {patriot ? (
          <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            <p>
              O Clube Bolsonaro é a loja oficial de camisetas e personalizados para quem quer vestir
              o movimento com tecido bom e acabamento caprichado.
            </p>
            <p>
              Aqui você encontra as peças da linha, escolhe o tamanho, coloca no carrinho e conclui
              a compra com pagamento seguro. Envio para todo o Brasil.
            </p>
            <p>
              A produção fica com a Stampabr — camisetas personalizadas. É quem estampa, embala e
              despacha o seu pedido.
            </p>
          </div>
        ) : (
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {store.description} Esta página apresenta a loja e o caminho da compra: escolha a peça,
            adicione ao carrinho e finalize o pagamento.
          </p>
        )}

        <div className="mt-10 rounded-2xl bg-brand-deep px-6 py-8 text-center">
          <img
            src="/brand/stampabr-wide.jpg"
            alt="Stampabr — camisetas personalizadas"
            className="mx-auto h-14 w-auto object-contain mix-blend-screen sm:h-16"
          />
          <img
            src="/brand/stampabr-logo.png"
            alt=""
            className="mx-auto mt-5 h-16 w-auto object-contain mix-blend-screen"
          />
        </div>

        <Link
          to="/"
          className="mt-8 inline-flex h-11 items-center rounded-full bg-brand px-6 text-sm font-bold text-brand-foreground"
        >
          Ir para a loja
        </Link>
      </div>
    </StoreLayout>
  );
}
