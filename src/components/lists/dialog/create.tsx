"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { createList } from "@/lib/actions/lists";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createListSchema, type CreateListData } from "@/types/list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function CreateListDialog() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("lists");

  const form = useForm<CreateListData>({
    resolver: zodResolver(createListSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const onSubmit = async (data: CreateListData) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      if (data.description) {
        formData.append("description", data.description);
      }

      await createList(formData);

      setOpen(false);
      form.reset();
    } catch (error) {
      console.error("Failed to create list:", error);

      if (error instanceof Error) {
        form.setError("root", {
          type: "server",
          message: t("validation.serverError"),
        });
      }
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("createList")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">{t("fieldTitle")}</Label>
            <Input
              id="title"
              {...form.register("title")}
              placeholder={t("titlePlaceholder")}
              disabled={form.formState.isSubmitting}
            />
            {form.formState.errors.title && (
              <p className="text-sm text-red-500">
                {t("validation.titleRequired")}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t("fieldDescription")}</Label>
            <Textarea
              id="description"
              {...form.register("description")}
              placeholder={t("descriptionPlaceholder")}
              disabled={form.formState.isSubmitting}
              rows={3}
            />
          </div>

          {form.formState.errors.root && (
            <p className="text-sm text-red-500">
              {form.formState.errors.root.message}
            </p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={form.formState.isSubmitting}
            >
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
