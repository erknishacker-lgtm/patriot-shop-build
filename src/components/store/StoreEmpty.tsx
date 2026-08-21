import { StoreLayout } from "@/components/store/StoreLayout";
import { useStore } from "@/hooks/use-store";

export function StoreEmpty() {
  const store = useStore();
  return (
    <StoreLayout>
      <div className="mx-auto flex max-w-[720px] flex-col items-center px-4 py-24 text-center">
        <img src={store.logoSrc} alt={store.name} className="h-14 w-auto object-contain" />
        <h1 className="mt-8 font-display text-2xl font-bold text-balance text-brand-deep sm:text-3xl">
          {store.emptyTitle}
        </h1>
        <p className="mt-3 max-w-md text-sm text-muted-foreground">{store.emptyText}</p>
      </div>
    </StoreLayout>
  );
}
