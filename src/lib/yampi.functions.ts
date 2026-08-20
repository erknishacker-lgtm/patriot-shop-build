import { createServerFn } from "@tanstack/react-start";

const YAMPI_ALIAS = "camisetas2026";
const API_BASE = `https://api.dooki.com.br/v2/${YAMPI_ALIAS}`;

function headers() {
  return {
    "User-Token": process.env["YAMPI_API_TOKEN"] ?? "",
    "User-Secret-Key": process.env["YAMPI_SECRET_KEY"] ?? "",
    "Content-Type": "application/json",
    Accept: "application/json",
  };
}

/** Lists catalog products + skus so we can map sizes to Yampi SKU ids. */
export const listYampiSkus = createServerFn({ method: "GET" }).handler(async () => {
  const res = await fetch(`${API_BASE}/catalog/products?include=skus&limit=20`, {
    headers: headers(),
  });
  const text = await res.text();
  if (!res.ok) {
    return { ok: false as const, status: res.status, error: text.slice(0, 500) };
  }
  let json: any;
  try {
    json = JSON.parse(text);
  } catch {
    return { ok: false as const, status: res.status, error: "invalid json" };
  }
  const products = (json?.data ?? []).map((p: any) => ({
    id: p.id,
    name: p.name,
    skus: (p.skus?.data ?? []).map((s: any) => ({
      id: s.id,
      title: s.title,
      price: s.price_sale ?? s.price,
      variations: (s.variations?.data ?? []).map((v: any) => v?.value?.value ?? v?.value),
    })),
  }));
  return { ok: true as const, products };
});
