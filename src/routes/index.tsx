import { createFileRoute } from "@tanstack/react-router";
import { ProductPageView } from "@/components/store/ProductPageView";
import { StoreEmpty } from "@/components/store/StoreEmpty";
import { fetchPublishedProducts, toCollectionProduct } from "@/lib/products";
import { resolveStoreKey } from "@/lib/resolve-store-key";
import { STORES } from "@/lib/stores";

export const Route = createFileRoute("/")({
  loader: async () => {
    const storeKey = await resolveStoreKey();
    const catalog = await fetchPublishedProducts(storeKey);
    const product = catalog[0] ?? null;
    const related = catalog.slice(1).map(toCollectionProduct);
    return { product, related, storeKey };
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
  const { product, related } = Route.useLoaderData();
  if (!product) return <StoreEmpty />;
  return <ProductPageView product={product} related={related} />;
}
