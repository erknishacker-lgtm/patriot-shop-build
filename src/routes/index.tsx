import { createFileRoute } from "@tanstack/react-router";
import { HomeCatalog } from "@/components/store/HomeCatalog";
import { StoreEmpty } from "@/components/store/StoreEmpty";
import { fetchPublishedProducts, toCollectionProduct } from "@/lib/products";
import { resolveStoreKey } from "@/lib/resolve-store-key";
import { STORES } from "@/lib/stores";

export const Route = createFileRoute("/")({
  loader: async () => {
    const storeKey = await resolveStoreKey();
    const catalog = await fetchPublishedProducts(storeKey);
    return { items: catalog.map(toCollectionProduct), storeKey };
  },
  head: ({ loaderData }) => {
    const store = STORES[loaderData?.storeKey ?? "patriot"];
    return {
      meta: [
        { title: store.title },
        { name: "description", content: store.description },
        { property: "og:title", content: store.title },
        { property: "og:description", content: store.description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: HomePage,
});

function HomePage() {
  const { items } = Route.useLoaderData();
  if (items.length === 0) return <StoreEmpty />;
  return <HomeCatalog items={items} />;
}
