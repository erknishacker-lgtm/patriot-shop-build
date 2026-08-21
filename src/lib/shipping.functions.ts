import { createServerFn } from "@tanstack/react-start";

export type ShippingQuote = {
  id: string;
  name: string;
  eta: string;
  price: number;
};

type SuperFreteService = {
  id?: number | string;
  name?: string;
  price?: string | number;
  custom_price?: string | number;
  delivery_time?: number;
  delivery_range?: { min?: number; max?: number };
  error?: string;
  company?: { name?: string };
};

function onlyDigits(value: string) {
  return String(value ?? "").replace(/\D/g, "");
}

/**
 * Cotação de frete real via SuperFrete (mesma transportadora usada no
 * checkout Yampi). Sem token configurado, cai em uma estimativa local.
 */
export const quoteShipping = createServerFn({ method: "POST" })
  .inputValidator((input: { cep: string }) => ({ cep: onlyDigits(input?.cep ?? "") }))
  .handler(async ({ data }) => {
    const cep = data.cep;
    if (cep.length !== 8) {
      return { options: [] as ShippingQuote[], error: "CEP inválido.", source: "invalid" as const };
    }

    const token = process.env["SUPERFRETE_TOKEN"];
    const from = onlyDigits(process.env["SUPERFRETE_FROM_CEP"] ?? "01001000") || "01001000";

    const fallback = (): { options: ShippingQuote[]; source: "fallback" } => {
      const far = Number(cep.slice(0, 1)) >= 6 ? 2 : 0;
      return {
        options: [
          { id: "padrao", name: "Entrega padrão", eta: `${8 + far} a ${13 + far} dias úteis`, price: 0 },
          { id: "expressa", name: "Entrega expressa", eta: `${5 + far} a ${9 + far} dias úteis`, price: 19.9 },
        ],
        source: "fallback",
      };
    };

    if (!token) return fallback();

    try {
      const res = await fetch("https://api.superfrete.com/api/v0/calculator", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          "User-Agent": "Clube Bolsonaro Store (contato@clubebolsonaro.com.br)",
        },
        body: JSON.stringify({
          from: { postal_code: from },
          to: { postal_code: cep },
          services: "1,2,17",
          options: { own_hand: false, receipt: false, insurance_value: 0, use_insurance_value: false },
          package: { height: 4, width: 20, length: 28, weight: 0.3 },
        }),
      });

      const raw = await res.text();
      if (!res.ok) {
        console.error("[superfrete] HTTP", res.status, raw.slice(0, 500));
        return fallback();
      }
      let json: SuperFreteService[] | { message?: string };
      try {
        json = JSON.parse(raw);
      } catch {
        console.error("[superfrete] resposta não-JSON", raw.slice(0, 300));
        return fallback();
      }
      if (!Array.isArray(json)) {
        console.error("[superfrete] payload inesperado", raw.slice(0, 500));
        return fallback();
      }

      const options = json
        .filter((s) => !s.error && (s.price ?? s.custom_price) != null)
        .map((s, i) => {
          const price = Number(s.custom_price ?? s.price ?? 0);
          const min = s.delivery_range?.min ?? s.delivery_time ?? 0;
          const max = s.delivery_range?.max ?? s.delivery_time ?? min;
          return {
            id: String(s.id ?? i),
            name: s.name ?? s.company?.name ?? "Envio",
            eta: min === max ? `${max} dias úteis` : `${min} a ${max} dias úteis`,
            price: Number.isFinite(price) ? price : 0,
          } satisfies ShippingQuote;
        })
        .sort((a, b) => a.price - b.price);

      if (options.length === 0) {
        const apiError = json.find((s) => s.error)?.error;
        console.error("[superfrete] sem opções", apiError ?? raw.slice(0, 300));
        return {
          options: [] as ShippingQuote[],
          error: apiError ?? "Não encontramos opções de entrega para este CEP.",
          source: "superfrete" as const,
        };
      }
      return { options, source: "superfrete" as const };
    } catch (err) {
      console.error("[superfrete] erro", err);
      return fallback();
    }
  });
