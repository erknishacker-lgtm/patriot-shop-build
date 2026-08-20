import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, Search, ShoppingCart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/hooks/use-cart";
import { Logo } from "./Logo";

const NAV = [
  { label: "Início", to: "/" },
  { label: "A Loja", to: "/" },
  { label: "Sobre", to: "/" },
];

function SearchField({ id = "busca" }: { id?: string }) {
  return (
    <form
      className="relative w-full"
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <label htmlFor={id} className="sr-only">
        Buscar produtos
      </label>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <Input id={id} placeholder="O que você procura?" className="h-10 rounded-full pl-9" />
    </form>
  );
}

export function Header() {
  const { count, openCart } = useCart();
  const [mobileSearch, setMobileSearch] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto grid max-w-[1200px] grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 lg:grid-cols-[auto_1fr_auto] lg:gap-6">
        <Logo />

        <div className="hidden items-center gap-6 lg:flex">
          <nav className="flex items-center gap-5" aria-label="Navegação principal">
            {NAV.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="text-sm font-medium text-foreground/80 transition-colors hover:text-brand"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="max-w-sm flex-1">
            <SearchField />
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Abrir busca"
            onClick={() => setMobileSearch((v) => !v)}
          >
            {mobileSearch ? <X /> : <Search />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="relative"
            aria-label={`Abrir carrinho com ${count} itens`}
            onClick={openCart}
          >
            <ShoppingCart />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid min-w-5 animate-in zoom-in place-items-center rounded-full bg-gold px-1 text-[11px] font-bold text-gold-foreground">
                {count}
              </span>
            )}
          </Button>

          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Abrir menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[85vw] max-w-xs">
              <SheetTitle className="text-left font-display text-brand-deep">Menu</SheetTitle>
              <nav className="mt-6 flex flex-col gap-1" aria-label="Navegação mobile">
                {NAV.map((item) => (
                  <Link
                    key={item.label}
                    to={item.to}
                    onClick={() => setMenuOpen(false)}
                    className="rounded-lg px-3 py-3 text-base font-medium transition-colors hover:bg-brand-soft"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {mobileSearch && (
        <div className="border-t border-border px-4 py-3 animate-in fade-in slide-in-from-top-1 lg:hidden">
          <SearchField id="busca-mobile" />
        </div>
      )}
    </header>
  );
}
