import type {
  Product,
  ProductReview,
  ProductSize,
  ProductSpec,
} from "@/data/product";
import { product as fallbackProduct } from "@/data/product";
import { getSupabase } from "@/lib/supabase";
import type { CollectionProduct } from "@/data/collections";
import { STORES, type StoreKey } from "@/lib/stores";

export type ProductRecord = Product & {
  published: boolean;
  rank: number;
};

export type ProductRow = {
  id: string;
  slug: string;
  name: string;
  category: string;
  category_slug: string;
  badge: string | null;
  sku: string;
  brand: string;
  stock: number;
  price: number | string;
  old_price: number | string | null;
  pix_discount: number | string;
  max_installments: number;
  images: Product["images"] | null;
  sizes: ProductSize[] | null;
  description: string[] | null;
  specifications: ProductSpec[] | null;
  highlights: Product["highlights"] | null;
  faq: Product["faq"] | null;
  size_chart: Product["sizeChart"] | null;
  reviews: ProductReview[] | null;
  checkout_url: string | null;
  rank: number;
  published: boolean;
};

function num(value: number | string | null | undefined, fallback = 0) {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export function rowToProduct(row: ProductRow): ProductRecord {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    categorySlug: row.category_slug,
    ...(row.badge ? { badge: row.badge } : {}),
    sku: row.sku,
    brand: row.brand,
    stock: num(row.stock),
    price: num(row.price),
    oldPrice: row.old_price === null || row.old_price === "" ? null : num(row.old_price),
    pixDiscount: num(row.pix_discount, 0.03),
    maxInstallments: Math.max(1, Math.trunc(num(row.max_installments, 12))),
    images: Array.isArray(row.images) ? row.images : [],
    sizes: (Array.isArray(row.sizes) ? row.sizes : []).map((size) => ({
      label: size.label,
      extra: num(size.extra),
      available: size.available !== false,
      checkoutUrl: String(size.checkoutUrl ?? "").trim(),
    })),
    description: Array.isArray(row.description) ? row.description : [],
    specifications: Array.isArray(row.specifications) ? row.specifications : [],
    highlights: Array.isArray(row.highlights) ? row.highlights : [],
    faq: Array.isArray(row.faq) ? row.faq : [],
    sizeChart: Array.isArray(row.size_chart) ? row.size_chart : [],
    reviews: (Array.isArray(row.reviews) ? row.reviews : []).map((review) => ({
      ...review,
      photos: Array.isArray(review.photos) ? review.photos : [],
    })),
    checkoutUrl: row.checkout_url?.trim() ?? "",
    rank: num(row.rank, 100),
    published: row.published !== false,
  };
}

export function productToRow(product: ProductRecord) {
  return {
    slug: product.slug,
    name: product.name,
    category: product.category,
    category_slug: product.categorySlug,
    badge: product.badge?.trim() ? product.badge.trim() : null,
    sku: product.sku,
    brand: product.brand,
    stock: Math.max(0, Math.trunc(product.stock)),
    price: product.price,
    old_price: product.oldPrice,
    pix_discount: product.pixDiscount,
    max_installments: product.maxInstallments,
    images: product.images,
    sizes: product.sizes,
    description: product.description,
    specifications: product.specifications,
    highlights: product.highlights,
    faq: product.faq,
    size_chart: product.sizeChart,
    reviews: product.reviews,
    rank: product.rank,
    published: product.published,
  };
}

export function toCollectionProduct(product: ProductRecord): CollectionProduct {
  const cover = product.images[0];
  return {
    id: product.id,
    name: product.name,
    image: cover?.src ?? "",
    alt: cover?.alt ?? product.name,
    price: product.price,
    oldPrice: product.oldPrice,
    maxInstallments: product.maxInstallments,
    inStock: product.stock > 0 && product.sizes.some((s) => s.available),
    rank: product.rank,
    slug: product.slug,
    to: `/produto/${product.slug}`,
  };
}

function asFallbackRecord(source: Product = fallbackProduct): ProductRecord {
  return {
    ...source,
    published: true,
    rank: 1,
  };
}

export async function fetchPublishedProducts(
  storeKey: StoreKey = "patriot",
): Promise<ProductRecord[]> {
  const store = STORES[storeKey];
  const supabase = getSupabase();
  if (!supabase) return storeKey === "patriot" ? [asFallbackRecord()] : [];

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("published", true)
    .eq("brand", store.catalogBrand)
    .order("rank", { ascending: true });

  if (error) return storeKey === "patriot" ? [asFallbackRecord()] : [];
  return ((data ?? []) as ProductRow[]).map(rowToProduct);
}

export async function fetchFeaturedProduct(
  storeKey: StoreKey = "patriot",
): Promise<ProductRecord | null> {
  const list = await fetchPublishedProducts(storeKey);
  if (list.length) return list[0] ?? null;
  return storeKey === "patriot" ? asFallbackRecord() : null;
}

export async function fetchProductBySlug(
  slug: string,
  storeKey: StoreKey = "patriot",
): Promise<ProductRecord | null> {
  const store = STORES[storeKey];
  const supabase = getSupabase();
  if (!supabase) {
    return storeKey === "patriot" && fallbackProduct.slug === slug ? asFallbackRecord() : null;
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .eq("brand", store.catalogBrand)
    .maybeSingle();

  if (error || !data) {
    if (storeKey === "patriot" && fallbackProduct.slug === slug) return asFallbackRecord();
    return null;
  }
  return rowToProduct(data as ProductRow);
}

export function emptyProduct(catalogBrand = "Clube Bolsonaro"): ProductRecord {
  return {
    id: "",
    slug: "",
    name: "",
    category: "Vestuário",
    categorySlug: "vestuario",
    badge: "DESTAQUE",
    sku: "",
    brand: catalogBrand,
    stock: 0,
    price: 0,
    oldPrice: null,
    pixDiscount: 0.03,
    maxInstallments: 12,
    images: [],
    sizes: [
      { label: "P", extra: 0, available: true, checkoutUrl: "" },
      { label: "M", extra: 0, available: true, checkoutUrl: "" },
      { label: "G", extra: 0, available: true, checkoutUrl: "" },
      { label: "GG", extra: 0, available: true, checkoutUrl: "" },
      { label: "G1", extra: 9.15, available: true, checkoutUrl: "" },
      { label: "G2", extra: 19.15, available: true, checkoutUrl: "" },
    ],
    description: [""],
    specifications: [{ label: "Marca", value: catalogBrand }],
    highlights: [{ title: "", text: "" }],
    faq: [{ question: "", answer: "" }],
    sizeChart: [
      { size: "P", chest: "", length: "", shoulder: "" },
      { size: "M", chest: "", length: "", shoulder: "" },
      { size: "G", chest: "", length: "", shoulder: "" },
      { size: "GG", chest: "", length: "", shoulder: "" },
      { size: "G1", chest: "", length: "", shoulder: "" },
      { size: "G2", chest: "", length: "", shoulder: "" },
    ],
    reviews: [],
    checkoutUrl: "",
    published: true,
    rank: 100,
  };
}
