import { useState } from "react";
import { Heart, Loader2, ShieldCheck, ShoppingCart, Truck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import { useProduct } from "@/hooks/use-product";
import { formatBRL } from "@/lib/format";
import { cn } from "@/lib/utils";
import { QuantitySelector } from "./QuantitySelector";
import { ShareMenu } from "./ShareMenu";
import { ShippingCalculator } from "./ShippingCalculator";
import { SizeSelector } from "./SizeSelector";

export function ProductInfo() {
  const {
    product,
    selectedSize,
    setSelectedSize,
    quantity,
    setQuantity,
    unitPrice,
    total,
    sizeExtra,
  } = useProduct();
  const { addItem, openCart } = useCart();
  const [showSizeError, setShowSizeError] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    if (!selectedSize) {
      setShowSizeError(true);
      toast.error("Escolha um tamanho antes de adicionar ao carrinho.");
      return;
    }
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 550));
    addItem({
      productId: product.id,
      name: product.name,
      image: product.images[0]!.src,
      size: selectedSize,
      unitPrice,
      quantity,
    });
    setLoading(false);
    toast.success("Produto adicionado ao carrinho!", {
      description: `${product.name} • Tamanho ${selectedSize} • ${quantity}x`,
    });
    openCart();
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        {product.badge && (
          <span className="inline-flex items-center rounded-full bg-gradient-to-br from-gold to-gold-strong px-3 py-1 text-[11px] font-bold tracking-[0.12em] text-gold-foreground">
            {product.badge}
          </span>
        )}
        <h1 className="mt-3 text-2xl font-bold text-brand-deep sm:text-3xl lg:text-4xl">
          {product.name}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {product.category} • SKU {product.sku}
        </p>
      </div>

      <div>
        <div className="flex flex-wrap items-end gap-3">
          {product.oldPrice && (
            <span className="text-lg text-muted-foreground line-through">
              {formatBRL(product.oldPrice)}
            </span>
          )}
          <span className="text-3xl font-extrabold text-brand-deep sm:text-4xl">
            {formatBRL(unitPrice)}
          </span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          ou até 6x de {formatBRL(unitPrice / 6)} sem juros
          {sizeExtra > 0 && ` • inclui adicional de ${formatBRL(sizeExtra)}`}
        </p>
      </div>

      <Separator />

      <SizeSelector
        sizes={product.sizes}
        selected={selectedSize}
        error={showSizeError}
        onSelect={(size) => {
          setSelectedSize(size);
          setShowSizeError(false);
        }}
      />

      <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4">
        <QuantitySelector value={quantity} onChange={setQuantity} />
        <div className="min-w-0 text-right">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Total</p>
          <p className="truncate text-xl font-bold text-brand-deep">{formatBRL(total)}</p>
        </div>
      </div>

      <Button
        variant="cta"
        size="xl"
        className="w-full"
        onClick={() => void handleAddToCart()}
        disabled={loading}
      >
        {loading ? <Loader2 className="animate-spin" /> : <ShoppingCart />}
        {loading ? "Adicionando..." : "Adicionar ao Carrinho"}
      </Button>

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

      <ul className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
        <li className="flex items-center gap-2">
          <ShieldCheck className="size-4 text-brand" aria-hidden="true" /> Compra 100% segura
        </li>
        <li className="flex items-center gap-2">
          <Truck className="size-4 text-brand" aria-hidden="true" /> Enviamos para todo o Brasil
        </li>
      </ul>

      <ShippingCalculator />
    </div>
  );
}
