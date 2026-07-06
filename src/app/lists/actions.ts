"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { list } from "@/services/list";
import type { ListData } from "@/types/list";
import { type ListFormValues, listSchema } from "@/validations/list";

export type ActionResult = { errors: Record<string, string[]> } | undefined;

function toListData(data: ListFormValues): ListData {
  return {
    title: data.title,
    description: data.description,
    tags: data.tags
      ? data.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      : [],
    icon: data.icon,
    cardTemplate: data.cardTemplate,
    requireApproval: data.requireApproval,
    public: data.public,
  };
}

export async function createList(data: ListFormValues): Promise<ActionResult> {
  const result = listSchema.safeParse(data);
  if (!result.success) {
    const { fieldErrors, formErrors } = z.flattenError(result.error);
    const errors = fieldErrors as Record<string, string[]>;
    if (formErrors.length) errors._form = formErrors;
    return { errors };
  }
  await list.create(toListData(result.data));
  redirect("/lists");
}

export async function updateList(id: string, data: ListFormValues): Promise<ActionResult> {
  const result = listSchema.safeParse(data);
  if (!result.success) {
    const { fieldErrors, formErrors } = z.flattenError(result.error);
    const errors = fieldErrors as Record<string, string[]>;
    if (formErrors.length) errors._form = formErrors;
    return { errors };
  }
  await list.update(id, toListData(result.data));
  redirect("/lists");
}

export async function deleteList(id: string) {
  await list.remove(id);
  revalidatePath("/lists");
}
