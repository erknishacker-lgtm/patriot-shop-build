import { useEffect, useState } from "react";
import {
  Check,
  Heart,
  RotateCcw,
  ShieldCheck,
  ShoppingCart,
  Truck,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

import { useCart } from "@/hooks/use-cart";
import { useProduct } from "@/hooks/use-product";
import { applyCheckoutParams } from "@/lib/yampi";
import { cn } from "@/lib/utils";
import { PriceBlock } from "./PriceBlock";
import { ProductRating } from "./ProductRating";
import { QuantitySelector } from "./QuantitySelector";
import { ShareMenu } from "./ShareMenu";
import { ShippingCalculator } from "./ShippingCalculator";
import { SizeChartDialog } from "./SizeChartDialog";
import { SizeSelector } from "./SizeSelector";


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
  const [added, setAdded] = useState(false);
  const { addItem, openCart } = useCart();

  useEffect(() => {
    if (!added) return;
    const timer = setTimeout(() => setAdded(false), 1800);
    return () => clearTimeout(timer);
  }, [added]);

  const sizeCheckout =
    product.sizes.find((size) => size.label === selectedSize)?.checkoutUrl?.trim() ?? "";
  const checkoutUrl = sizeCheckout || product.checkoutUrl?.trim() || "";
  const hasSizeCheckouts = product.sizes.some((size) => size.checkoutUrl?.trim());

  const handleAddToCart = () => {
    if (!selectedSize) {
      setShowSizeError(true);
      document.getElementById("size-selector")?.scrollIntoView({ behavior: "smooth", block: "center" });
      toast.error("Escolha um tamanho antes de continuar.");
      return;
    }
    if (checkoutUrl) {
      window.location.href = applyCheckoutParams(checkoutUrl, selectedSize, quantity);
      return;
    }
    if (hasSizeCheckouts) {
      toast.error("Este tamanho ainda não tem link de compra.");
      return;
    }
    addItem({
      productId: product.sku,
      name: product.name,
      image: product.images[0]?.src ?? "",
      size: selectedSize,
      unitPrice,
      quantity,
      ...(checkoutUrl ? { checkoutUrl } : {}),
    });
    setAdded(true);
    toast.success("Produto adicionado ao carrinho", {
      description: `${product.name} • Tamanho ${selectedSize} • ${quantity}x`,
    });
    openCart();
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

      <div id="size-selector">
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
        onClick={handleAddToCart}
      >
        {added ? <Check className="animate-in zoom-in" /> : <ShoppingCart />}
        {added
          ? "ADICIONADO"
          : hasSizeCheckouts || checkoutUrl
            ? "COMPRAR AGORA"
            : "ADICIONAR AO CARRINHO"}


      </Button>





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
