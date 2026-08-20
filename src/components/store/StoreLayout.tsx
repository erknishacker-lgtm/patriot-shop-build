import type { ReactNode } from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { MiniCart } from "./MiniCart";
import { TopBar } from "./TopBar";

export function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopBar />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <MiniCart />
    </div>
  );
}
