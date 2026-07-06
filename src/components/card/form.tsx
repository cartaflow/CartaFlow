"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useMemo, useTransition } from "react";
import { useForm } from "react-hook-form";
import type { ActionResult } from "@/app/lists/[id]/cards/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { buildCardSchema, type CardFormValues } from "@/validations/card";

interface CardFormProps {
  defaultValues?: Partial<CardFormValues>;
  action: (data: CardFormValues) => Promise<ActionResult>;
  mode: "create" | "update";
  onDone?: () => void;
}

export function CardForm({ defaultValues, action, mode, onDone }: CardFormProps) {
  const translations = useTranslations("card.form");

  const schema = useMemo(
    () =>
      buildCardSchema({
        titleRequired: translations("validation.titleRequired"),
        titleTooLong: translations("validation.titleTooLong"),
        descriptionTooLong: translations("validation.descriptionTooLong"),
        invalidUrl: translations("validation.invalidUrl"),
      }),
    [translations],
  );

  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CardFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  function onSubmit(data: CardFormValues) {
    startTransition(async () => {
      const result = await action(data);
      if (result?.errors) {
        for (const [field, messages] of Object.entries(result.errors)) {
          if (field === "_form") {
            setError("root", { message: messages[0] });
          } else {
            setError(field as keyof CardFormValues, { message: messages[0] });
          }
        }
        return;
      }
      onDone?.();
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">
          {translations("title")}
        </label>
        <Input id="title" type="text" aria-invalid={!!errors.title} {...register("title")} />
        {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          {translations("description")}
        </label>
        <Textarea id="description" rows={3} aria-invalid={!!errors.description} {...register("description")} />
        {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="url" className="text-sm font-medium">
          {translations("url")}
        </label>
        <Input id="url" type="text" aria-invalid={!!errors.url} {...register("url")} />
        {errors.url && <p className="text-sm text-destructive">{errors.url.message}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="image" className="text-sm font-medium">
          {translations("image")}
        </label>
        <Input id="image" type="text" aria-invalid={!!errors.image} {...register("image")} />
        {errors.image && <p className="text-sm text-destructive">{errors.image.message}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="tags" className="text-sm font-medium">
          {translations("tags")}
        </label>
        <Input
          id="tags"
          type="text"
          placeholder={translations("tagsPlaceholder")}
          aria-invalid={!!errors.tags}
          {...register("tags")}
        />
        {errors.tags && <p className="text-sm text-destructive">{errors.tags.message}</p>}
      </div>

      {errors.root && <p className="text-sm text-destructive">{errors.root.message}</p>}

      <div className="flex gap-3 pt-1">
        <Button type="submit" disabled={isPending}>
          {isPending ? "…" : translations(`submit.${mode}`)}
        </Button>
        {onDone && (
          <Button type="button" variant="outline" onClick={onDone}>
            {translations("cancel")}
          </Button>
        )}
      </div>
    </form>
  );
}
