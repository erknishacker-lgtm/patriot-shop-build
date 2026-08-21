export type StoreKey = "patriot" | "lula" | "marcal";

export type StoreConfig = {
  key: StoreKey;
  name: string;
  shortName: string;
  catalogBrand: string;
  tagline: string;
  title: string;
  description: string;
  logoSrc: string;
  logoOnDarkSrc: string;
  favicon: string;
  footerNote: string;
  emptyTitle: string;
  emptyText: string;
  collectionLead: string;
  highlightTitle: string;
  descriptionKicker: string;
  reviewsLead: string;
  originalProductText: string;
  topbar: string[];
};

const COOKIE = "stampabr_loja";

export const STORES: Record<StoreKey, StoreConfig> = {
  patriot: {
    key: "patriot",
    name: "Clube Bolsonaro",
    shortName: "CB",
    catalogBrand: "Clube Bolsonaro",
    tagline: "Loja Oficial",
    title: "Clube Bolsonaro | Loja Oficial",
    description:
      "Loja oficial Clube Bolsonaro: vestuário com identidade patriótica, tecido Dry 3D e acabamento premium.",
    logoSrc: "/brand/clube-bolsonaro.png",
    logoOnDarkSrc: "/brand/clube-bolsonaro.png",
    favicon: "/favicon.png",
    footerNote: "© 2026 Clube Bolsonaro",
    emptyTitle: "Em breve",
    emptyText: "Novas peças estão chegando à loja oficial.",
    collectionLead:
      "As peças preferidas dos patriotas: tecido Dry 3D, acabamento premium e envio para todo o Brasil.",
    highlightTitle: "Por que escolher a Camiseta Clube Bolsonaro?",
    descriptionKicker: "Camiseta Oficial Clube Bolsonaro",
    reviewsLead: "Confira a opinião de clientes que já vestem a Camiseta Clube Bolsonaro",
    originalProductText: "Produto oficial da linha Clube Bolsonaro.",
    topbar: [
      "Compra 100% segura",
      "Frete grátis acima de R$ 299",
      "Faça parte do movimento que mais cresce no Brasil",
      "Envio para todo o Brasil",
    ],
  },
  lula: {
    key: "lula",
    name: "Loja Lula",
    shortName: "LULA",
    catalogBrand: "Loja Lula",
    tagline: "Camisetas do povo",
    title: "Loja Lula | Camisetas",
    description: "Camisetas e personalizados com as cores do PT. Envio para todo o Brasil.",
    logoSrc: "/brand/lula.svg",
    logoOnDarkSrc: "/brand/lula-on-dark.svg",
    favicon: "/brand/lula.svg",
    footerNote: "© 2026 Loja Lula",
    emptyTitle: "A loja está sendo montada",
    emptyText:
      "Em breve camisetas e personalizados. O cadastro de produtos já está pronto no painel.",
    collectionLead: "Camisetas e personalizados nas cores do povo. Envio para todo o Brasil.",
    highlightTitle: "Por que escolher a Loja Lula?",
    descriptionKicker: "Peça oficial Loja Lula",
    reviewsLead: "Confira a opinião de quem já comprou na Loja Lula",
    originalProductText: "Produto oficial da Loja Lula.",
    topbar: [
      "Compra 100% segura",
      "Frete para todo o Brasil",
      "Personalizados com a sua cara",
      "Pagamento no Pix e cartão",
    ],
  },
  marcal: {
    key: "marcal",
    name: "Pablo Marçal",
    shortName: "PM",
    catalogBrand: "Pablo Marçal",
    tagline: "Personalizados oficiais",
    title: "Pablo Marçal | Loja",
    description: "Camisetas e personalizados Pablo Marçal. Envio para todo o Brasil.",
    logoSrc: "/brand/marcal.svg",
    logoOnDarkSrc: "/brand/marcal-on-dark.svg",
    favicon: "/brand/marcal.svg",
    footerNote: "© 2026 Pablo Marçal",
    emptyTitle: "Loja em preparação",
    emptyText:
      "Os personalizados entram em breve. O painel já está pronto para cadastrar as peças.",
    collectionLead: "Personalizados Pablo Marçal. Envio para todo o Brasil.",
    highlightTitle: "Por que escolher os personalizados Pablo Marçal?",
    descriptionKicker: "Personalizado oficial Pablo Marçal",
    reviewsLead: "Confira a opinião de quem já comprou na loja Pablo Marçal",
    originalProductText: "Produto oficial da linha Pablo Marçal.",
    topbar: [
      "Compra 100% segura",
      "Personalize o seu",
      "Envio para todo o Brasil",
      "Pix e cartão",
    ],
  },
};

export function parseStoreKey(value: string | null | undefined): StoreKey | null {
  if (value === "lula" || value === "marcal" || value === "patriot") return value;
  return null;
}

export function storeFromCookieHeader(header: string | null | undefined): StoreKey | null {
  if (!header) return null;
  const match = header.match(/(?:^|;\s*)stampabr_loja=(patriot|lula|marcal)/);
  return parseStoreKey(match?.[1] ?? null);
}

export function persistStoreCookie(key: StoreKey) {
  if (typeof document === "undefined") return;
  document.cookie = `${COOKIE}=${key}; Path=/; Max-Age=86400; SameSite=Lax`;
}

export function storeFromHost(
  hostname: string,
  search = "",
  cookieHeader?: string | null,
): StoreKey {
  const raw = search.startsWith("?") ? search.slice(1) : search;
  const fromQuery = parseStoreKey(new URLSearchParams(raw).get("loja"));
  if (fromQuery) return fromQuery;

  const host = hostname.toLowerCase();
  if (host === "lula" || host.startsWith("lula.") || host.includes(".lula.")) return "lula";
  if (host.includes("marcal") || host.includes("pablo")) return "marcal";

  const fromCookie = storeFromCookieHeader(cookieHeader ?? (typeof document === "undefined" ? "" : document.cookie));
  if (fromCookie) return fromCookie;

  return "patriot";
}

export const STORE_BOOT_SCRIPT = `(function(){try{var h=location.hostname.toLowerCase();var q=new URLSearchParams(location.search).get('loja');var c=(document.cookie.match(/(?:^|; )stampabr_loja=(patriot|lula|marcal)/)||[])[1];var s=(q==='lula'||q==='marcal'||q==='patriot')?q:(h==='lula'||h.indexOf('lula.')===0||h.indexOf('.lula.')!==-1)?'lula':(h.indexOf('marcal')!==-1||h.indexOf('pablo')!==-1)?'marcal':(c||'patriot');document.documentElement.setAttribute('data-store',s);if(q==='lula'||q==='marcal'||q==='patriot'){document.cookie='stampabr_loja='+q+'; Path=/; Max-Age=86400; SameSite=Lax';}}catch(e){}})();`;
