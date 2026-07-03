"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useTransition } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import type { ActionResult } from "@/app/profile/[id]/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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

  const inputClass = (hasError: boolean) =>
    cn(
      "w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary",
      hasError && "border-destructive focus:ring-destructive",
    );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="bio" className="text-sm font-medium">
          {translations("bio")}
        </label>
        <textarea id="bio" rows={4} {...register("bio")} className={inputClass(!!errors.bio)} />
        {errors.bio && <p className="text-sm text-destructive">{errors.bio.message}</p>}
      </div>

      <div className="space-y-2">
        <span className="text-sm font-medium">{translations("socialLinks")}</span>
        <div className="space-y-2">
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <input
                type="text"
                placeholder={translations("linkType")}
                {...register(`socialLinks.${index}.type`)}
                className={cn(inputClass(!!errors.socialLinks?.[index]?.type), "w-32")}
              />
              <input
                type="text"
                placeholder={translations("linkUrl")}
                {...register(`socialLinks.${index}.link`)}
                className={inputClass(!!errors.socialLinks?.[index]?.link)}
              />
              <Button type="button" variant="outline" size="icon" onClick={() => remove(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <Button type="button" variant="outline" onClick={() => append({ type: "", link: "" })}>
          <Plus className="h-4 w-4" />
          {translations("addLink")}
        </Button>
      </div>

      {errors.root && <p className="text-sm text-destructive">{errors.root.message}</p>}

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? "…" : translations("save")}
        </Button>
      </div>
    </form>
  );
}
