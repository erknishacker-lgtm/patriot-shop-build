import { Headphones, MapPin, PackageCheck } from "lucide-react";

const ITEMS = [
  {
    Icon: MapPin,
    title: "Rastreio",
    text: "Você receberá o código de rastreio para acompanhar seu pedido.",
  },
  {
    Icon: PackageCheck,
    title: "Envio",
    text: "Seu pedido será preparado e enviado após a confirmação do pagamento.",
  },
  {
    Icon: Headphones,
    title: "Suporte",
    text: "Conte com nosso atendimento para tirar suas dúvidas sobre o pedido.",
  },
];

export function TrustBlock() {
  return (
    <section aria-label="Confiança" className="mx-auto max-w-[1200px] px-4 py-12">
      <ul className="grid gap-8 sm:grid-cols-3">
        {ITEMS.map(({ Icon, title, text }) => (
          <li key={title} className="text-center">
            <span className="mx-auto grid size-11 place-items-center rounded-full border border-border">
              <Icon className="size-5 text-brand" aria-hidden="true" />
            </span>
            <h3 className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-brand-deep">
              {title}
            </h3>
            <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {text}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
