import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  rating: number;
  reviewCount: number;
  className?: string;
};

export function ProductRating({ rating, reviewCount, className }: Props) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <div className="flex items-center" aria-label={`Nota ${rating.toFixed(1)} de 5`}>
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i < fullStars || (i === fullStars && hasHalf);
          return (
            <Star
              key={i}
              className={cn(
                "size-4 shrink-0",
                filled ? "fill-gold text-gold" : "fill-muted text-muted-foreground/30",
              )}
              aria-hidden="true"
            />
          );
        })}
      </div>
      <span className="text-sm font-bold text-brand-deep">{rating.toFixed(1)}</span>
      <span className="text-xs text-muted-foreground">•</span>
      <span className="text-sm text-muted-foreground">
        {reviewCount} avaliaç{reviewCount === 1 ? "ão" : "ões"}
      </span>
    </div>
  );
}
