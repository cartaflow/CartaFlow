"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useTransition } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import type { ActionResult } from "@/app/profile/[id]/actions";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { buildProfileSchema, type ProfileFormValues } from "@/validations/user";

interface ProfileFormProps {
  defaultValues?: Partial<ProfileFormValues>;
  action: (data: ProfileFormValues) => Promise<ActionResult>;
}

export function ProfileForm({ defaultValues, action }: ProfileFormProps) {
  const translations = useTranslations("profile.form");

  const schema = useMemo(
    () =>
      buildProfileSchema({
        bioTooLong: translations("validation.bioTooLong"),
        linkTypeRequired: translations("validation.linkTypeRequired"),
        invalidUrl: translations("validation.invalidUrl"),
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
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { bio: "", socialLinks: [], ...defaultValues },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "socialLinks" });

  function onSubmit(data: ProfileFormValues) {
    startTransition(async () => {
      const result = await action(data);
      if (result?.errors) {
        const message = result.errors._form?.[0] ?? Object.values(result.errors)[0]?.[0];
        if (message) setError("root", { message });
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        <Field data-invalid={!!errors.bio}>
          <FieldLabel htmlFor="bio">{translations("bio")}</FieldLabel>
          <Textarea id="bio" rows={4} aria-invalid={!!errors.bio} {...register("bio")} />
          <FieldError errors={[errors.bio]} />
        </Field>

        <FieldSet>
          <FieldLegend variant="label">{translations("socialLinks")}</FieldLegend>
          <div className="space-y-2">
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <Input
                  type="text"
                  placeholder={translations("linkType")}
                  aria-invalid={!!errors.socialLinks?.[index]?.type}
                  className="w-32"
                  {...register(`socialLinks.${index}.type`)}
                />
                <Input
                  type="text"
                  placeholder={translations("linkUrl")}
                  aria-invalid={!!errors.socialLinks?.[index]?.link}
                  {...register(`socialLinks.${index}.link`)}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label={translations("removeLink")}
                  onClick={() => remove(index)}
                >
                  <Trash2 />
                </Button>
              </div>
            ))}
          </div>
          <Button type="button" variant="outline" onClick={() => append({ type: "", link: "" })}>
            <Plus data-icon="inline-start" />
            {translations("addLink")}
          </Button>
        </FieldSet>

        {errors.root && <FieldError>{errors.root.message}</FieldError>}

        <div className="flex gap-3">
          <Button type="submit" disabled={isPending}>
            {isPending ? "…" : translations("save")}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
