import { useState } from "react";
import { Loader2, ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/hooks/use-cart";
import { formatBRL } from "@/lib/format";
import { applyCheckoutParams, buildYampiCheckoutUrl } from "@/lib/yampi";
import { createYampiCheckout } from "@/lib/yampi.functions";
import { QuantitySelector } from "./QuantitySelector";

export function MiniCart() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, count } = useCart();
  const [loading, setLoading] = useState(false);
  const goToYampiCheckout = useServerFn(createYampiCheckout);

  const handleCheckout = async () => {
    if (items.length === 0) return;
    const withLink = items.find((item) => item.checkoutUrl?.trim());
    if (withLink?.checkoutUrl) {
      window.location.href = applyCheckoutParams(
        withLink.checkoutUrl,
        withLink.size,
        withLink.quantity,
      );
      return;
    }
    const payload = items.map((i) => ({ size: i.size, quantity: i.quantity }));
    setLoading(true);
    try {
      const result = await goToYampiCheckout({ data: { items: payload } });
      window.location.href = result.url;
    } catch {
      toast.error("Não foi possível abrir o checkout. Redirecionando...");
      window.location.href = buildYampiCheckoutUrl(payload);
    } finally {
      setLoading(false);
    }
  };


  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent side="right" className="flex w-[90vw] max-w-md flex-col gap-0 p-0 sm:w-full">
        <div className="border-b border-border px-5 py-4">
          <SheetTitle className="flex items-center gap-2 font-display text-brand-deep">
            <ShoppingBag className="size-5" aria-hidden="true" />
            Seu carrinho
            <span className="text-sm font-normal text-muted-foreground">({count})</span>
          </SheetTitle>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <ShoppingBag className="size-10 text-muted-foreground/50" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">Seu carrinho está vazio.</p>
            <Button variant="soft" onClick={closeCart}>
              Continuar comprando
            </Button>
          </div>
        ) : (
          <>
            <ul className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
              {items.map((item) => (
                <li key={item.key} className="flex gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    width={96}
                    height={96}
                    className="size-20 shrink-0 rounded-xl border border-border object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Tamanho {item.size} • {formatBRL(item.unitPrice)}
                    </p>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <QuantitySelector
                        size="sm"
                        value={item.quantity}
                        onChange={(q) => updateQuantity(item.key, q)}
                      />
                      <button
                        type="button"
                        onClick={() => removeItem(item.key)}
                        aria-label={`Remover ${item.name} do carrinho`}
                        className="grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                    <p className="mt-1 text-right text-sm font-bold text-brand-deep">
                      {formatBRL(item.unitPrice * item.quantity)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-border px-5 py-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="text-xl font-extrabold text-brand-deep">
                  {formatBRL(subtotal)}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Frete calculado na finalização da compra.
              </p>
              <Separator className="my-4" />
              <div className="flex flex-col gap-2">
                <Button
                  variant="brand"
                  size="lg"
                  disabled={loading}
                  onClick={() => void handleCheckout()}
                >
                  {loading && <Loader2 className="animate-spin" />}
                  {loading ? "Abrindo checkout..." : "Finalizar compra"}
                </Button>
                <Button variant="ghost" onClick={closeCart}>
                  Continuar comprando
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
