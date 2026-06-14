"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { cardSchema, type CardInput, type Card } from "@/types/card";
import { createCard, updateCard } from "@/lib/actions/cards";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import TagEditor from "@/components/lists/detail/tag-editor";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface CardFormDialogProps {
  listId: string;
  card?: Card;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CardFormDialog({ listId, card, open, onOpenChange }: CardFormDialogProps) {
  const t = useTranslations("cards");
  const router = useRouter();
  const isEdit = Boolean(card);

  const form = useForm<CardInput>({
    resolver: zodResolver(cardSchema),
    defaultValues: { title: "", description: "", url: "", image: "", tags: [] },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        title: card?.title ?? "",
        description: card?.description ?? "",
        url: card?.url ?? "",
        image: card?.image ?? "",
        tags: card?.tags ?? [],
      });
    }
  }, [open, card, form]);

  const onSubmit = async (data: CardInput) => {
    try {
      if (isEdit && card) {
        await updateCard(card.id, data);
      } else {
        await createCard(listId, data);
      }
      onOpenChange(false);
      router.refresh();
    } catch {
      form.setError("root", { type: "server", message: t("validation.serverError") });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? t("editCard") : t("newCard")}</DialogTitle>
          <DialogDescription>
            {isEdit ? t("editCardDescription") : t("createCardDescription")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="card-title">{t("fieldTitle")}</Label>
            <Input id="card-title" {...form.register("title")} placeholder={t("titlePlaceholder")} disabled={form.formState.isSubmitting} autoFocus />
            {form.formState.errors.title && (
              <p className="text-sm text-destructive">{t("validation.titleRequired")}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="card-url">{t("fieldUrl")}</Label>
            <Input id="card-url" {...form.register("url")} placeholder={t("urlPlaceholder")} disabled={form.formState.isSubmitting} />
            {form.formState.errors.url && (
              <p className="text-sm text-destructive">{t("validation.invalidUrl")}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="card-description">{t("fieldDescription")}</Label>
            <Textarea id="card-description" {...form.register("description")} placeholder={t("descriptionPlaceholder")} disabled={form.formState.isSubmitting} rows={5} className="font-mono text-sm" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="card-image">{t("fieldImage")}</Label>
            <Input id="card-image" {...form.register("image")} placeholder={t("imagePlaceholder")} disabled={form.formState.isSubmitting} />
            {form.formState.errors.image && (
              <p className="text-sm text-destructive">{t("validation.invalidUrl")}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>{t("fieldTags")}</Label>
            <Controller control={form.control} name="tags" render={({ field }) => (
              <TagEditor tags={field.value ?? []} onTagsChange={field.onChange} placeholder={t("tagPlaceholder")} />
            )} />
          </div>

          {form.formState.errors.root && (
            <p className="text-sm text-destructive">{form.formState.errors.root.message}</p>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={form.formState.isSubmitting}>
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting
                ? isEdit ? t("saving") : t("creating")
                : isEdit ? t("save") : t("create")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
