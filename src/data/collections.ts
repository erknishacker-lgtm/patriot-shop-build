import img1 from "@/assets/mitinho-4.png.asset.json";

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
    name: "Camiseta Clube Bolsonaro - #Mitinho",
    image: img1.url,
    alt: "Camiseta amarela Clube Bolsonaro #Mitinho",
    price: 89.9,
    oldPrice: 119.9,
    maxInstallments: 12,
    inStock: true,
    rank: 1,
    to: "/",
  },
];
