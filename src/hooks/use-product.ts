import { useMemo, useState } from "react";
import { product as defaultProduct, type Product } from "@/data/product";

export function useProduct(source: Product = defaultProduct) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const sizeExtra = useMemo(
    () => source.sizes.find((s) => s.label === selectedSize)?.extra ?? 0,
    [source.sizes, selectedSize],
  );

  const unitPrice = source.price + sizeExtra;

  return {
    product: source,
    selectedSize,
    setSelectedSize,
    quantity,
    setQuantity,
    increment: () => setQuantity((q) => q + 1),
    decrement: () => setQuantity((q) => Math.max(1, q - 1)),
    sizeExtra,
    unitPrice,
    total: unitPrice * quantity,
  };
}
