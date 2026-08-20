import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  checkoutUrl: string;
};

export function YampiCartSheet({ open, onOpenChange, checkoutUrl }: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 p-0 sm:max-w-md"
      >
        <SheetHeader className="border-b border-border px-4 py-3">
          <SheetTitle className="text-sm font-bold uppercase tracking-wider text-brand-deep">
            Seu carrinho
          </SheetTitle>
        </SheetHeader>
        {open && (
          <iframe
            src={checkoutUrl}
            title="Carrinho e checkout seguro"
            className="h-full w-full flex-1 border-0"
            allow="payment"
          />
        )}
      </SheetContent>
    </Sheet>
  );
}
