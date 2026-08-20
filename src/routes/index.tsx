import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/store/Breadcrumbs";
import { ProductDescription } from "@/components/store/ProductDescription";
import { ProductGallery } from "@/components/store/ProductGallery";
import { ProductInfo } from "@/components/store/ProductInfo";
import { ProductSpecifications } from "@/components/store/ProductSpecifications";
import { StoreLayout } from "@/components/store/StoreLayout";
import { product } from "@/data/product";

const TITLE = "Camiseta Clube Bolsonaro | Loja Oficial";
const DESCRIPTION =
  "Camiseta Clube Bolsonaro com tecido Dry 3D, acabamento premium e identidade patriótica. Confira tamanhos e compre online.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "product" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    sku: product.sku,
    category: product.category,
    description: product.description[0],
    brand: { "@type": "Brand", name: product.brand },
    offers: {
      "@type": "Offer",
      priceCurrency: "BRL",
      price: product.price.toFixed(2),
      availability:
        product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <StoreLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-7xl px-4">
        <Breadcrumbs
          items={[
            { label: "Home", to: "/" },
            { label: product.category, to: "/" },
            { label: product.name },
          ]}
        />

        <div className="grid gap-8 pb-12 lg:grid-cols-2 lg:gap-12">
          <ProductGallery images={product.images} title={product.name} />
          <ProductInfo />
        </div>

        <div className="grid gap-6 pb-12 lg:grid-cols-2">
          <ProductDescription paragraphs={product.description} />
          <ProductSpecifications specs={product.specifications} />
        </div>
      </div>
    </StoreLayout>
  );
}
