import { useState } from "react";
import { toast } from "sonner";
import { useCart, type CartItem } from "@/hooks/use-cart";
import { buildYampiCheckoutFromItems } from "@/lib/yampi";

export function paymentUrlForItem(item: CartItem) {
  const built = buildYampiCheckoutFromItems([item]);
  return "url" in built ? built.url : "";
}

export function useCartCheckout() {
  const { items } = useCart();
  const [loading, setLoading] = useState(false);

  const checkout = async (only?: CartItem) => {
    const bag = only ? [only] : items;
    if (bag.length === 0) return;

    const built = buildYampiCheckoutFromItems(bag);
    if ("error" in built) {
      toast.error(built.error);
      return;
    }

    setLoading(true);
    window.location.href = built.url;
  };

  return { checkout, loading };
}
