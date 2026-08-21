import { useEffect, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { ProductForm } from "@/components/admin/ProductForm";
import { Button } from "@/components/ui/button";
import { adminGetProduct } from "@/lib/admin.functions";
import { type ProductRecord } from "@/lib/products";

export const Route = createFileRoute("/a8f3c91e7b2d4f06/estoque/$id")({
  ssr: false,
  component: EditarProdutoPage,
});

function EditarProdutoPage() {
  const { id } = Route.useParams();
  const [product, setProduct] = useState<ProductRecord | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void adminGetProduct({ data: { id } })
      .then((row) => {
        if (!active) return;
        setProduct(row);
        if (!row) setError("Produto não encontrado.");
      })
      .catch((err: unknown) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Não deu para abrir o produto.");
      });
    return () => {
      active = false;
    };
  }, [id]);

  if (error) {
    return (
      <AdminShell title="Produto">
        <p className="text-sm text-muted-foreground">{error}</p>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/a8f3c91e7b2d4f06/estoque">Voltar ao estoque</Link>
        </Button>
      </AdminShell>
    );
  }

  if (!product) {
    return (
      <AdminShell title="Editar produto">
        <p className="text-sm text-muted-foreground">Carregando…</p>
      </AdminShell>
    );
  }

  return (
    <AdminShell title="Editar produto">
      <ProductForm initial={product} isNew={false} />
    </AdminShell>
  );
}
