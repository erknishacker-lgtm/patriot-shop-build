import img1 from "@/assets/camiseta-1.jpg";
import img2 from "@/assets/camiseta-2.jpg";
import img3 from "@/assets/camiseta-3.jpg";
import img4 from "@/assets/camiseta-4.jpg";
import img5 from "@/assets/camiseta-5.jpg";

export type ProductSize = {
  /** Rótulo exibido no seletor */
  label: string;
  /** Valor adicional em reais somado ao preço base */
  extra: number;
  /** Disponibilidade da grade */
  available: boolean;
};

export type ProductSpec = {
  label: string;
  value: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  categorySlug: string;
  badge?: string;
  sku: string;
  brand: string;
  stock: number;
  /** Preço base em reais */
  price: number;
  /** Preço antigo (riscado). Deixe null quando não houver promoção. */
  oldPrice: number | null;
  images: { src: string; alt: string }[];
  sizes: ProductSize[];
  description: string[];
  specifications: ProductSpec[];
};

/**
 * Todos os dados do produto ficam concentrados aqui.
 * Para transformar em catálogo, basta exportar uma lista destes objetos.
 */
export const product: Product = {
  id: "camiseta-clube-bolsonaro",
  slug: "camiseta-clube-bolsonaro",
  name: "Camiseta Clube Bolsonaro",
  category: "Vestuário",
  categorySlug: "vestuario",
  badge: "DESTAQUE",
  sku: "CB-CAM-0001",
  brand: "Clube Bolsonaro",
  stock: 42,
  price: 239.8,
  oldPrice: null,
  images: [
    { src: img1, alt: "Camiseta Clube Bolsonaro verde vista de frente" },
    { src: img2, alt: "Camiseta Clube Bolsonaro vista das costas no cabide" },
    { src: img3, alt: "Detalhe do escudo em alto relevo emborrachado 3D" },
    { src: img4, alt: "Detalhe da gola polo V com retilínea" },
    { src: img5, alt: "Camiseta Clube Bolsonaro em flat lay" },
  ],
  sizes: [
    { label: "P", extra: 0, available: true },
    { label: "M", extra: 0, available: true },
    { label: "G", extra: 0, available: true },
    { label: "GG", extra: 0, available: true },
    { label: "G1", extra: 9.15, available: true },
    { label: "G2", extra: 19.15, available: true },
  ],
  description: [
    "A Camiseta Oficial Clube Bolsonaro foi criada para quem deseja vestir mais do que uma roupa: deseja expressar uma mensagem. Com visual marcante, acabamento de qualidade e identidade patriótica, é uma peça que carrega força, presença e personalidade.",
    "Sua construção em tecido Dry proporciona conforto térmico e praticidade no uso, sendo uma excelente opção para quem procura uma camiseta leve, resistente e com ótimo caimento. A arte foi desenvolvida para destacar os elementos visuais do projeto, valorizando as cores do Brasil e criando uma peça com presença forte tanto em ambientes casuais quanto em eventos.",
    "O produto faz parte da linha Clube Bolsonaro, pensada para quem busca peças com identidade, qualidade e propósito. Uma camiseta desenvolvida para unir conforto, estilo e sentimento patriótico em uma única peça.",
  ],
  specifications: [
    { label: "Gênero", value: "Masculino / Feminino / Infantil" },
    { label: "Marca", value: "Clube Bolsonaro" },
    {
      label: "Indicado para",
      value: "Dia a dia, eventos, encontros, uso casual e ocasiões especiais",
    },
    { label: "Composição", value: "Tecido Dry 3D 100% poliéster" },
    { label: "Gola", value: "Polo V com Retilínea" },
    { label: "Gramatura", value: "130g/m²" },
    {
      label: "Acabamentos",
      value: "Escudos em Alto Relevo Emborrachado 3D, DTF Localizado",
    },
    { label: "Fabricação", value: "Nacional" },
    { label: "Envio", value: "Produto enviado com Nota Fiscal" },
  ],
};
