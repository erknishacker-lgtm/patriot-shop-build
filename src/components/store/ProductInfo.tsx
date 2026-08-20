import { useEffect, useState } from "react";
import {
  Check,
  Heart,
  Loader2 as Spinner,
  RotateCcw,
  ShieldCheck,
  ShoppingCart,
  Truck,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

import { useProduct } from "@/hooks/use-product";
import { cn } from "@/lib/utils";
import { buildYampiCheckoutUrl } from "@/lib/yampi";
import { PriceBlock } from "./PriceBlock";
import { ProductRating } from "./ProductRating";
import { QuantitySelector } from "./QuantitySelector";
import { ShareMenu } from "./ShareMenu";
import { ShippingCalculator } from "./ShippingCalculator";
import { SizeChartDialog } from "./SizeChartDialog";
import { SizeSelector } from "./SizeSelector";
import { YampiCartSheet } from "./YampiCartSheet";


type Props = ReturnType<typeof useProduct>;

export function ProductInfo(props: Props) {
  const {
    product,
    selectedSize,
    setSelectedSize,
    quantity,
    setQuantity,
    unitPrice,
    total,
    sizeExtra,
  } = props;
  const [showSizeError, setShowSizeError] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const goToYampiCheckout = useServerFn(createYampiCheckout);

  useEffect(() => {
    if (!added) return;
    const timer = setTimeout(() => setAdded(false), 1800);
    return () => clearTimeout(timer);
  }, [added]);

  const handleBuyNow = async () => {
    if (!selectedSize) {
      setShowSizeError(true);
      toast.error("Escolha um tamanho antes de continuar.");
      return;
    }
    setLoading(true);
    try {
      const result = await goToYampiCheckout({
        data: { quantity, size: selectedSize },
      });
      setAdded(true);
      toast.success("Redirecionando para o checkout seguro...", {
        description: `${product.name} • Tamanho ${selectedSize} • ${quantity}x`,
      });
      window.location.href = result.url;
    } catch {
      toast.error("Não foi possível abrir o checkout. Tente novamente.");
      window.location.href = buildYampiCheckoutUrl({ quantity, size: selectedSize });
    } finally {
      setLoading(false);
    }
  };



  const oldUnitPrice = product.oldPrice ? product.oldPrice + sizeExtra : null;

  return (
    <div className="flex flex-col gap-4">
      <div>
        {product.badge && (
          <span className="inline-flex items-center rounded-md bg-gold px-2 py-0.5 text-[10px] font-bold tracking-[0.14em] text-gold-foreground">
            {product.badge}
          </span>
        )}
        <h1 className="mt-2 font-display text-xl font-extrabold leading-snug text-brand-deep sm:text-2xl">
          {product.name}
        </h1>
        <ProductRating
          rating={
            product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
          }
          reviewCount={product.reviews.length}
          className="mt-1.5"
        />
      </div>

      <PriceBlock
        price={unitPrice}
        oldPrice={oldUnitPrice}
        pixDiscount={product.pixDiscount}
        maxInstallments={product.maxInstallments}
        quantitySelector={
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-foreground">
              Quantidade
            </span>
            <QuantitySelector value={quantity} onChange={setQuantity} />
          </div>
        }
      />

      <div>
        <div className="flex items-baseline gap-2">
          <h2 className="text-[11px] font-semibold uppercase tracking-wider text-foreground">
            Tamanho
          </h2>
          <SizeChartDialog rows={product.sizeChart} />
        </div>
        <div className="mt-1.5">
          <SizeSelector
            sizes={product.sizes}
            selected={selectedSize}
            error={showSizeError}
            onSelect={(size) => {
              setSelectedSize(size);
              setShowSizeError(false);
            }}
          />
        </div>
      </div>

      <Button
        id="cta-add-cart"
        variant="brand"
        size="xl"
        className={cn("w-full text-base tracking-wide", added && "scale-[1.01]")}
        onClick={() => void handleBuyNow()}
        disabled={loading}
      >
        {loading ? (
          <Spinner className="animate-spin" />
        ) : added ? (
          <Check className="animate-in zoom-in" />
        ) : (
          <ShoppingCart />
        )}
        {loading ? "PROCESSANDO..." : added ? "NO CARRINHO" : "COMPRAR AGORA"}

      </Button>

      <YampiCartSheet open={cartOpen} onOpenChange={setCartOpen} checkoutUrl={cartUrl} />




      <ul className="grid gap-0.5 overflow-hidden rounded-lg border border-border bg-card p-1 sm:grid-cols-3">
        {[
          {
            Icon: ShieldCheck,
            title: "Pagamento seguro",
            text: "Dados protegidos",
          },
          {
            Icon: Truck,
            title: "Envio nacional",
            text: "Com rastreio",
          },
          {
            Icon: RotateCcw,
            title: "Devolução fácil",
            text: "7 dias úteis",
          },
        ].map(({ Icon, title, text }) => (
          <li key={title} className="flex items-center gap-1 rounded-md px-1.5 py-1">
            <Icon className="size-3 shrink-0 text-brand" aria-hidden="true" />
            <div className="min-w-0">
              <p className="text-[10px] font-semibold leading-none text-brand-deep">{title}</p>
              <p className="text-[10px] leading-none text-muted-foreground">{text}</p>
            </div>
          </li>
        ))}
      </ul>

      <ShippingCalculator compact />

      <div className="flex gap-3">
        <Button
          variant="outline"
          size="lg"
          className="flex-1 gap-2"
          aria-pressed={favorite}
          onClick={() => {
            setFavorite((v) => !v);
            toast(favorite ? "Removido dos favoritos" : "Adicionado aos favoritos");
          }}
        >
          <Heart
            className={cn(
              "size-4 transition-transform duration-300",
              favorite && "scale-125 fill-destructive text-destructive",
            )}
          />
          {favorite ? "Favoritado" : "Favoritar"}
        </Button>
        <ShareMenu title={product.name} />
      </div>
    </div>
  );
}
