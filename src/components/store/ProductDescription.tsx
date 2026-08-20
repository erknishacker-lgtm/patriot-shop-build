export function ProductDescription({ paragraphs }: { paragraphs: string[] }) {
  return (
    <section className="card-elevated p-6 sm:p-8" aria-labelledby="descricao-titulo">
      <h2 id="descricao-titulo" className="text-xl font-bold text-brand-deep sm:text-2xl">
        Descrição do Produto
      </h2>
      <span className="mt-3 block h-1 w-16 rounded-full gold-gradient" aria-hidden="true" />
      <div className="mt-5 space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
        {paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 24)}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}
