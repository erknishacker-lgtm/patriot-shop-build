import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Barcode, CreditCard, Lock, QrCode } from "lucide-react";
import { toast } from "sonner";
import { Breadcrumbs } from "@/components/store/Breadcrumbs";
import { StoreLayout } from "@/components/store/StoreLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import { formatBRL, maskCep, maskPhone } from "@/lib/format";
import { cn } from "@/lib/utils";

const TITLE = "Checkout | Clube Bolsonaro";
const DESCRIPTION =
  "Finalize sua compra na loja oficial Clube Bolsonaro: dados de entrega, forma de pagamento e resumo do pedido.";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CheckoutPage,
});

const PAYMENT_METHODS = [
  { id: "pix", label: "Pix", hint: "Aprovação imediata", Icon: QrCode },
  { id: "card", label: "Cartão", hint: "Em até 6x sem juros", Icon: CreditCard },
  { id: "boleto", label: "Boleto", hint: "Vence em 3 dias", Icon: Barcode },
] as const;

function Field({
  id,
  label,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { id: string; label: string }) {
  return (
    <div className={cn("min-w-0", className)}>
      <Label htmlFor={id} className="text-xs font-semibold text-muted-foreground">
        {label}
      </Label>
      <Input id={id} className="mt-1.5 h-11" {...props} />
    </div>
  );
}

function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const [payment, setPayment] = useState<(typeof PAYMENT_METHODS)[number]["id"]>("pix");
  const [cep, setCep] = useState("");
  const [phone, setPhone] = useState("");

  const shipping = items.length > 0 ? 19.9 : 0;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (items.length === 0) {
      toast.error("Seu carrinho está vazio.");
      return;
    }
    // Ponto de integração futura com gateway (Mercado Pago, Stripe, PagSeguro...).
    toast.success("Pedido registrado!", {
      description: "Pagamento ainda não integrado — estrutura pronta para o gateway.",
    });
    clear();
  };

  return (
    <StoreLayout>
      <div className="mx-auto max-w-[1200px] px-4 pb-16">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Checkout" }]} />
        <h1 className="text-2xl font-bold text-brand-deep sm:text-3xl">Finalizar compra</h1>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="flex flex-col gap-6">
            <section className="rounded-xl border border-border bg-card shadow-[var(--shadow-card)] p-5 sm:p-6">
              <h2 className="text-lg font-bold text-brand-deep">Dados pessoais</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field id="nome" label="Nome completo" required autoComplete="name" />
                <Field id="email" label="E-mail" type="email" required autoComplete="email" />
                <Field
                  id="telefone"
                  label="Telefone"
                  required
                  inputMode="tel"
                  value={phone}
                  onChange={(e) => setPhone(maskPhone(e.target.value))}
                  placeholder="(00) 00000-0000"
                />
              </div>
            </section>

            <section className="rounded-xl border border-border bg-card shadow-[var(--shadow-card)] p-5 sm:p-6">
              <h2 className="text-lg font-bold text-brand-deep">Endereço de entrega</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-6">
                <Field
                  id="cep-checkout"
                  label="CEP"
                  required
                  inputMode="numeric"
                  placeholder="00000-000"
                  value={cep}
                  onChange={(e) => setCep(maskCep(e.target.value))}
                  className="sm:col-span-2"
                />
                <Field id="rua" label="Rua" required className="sm:col-span-4" />
                <Field id="numero" label="Número" required className="sm:col-span-2" />
                <Field id="complemento" label="Complemento" className="sm:col-span-4" />
                <Field id="bairro" label="Bairro" required className="sm:col-span-3" />
                <Field id="cidade" label="Cidade" required className="sm:col-span-2" />
                <Field id="estado" label="UF" required maxLength={2} className="sm:col-span-1" />
              </div>
            </section>

            <section className="rounded-xl border border-border bg-card shadow-[var(--shadow-card)] p-5 sm:p-6">
              <h2 className="text-lg font-bold text-brand-deep">Forma de pagamento</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {PAYMENT_METHODS.map(({ id, label, hint, Icon }) => (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={payment === id}
                    onClick={() => setPayment(id)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-all",
                      payment === id
                        ? "border-brand bg-brand-soft"
                        : "border-border hover:border-brand/40",
                    )}
                  >
                    <Icon className="size-5 shrink-0 text-brand" aria-hidden="true" />
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold">{label}</span>
                      <span className="block truncate text-xs text-muted-foreground">{hint}</span>
                    </span>
                  </button>
                ))}
              </div>
              <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                <Lock className="size-3.5" aria-hidden="true" />
                Ambiente de demonstração — nenhum pagamento real é processado.
              </p>
            </section>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <section className="rounded-xl border border-border bg-card shadow-[var(--shadow-card)] p-5 sm:p-6">
              <h2 className="text-lg font-bold text-brand-deep">Resumo do pedido</h2>

              {items.length === 0 ? (
                <div className="mt-4 text-sm text-muted-foreground">
                  <p>Seu carrinho está vazio.</p>
                  <Button variant="soft" className="mt-3" asChild>
                    <Link to="/">Voltar à loja</Link>
                  </Button>
                </div>
              ) : (
                <>
                  <ul className="mt-4 space-y-3">
                    {items.map((item) => (
                      <li key={item.key} className="flex gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          loading="lazy"
                          width={64}
                          height={64}
                          className="size-14 shrink-0 rounded-lg border border-border object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Tam. {item.size} • {item.quantity}x
                          </p>
                        </div>
                        <span className="shrink-0 text-sm font-semibold">
                          {formatBRL(item.unitPrice * item.quantity)}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Separator className="my-4" />
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Subtotal</dt>
                      <dd>{formatBRL(subtotal)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Frete estimado</dt>
                      <dd>{formatBRL(shipping)}</dd>
                    </div>
                    <div className="flex justify-between pt-2 text-base font-bold text-brand-deep">
                      <dt>Total</dt>
                      <dd>{formatBRL(subtotal + shipping)}</dd>
                    </div>
                  </dl>

                  <Button type="submit" variant="cta" size="xl" className="mt-5 w-full">
                    Concluir pedido
                  </Button>
                </>
              )}
            </section>
          </aside>
        </form>
      </div>
    </StoreLayout>
  );
}
