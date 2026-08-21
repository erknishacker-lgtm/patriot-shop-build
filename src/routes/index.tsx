import { createFileRoute } from "@tanstack/react-router";
import { ProductPageView } from "@/components/store/ProductPageView";
import { fetchFeaturedProduct } from "@/lib/products";

export const Route = createFileRoute("/")({
  loader: async () => ({ product: await fetchFeaturedProduct() }),
  head: ({ loaderData }) => {
    const product = loaderData?.product;
    const title = product
      ? `${product.name} | Loja Oficial`
      : "Camiseta Clube Bolsonaro | Loja Oficial";
    const description =
      product?.description[0] ??
      "Loja oficial Clube Bolsonaro: vestuário com identidade patriótica, tecido Dry 3D e envio para todo o Brasil.";
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
  component: HomePage,
});

function HomePage() {
  const { product } = Route.useLoaderData();
  return <ProductPageView product={product} />;
}
