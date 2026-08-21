import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { ProductForm } from "@/components/admin/ProductForm";
import { emptyProduct } from "@/lib/products";

export const Route = createFileRoute("/a8f3c91e7b2d4f06/estoque/novo")({
  ssr: false,
  component: NovoProdutoPage,
});

function NovoProdutoPage() {
  return (
    <AdminShell title="Novo produto">
      <ProductForm initial={emptyProduct()} isNew />
    </AdminShell>
  );
}
