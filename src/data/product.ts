import img1 from "@/assets/mitinho-4.png.asset.json";
import img2 from "@/assets/mitinho-5.png.asset.json";
import img3 from "@/assets/mitinho-6.png.asset.json";
import img4 from "@/assets/mitinho-7.png.asset.json";

export type ProductSize = {
  /** Rótulo exibido no seletor */
  label: string;
  /** Valor adicional em reais somado ao preço base */
  extra: number;
  /** Disponibilidade da grade */
  available: boolean;
  /** Link de checkout deste tamanho */
  checkoutUrl: string;
};

export type ProductSpec = {
  label: string;
  value: string;
};

export type ProductReview = {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  verified: boolean;
  photos: { src: string; alt: string }[];
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
  reviews: ProductReview[];
  /** Link do botão de compra / checkout deste produto */
  checkoutUrl: string;
};

/**
 * Todos os dados do produto ficam concentrados aqui.
 * Para transformar em catálogo, basta exportar uma lista destes objetos.
 */
export const product: Product = {
  id: "camiseta-clube-bolsonaro",
  slug: "camiseta-clube-bolsonaro",
  name: "Camiseta Clube Bolsonaro - #Mitinho",
  category: "Vestuário",
  categorySlug: "vestuario",
  badge: "DESTAQUE",
  sku: "CB-CAM-0001",
  brand: "Clube Bolsonaro",
  stock: 42,
  price: 89.9,
  oldPrice: 119.9,
  pixDiscount: 0.03,
  maxInstallments: 12,
  images: [
    { src: img1.url, alt: "Camiseta amarela Clube Bolsonaro #Mitinho vista de frente" },
    { src: img2.url, alt: "Modelo vestindo a camiseta amarela #Mitinho" },
    { src: img3.url, alt: "Modelo de costas com a camiseta amarela lisa" },
    { src: img4.url, alt: "Camiseta amarela #Mitinho em flat lay pelas costas" },
  ],
  sizes: [
    { label: "P", extra: 0, available: true, checkoutUrl: "" },
    { label: "M", extra: 0, available: true, checkoutUrl: "" },
    { label: "G", extra: 0, available: true, checkoutUrl: "" },
    { label: "GG", extra: 0, available: true, checkoutUrl: "" },
    { label: "G1", extra: 9.15, available: true, checkoutUrl: "" },
    { label: "G2", extra: 19.15, available: true, checkoutUrl: "" },
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
    { size: "P", chest: "46 cm", length: "66 cm", shoulder: "38 cm" },
    { size: "M", chest: "49 cm", length: "69 cm", shoulder: "40 cm" },
    { size: "G", chest: "52 cm", length: "72 cm", shoulder: "42 cm" },
    { size: "GG", chest: "55 cm", length: "75 cm", shoulder: "44 cm" },
    { size: "G1", chest: "58 cm", length: "77 cm", shoulder: "46 cm" },
    { size: "G2", chest: "61 cm", length: "79 cm", shoulder: "48 cm" },
  ],
  checkoutUrl: "",
  reviews: [
    {
      id: "r1",
      author: "Carlos M.",
      rating: 5,
      date: "2026-07-12",
      title: "Qualidade excelente",
      content:
        "A camiseta superou minhas expectativas. Tecido leve, costura reforçada e o escudo em alto relevo dá um acabamento premium.",
      verified: true,
      photos: [],
    },
    {
      id: "r2",
      author: "Fernanda R.",
      rating: 5,
      date: "2026-07-08",
      title: "Entrega rápida e produto perfeito",
      content:
        "Chegou antes do prazo, com Nota Fiscal e embalagem protegida. O tamanho G1 serviu direitinho conforme a tabela.",
      verified: true,
      photos: [],
    },
    {
      id: "r3",
      author: "João P.",
      rating: 4,
      date: "2026-06-28",
      title: "Muito boa",
      content:
        "Gostei bastante da estampa e do tecido. Só achei que a gola podia ser um pouco mais reforçada, mas no geral recomendo.",
      verified: true,
      photos: [],
    },
    {
      id: "r4",
      author: "Ana L.",
      rating: 5,
      date: "2026-06-15",
      title: "Presente certeiro",
      content:
        "Comprei para presentear e a pessoa adorou. Identidade visual forte e cores vibrantes. Vou comprar mais.",
      verified: false,
      photos: [],
    },
    {
      id: "r5",
      author: "Marcos T.",
      rating: 5,
      date: "2026-05-30",
      title: "Top demais",
      content:
        "Já é a terceira que compro. Caimento ótimo, não desbota na lavagem e o atendimento é nota 10.",
      verified: true,
      photos: [],
    },
  ],
};
