"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useMemo, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { type ActionResult, fetchCardMetadata } from "@/app/lists/[id]/cards/actions";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
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
  const [isFetchingMetadata, startMetadataFetch] = useTransition();
  const [fetchError, setFetchError] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm<CardFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  function handleFetchMetadata() {
    const url = getValues("url");
    if (!url) return;

    setFetchError(false);
    startMetadataFetch(async () => {
      const result = await fetchCardMetadata(url);
      if (!result) {
        setFetchError(true);
        return;
      }
      if (result.title) setValue("title", result.title, { shouldValidate: true });
      if (result.description) setValue("description", result.description, { shouldValidate: true });
      if (result.image) setValue("image", result.image, { shouldValidate: true });
    });
  }

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
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        <Field data-invalid={!!errors.title}>
          <FieldLabel htmlFor="title">{translations("title")}</FieldLabel>
          <Input id="title" type="text" aria-invalid={!!errors.title} {...register("title")} />
          <FieldError errors={[errors.title]} />
        </Field>

        <Field data-invalid={!!errors.description}>
          <FieldLabel htmlFor="description">{translations("description")}</FieldLabel>
          <Textarea id="description" rows={3} aria-invalid={!!errors.description} {...register("description")} />
          <FieldError errors={[errors.description]} />
        </Field>

        <Field data-invalid={!!errors.url}>
          <FieldLabel htmlFor="url">{translations("url")}</FieldLabel>
          <div className="flex gap-2">
            <Input id="url" type="text" className="flex-1" aria-invalid={!!errors.url} {...register("url")} />
            <Button
              type="button"
              variant="outline"
              disabled={isFetchingMetadata || !watch("url")}
              onClick={handleFetchMetadata}
            >
              {isFetchingMetadata ? translations("fetchMetadataPending") : translations("fetchMetadata")}
            </Button>
          </div>
          <FieldError errors={[errors.url]} />
          {fetchError && <FieldError>{translations("fetchMetadataError")}</FieldError>}
        </Field>

        <Field data-invalid={!!errors.image}>
          <FieldLabel htmlFor="image">{translations("image")}</FieldLabel>
          <Input id="image" type="text" aria-invalid={!!errors.image} {...register("image")} />
          <FieldError errors={[errors.image]} />
        </Field>

        <Field data-invalid={!!errors.tags}>
          <FieldLabel htmlFor="tags">{translations("tags")}</FieldLabel>
          <Input
            id="tags"
            type="text"
            placeholder={translations("tagsPlaceholder")}
            aria-invalid={!!errors.tags}
            {...register("tags")}
          />
          <FieldError errors={[errors.tags]} />
        </Field>

        {errors.root && <FieldError>{errors.root.message}</FieldError>}

        <div className="flex gap-3">
          <Button type="submit" disabled={isPending}>
            {isPending ? "…" : translations(`submit.${mode}`)}
          </Button>
          {onDone && (
            <Button type="button" variant="outline" onClick={onDone}>
              {translations("cancel")}
            </Button>
          )}
        </div>
      </FieldGroup>
    </form>
  );
}
