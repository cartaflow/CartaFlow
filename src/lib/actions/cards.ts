"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/services/auth";
import { revalidatePath } from "next/cache";
import { cardSchema, type CardInput } from "@/types/card";

async function requireUserId() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }
  return session.user.id;
}

async function requireOwnedList(listId: string, userId: string) {
  const list = await prisma.list.findFirst({ where: { id: listId, userId } });
  if (!list) throw new Error("List not found");
  return list;
}

async function requireOwnedCard(cardId: string, userId: string) {
  const card = await prisma.card.findFirst({
    where: { id: cardId, list: { userId } },
  });
  if (!card) throw new Error("Card not found");
  return card;
}

export async function getCards(listId: string) {
  const userId = await requireUserId();
  await requireOwnedList(listId, userId);

  return prisma.card.findMany({
    where: { listId },
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function createCard(listId: string, input: CardInput) {
  const userId = await requireUserId();
  await requireOwnedList(listId, userId);
  const data = cardSchema.parse(input);

  await prisma.card.create({
    data: {
      title: data.title,
      description: data.description || null,
      url: data.url || null,
      image: data.image || null,
      tags: data.tags ?? [],
      listId,
      userId,
    },
  });

  revalidatePath(`/lists/${listId}`);
}

export async function updateCard(cardId: string, input: CardInput) {
  const userId = await requireUserId();
  const card = await requireOwnedCard(cardId, userId);
  const data = cardSchema.parse(input);

  await prisma.card.update({
    where: { id: cardId },
    data: {
      title: data.title,
      description: data.description || null,
      url: data.url || null,
      image: data.image || null,
      tags: data.tags ?? [],
    },
  });

  revalidatePath(`/lists/${card.listId}`);
}

export async function duplicateCard(cardId: string) {
  const userId = await requireUserId();
  const card = await requireOwnedCard(cardId, userId);

  await prisma.card.create({
    data: {
      title: `${card.title} (copy)`,
      description: card.description,
      url: card.url,
      image: card.image,
      tags: card.tags,
      listId: card.listId,
      userId,
    },
  });

  revalidatePath(`/lists/${card.listId}`);
}

export async function deleteCard(cardId: string) {
  const userId = await requireUserId();
  const card = await requireOwnedCard(cardId, userId);

  await prisma.card.delete({ where: { id: cardId } });

  revalidatePath(`/lists/${card.listId}`);
}
