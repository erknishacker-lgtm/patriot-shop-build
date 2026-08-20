import { BadgeCheck, FileText, ShieldCheck, Truck } from "lucide-react";

const ITEMS = [
  {
    Icon: ShieldCheck,
    title: "Compra Segura",
    text: "Ambiente protegido para você comprar com tranquilidade.",
  },
  { Icon: Truck, title: "Envio Nacional", text: "Enviamos seu pedido para todo o Brasil." },
  {
    Icon: BadgeCheck,
    title: "Produto Original",
    text: "Produto oficial da linha Clube Bolsonaro.",
  },
  { Icon: FileText, title: "Nota Fiscal", text: "Todos os pedidos são enviados com Nota Fiscal." },
];

export function BenefitsStrip() {
  return (
    <section aria-label="Benefícios da compra" className="border-y border-border bg-surface">
      <div className="mx-auto max-w-[1200px] px-4 py-8">
        <ul className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4">
          {ITEMS.map(({ Icon, title, text }) => (
            <li
              key={title}
              className="w-[76%] min-w-0 shrink-0 snap-start rounded-xl border border-border bg-card p-5 sm:w-auto"
            >
              <Icon className="size-5 text-brand" aria-hidden="true" />
              <p className="mt-3 text-sm font-bold text-brand-deep">{title}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
