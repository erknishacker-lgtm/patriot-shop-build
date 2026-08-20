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
  /** Desconto aplicado no pagamento via PIX (0.03 = 3%) */
  pixDiscount: number;
  /** Máximo de parcelas sem juros no cartão */
  maxInstallments: number;
  images: { src: string; alt: string }[];
  sizes: ProductSize[];
  description: string[];
  specifications: ProductSpec[];
  highlights: { title: string; text: string }[];
  faq: { question: string; answer: string }[];
  sizeChart: { size: string; chest: string; length: string; shoulder: string }[];
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
  oldPrice: 299.8,
  pixDiscount: 0.03,
  maxInstallments: 12,
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
    { label: "Nota Fiscal", value: "Sim, todo pedido é enviado com Nota Fiscal" },
  ],
  highlights: [
    {
      title: "Tecido Dry 3D",
      text: "Confortável, leve e adequado para o uso no dia a dia.",
    },
    {
      title: "Alto Relevo 3D",
      text: "Detalhes emborrachados que valorizam o acabamento da peça.",
    },
    {
      title: "Identidade Marcante",
      text: "Design desenvolvido para quem deseja vestir sua identidade e seus valores.",
    },
    {
      title: "Fabricação Nacional",
      text: "Produto fabricado no Brasil com controle de qualidade.",
    },
  ],
  faq: [
    { question: "Quais tamanhos estão disponíveis?", answer: "P, M, G, GG, G1 e G2." },
    {
      question: "Como escolher o tamanho?",
      answer:
        'Clique em "Consulte nossa tabela de medidas" antes de adicionar o produto ao carrinho e confira largura, comprimento e ombro de cada tamanho.',
    },
    {
      question: "O produto possui Nota Fiscal?",
      answer: "Sim. O pedido é enviado com Nota Fiscal.",
    },
    {
      question: "Qual o prazo de envio?",
      answer:
        "O prazo varia conforme o CEP e a modalidade escolhida. Simule no calculador de frete desta página.",
    },
    { question: "Vocês enviam para todo o Brasil?", answer: "Sim, enviamos para todo o Brasil." },
    {
      question: "Quais formas de pagamento estão disponíveis?",
      answer: "Pix, cartão de crédito em até 12x e boleto bancário.",
    },
    {
      question: "Posso trocar o tamanho?",
      answer:
        "Sim. A troca por tamanho pode ser solicitada em até 7 dias corridos após o recebimento, com a peça sem uso e com etiqueta. Basta falar com o nosso atendimento para receber as instruções de envio.",
    },
  ],
  sizeChart: [
    { size: "P", chest: "50 cm", length: "70 cm", shoulder: "42 cm" },
    { size: "M", chest: "52 cm", length: "72 cm", shoulder: "44 cm" },
    { size: "G", chest: "54 cm", length: "74 cm", shoulder: "46 cm" },
    { size: "GG", chest: "56 cm", length: "76 cm", shoulder: "48 cm" },
    { size: "G1", chest: "60 cm", length: "78 cm", shoulder: "50 cm" },
    { size: "G2", chest: "64 cm", length: "80 cm", shoulder: "52 cm" },
  ],
};
