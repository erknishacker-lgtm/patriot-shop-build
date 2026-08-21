/** Pasta cifrada da porta de acesso. Não aparece no menu da loja. */
export const ADMIN_GATE = "a8f3c91e7b2d4f06";

/** Único e-mail autorizado a entrar no painel. */
export const ADMIN_EMAIL = "louzadaof@gmail.com";

export const adminPaths = {
  login: `/${ADMIN_GATE}`,
  estoque: `/${ADMIN_GATE}/estoque`,
  novo: `/${ADMIN_GATE}/estoque/novo`,
  editar: (id: string) => `/${ADMIN_GATE}/estoque/${id}`,
} as const;
