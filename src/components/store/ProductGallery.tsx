import { useState } from "react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type GalleryImage = { src: string; alt: string };

export function ProductGallery({ images, title }: { images: GalleryImage[]; title: string }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [zoom, setZoom] = useState(false);

  const go = (delta: number) => setActive((i) => (i + delta + images.length) % images.length);
  const current = images[active];

  return (
    <div className="flex flex-col gap-3">
      <div className="group relative overflow-hidden rounded-2xl border border-border bg-surface shadow-[var(--shadow-card)]">
        <button
          type="button"
          className="block w-full cursor-zoom-in"
          onClick={() => setLightbox(true)}
          onMouseEnter={() => setZoom(true)}
          onMouseLeave={() => setZoom(false)}
          aria-label="Ampliar imagem do produto"
        >
          <img
            src={current.src}
            alt={current.alt}
            width={1024}
            height={1024}
            className={cn(
              "aspect-square w-full object-cover transition-transform duration-500",
              zoom ? "scale-110" : "scale-100",
            )}
          />
        </button>

        <span className="pointer-events-none absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-background/80 text-foreground shadow-sm">
          <Expand className="size-4" aria-hidden="true" />
        </span>

        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Imagem anterior"
          className="absolute left-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-background/85 text-foreground shadow-sm transition hover:bg-background"
        >
          <ChevronLeft className="size-5" />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Próxima imagem"
          className="absolute right-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-background/85 text-foreground shadow-sm transition hover:bg-background"
        >
          <ChevronRight className="size-5" />
        </button>

        <span className="absolute bottom-3 left-3 rounded-full bg-brand-deep/85 px-2.5 py-1 text-[11px] font-medium text-primary-foreground">
          {active + 1} / {images.length}
        </span>
      </div>

      <ul className="grid grid-cols-5 gap-2 sm:gap-3">
        {images.map((image, index) => (
          <li key={image.src}>
            <button
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Ver imagem ${index + 1}: ${image.alt}`}
              aria-current={index === active}
              className={cn(
                "block w-full overflow-hidden rounded-xl border-2 bg-surface transition-all duration-200 hover:opacity-100",
                index === active
                  ? "border-brand opacity-100 ring-2 ring-brand/15"
                  : "border-transparent opacity-70",
              )}
            >
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                width={1024}
                height={1024}
                className="aspect-square w-full object-cover"
              />
            </button>
          </li>
        ))}
      </ul>

      <Dialog open={lightbox} onOpenChange={setLightbox}>
        <DialogContent
          showCloseButton={false}
          className="max-w-3xl border-none bg-background p-2 sm:p-4"
        >
          <DialogTitle className="sr-only">{title} — galeria ampliada</DialogTitle>
          <div className="relative">
            <img
              src={current.src}
              alt={current.alt}
              className="max-h-[75vh] w-full rounded-xl object-contain"
            />
            <button
              type="button"
              onClick={() => setLightbox(false)}
              aria-label="Fechar"
              className="absolute right-2 top-2 grid size-9 place-items-center rounded-full bg-background/90 shadow-sm"
            >
              <X className="size-4" />
            </button>
            <div className="mt-3 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Imagem anterior"
                className="grid size-10 place-items-center rounded-full border border-border"
              >
                <ChevronLeft className="size-5" />
              </button>
              <span className="text-sm text-muted-foreground">
                {active + 1} / {images.length}
              </span>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Próxima imagem"
                className="grid size-10 place-items-center rounded-full border border-border"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
