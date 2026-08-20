import { Check, Star, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ProductReview } from "@/data/product";

type Props = {
  reviews: ProductReview[];
};

export function ProductReviews({ reviews }: Props) {
  if (!reviews.length) return null;

  const average =
    reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  const counts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  return (
    <section className="bg-surface py-10 sm:py-14" id="avaliacoes">
      <div className="mx-auto max-w-[1200px] px-4">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-brand/10">
            <Star className="size-5 fill-gold text-gold" aria-hidden="true" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-brand-deep sm:text-2xl">
              Avaliações de quem comprou
            </h2>
            <p className="text-sm text-muted-foreground">
              Confira a opinião de clientes que já vestem a Camiseta Clube Bolsonaro
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="text-center">
              <p className="font-display text-5xl font-extrabold text-brand-deep">
                {average.toFixed(1)}
              </p>
              <div className="mt-2 flex justify-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "size-4",
                      i < Math.round(average)
                        ? "fill-gold text-gold"
                        : "fill-muted text-muted-foreground/30",
                    )}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Baseado em {reviews.length} avaliaç{reviews.length === 1 ? "ão" : "ões"}
              </p>
            </div>

            <div className="mt-5 space-y-2">
              {counts.map(({ star, count }) => {
                const pct = reviews.length ? (count / reviews.length) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-2 text-sm">
                    <span className="w-3 font-medium text-brand-deep">{star}</span>
                    <Star className="size-3 fill-gold text-gold" aria-hidden="true" />
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-gold transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-xs text-muted-foreground">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            {reviews.slice(0, 4).map((review) => (
              <article
                key={review.id}
                className="rounded-2xl border border-border bg-card p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-brand-deep">{review.author}</span>
                      {review.verified && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand">
                          <Check className="size-3" aria-hidden="true" />
                          Verificado
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {(() => {
                        const [y, m, d] = review.date.split("-");
                        const monthNames = [
                          "jan", "fev", "mar", "abr", "mai", "jun",
                          "jul", "ago", "set", "out", "nov", "dez",
                        ];
                        return `${d} de ${monthNames[Number(m) - 1]}. de ${y}`;
                      })()}
                    </p>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "size-3.5",
                          i < review.rating
                            ? "fill-gold text-gold"
                            : "fill-muted text-muted-foreground/30",
                        )}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                </div>
                <h3 className="mt-3 font-semibold text-foreground">{review.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {review.content}
                </p>
                <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                  <ThumbsUp className="size-3.5" aria-hidden="true" />
                  <span>Esta avaliação foi útil</span>
                </div>
              </article>
            ))}

            {reviews.length > 4 && (
              <Button variant="outline" className="w-full">
                Ver todas as {reviews.length} avaliações
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
