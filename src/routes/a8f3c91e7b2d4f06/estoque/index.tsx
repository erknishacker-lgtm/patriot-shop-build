import { useEffect, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { useStore } from "@/hooks/use-store";
import { adminDeleteProduct, adminListProducts } from "@/lib/admin.functions";
import { type ProductRecord } from "@/lib/products";
import { formatBRL } from "@/lib/format";

export const Route = createFileRoute("/a8f3c91e7b2d4f06/estoque/")({
  ssr: false,
  component: EstoqueListPage,
});

function EstoqueListPage() {
  const store = useStore();
  const [items, setItems] = useState<ProductRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      setItems(await adminListProducts({ data: { catalogBrand: store.catalogBrand } }));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não deu para ler o estoque.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // Recarrega quando troca a loja (subdomínio ou ?loja=).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.catalogBrand]);

  const remove = async (product: ProductRecord) => {
    if (!window.confirm(`Apagar “${product.name}”? Isso tira o produto da loja.`)) return;
    try {
      await adminDeleteProduct({ data: { id: product.id } });
      toast.success("Produto apagado.");
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não deu para apagar.");
    }
  };

  return (
    <AdminShell
      title="Produtos"
      action={
        <Button asChild variant="cta">
          <Link to="/a8f3c91e7b2d4f06/estoque/novo">
            <Plus className="size-4" />
            Novo produto
          </Link>
        </Button>
      }
    >
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
        {loading ? (
          <p className="p-6 text-sm text-muted-foreground">Carregando estoque…</p>
        ) : items.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">
            Nenhum produto nesta loja ainda. Cadastre o primeiro — as outras lojas não aparecem aqui.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-semibold">Produto</th>
                  <th className="px-4 py-3 font-semibold">SKU</th>
                  <th className="px-4 py-3 font-semibold">Preço</th>
                  <th className="px-4 py-3 font-semibold">Unidades</th>
                  <th className="px-4 py-3 font-semibold">Estoque</th>
                  <th className="px-4 py-3 font-semibold">Loja</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-t border-border">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {item.images[0]?.src ? (
                          <img
                            src={item.images[0].src}
                            alt=""
                            className="size-12 rounded-lg object-cover bg-muted"
                          />
                        ) : (
                          <span className="size-12 rounded-lg bg-muted" />
                        )}
                        <div>
                          <p className="font-medium text-foreground">{item.name}</p>
                          <p className="text-xs text-muted-foreground">/{item.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{item.sku}</td>
                    <td className="px-4 py-3 font-medium">{formatBRL(item.price)}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {item.sizes.filter((s) => s.available).map((s) => s.label).join(", ") || "—"}
                    </td>
                    <td className="px-4 py-3">{item.stock}</td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          item.published
                            ? "rounded-full bg-brand-soft px-2 py-0.5 text-xs font-semibold text-brand-deep"
                            : "rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground"
                        }
                      >
                        {item.published ? "Visível" : "Oculto"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Button asChild variant="ghost" size="icon">
                          <Link
                            to="/a8f3c91e7b2d4f06/estoque/$id"
                            params={{ id: item.id }}
                            aria-label="Editar"
                          >
                            <Pencil className="size-4" />
                          </Link>
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label="Apagar"
                          onClick={() => void remove(item)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
