import type { ReactNode } from "react";
import { Info, QrCode } from "lucide-react";
import { formatBRL } from "@/lib/format";
import { PaymentMethodsDialog } from "./PaymentMethodsDialog";

type Props = {
  price: number;
  oldPrice: number | null;
  pixDiscount: number;
  maxInstallments: number;
  action?: ReactNode;
};

export function PriceBlock({ price, oldPrice, pixDiscount, maxInstallments }: Props) {
  const discount = oldPrice ? Math.round((1 - price / oldPrice) * 100) : 0;
  const pixPrice = price * (1 - pixDiscount);
  const installment = price / maxInstallments;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          {oldPrice && (
            <span className="text-base text-muted-foreground line-through">
              {formatBRL(oldPrice)}
            </span>
          )}
          {discount > 0 && (
            <span className="rounded-md bg-gold px-2 py-0.5 text-xs font-bold text-gold-foreground">
              {discount}% OFF
            </span>
          )}
        </div>
        <p className="mt-1 font-display text-3xl font-extrabold tracking-tight text-brand-deep sm:text-4xl">
          {formatBRL(price)}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
          <p className="text-sm text-muted-foreground">
            Em até {maxInstallments}x de {formatBRL(installment)} no cartão
          </p>
          <PaymentMethodsDialog
            total={price}
            maxInstallments={maxInstallments}
            pixPrice={pixPrice}
          />
        </div>
      </div>

      <div className="rounded-xl border border-brand/20 bg-brand-soft/60 p-4">
        <div className="flex items-start gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-brand-deep">
            <QrCode className="size-4 text-gold" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-bold text-brand-deep">
              {formatBRL(pixPrice)}{" "}
              <span className="font-semibold text-brand">
                no PIX ({Math.round(pixDiscount * 100)}% OFF)
              </span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Pague à vista no PIX e garanta {Math.round(pixDiscount * 100)}% de desconto.
            </p>
            <p className="mt-2 flex items-start gap-1.5 text-[11px] text-muted-foreground">
              <Info className="mt-px size-3 shrink-0" aria-hidden="true" />
              Pagamento via PIX confirmado após a conclusão da compra.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
