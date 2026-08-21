export const YAMPI_CHECKOUT_URL = "https://camisetas2026.pay.yampi.com.br/r/D7RGNE9BBU";

export const YAMPI_ALIAS = "camisetas2026";

export type CheckoutItem = { size: string; quantity: number };

/**
 * Mapa explícito tamanho -> SKU da Yampi.
 * Preencha com os códigos reais da loja para garantir 1:1 com a seleção.
 * Enquanto vazio, o servidor resolve o SKU pelo título na API da Yampi.
 */
export const YAMPI_SKU_BY_SIZE: Record<string, string> = {};

export function applyCheckoutParams(url: string, size: string, quantity: number) {
  try {
    const parsed = new URL(url);
    if (quantity > 0 && !parsed.searchParams.has("quantity")) {
      parsed.searchParams.set("quantity", String(quantity));
    }
    if (size && !parsed.searchParams.has("tamanho") && !parsed.searchParams.has("size")) {
      parsed.searchParams.set("tamanho", size);
    }
    return parsed.toString();
  } catch {
    return url;
  }
}

/** Link de fallback (sem API), preservando tamanho e quantidade. */
export function buildYampiCheckoutUrl(items: CheckoutItem[]) {
  const url = new URL(YAMPI_CHECKOUT_URL);
  const total = items.reduce((acc, i) => acc + i.quantity, 0);
  if (total > 0) url.searchParams.set("quantity", String(total));
  const sizes = items.filter((i) => i.size).map((i) => `${i.size}x${i.quantity}`);
  if (sizes.length > 0) url.searchParams.set("tamanho", sizes.join(","));
  return url.toString();
}

/** URL de carrinho com múltiplos SKUs (usada quando há mais de um tamanho). */
export function buildYampiCartUrl(entries: { skuId: string; quantity: number }[]) {
  const url = new URL(`https://${YAMPI_ALIAS}.pay.yampi.com.br/cart`);
  entries.forEach((entry) => {
    url.searchParams.append("sku_id[]", entry.skuId);
    url.searchParams.append("quantity[]", String(entry.quantity));
  });
  return url.toString();
}
