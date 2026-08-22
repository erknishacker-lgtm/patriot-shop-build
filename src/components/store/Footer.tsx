import { Link } from "@tanstack/react-router";
import { useStore } from "@/hooks/use-store";

const PAYMENTS = ["Pix", "Visa", "Mastercard", "Elo", "Boleto"];

export function Footer() {
  const store = useStore();
  return (
    <footer className="bg-brand-deep text-primary-foreground">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-5 px-4 py-8 text-center">
        <Link to="/" aria-label={`${store.name} — início`}>
          <img
            src={store.logoOnDarkSrc}
            alt={store.name}
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

        <nav
          aria-label="Políticas da loja"
          className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] font-semibold text-primary-foreground/75"
        >
          <Link to="/entrega-e-reembolso" className="hover:text-gold">
            Entrega e reembolso
          </Link>
          <Link to="/privacidade" className="hover:text-gold">
            Privacidade
          </Link>
          <Link to="/sobre" className="hover:text-gold">
            Sobre
          </Link>
        </nav>

        <img
          src="/brand/stampabr-wordmark.png"
          alt="Stampabr — camisetas personalizadas"
          className="h-10 w-auto object-contain opacity-95 sm:h-12"
        />

        <p className="text-[11px] text-primary-foreground/55">{store.footerNote}</p>
      </div>
    </footer>
  );
}
