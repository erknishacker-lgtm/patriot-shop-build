import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Youtube } from "lucide-react";

const COLUMNS = [
  {
    title: "Institucional",
    links: [
      { label: "Início", to: "/" },
      { label: "A Loja", to: "/" },
      { label: "Sobre", to: "/" },
    ],
  },
  {
    title: "Atendimento",
    links: [
      { label: "Fale conosco", to: "/" },
      { label: "Política de Privacidade", to: "/" },
      { label: "Termos de Uso", to: "/" },
    ],
  },
];

const PAYMENTS = ["Pix", "Visa", "Mastercard", "Amex", "Boleto"];

export function Footer() {
  return (
    <footer className="mt-16 bg-brand-deep text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-display text-lg font-bold text-gold">Clube Bolsonaro</p>
            <p className="mt-3 max-w-xs text-sm text-primary-foreground/70">
              Loja oficial de vestuário com identidade, qualidade e propósito. Envio para todo o
              Brasil com Nota Fiscal.
            </p>
          </div>

          {COLUMNS.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-gold">
                {column.title}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-primary-foreground/75 transition-colors hover:text-gold"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-gold">
              Pagamento
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {PAYMENTS.map((payment) => (
                <li
                  key={payment}
                  className="rounded-md border border-primary-foreground/20 bg-primary-foreground/5 px-2.5 py-1.5 text-[11px] font-semibold"
                >
                  {payment}
                </li>
              ))}
            </ul>

            <h2 className="mt-6 text-sm font-semibold uppercase tracking-[0.14em] text-gold">
              Acompanhe nas redes
            </h2>
            <ul className="mt-3 flex gap-2">
              {[
                { Icon: Instagram, label: "Instagram" },
                { Icon: Facebook, label: "Facebook" },
                { Icon: Youtube, label: "YouTube" },
              ].map(({ Icon, label }) => (
                <li key={label}>
                  <a
                    href="/"
                    aria-label={label}
                    className="grid size-9 place-items-center rounded-full border border-primary-foreground/20 transition-colors hover:border-gold hover:text-gold"
                  >
                    <Icon className="size-4" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-primary-foreground/15 pt-6 text-xs text-primary-foreground/60">
          <p className="font-semibold text-primary-foreground/80">CAPITAO STORE BRASIL LTDA</p>
          <p className="mt-1">CNPJ: 66.716.746/0001-04</p>
          <p className="mt-1">© 2026 Clube Bolsonaro. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
