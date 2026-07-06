"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useMemo, useTransition } from "react";
import { useForm } from "react-hook-form";
import type { ActionResult } from "@/app/lists/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

          <div className="space-y-2">
            <label htmlFor="icon" className="text-sm font-medium">
              {translations("icon")}
            </label>
            <Input id="icon" type="text" aria-invalid={!!errors.icon} {...register("icon")} />
            {errors.icon && <p className="text-sm text-destructive">{errors.icon.message}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="cardTemplate" className="text-sm font-medium">
              {translations("cardTemplate")}
            </label>
            <Textarea id="cardTemplate" rows={3} aria-invalid={!!errors.cardTemplate} {...register("cardTemplate")} />
            {errors.cardTemplate && <p className="text-sm text-destructive">{errors.cardTemplate.message}</p>}
          </div>

          <div className="flex items-center gap-2">
            <input id="public" type="checkbox" {...register("public")} className="h-4 w-4" />
            <label htmlFor="public" className="text-sm font-medium">
              {translations("public")}
            </label>
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
            <Button variant="outline" render={<Link href="/lists" />}>
              {translations("cancel")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
