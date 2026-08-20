import { createFileRoute } from "@tanstack/react-router";

const ALIAS = "camisetas2026";

export const Route = createFileRoute("/api/public/yampi-debug")({
  server: {
    handlers: {
      GET: async () => {
        const res = await fetch(
          `https://api.dooki.com.br/v2/${ALIAS}/catalog/products?include=skus,skus.variations&limit=10`,
          {
            headers: {
              "User-Token": process.env["YAMPI_API_TOKEN"] ?? "",
              "User-Secret-Key": process.env["YAMPI_SECRET_KEY"] ?? "",
              Accept: "application/json",
            },
          },
        );
        const body = await res.text();
        return new Response(body, {
          status: res.status,
          headers: { "content-type": "application/json" },
        });
      },
    },
  },
});
