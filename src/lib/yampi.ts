export const YAMPI_CHECKOUT_URL = "https://camisetas2026.pay.yampi.com.br/r/D7RGNE9BBU";

export function buildYampiCheckoutUrl(options: { quantity?: number; size?: string } = {}) {
  const url = new URL(YAMPI_CHECKOUT_URL);
  if (options.quantity && options.quantity > 0) {
    url.searchParams.set("quantity", String(options.quantity));
  }
  if (options.size) {
    url.searchParams.set("variant", options.size);
  }
  return url.toString();
}

export const YAMPI_ALIAS = "camisetas2026";
