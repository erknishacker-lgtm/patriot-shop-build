import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ProductPageView } from "@/components/store/ProductPageView";
import { fetchProductBySlug } from "@/lib/products";

export const Route = createFileRoute("/produto/$slug")({
  loader: async ({ params }) => {
    const product = await fetchProductBySlug(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    const product = loaderData?.product;
    const title = product ? `${product.name} | Loja Oficial` : "Produto | Loja Oficial";
    const description = product?.description[0] ?? "Produto da loja oficial Clube Bolsonaro.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ProdutoSlugPage,
  notFoundComponent: () => (
    <div className="grid min-h-[60vh] place-items-center px-4 text-center">
      <div>
        <h1 className="font-display text-2xl font-bold text-brand-deep">Produto não encontrado</h1>
        <p className="mt-2 text-sm text-muted-foreground">Esse item saiu da vitrine ou o link mudou.</p>
        <Link to="/" className="mt-4 inline-block text-sm font-semibold text-brand">
          Voltar à loja
        </Link>
      </div>
    </div>
  ),
});

function ProdutoSlugPage() {
  const { product } = Route.useLoaderData();
  return <ProductPageView product={product} />;
}
