import { ArrowRight } from "lucide-react";

export function TopBar() {
  return (
    <div className="bg-brand-deep text-primary-foreground">
      <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-2 text-center">
        <p className="text-[11px] font-medium tracking-wide sm:text-sm">
          Faça parte do movimento que mais cresce no Brasil
          <ArrowRight className="ml-1.5 inline size-3.5 text-gold" aria-hidden="true" />
        </p>
      </div>
    </div>
  );
}
