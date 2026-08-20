import { createServerFn } from "@tanstack/react-start";
import { YAMPI_ALIAS, YAMPI_CHECKOUT_URL, buildYampiCheckoutUrl } from "@/lib/yampi";

type CheckoutInput = { quantity: number; size: string };

/**
 * Resolves the live Yampi purchase URL through the Yampi (Dooki) API,
 * falling back to the static checkout link if the API is unavailable.
 */
export const createYampiCheckout = createServerFn({ method: "POST" })
  .inputValidator((input: CheckoutInput) => ({
    quantity: Math.max(1, Math.min(99, Math.trunc(input.quantity) || 1)),
    size: String(input.size ?? ""),
  }))
  .handler(async ({ data }) => {
    const token = process.env["YAMPI_API_TOKEN"];
    const secret = process.env["YAMPI_SECRET_KEY"];

    const fallback = buildYampiCheckoutUrl(data);
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
        data?: Array<{ skus?: { data?: Array<Record<string, unknown>> } }>;
      };

      const skus = (json.data ?? []).flatMap((p) => p.skus?.data ?? []);
      const match =
        skus.find((s) =>
          String(s["title"] ?? "")
            .toLowerCase()
            .includes(data.size.toLowerCase()),
        ) ?? skus[0];

      const purchaseUrl = match ? String(match["purchase_url"] ?? "") : "";
      const base = purchaseUrl.startsWith("http") ? purchaseUrl : YAMPI_CHECKOUT_URL;

      const url = new URL(base);
      url.searchParams.set("quantity", String(data.quantity));
      if (data.size) url.searchParams.set("tamanho", data.size);
      return { url: url.toString(), source: "api" as const };
    } catch {
      return { url: fallback, source: "fallback" as const };
    }
  });
