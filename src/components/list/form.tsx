"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useMemo, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import type { ActionResult } from "@/app/lists/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel, FieldTitle } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
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
    control,
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

            <Field data-invalid={!!errors.icon}>
              <FieldLabel htmlFor="icon">{translations("icon")}</FieldLabel>
              <Input id="icon" type="text" aria-invalid={!!errors.icon} {...register("icon")} />
              <FieldError errors={[errors.icon]} />
            </Field>

            <Field data-invalid={!!errors.cardTemplate}>
              <FieldLabel htmlFor="cardTemplate">{translations("cardTemplate")}</FieldLabel>
              <Textarea id="cardTemplate" rows={3} aria-invalid={!!errors.cardTemplate} {...register("cardTemplate")} />
              <FieldError errors={[errors.cardTemplate]} />
            </Field>

            <FieldLabel htmlFor="public">
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>{translations("public")}</FieldTitle>
                </FieldContent>
                <Controller
                  control={control}
                  name="public"
                  render={({ field }) => <Switch id="public" checked={field.value} onCheckedChange={field.onChange} />}
                />
              </Field>
            </FieldLabel>

            <FieldLabel htmlFor="requireApproval">
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>{translations("requireApproval")}</FieldTitle>
                </FieldContent>
                <Controller
                  control={control}
                  name="requireApproval"
                  render={({ field }) => (
                    <Switch id="requireApproval" checked={field.value} onCheckedChange={field.onChange} />
                  )}
                />
              </Field>
            </FieldLabel>

            {errors.root && <FieldError>{errors.root.message}</FieldError>}

            <div className="flex gap-3">
              <Button type="submit" disabled={isPending}>
                {isPending ? "…" : translations(`submit.${mode}`)}
              </Button>
              <Button variant="outline" render={<Link href="/lists" />}>
                {translations("cancel")}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
