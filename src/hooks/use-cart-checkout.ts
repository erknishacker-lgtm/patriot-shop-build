import { useState } from "react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { useCart, type CartItem } from "@/hooks/use-cart";
import { applyCheckoutParams, buildYampiCheckoutUrl } from "@/lib/yampi";
import { createYampiCheckout } from "@/lib/yampi.functions";

export function paymentUrlForItem(item: CartItem) {
  const link = item.checkoutUrl?.trim();
  if (!link) return "";
  return applyCheckoutParams(link, item.size, item.quantity);
}

export function useCartCheckout() {
  const { items } = useCart();
  const [loading, setLoading] = useState(false);
  const goToYampiCheckout = useServerFn(createYampiCheckout);

  const checkout = async (only?: CartItem) => {
    const bag = only ? [only] : items;
    if (bag.length === 0) return;

    if (bag.length === 1) {
      const direct = paymentUrlForItem(bag[0]!);
      if (direct) {
        window.location.href = direct;
        return;
      }
    }

    const payload = bag.map((item) => ({ size: item.size, quantity: item.quantity }));
    setLoading(true);
    try {
      const result = await goToYampiCheckout({ data: { items: payload } });
      window.location.href = result.url;
    } catch {
      const direct = bag.map(paymentUrlForItem).find(Boolean);
      if (direct) {
        window.location.href = direct;
        return;
      }
      toast.error("Não foi possível abrir o pagamento. Tentando de outro jeito…");
      window.location.href = buildYampiCheckoutUrl(payload);
    } finally {
      setLoading(false);
    }
  };

  return { checkout, loading };
}
