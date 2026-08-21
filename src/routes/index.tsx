import { createFileRoute } from "@tanstack/react-router";
import { ProductPageView } from "@/components/store/ProductPageView";
import { StoreEmpty } from "@/components/store/StoreEmpty";
import { fetchFeaturedProduct } from "@/lib/products";
import { resolveStoreKey } from "@/lib/resolve-store-key";
import { STORES } from "@/lib/stores";

export const Route = createFileRoute("/")({
  loader: async () => {
    const storeKey = await resolveStoreKey();
    return { product: await fetchFeaturedProduct(storeKey), storeKey };
  },
  head: ({ loaderData }) => {
    const store = STORES[loaderData?.storeKey ?? "patriot"];
    const product = loaderData?.product;
    const title = product ? `${product.name} | ${store.name}` : store.title;
    const description = product?.description[0] ?? store.description;
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
  if (!product) return <StoreEmpty />;
  return <ProductPageView product={product} />;
}
