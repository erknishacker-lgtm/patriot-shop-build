import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Product } from "@/data/product";

export function SizeChartDialog({ rows }: { rows: Product["sizeChart"] }) {
  return (
    <Dialog>
      <DialogTrigger className="text-xs font-semibold text-brand underline underline-offset-4 transition-colors hover:text-brand-deep">
        Consulte nossa tabela de medidas
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-brand-deep">Tabela de medidas</DialogTitle>
          <DialogDescription>
            Medidas aproximadas da peça deitada. Pode haver variação de até 2 cm.
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-surface text-left text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-semibold">Tam.</th>
                <th className="px-3 py-2 font-semibold">Largura</th>
                <th className="px-3 py-2 font-semibold">Compr.</th>
                <th className="px-3 py-2 font-semibold">Ombro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((row) => (
                <tr key={row.size}>
                  <td className="px-3 py-2 font-semibold text-brand-deep">{row.size}</td>
                  <td className="px-3 py-2 text-muted-foreground">{row.chest}</td>
                  <td className="px-3 py-2 text-muted-foreground">{row.length}</td>
                  <td className="px-3 py-2 text-muted-foreground">{row.shoulder}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
