import { useEffect, useState } from "react";
import {
  Banknote,
  Check,
  CreditCard,
  FileText,
  Heart,
  Loader2,
  Lock,
  QrCode,
  ShieldCheck,
  ShoppingCart,
  Truck,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import { useProduct } from "@/hooks/use-product";
import { formatBRL } from "@/lib/format";
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
  const { addItem, openCart } = useCart();
  const [showSizeError, setShowSizeError] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const timer = setTimeout(() => setAdded(false), 1800);
    return () => clearTimeout(timer);
  }, [added]);

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
    setAdded(true);
    toast.success("Produto adicionado ao carrinho!", {
      description: `${product.name} • Tamanho ${selectedSize} • ${quantity}x`,
    });
    openCart();
  };

  const oldUnitPrice = product.oldPrice ? product.oldPrice + sizeExtra : null;

  return (
    <div className="flex flex-col gap-6">
      <div>
        {product.badge && (
          <span className="inline-flex items-center rounded-md bg-gold px-2.5 py-1 text-[11px] font-bold tracking-[0.14em] text-gold-foreground">
            {product.badge}
          </span>
        )}
        <h1 className="mt-3 font-display text-2xl font-extrabold leading-tight text-brand-deep sm:text-3xl lg:text-[2.25rem]">
          {product.name}
        </h1>
        <ProductRating
          rating={
            product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
          }
          reviewCount={product.reviews.length}
          className="mt-3"
        />
        <p className="mt-2 text-sm text-muted-foreground">
          {product.category} • SKU {product.sku}
        </p>
      </div>

      <div>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-foreground">
            Escolha seu tamanho
          </h2>
          <SizeChartDialog rows={product.sizeChart} />
        </div>
        <div className="mt-2">
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

      <PriceBlock
        price={unitPrice}
        oldPrice={oldUnitPrice}
        pixDiscount={product.pixDiscount}
        maxInstallments={product.maxInstallments}
        action={
          <Button
            id="cta-add-cart"
            variant="brand"
            size="xl"
            className={cn("w-full text-base tracking-wide", added && "scale-[1.01]")}
            onClick={() => void handleAddToCart()}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : added ? (
              <Check className="animate-in zoom-in" />
            ) : (
              <ShoppingCart />
            )}
            {loading ? "ADICIONANDO..." : added ? "ADICIONADO!" : "ADICIONAR AO CARRINHO"}
          </Button>
        }
      />

      <div className="rounded-xl border border-border bg-card p-4">
        <p className="flex items-center gap-2 text-sm font-semibold text-brand-deep">
          <Truck className="size-4 text-brand" aria-hidden="true" />
          Envio para todo o Brasil
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Despacho rápido após confirmação do pagamento.
        </p>
        <ul className="mt-3 grid gap-1.5 text-xs text-muted-foreground sm:grid-cols-2">
          {[
            { Icon: ShieldCheck, label: "Compra segura" },
            { Icon: FileText, label: "Produto com Nota Fiscal" },
            { Icon: Truck, label: "Envio para todo o Brasil" },
          ].map(({ Icon, label }) => (
            <li key={label} className="flex items-center gap-2">
              <Icon className="size-3.5 shrink-0 text-brand" aria-hidden="true" />
              {label}
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-[auto_minmax(0,1fr)] items-end gap-4">
        <div>
          <p className="mb-2 text-sm font-semibold text-foreground">Quantidade</p>
          <QuantitySelector value={quantity} onChange={setQuantity} />
        </div>
        <div className="min-w-0 text-right">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Total</p>
          <p className="truncate text-xl font-bold text-brand-deep">{formatBRL(total)}</p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-surface p-4">
        <p className="flex items-center gap-2 text-sm font-semibold text-brand-deep">
          <Lock className="size-4 text-brand" aria-hidden="true" />
          Compra segura e protegida
        </p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          Seus dados são tratados com segurança durante todo o processo de compra.
        </p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {[
            { Icon: CreditCard, label: "Cartão" },
            { Icon: QrCode, label: "Pix" },
            { Icon: Banknote, label: "Boleto" },
          ].map(({ Icon, label }) => (
            <li
              key={label}
              className="flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-[11px] font-semibold text-muted-foreground"
            >
              <Icon className="size-3.5" aria-hidden="true" />
              {label}
            </li>
          ))}
        </ul>
      </div>

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
