import type { ReactNode } from "react";
import { QrCode, Zap } from "lucide-react";
import { formatBRL } from "@/lib/format";
import { PaymentMethodsDialog } from "./PaymentMethodsDialog";

type Props = {
  price: number;
  oldPrice: number | null;
  pixDiscount: number;
  maxInstallments: number;
  action?: ReactNode;
  quantitySelector?: ReactNode;
};

export function PriceBlock({ price, oldPrice, pixDiscount, maxInstallments, action, quantitySelector }: Props) {
  const discount = oldPrice ? Math.round((1 - price / oldPrice) * 100) : 0;
  const pixPrice = price * (1 - pixDiscount);
  const installment = price / maxInstallments;

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <p className="font-display text-2xl font-extrabold tracking-tight text-brand-deep sm:text-3xl">
          {formatBRL(price)}
        </p>
        {oldPrice && (
          <span className="text-sm text-muted-foreground line-through">
            {formatBRL(oldPrice)}
          </span>
        )}
        {discount > 0 && (
          <span className="rounded-md bg-brand px-2 py-0.5 text-xs font-bold text-brand-foreground">
            - {discount}%
          </span>
        )}
      </div>

      <p className="text-sm text-muted-foreground">
        em até <span className="font-semibold text-foreground">{maxInstallments}x</span> de{" "}
        <span className="font-semibold text-foreground">{formatBRL(installment)}</span>
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <PaymentMethodsDialog
          total={price}
          maxInstallments={maxInstallments}
          pixPrice={pixPrice}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-brand/20 bg-brand-soft/60 px-2.5 py-1.5">
        <QrCode className="size-4 shrink-0 text-brand" aria-hidden="true" />
        <p className="text-xs font-semibold text-brand-deep">
          {Math.round(pixDiscount * 100)}% OFF no pix
          <span className="ml-1 font-bold">{formatBRL(pixPrice)}</span>
        </p>
        <span className="inline-flex items-center gap-1 rounded-md bg-brand px-2 py-0.5 text-[11px] font-bold text-brand-foreground">
          <Zap className="size-3" aria-hidden="true" />
          Envio Prioritário
        </span>
      </div>

      {action && <div className="pt-1">{action}</div>}
    </div>
  );
}
