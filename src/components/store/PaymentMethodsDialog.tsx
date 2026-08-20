import { Banknote, CreditCard, QrCode } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatBRL } from "@/lib/format";

type Props = {
  total: number;
  maxInstallments: number;
  pixPrice: number;
};

export function PaymentMethodsDialog({ total, maxInstallments, pixPrice }: Props) {
  const rows = Array.from({ length: maxInstallments }, (_, i) => i + 1);

  return (
    <Dialog>
      <DialogTrigger className="text-sm font-semibold text-brand underline underline-offset-4 transition-colors hover:text-brand-deep">
        Ver formas de pagamento
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-brand-deep">Formas de pagamento</DialogTitle>
          <DialogDescription>
            Escolha como prefere pagar. Valores calculados sobre {formatBRL(total)}.
          </DialogDescription>
        </DialogHeader>

        <ul className="grid gap-2 sm:grid-cols-3">
          {[
            { Icon: CreditCard, label: "Cartão de crédito", note: `até ${maxInstallments}x` },
            { Icon: QrCode, label: "Pix", note: "3% OFF" },
            { Icon: Banknote, label: "Boleto", note: "à vista" },
          ].map(({ Icon, label, note }) => (
            <li
              key={label}
              className="rounded-lg border border-border bg-surface px-3 py-3 text-center"
            >
              <Icon className="mx-auto size-5 text-brand" aria-hidden="true" />
              <p className="mt-2 text-xs font-semibold text-foreground">{label}</p>
              <p className="text-[11px] text-muted-foreground">{note}</p>
            </li>
          ))}
        </ul>

        <div className="rounded-lg border border-border">
          <p className="border-b border-border px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Parcelamento no cartão
          </p>
          <ul className="divide-y divide-border">
            {rows.map((n) => (
              <li key={n} className="flex items-center justify-between px-4 py-2 text-sm">
                <span className="font-medium">
                  {n}x de {formatBRL(total / n)}
                </span>
                <span className="text-muted-foreground">sem juros</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-muted-foreground">
          No Pix o valor à vista fica {formatBRL(pixPrice)}. Boleto compensa em até 2 dias úteis.
        </p>
      </DialogContent>
    </Dialog>
  );
}
