import { Check, Facebook, Link2, MessageCircle, Share2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ShareMenu({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const currentUrl = () => (typeof window === "undefined" ? "" : window.location.href);

  const open = (url: string) => window.open(url, "_blank", "noopener,noreferrer");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl());
      setCopied(true);
      toast.success("Link copiado!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Não foi possível copiar o link.");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="lg" className="flex-1 gap-2">
          <Share2 className="size-4" />
          Compartilhar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem
          onClick={() =>
            open(
              `https://api.whatsapp.com/send?text=${encodeURIComponent(`${title} — ${currentUrl()}`)}`,
            )
          }
        >
          <MessageCircle className="size-4" /> WhatsApp
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl())}`)
          }
        >
          <Facebook className="size-4" /> Facebook
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            open(
              `https://x.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(currentUrl())}`,
            )
          }
        >
          <span className="grid size-4 place-items-center text-[13px] font-bold">X</span> X
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => void copy()}>
          {copied ? <Check className="size-4" /> : <Link2 className="size-4" />} Copiar link
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
