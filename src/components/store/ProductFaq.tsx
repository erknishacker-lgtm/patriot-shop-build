import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { Product } from "@/data/product";

export function ProductFaq({ items }: { items: Product["faq"] }) {
  return (
    <section aria-labelledby="faq-titulo" className="border-y border-border bg-surface">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <h2
          id="faq-titulo"
          className="text-center font-display text-2xl font-bold text-brand-deep sm:text-3xl"
        >
          Perguntas frequentes
        </h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Tudo o que você precisa saber antes de finalizar o pedido.
        </p>
        <Accordion type="single" collapsible className="mt-8">
          {items.map((item, index) => (
            <AccordionItem key={item.question} value={`faq-${index}`}>
              <AccordionTrigger className="text-left text-sm font-semibold text-brand-deep sm:text-base">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
