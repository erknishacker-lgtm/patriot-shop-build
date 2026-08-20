import img1 from "@/assets/camiseta-1.jpg";
import img2 from "@/assets/camiseta-2.jpg";
import img3 from "@/assets/camiseta-3.jpg";
import img4 from "@/assets/camiseta-4.jpg";
import img5 from "@/assets/camiseta-5.jpg";

export type CollectionItem = {
  id: string;
  name: string;
  image: string;
  alt: string;
  price: number;
  oldPrice: number | null;
  badge?: string;
  rating: number;
  reviews: number;
};

/** Coleção "Mais vendidas" exibida na página de produto. */
export const bestSellers: CollectionItem[] = [
  {
    id: "camiseta-clube-bolsonaro",
    name: "Camiseta Clube Bolsonaro",
    image: img1,
    alt: "Camiseta Clube Bolsonaro verde vista de frente",
    price: 239.8,
    oldPrice: 299.8,
    badge: "MAIS VENDIDA",
    rating: 4.8,
    reviews: 5,
  },
  {
    id: "camiseta-patriota-costas",
    name: "Camiseta Patriota Escudo 3D",
    image: img2,
    alt: "Camiseta patriota vista das costas no cabide",
    price: 219.8,
    oldPrice: 279.8,
    badge: "-21%",
    rating: 4.9,
    reviews: 12,
  },
  {
    id: "camiseta-brasil-alto-relevo",
    name: "Camiseta Brasil Alto Relevo",
    image: img3,
    alt: "Detalhe do escudo em alto relevo emborrachado 3D",
    price: 229.8,
    oldPrice: 289.8,
    rating: 4.7,
    reviews: 8,
  },
  {
    id: "camiseta-polo-retilinea",
    name: "Camiseta Polo Gola V Retilínea",
    image: img4,
    alt: "Detalhe da gola polo V com retilínea",
    price: 249.8,
    oldPrice: null,
    badge: "NOVO",
    rating: 4.8,
    reviews: 4,
  },
  {
    id: "camiseta-dry-3d",
    name: "Camiseta Dry 3D Movimento",
    image: img5,
    alt: "Camiseta Clube Bolsonaro em flat lay",
    price: 209.8,
    oldPrice: 259.8,
    rating: 4.6,
    reviews: 9,
  },
];
