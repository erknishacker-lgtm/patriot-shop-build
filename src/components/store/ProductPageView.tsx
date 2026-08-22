import { useEffect, useRef, useState } from "react";
import { Breadcrumbs } from "@/components/store/Breadcrumbs";
import { BenefitsStrip } from "@/components/store/BenefitsStrip";
import { ProductDescription } from "@/components/store/ProductDescription";
import { ProductFaq } from "@/components/store/ProductFaq";
import { ProductGallery } from "@/components/store/ProductGallery";
import { ProductHighlights } from "@/components/store/ProductHighlights";
import { ProductInfo } from "@/components/store/ProductInfo";
import { ProductReviews } from "@/components/store/ProductReviews";
import { ProductSpecifications } from "@/components/store/ProductSpecifications";
import { StickyBuyBar } from "@/components/store/StickyBuyBar";
import { StoreLayout } from "@/components/store/StoreLayout";
import { RelatedProducts } from "@/components/store/RelatedProducts";
import { TrustBlock } from "@/components/store/TrustBlock";
import type { CollectionProduct } from "@/data/collections";
import type { Product } from "@/data/product";
import { useProduct } from "@/hooks/use-product";

export function ProductPageView({
  product,
  related = [],
}: {
  product: Product;
  related?: CollectionProduct[];
}) {
  const state = useProduct(product);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    const node = ctaRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowSticky(!!entry && !entry.isIntersecting),
      { rootMargin: "-80px 0px 0px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <div className="mx-auto max-w-[1200px] px-4">
        <Breadcrumbs
          items={[
            { label: "Home", to: "/" },
            { label: product.category, to: "/" },
            { label: product.name },
          ]}
        />

        <div ref={ctaRef} className="grid gap-8 pb-12 lg:grid-cols-2 lg:gap-14">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <ProductGallery images={product.images} title={product.name} />
          </div>
          <ProductInfo {...state} />
        </div>
      </div>

      <RelatedProducts items={related} />
      <BenefitsStrip />
      <ProductDescription paragraphs={product.description} />
      <ProductReviews reviews={product.reviews} />
      <ProductHighlights items={product.highlights} />
      <ProductSpecifications specs={product.specifications} />
      <ProductFaq items={product.faq} />
      <TrustBlock />

      <StickyBuyBar
        price={state.total}
        visible={showSticky}
        size={state.selectedSize}
        quantity={state.quantity}
        onBuy={() => document.getElementById("cta-add-cart")?.click()}
      />
      <div className="h-20 lg:hidden" aria-hidden="true" />
    </StoreLayout>
  );
}
