import { Outlet, createFileRoute } from "@tanstack/react-router";
import { AuthGate } from "@/components/admin/AuthGate";

export const Route = createFileRoute("/a8f3c91e7b2d4f06/estoque")({
  ssr: false,
  head: () => ({
    meta: [{ title: "Estoque interno" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: AdminEstoqueLayout,
});

function AdminEstoqueLayout() {
  return (
    <AuthGate>
      <Outlet />
    </AuthGate>
  );
}
