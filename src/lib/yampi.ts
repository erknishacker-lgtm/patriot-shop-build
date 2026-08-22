/**
 * Yampi junta várias peças num único link, com o token de cada produto:
 * https://loja.pay.yampi.com.br/r/TOKEN1:1,TOKEN2:2
 * @see https://help.yampi.com.br/pt-BR/articles/6067074-como-gerar-um-link-de-compra-para-varios-produtos
 */

export type CheckoutItem = { size: string; quantity: number };

export type YampiPurchase = {
  origin: string;
  token: string;
};

export function parseYampiPurchase(url: string): YampiPurchase | null {
  try {
    const parsed = new URL(url.trim());
    const match = parsed.pathname.match(/\/r\/([A-Za-z0-9]+)/i);
    if (!match?.[1]) return null;
    return { origin: parsed.origin, token: match[1] };
  } catch {
    return null;
  }
}

export function buildYampiCheckoutFromItems(
  items: Array<{ checkoutUrl?: string; quantity: number }>,
): { url: string } | { error: string } {
  const parsed = items.map((item) => {
    const purchase = parseYampiPurchase(item.checkoutUrl ?? "");
    if (!purchase) return null;
    return { ...purchase, quantity: Math.max(1, Math.min(99, Math.trunc(item.quantity) || 1)) };
  });

  if (parsed.some((item) => !item)) {
    return { error: "Uma das peças está sem o link de compra da Yampi. Cadastre o link no painel." };
  }

  const list = parsed as Array<YampiPurchase & { quantity: number }>;
  if (list.length === 0) {
    return { error: "O carrinho está vazio." };
  }

  const origin = list[0]!.origin;
  if (list.some((item) => item.origin !== origin)) {
    return {
      error:
        "As peças são de caixas Yampi diferentes. Coloque todos os produtos na mesma loja Yampi para pagar juntos.",
    };
  }

  const tokens = list.map((item) => `${item.token}:${item.quantity}`).join(",");
  return { url: `${origin}/r/${tokens}` };
}

/** Um único produto: usa o token da Yampi e a quantidade (:2), sem query extra. */
export function applyCheckoutParams(url: string, _size: string, quantity: number) {
  const built = buildYampiCheckoutFromItems([{ checkoutUrl: url, quantity }]);
  return "url" in built ? built.url : url;
}
