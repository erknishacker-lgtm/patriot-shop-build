import { useStore } from "@/hooks/use-store";

export function ProductDescription({ paragraphs }: { paragraphs: string[] }) {
  const store = useStore();
  return (
    <section aria-labelledby="descricao-titulo" className="mx-auto max-w-[1200px] px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <h2
          id="descricao-titulo"
          className="font-display text-2xl font-bold text-brand-deep sm:text-3xl"
        >
          Descrição
        </h2>
        <p className="mt-1 text-sm font-semibold uppercase tracking-[0.14em] text-brand">
          {store.descriptionKicker}
        </p>
        <span className="mt-4 block h-1 w-16 rounded-full bg-gold" aria-hidden="true" />
        <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
          {paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
