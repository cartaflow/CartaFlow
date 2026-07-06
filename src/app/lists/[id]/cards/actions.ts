"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { fetchPageMetadata, type PageMetadata } from "@/lib/metadata";
import { card } from "@/services/card";
import { user } from "@/services/user";
import type { CardData } from "@/types/card";
import { type CardFormValues, cardSchema } from "@/validations/card";

export type ActionResult = { errors: Record<string, string[]> } | undefined;

function toCardData(data: CardFormValues): CardData {
  return {
    title: data.title,
    description: data.description,
    url: data.url,
    image: data.image,
    tags: data.tags
      ? data.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      : [],
  };
}

/** Best-effort link preview: returns null on any failure so the form can fall back to manual entry. */
export async function fetchCardMetadata(url: string): Promise<PageMetadata | null> {
  await user.read();

  const result = z.string().url().safeParse(url);
  if (!result.success) return null;

  try {
    return await fetchPageMetadata(result.data);
  } catch {
    return null;
  }
}

export async function createCard(listId: string, data: CardFormValues): Promise<ActionResult> {
  const result = cardSchema.safeParse(data);
  if (!result.success) {
    const { fieldErrors, formErrors } = z.flattenError(result.error);
    const errors = fieldErrors as Record<string, string[]>;
    if (formErrors.length) errors._form = formErrors;
    return { errors };
  }
  await card.create(listId, toCardData(result.data));
  revalidatePath(`/lists/${listId}`);
}

export async function updateCard(id: string, listId: string, data: CardFormValues): Promise<ActionResult> {
  const result = cardSchema.safeParse(data);
  if (!result.success) {
    const { fieldErrors, formErrors } = z.flattenError(result.error);
    const errors = fieldErrors as Record<string, string[]>;
    if (formErrors.length) errors._form = formErrors;
    return { errors };
  }
  await card.update(id, toCardData(result.data));
  revalidatePath(`/lists/${listId}`);
}

export async function deleteCard(id: string, listId: string) {
  await card.remove(id);
  revalidatePath(`/lists/${listId}`);
}

export async function duplicateCard(id: string, listId: string) {
  await card.duplicate(id);
  revalidatePath(`/lists/${listId}`);
}

export async function approveCard(id: string, listId: string) {
  await card.approve(id);
  revalidatePath(`/lists/${listId}`);
}

interface ImportedCard {
  title?: unknown;
  description?: unknown;
  url?: unknown;
  image?: unknown;
  tags?: unknown;
}

/** Best-effort bulk import: each entry goes through the same validation and approval rules as a manual create. */
export async function importCards(listId: string, entries: ImportedCard[]) {
  for (const entry of entries) {
    const result = cardSchema.safeParse({
      title: typeof entry.title === "string" ? entry.title : "",
      description: typeof entry.description === "string" ? entry.description : "",
      url: typeof entry.url === "string" ? entry.url : "",
      image: typeof entry.image === "string" ? entry.image : "",
      tags: Array.isArray(entry.tags) ? entry.tags.join(", ") : "",
    });
    if (result.success) await card.create(listId, toCardData(result.data));
  }
  revalidatePath(`/lists/${listId}`);
}
