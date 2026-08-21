import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { getAdminSession } from "@/lib/admin.functions";
import { clearBrowserAuthJunk } from "@/lib/clear-browser-auth";

export function AuthGate({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    clearBrowserAuthJunk();
    let active = true;
    void getAdminSession().then((session) => {
      if (!active) return;
      if (!session.email) {
        void navigate({ to: "/a8f3c91e7b2d4f06" });
        return;
      }
      setReady(true);
    });
    return () => {
      active = false;
    };
  }, [navigate]);

  if (!ready) {
    return (
      <div className="grid min-h-screen place-items-center bg-surface text-sm text-muted-foreground">
        Abrindo o estoque…
      </div>
    );
  }

  return <>{children}</>;
}
