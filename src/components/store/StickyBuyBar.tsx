import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatBRL } from "@/lib/format";

type Props = {
  price: number;
  visible: boolean;
  onBuy: () => void;
};

export function StickyBuyBar({ price, visible, onBuy }: Props) {
  if (!visible) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-4 py-3 backdrop-blur animate-in slide-in-from-bottom-2 lg:hidden">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Total</p>
          <p className="truncate text-base font-bold text-brand-deep">{formatBRL(price)}</p>
        </div>
        <Button variant="cta" size="lg" className="shrink-0" onClick={onBuy}>
          <ShoppingCart />
          Adicionar
        </Button>
      </div>
    </div>
  );
}
