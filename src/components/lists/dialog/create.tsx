"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { createList } from "@/lib/actions/lists";
import { useTranslations } from "next-intl";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createListSchema, type CreateListData } from "@/types/list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import IconSelector from "@/components/lists/detail/icon-selector";
import TagEditor from "@/components/lists/detail/tag-editor";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function CreateListDialog() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("lists");
  const router = useRouter();

  const form = useForm<CreateListData>({
    resolver: zodResolver(createListSchema),
    defaultValues: { title: "", description: "", icon: "list", tags: [] },
  });

  const onSubmit = async (data: CreateListData) => {
    try {
      const id = await createList(data);
      setOpen(false);
      form.reset();
      router.push(`/lists/${id}`);
    } catch {
      form.setError("root", { type: "server", message: t("validation.serverError") });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">
          <Plus className="h-4 w-4" />
          {t("newList")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("createList")}</DialogTitle>
          <DialogDescription>{t("createListDescription")}</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">{t("fieldTitle")}</Label>
            <Input id="title" {...form.register("title")} placeholder={t("titlePlaceholder")} disabled={form.formState.isSubmitting} autoFocus />
            {form.formState.errors.title && (
              <p className="text-sm text-destructive">{t("validation.titleRequired")}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t("fieldDescription")}</Label>
            <Textarea id="description" {...form.register("description")} placeholder={t("descriptionPlaceholder")} disabled={form.formState.isSubmitting} rows={3} />
          </div>

          <div className="space-y-2">
            <Label>{t("fieldTags")}</Label>
            <Controller control={form.control} name="tags" render={({ field }) => (
              <TagEditor tags={field.value ?? []} onTagsChange={field.onChange} placeholder={t("tagPlaceholder")} />
            )} />
          </div>

          <div className="space-y-2">
            <Label>{t("fieldIcon")}</Label>
            <Controller control={form.control} name="icon" render={({ field }) => (
              <IconSelector selectedIcon={field.value ?? "list"} onIconChange={field.onChange} />
            )} />
          </div>

          {form.formState.errors.root && (
            <p className="text-sm text-destructive">{form.formState.errors.root.message}</p>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={form.formState.isSubmitting}>
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? t("creating") : t("create")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
