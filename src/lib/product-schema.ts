import { z } from "zod";
import type { Product } from "@/data/product";
import { slugify } from "@/lib/slug";

export type ParsedProduct = Product & { published: boolean; rank: number };

export function safeImageSrc(src: string): string | null {
  const value = src.trim();
  if (!value || value.length > 2000) return null;
  if (value.startsWith("/") && !value.startsWith("//") && !value.includes("\\")) {
    return value;
  }
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

const sizeSchema = z.object({
  label: z.string().trim().min(1).max(20),
  extra: z.number().min(0).max(10_000),
  available: z.boolean(),
});

const imageSchema = z.object({
  src: z.string().min(1).max(2000),
  alt: z.string().max(200),
});

const specSchema = z.object({
  label: z.string().trim().min(1).max(80),
  value: z.string().trim().min(1).max(300),
});

const highlightSchema = z.object({
  title: z.string().trim().min(1).max(80),
  text: z.string().trim().min(1).max(300),
});

const faqSchema = z.object({
  question: z.string().trim().min(1).max(200),
  answer: z.string().trim().min(1).max(1000),
});

const chartSchema = z.object({
  size: z.string().trim().min(1).max(20),
  chest: z.string().trim().max(40),
  length: z.string().trim().max(40),
  shoulder: z.string().trim().max(40),
});

const reviewSchema = z.object({
  id: z.string().trim().min(1).max(80),
  author: z.string().trim().min(1).max(80),
  rating: z.number().int().min(1).max(5),
  date: z.string().trim().max(32),
  title: z.string().trim().max(120),
  content: z.string().trim().max(2000),
  verified: z.boolean(),
  photos: z.array(imageSchema).max(8).optional(),
});

export const productInputSchema = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  slug: z.string().trim().min(1).max(80),
  name: z.string().trim().min(1).max(160),
  category: z.string().trim().min(1).max(80),
  categorySlug: z.string().trim().max(80).optional(),
  badge: z.string().trim().max(40).optional(),
  sku: z.string().trim().min(1).max(40),
  brand: z.string().trim().min(1).max(80),
  stock: z.number().int().min(0).max(1_000_000),
  price: z.number().gt(0).max(1_000_000),
  oldPrice: z.number().gt(0).max(1_000_000).nullable(),
  pixDiscount: z.number().min(0).max(0.5),
  maxInstallments: z.number().int().min(1).max(24),
  images: z.array(imageSchema).max(20),
  sizes: z.array(sizeSchema).min(1).max(20),
  description: z.array(z.string().trim().max(4000)).max(12),
  specifications: z.array(specSchema).max(30),
  highlights: z.array(highlightSchema).max(12),
  faq: z.array(faqSchema).max(20),
  sizeChart: z.array(chartSchema).max(20),
  reviews: z.array(reviewSchema).max(50),
  rank: z.number().int().min(0).max(100_000),
  published: z.boolean(),
});

export function parseProductInput(input: unknown, isNew: boolean): ParsedProduct {
  const parsed = productInputSchema.parse(input);
  const images = parsed.images
    .map((image) => {
      const src = safeImageSrc(image.src);
      return src ? { src, alt: image.alt.trim() } : null;
    })
    .filter((image): image is { src: string; alt: string } => Boolean(image));

  if (parsed.oldPrice !== null && parsed.oldPrice <= parsed.price) {
    throw new Error("O preço antigo precisa ser maior que o preço atual.");
  }

  return {
    id: isNew ? "" : parsed.id || "",
    slug: slugify(parsed.slug) || slugify(parsed.name),
    name: parsed.name,
    category: parsed.category,
    categorySlug: slugify(parsed.categorySlug || parsed.category) || "vestuario",
    ...(parsed.badge ? { badge: parsed.badge } : {}),
    sku: parsed.sku,
    brand: parsed.brand,
    stock: parsed.stock,
    price: parsed.price,
    oldPrice: parsed.oldPrice,
    pixDiscount: parsed.pixDiscount,
    maxInstallments: parsed.maxInstallments,
    images,
    sizes: parsed.sizes,
    description: parsed.description.map((p) => p.trim()).filter(Boolean),
    specifications: parsed.specifications,
    highlights: parsed.highlights,
    faq: parsed.faq,
    sizeChart: parsed.sizeChart,
    reviews: parsed.reviews
      .map((review) => ({
        ...review,
        photos: (review.photos ?? [])
          .map((photo) => {
            const src = safeImageSrc(photo.src);
            return src ? { src, alt: photo.alt.trim() } : null;
          })
          .filter((photo): photo is { src: string; alt: string } => Boolean(photo)),
      }))
      .filter((review) => review.author.trim() && (review.content.trim() || review.photos.length > 0)),
    rank: parsed.rank,
    published: parsed.published,
  };
}
