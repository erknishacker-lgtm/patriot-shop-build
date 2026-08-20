import img1 from "@/assets/camiseta-1.jpg";
import img2 from "@/assets/camiseta-2.jpg";
import img3 from "@/assets/camiseta-3.jpg";
import img4 from "@/assets/camiseta-4.jpg";
import img5 from "@/assets/camiseta-5.jpg";

export type CollectionProduct = {
  id: string;
  name: string;
  image: string;
  alt: string;
  price: number;
  oldPrice: number | null;
  maxInstallments: number;
  inStock: boolean;
  /** Ordem de mais vendidos (menor = mais vendido) */
  rank: number;
  to?: string;
};

export const bestSellers: CollectionProduct[] = [
  {
    id: "camiseta-clube-bolsonaro",
    name: "Camiseta Clube Bolsonaro — Tecido Dry 3D com Escudo em Alto Relevo",
    image: img1,
    alt: "Camiseta Clube Bolsonaro verde vista de frente",
    price: 239.8,
    oldPrice: 299.8,
    maxInstallments: 12,
    inStock: true,
    rank: 1,
    to: "/",
  },
  {
    id: "camiseta-patriota-costas",
    name: "Camiseta Patriota Brasil 2026 — Estampa nas Costas",
    image: img2,
    alt: "Camiseta patriota vista das costas no cabide",
    price: 199.9,
    oldPrice: 259.9,
    maxInstallments: 12,
    inStock: true,
    rank: 2,
  },
  {
    id: "camiseta-escudo-3d",
    name: "Camiseta Escudo 3D Emborrachado — Linha Premium",
    image: img3,
    alt: "Detalhe do escudo em alto relevo emborrachado 3D",
    price: 219.9,
    oldPrice: 289.9,
    maxInstallments: 12,
    inStock: true,
    rank: 3,
  },
  {
    id: "camiseta-polo-v",
    name: "Camiseta Gola Polo V com Retilínea — Verde Oliva",
    image: img4,
    alt: "Detalhe da gola polo V com retilínea",
    price: 189.9,
    oldPrice: 229.9,
    maxInstallments: 10,
    inStock: true,
    rank: 4,
  },
  {
    id: "camiseta-flat-lay",
    name: "Camiseta Movimento Brasil — Edição Limitada",
    image: img5,
    alt: "Camiseta Clube Bolsonaro em flat lay",
    price: 179.9,
    oldPrice: null,
    maxInstallments: 10,
    inStock: true,
    rank: 5,
  },
  {
    id: "kit-2-camisetas",
    name: "Kit 2 Camisetas Patriotas — Economize no Combo",
    image: img1,
    alt: "Kit com duas camisetas patriotas",
    price: 429.8,
    oldPrice: 559.6,
    maxInstallments: 12,
    inStock: true,
    rank: 6,
  },
  {
    id: "camiseta-infantil",
    name: "Camiseta Infantil Clube Bolsonaro — Tecido Dry Leve",
    image: img3,
    alt: "Camiseta infantil com escudo em alto relevo",
    price: 149.9,
    oldPrice: 199.9,
    maxInstallments: 8,
    inStock: false,
    rank: 7,
  },
  {
    id: "camiseta-feminina",
    name: "Camiseta Feminina Baby Look Patriota — Caimento Ajustado",
    image: img2,
    alt: "Camiseta feminina baby look patriota",
    price: 189.9,
    oldPrice: 239.9,
    maxInstallments: 10,
    inStock: true,
    rank: 8,
  },
];
