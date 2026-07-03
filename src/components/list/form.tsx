"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useMemo, useTransition } from "react";
import { useForm } from "react-hook-form";
import type { ActionResult } from "@/app/lists/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { buildListSchema, type ListFormValues } from "@/validations/list";

interface ListFormProps {
  defaultValues?: Partial<ListFormValues>;
  action: (data: ListFormValues) => Promise<ActionResult>;
  mode: "create" | "update";
}

export function ListForm({ defaultValues, action, mode }: ListFormProps) {
  const translations = useTranslations("list.form");

  const schema = useMemo(
    () =>
      buildListSchema({
        titleRequired: translations("validation.titleRequired"),
        titleTooLong: translations("validation.titleTooLong"),
        descriptionTooLong: translations("validation.descriptionTooLong"),
        templateTooLong: translations("validation.templateTooLong"),
      }),
    [translations],
  );

  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ListFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  function onSubmit(data: ListFormValues) {
    startTransition(async () => {
      const result = await action(data);
      if (result?.errors) {
        for (const [field, messages] of Object.entries(result.errors)) {
          if (field === "_form") {
            setError("root", { message: messages[0] });
          } else {
            setError(field as keyof ListFormValues, { message: messages[0] });
          }
        }
      }
    });
  }

  const inputClass = (hasError: boolean) =>
    cn(
      "w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary",
      hasError && "border-destructive focus:ring-destructive",
    );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">
          {translations("title")}
        </label>
        <input id="title" type="text" {...register("title")} className={inputClass(!!errors.title)} />
        {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          {translations("description")}
        </label>
        <textarea id="description" rows={3} {...register("description")} className={inputClass(!!errors.description)} />
        {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="tags" className="text-sm font-medium">
          {translations("tags")}
        </label>
        <input
          id="tags"
          type="text"
          placeholder={translations("tagsPlaceholder")}
          {...register("tags")}
          className={inputClass(!!errors.tags)}
        />
        {errors.tags && <p className="text-sm text-destructive">{errors.tags.message}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="icon" className="text-sm font-medium">
          {translations("icon")}
        </label>
        <input id="icon" type="text" {...register("icon")} className={inputClass(!!errors.icon)} />
        {errors.icon && <p className="text-sm text-destructive">{errors.icon.message}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="cardTemplate" className="text-sm font-medium">
          {translations("cardTemplate")}
        </label>
        <textarea
          id="cardTemplate"
          rows={3}
          {...register("cardTemplate")}
          className={inputClass(!!errors.cardTemplate)}
        />
        {errors.cardTemplate && <p className="text-sm text-destructive">{errors.cardTemplate.message}</p>}
      </div>

      <div className="flex items-center gap-2">
        <input id="requireApproval" type="checkbox" {...register("requireApproval")} className="h-4 w-4" />
        <label htmlFor="requireApproval" className="text-sm font-medium">
          {translations("requireApproval")}
        </label>
      </div>

      {errors.root && <p className="text-sm text-destructive">{errors.root.message}</p>}

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? "…" : translations(`submit.${mode}`)}
        </Button>
        <Link
          href="/lists"
          className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
        >
          {translations("cancel")}
        </Link>
      </div>
    </form>
  );
}
