import { Link } from "@tanstack/react-router";

const PAYMENTS = ["Pix", "Visa", "Mastercard", "Elo", "Boleto"];

export function Footer() {
  return (
    <footer className="bg-brand-deep text-primary-foreground">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-5 px-4 py-8 text-center">
        <Link to="/" aria-label="Clube Bolsonaro — início">
          <img
            src="/brand/clube-bolsonaro.png"
            alt="Clube Bolsonaro"
            className="mx-auto h-11 w-auto object-contain sm:h-14"
          />
        </Link>

        <ul className="flex flex-wrap items-center justify-center gap-2">
          {PAYMENTS.map((payment) => (
            <li
              key={payment}
              className="rounded-md border border-primary-foreground/20 px-2.5 py-1 text-[11px] font-semibold text-primary-foreground/80"
            >
              {payment}
            </li>
          ))}
        </ul>

        <div className="space-y-1 text-[11px] leading-relaxed text-primary-foreground/55">
          <p>CAPITAO STORE BRASIL LTDA · CNPJ 66.716.746/0001-04</p>
          <p>© 2026 Clube Bolsonaro</p>
        </div>
      </div>
    </footer>
  );
}
