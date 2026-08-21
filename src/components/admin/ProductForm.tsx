import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Plus, Star, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { adminSaveProduct, adminUploadImage } from "@/lib/admin.functions";
import { type ProductRecord } from "@/lib/products";
import { slugify } from "@/lib/slug";
import { cn } from "@/lib/utils";

type PendingImage = { id: string; file: File; preview: string; alt: string };

async function fileToBase64(file: File) {
  const bytes = new Uint8Array(await file.arrayBuffer());
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("grid gap-1.5", className)}>
      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
      <div className="mb-4">
        <h2 className="font-display text-lg font-semibold text-brand-deep">{title}</h2>
        {hint && <p className="mt-1 text-sm text-muted-foreground">{hint}</p>}
      </div>
      <div className="grid gap-4">{children}</div>
    </section>
  );
}

export function ProductForm({ initial, isNew }: { initial: ProductRecord; isNew: boolean }) {
  const navigate = useNavigate();
  const [draft, setDraft] = useState<ProductRecord>(initial);
  const [slugLocked, setSlugLocked] = useState(!isNew);
  const [pending, setPending] = useState<PendingImage[]>([]);
  const [pendingReviewPhotos, setPendingReviewPhotos] = useState<Record<string, PendingImage[]>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    return () => {
      pending.forEach((item) => URL.revokeObjectURL(item.preview));
      Object.values(pendingReviewPhotos).flat().forEach((item) => URL.revokeObjectURL(item.preview));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const patch = (partial: Partial<ProductRecord>) => setDraft((prev) => ({ ...prev, ...partial }));

  const onName = (name: string) => {
    patch({
      name,
      slug: slugLocked ? draft.slug : slugify(name),
    });
  };

  const moneyError = useMemo(() => {
    if (!(draft.price > 0)) return "Informe o preço de venda.";
    if (draft.oldPrice !== null && draft.oldPrice > 0 && draft.oldPrice <= draft.price) {
      return "O preço antigo precisa ser maior que o preço atual.";
    }
    return null;
  }, [draft.price, draft.oldPrice]);

  const addPendingFiles = (files: FileList | null) => {
    if (!files?.length) return;
    const next: PendingImage[] = [];
    for (const file of Array.from(files)) {
      if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) continue;
      if (file.size > 6 * 1024 * 1024) {
        toast.error(`${file.name} passa de 6 MB.`);
        continue;
      }
      next.push({
        id: crypto.randomUUID(),
        file,
        preview: URL.createObjectURL(file),
        alt: draft.name || file.name,
      });
    }
    setPending((prev) => [...prev, ...next]);
  };

  const handleSave = async () => {
    if (!draft.name.trim()) {
      toast.error("Dê um nome ao produto.");
      return;
    }
    if (!draft.sku.trim()) {
      toast.error("Informe o código SKU.");
      return;
    }
    if (!draft.slug.trim()) {
      toast.error("Informe o endereço (slug) do produto.");
      return;
    }
    if (moneyError) {
      toast.error(moneyError);
      return;
    }
    if (draft.sizes.length === 0) {
      toast.error("Cadastre pelo menos uma unidade/tamanho.");
      return;
    }

    setSaving(true);
    try {
      const cleaned: ProductRecord = {
        ...draft,
        name: draft.name.trim(),
        sku: draft.sku.trim(),
        slug: slugify(draft.slug) || slugify(draft.name),
        category: draft.category.trim() || "Vestuário",
        categorySlug: slugify(draft.category) || "vestuario",
        brand: draft.brand.trim() || "Clube Bolsonaro",
        description: draft.description.map((p) => p.trim()).filter(Boolean),
        specifications: draft.specifications.filter((s) => s.label.trim() && s.value.trim()),
        highlights: draft.highlights.filter((h) => h.title.trim() && h.text.trim()),
        faq: draft.faq.filter((f) => f.question.trim() && f.answer.trim()),
        sizeChart: draft.sizeChart.filter((r) => r.size.trim()),
        reviews: draft.reviews.filter(
          (review) =>
            review.author.trim() && (review.content.trim() || review.photos.length > 0),
        ),
        images: draft.images.filter((img) => img.src.trim()),
      };

      const id = await adminSaveProduct({ data: { product: cleaned, isNew } });
      const uploaded = [];
      for (const item of pending) {
        const src = await adminUploadImage({
          data: { productId: id, base64: await fileToBase64(item.file) },
        });
        uploaded.push({ src, alt: item.alt.trim() || cleaned.name });
      }

      const reviewsWithPhotos = [];
      for (const review of cleaned.reviews) {
        const extras = pendingReviewPhotos[review.id] ?? [];
        const photos = [...review.photos];
        for (const item of extras) {
          const src = await adminUploadImage({
            data: { productId: id, base64: await fileToBase64(item.file) },
          });
          photos.push({ src, alt: item.alt.trim() || review.author });
        }
        reviewsWithPhotos.push({ ...review, photos });
      }

      const hadReviewUploads = Object.values(pendingReviewPhotos).some((list) => list.length > 0);
      if (uploaded.length || hadReviewUploads) {
        await adminSaveProduct({
          data: {
            product: {
              ...cleaned,
              id,
              images: [...cleaned.images, ...uploaded],
              reviews: reviewsWithPhotos,
            },
            isNew: false,
          },
        });
      }

      toast.success(isNew ? "Produto cadastrado." : "Produto atualizado.");
      pending.forEach((item) => URL.revokeObjectURL(item.preview));
      Object.values(pendingReviewPhotos)
        .flat()
        .forEach((item) => URL.revokeObjectURL(item.preview));
      setPending([]);
      setPendingReviewPhotos({});
      await navigate({ to: "/a8f3c91e7b2d4f06/estoque" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível salvar.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-5 pb-24">
      <Section title="Dados principais">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nome" className="sm:col-span-2">
            <Input value={draft.name} onChange={(e) => onName(e.target.value)} />
          </Field>
          <Field label="SKU">
            <Input value={draft.sku} onChange={(e) => patch({ sku: e.target.value })} />
          </Field>
          <Field label="Link do botão de compra" className="sm:col-span-2">
            <Input
              type="url"
              placeholder="https://… link de checkout deste produto"
              value={draft.checkoutUrl}
              onChange={(e) => patch({ checkoutUrl: e.target.value })}
            />
            <span className="text-xs font-normal normal-case tracking-normal text-muted-foreground">
              Cada produto tem o próprio checkout. Cole aqui o link da Yampi (ou outro) desta peça.
            </span>
          </Field>
          <Field label="Endereço na loja (slug)">
            <Input
              value={draft.slug}
              onChange={(e) => {
                setSlugLocked(true);
                patch({ slug: e.target.value });
              }}
            />
          </Field>
          <Field label="Categoria">
            <Input value={draft.category} onChange={(e) => patch({ category: e.target.value })} />
          </Field>
          <Field label="Marca">
            <Input value={draft.brand} onChange={(e) => patch({ brand: e.target.value })} />
          </Field>
          <Field label="Selo (ex.: DESTAQUE)">
            <Input value={draft.badge ?? ""} onChange={(e) => patch({ badge: e.target.value })} />
          </Field>
          <Field label="Ordem (menor = mais vendido)">
            <Input
              type="number"
              value={draft.rank}
              onChange={(e) => patch({ rank: Number(e.target.value) || 0 })}
            />
          </Field>
        </div>
        <div className="flex items-center justify-between rounded-xl border border-border bg-muted/40 px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-foreground">Visível na loja</p>
            <p className="text-xs text-muted-foreground">Desligue para esconder sem apagar.</p>
          </div>
          <Switch checked={draft.published} onCheckedChange={(published) => patch({ published })} />
        </div>
      </Section>

      <Section title="Preço e estoque">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Preço (R$)">
            <Input
              type="number"
              step="0.01"
              value={draft.price}
              onChange={(e) => patch({ price: Number(e.target.value) })}
            />
          </Field>
          <Field label="Preço antigo (R$)">
            <Input
              type="number"
              step="0.01"
              value={draft.oldPrice ?? ""}
              onChange={(e) =>
                patch({ oldPrice: e.target.value === "" ? null : Number(e.target.value) })
              }
            />
          </Field>
          <Field label="Desconto PIX (%)">
            <Input
              type="number"
              step="0.1"
              value={Number((draft.pixDiscount * 100).toFixed(2))}
              onChange={(e) => patch({ pixDiscount: (Number(e.target.value) || 0) / 100 })}
            />
          </Field>
          <Field label="Parcelas no cartão">
            <Input
              type="number"
              value={draft.maxInstallments}
              onChange={(e) => patch({ maxInstallments: Math.max(1, Number(e.target.value) || 1) })}
            />
          </Field>
          <Field label="Estoque total">
            <Input
              type="number"
              value={draft.stock}
              onChange={(e) => patch({ stock: Math.max(0, Number(e.target.value) || 0) })}
            />
          </Field>
        </div>
        {moneyError && <p className="text-sm text-destructive">{moneyError}</p>}
      </Section>

      <Section title="Fotos" hint="Pode colar um link ou enviar arquivo do computador.">
        <div className="grid gap-3">
          {draft.images.map((image, index) => (
            <div key={`${image.src}-${index}`} className="grid gap-3 rounded-xl border border-border p-3 sm:grid-cols-[96px_1fr_auto]">
              <img src={image.src} alt="" className="size-24 rounded-lg object-cover bg-muted" />
              <div className="grid gap-2">
                <Input
                  value={image.src}
                  onChange={(e) => {
                    const images = [...draft.images];
                    images[index] = { ...image, src: e.target.value };
                    patch({ images });
                  }}
                  placeholder="Link da foto"
                />
                <Input
                  value={image.alt}
                  onChange={(e) => {
                    const images = [...draft.images];
                    images[index] = { ...image, alt: e.target.value };
                    patch({ images });
                  }}
                  placeholder="Texto da foto"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => patch({ images: draft.images.filter((_, i) => i !== index) })}
                aria-label="Remover foto"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
          {pending.map((item) => (
            <div key={item.id} className="grid gap-3 rounded-xl border border-dashed border-brand/40 p-3 sm:grid-cols-[96px_1fr_auto]">
              <img src={item.preview} alt="" className="size-24 rounded-lg object-cover bg-muted" />
              <Input
                value={item.alt}
                onChange={(e) =>
                  setPending((prev) =>
                    prev.map((p) => (p.id === item.id ? { ...p, alt: e.target.value } : p)),
                  )
                }
                placeholder="Texto da foto"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => {
                  URL.revokeObjectURL(item.preview);
                  setPending((prev) => prev.filter((p) => p.id !== item.id));
                }}
                aria-label="Remover foto nova"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => patch({ images: [...draft.images, { src: "", alt: draft.name }] })}
          >
            <Plus className="size-4" />
            Adicionar link
          </Button>
          <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-4 text-sm font-medium shadow-sm hover:bg-accent">
            <Upload className="size-4" />
            Enviar arquivo
            <input
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              onChange={(e) => {
                addPendingFiles(e.target.files);
                e.currentTarget.value = "";
              }}
            />
          </label>
        </div>
      </Section>

      <Section
        title="Unidades (tamanhos)"
        hint="Cada linha é uma unidade à venda: P, M, G… com acréscimo de preço se houver."
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="pb-2 font-semibold">Unidade</th>
                <th className="pb-2 font-semibold">Acréscimo (R$)</th>
                <th className="pb-2 font-semibold">Disponível</th>
                <th className="pb-2" />
              </tr>
            </thead>
            <tbody>
              {draft.sizes.map((size, index) => (
                <tr key={`${size.label}-${index}`} className="border-t border-border">
                  <td className="py-2 pr-2">
                    <Input
                      value={size.label}
                      onChange={(e) => {
                        const sizes = [...draft.sizes];
                        sizes[index] = { ...size, label: e.target.value };
                        patch({ sizes });
                      }}
                    />
                  </td>
                  <td className="py-2 pr-2">
                    <Input
                      type="number"
                      step="0.01"
                      value={size.extra}
                      onChange={(e) => {
                        const sizes = [...draft.sizes];
                        sizes[index] = { ...size, extra: Number(e.target.value) || 0 };
                        patch({ sizes });
                      }}
                    />
                  </td>
                  <td className="py-2 pr-2">
                    <Switch
                      checked={size.available}
                      onCheckedChange={(available) => {
                        const sizes = [...draft.sizes];
                        sizes[index] = { ...size, available };
                        patch({ sizes });
                      }}
                    />
                  </td>
                  <td className="py-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => patch({ sizes: draft.sizes.filter((_, i) => i !== index) })}
                      aria-label="Remover unidade"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => patch({ sizes: [...draft.sizes, { label: "", extra: 0, available: true }] })}
        >
          <Plus className="size-4" />
          Nova unidade
        </Button>
      </Section>

      <Section title="Tabela de medidas">
        {draft.sizeChart.map((row, index) => (
          <div key={`${row.size}-${index}`} className="grid gap-2 sm:grid-cols-[1fr_1fr_1fr_1fr_auto]">
            <Input
              value={row.size}
              placeholder="Tam."
              onChange={(e) => {
                const sizeChart = [...draft.sizeChart];
                sizeChart[index] = { ...row, size: e.target.value };
                patch({ sizeChart });
              }}
            />
            <Input
              value={row.chest}
              placeholder="Peito"
              onChange={(e) => {
                const sizeChart = [...draft.sizeChart];
                sizeChart[index] = { ...row, chest: e.target.value };
                patch({ sizeChart });
              }}
            />
            <Input
              value={row.length}
              placeholder="Comprimento"
              onChange={(e) => {
                const sizeChart = [...draft.sizeChart];
                sizeChart[index] = { ...row, length: e.target.value };
                patch({ sizeChart });
              }}
            />
            <Input
              value={row.shoulder}
              placeholder="Ombro"
              onChange={(e) => {
                const sizeChart = [...draft.sizeChart];
                sizeChart[index] = { ...row, shoulder: e.target.value };
                patch({ sizeChart });
              }}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => patch({ sizeChart: draft.sizeChart.filter((_, i) => i !== index) })}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            patch({ sizeChart: [...draft.sizeChart, { size: "", chest: "", length: "", shoulder: "" }] })
          }
        >
          <Plus className="size-4" />
          Linha na tabela
        </Button>
      </Section>

      <Section title="Descrição">
        {draft.description.map((paragraph, index) => (
          <div key={index} className="flex gap-2">
            <Textarea
              value={paragraph}
              onChange={(e) => {
                const description = [...draft.description];
                description[index] = e.target.value;
                patch({ description });
              }}
              rows={4}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => patch({ description: draft.description.filter((_, i) => i !== index) })}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={() => patch({ description: [...draft.description, ""] })}>
          <Plus className="size-4" />
          Parágrafo
        </Button>
      </Section>

      <Section title="Destaques">
        {draft.highlights.map((item, index) => (
          <div key={index} className="grid gap-2 sm:grid-cols-[1fr_2fr_auto]">
            <Input
              value={item.title}
              placeholder="Título"
              onChange={(e) => {
                const highlights = [...draft.highlights];
                highlights[index] = { ...item, title: e.target.value };
                patch({ highlights });
              }}
            />
            <Input
              value={item.text}
              placeholder="Texto"
              onChange={(e) => {
                const highlights = [...draft.highlights];
                highlights[index] = { ...item, text: e.target.value };
                patch({ highlights });
              }}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => patch({ highlights: draft.highlights.filter((_, i) => i !== index) })}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={() => patch({ highlights: [...draft.highlights, { title: "", text: "" }] })}
        >
          <Plus className="size-4" />
          Destaque
        </Button>
      </Section>

      <Section title="Ficha técnica">
        {draft.specifications.map((item, index) => (
          <div key={index} className="grid gap-2 sm:grid-cols-[1fr_2fr_auto]">
            <Input
              value={item.label}
              placeholder="Campo"
              onChange={(e) => {
                const specifications = [...draft.specifications];
                specifications[index] = { ...item, label: e.target.value };
                patch({ specifications });
              }}
            />
            <Input
              value={item.value}
              placeholder="Valor"
              onChange={(e) => {
                const specifications = [...draft.specifications];
                specifications[index] = { ...item, value: e.target.value };
                patch({ specifications });
              }}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() =>
                patch({ specifications: draft.specifications.filter((_, i) => i !== index) })
              }
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            patch({ specifications: [...draft.specifications, { label: "", value: "" }] })
          }
        >
          <Plus className="size-4" />
          Linha da ficha
        </Button>
      </Section>

      <Section title="Perguntas frequentes">
        {draft.faq.map((item, index) => (
          <div key={index} className="grid gap-2 rounded-xl border border-border p-3">
            <div className="flex gap-2">
              <Input
                value={item.question}
                placeholder="Pergunta"
                onChange={(e) => {
                  const faq = [...draft.faq];
                  faq[index] = { ...item, question: e.target.value };
                  patch({ faq });
                }}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => patch({ faq: draft.faq.filter((_, i) => i !== index) })}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
            <Textarea
              value={item.answer}
              placeholder="Resposta"
              onChange={(e) => {
                const faq = [...draft.faq];
                faq[index] = { ...item, answer: e.target.value };
                patch({ faq });
              }}
            />
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={() => patch({ faq: [...draft.faq, { question: "", answer: "" }] })}
        >
          <Plus className="size-4" />
          Pergunta
        </Button>
      </Section>

      <Section
        title="Avaliações dos clientes"
        hint="Cadastre aqui os comentários e fotos que os clientes mandam no WhatsApp ou Instagram."
      >
        {draft.reviews.map((review, index) => {
          const extras = pendingReviewPhotos[review.id] ?? [];
          return (
            <div key={review.id} className="grid gap-3 rounded-xl border border-border p-3">
              <div className="flex flex-wrap items-start gap-2">
                <Input
                  className="min-w-[160px] flex-1"
                  value={review.author}
                  placeholder="Nome do cliente"
                  onChange={(e) => {
                    const reviews = [...draft.reviews];
                    reviews[index] = { ...review, author: e.target.value };
                    patch({ reviews });
                  }}
                />
                <Input
                  type="date"
                  className="w-[150px]"
                  value={review.date}
                  onChange={(e) => {
                    const reviews = [...draft.reviews];
                    reviews[index] = { ...review, date: e.target.value };
                    patch({ reviews });
                  }}
                />
                <div className="flex items-center gap-1 pt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      aria-label={`${star} estrela${star > 1 ? "s" : ""}`}
                      onClick={() => {
                        const reviews = [...draft.reviews];
                        reviews[index] = { ...review, rating: star };
                        patch({ reviews });
                      }}
                    >
                      <Star
                        className={cn(
                          "size-4",
                          star <= review.rating ? "fill-gold text-gold" : "text-muted-foreground/40",
                        )}
                      />
                    </button>
                  ))}
                </div>
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  Compra verificada
                  <Switch
                    checked={review.verified}
                    onCheckedChange={(verified) => {
                      const reviews = [...draft.reviews];
                      reviews[index] = { ...review, verified };
                      patch({ reviews });
                    }}
                  />
                </label>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    extras.forEach((item) => URL.revokeObjectURL(item.preview));
                    setPendingReviewPhotos((prev) => {
                      const next = { ...prev };
                      delete next[review.id];
                      return next;
                    });
                    patch({ reviews: draft.reviews.filter((_, i) => i !== index) });
                  }}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
              <Input
                value={review.title}
                placeholder="Título (opcional)"
                onChange={(e) => {
                  const reviews = [...draft.reviews];
                  reviews[index] = { ...review, title: e.target.value };
                  patch({ reviews });
                }}
              />
              <Textarea
                value={review.content}
                placeholder="Comentário do cliente"
                rows={3}
                onChange={(e) => {
                  const reviews = [...draft.reviews];
                  reviews[index] = { ...review, content: e.target.value };
                  patch({ reviews });
                }}
              />
              <div className="flex flex-wrap gap-2">
                {review.photos.map((photo, photoIndex) => (
                  <div key={`${photo.src}-${photoIndex}`} className="relative">
                    <img src={photo.src} alt="" className="size-16 rounded-lg object-cover bg-muted" />
                    <button
                      type="button"
                      className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-background text-xs shadow"
                      onClick={() => {
                        const reviews = [...draft.reviews];
                        reviews[index] = {
                          ...review,
                          photos: review.photos.filter((_, i) => i !== photoIndex),
                        };
                        patch({ reviews });
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
                {extras.map((item) => (
                  <div key={item.id} className="relative">
                    <img src={item.preview} alt="" className="size-16 rounded-lg object-cover bg-muted" />
                    <button
                      type="button"
                      className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-background text-xs shadow"
                      onClick={() => {
                        URL.revokeObjectURL(item.preview);
                        setPendingReviewPhotos((prev) => ({
                          ...prev,
                          [review.id]: (prev[review.id] ?? []).filter((p) => p.id !== item.id),
                        }));
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <label className="grid size-16 cursor-pointer place-items-center rounded-lg border border-dashed border-border text-muted-foreground hover:bg-muted/40">
                  <Upload className="size-4" />
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="sr-only"
                    onChange={(e) => {
                      const files = Array.from(e.target.files ?? []).filter((file) =>
                        ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type),
                      );
                      if (!files.length) return;
                      setPendingReviewPhotos((prev) => ({
                        ...prev,
                        [review.id]: [
                          ...(prev[review.id] ?? []),
                          ...files.map((file) => ({
                            id: crypto.randomUUID(),
                            file,
                            preview: URL.createObjectURL(file),
                            alt: review.author || file.name,
                          })),
                        ],
                      }));
                      e.currentTarget.value = "";
                    }}
                  />
                </label>
              </div>
            </div>
          );
        })}
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            patch({
              reviews: [
                ...draft.reviews,
                {
                  id: crypto.randomUUID(),
                  author: "",
                  rating: 5,
                  date: new Date().toISOString().slice(0, 10),
                  title: "",
                  content: "",
                  verified: true,
                  photos: [],
                },
              ],
            })
          }
        >
          <Plus className="size-4" />
          Nova avaliação
        </Button>
      </Section>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-6xl justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => void navigate({ to: "/a8f3c91e7b2d4f06/estoque" })}>
            Cancelar
          </Button>
          <Button type="button" variant="cta" disabled={saving} onClick={() => void handleSave()}>
            {saving ? "Salvando…" : isNew ? "Cadastrar produto" : "Salvar alterações"}
          </Button>
        </div>
      </div>
    </div>
  );
}
