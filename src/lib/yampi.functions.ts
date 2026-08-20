import { createServerFn } from "@tanstack/react-start";
import {
  YAMPI_ALIAS,
  YAMPI_CHECKOUT_URL,
  YAMPI_SKU_BY_SIZE,
  buildYampiCartUrl,
  buildYampiCheckoutUrl,
  type CheckoutItem,
} from "@/lib/yampi";

type CheckoutInput = { items: CheckoutItem[] };

type YampiSku = Record<string, unknown>;

function normalize(value: unknown) {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

/**
 * Resolve os SKUs da Yampi para cada tamanho selecionado e monta um único
 * link de checkout com todos os itens do carrinho.
 */
export const createYampiCheckout = createServerFn({ method: "POST" })
  .inputValidator((input: CheckoutInput) => ({
    items: (Array.isArray(input?.items) ? input.items : [])
      .map((item) => ({
        size: String(item?.size ?? "").trim(),
        quantity: Math.max(1, Math.min(99, Math.trunc(Number(item?.quantity)) || 1)),
      }))
      .filter((item) => item.size.length > 0)
      .slice(0, 20),
  }))
  .handler(async ({ data }) => {
    const items = data.items;
    const fallback = buildYampiCheckoutUrl(items);
    if (items.length === 0) return { url: fallback, source: "fallback" as const };

    const token = process.env["YAMPI_API_TOKEN"];
    const secret = process.env["YAMPI_SECRET_KEY"];
    if (!token || !secret) return { url: fallback, source: "fallback" as const };

    try {
      const res = await fetch(
        `https://api.dooki.com.br/v2/${YAMPI_ALIAS}/catalog/products?include=skus&limit=20`,
        {
          headers: {
            "User-Token": token,
            "User-Secret-Key": secret,
            Accept: "application/json",
          },
        },
      );
      if (!res.ok) return { url: fallback, source: "fallback" as const };

      const json = (await res.json()) as {
        data?: Array<{ skus?: { data?: YampiSku[] } }>;
      };
      const skus = (json.data ?? []).flatMap((p) => p.skus?.data ?? []);
      if (skus.length === 0) return { url: fallback, source: "fallback" as const };

      const resolved = items.map((item) => {
        const mapped = YAMPI_SKU_BY_SIZE[item.size];
        const sku =
          (mapped &&
            skus.find(
              (s) => normalize(s["id"]) === normalize(mapped) || normalize(s["sku"]) === normalize(mapped),
            )) ||
          skus.find((s) => {
            const title = normalize(s["title"]);
            const size = normalize(item.size);
            return title === size || title.endsWith(` ${size}`) || title.includes(` ${size} `);
          }) ||
          skus.find((s) => normalize(s["title"]).includes(normalize(item.size)));
        return { item, sku };
      });

      const missing = resolved.filter((r) => !r.sku).map((r) => r.item.size);
      if (missing.length > 0) {
        return {
          url: fallback,
          source: "fallback" as const,
          warning: `Tamanhos sem SKU correspondente na Yampi: ${missing.join(", ")}`,
        };
      }

      // Mais de um tamanho: carrinho com múltiplos SKUs.
      if (resolved.length > 1) {
        const entries = resolved.map((r) => ({
          skuId: String(r.sku!["id"] ?? r.sku!["sku"] ?? ""),
          quantity: r.item.quantity,
        }));
        return { url: buildYampiCartUrl(entries), source: "api" as const };
      }

      const only = resolved[0]!;
      const purchaseUrl = String(only.sku!["purchase_url"] ?? "");
      const base = purchaseUrl.startsWith("http") ? purchaseUrl : YAMPI_CHECKOUT_URL;
      const url = new URL(base);
      url.searchParams.set("quantity", String(only.item.quantity));
      url.searchParams.set("tamanho", only.item.size);
      return { url: url.toString(), source: "api" as const };
    } catch {
      return { url: fallback, source: "fallback" as const };
    }
  });
