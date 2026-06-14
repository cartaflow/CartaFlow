"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/services/auth";
import { revalidatePath } from "next/cache";
import { listSchema, type ListInput } from "@/types/list";

async function requireUserId() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }
  return session.user.id;
}

export async function getLists() {
  const userId = await requireUserId();

  const lists = await prisma.list.findMany({
    where: { userId },
    include: {
      user: { select: { name: true } },
      _count: { select: { cards: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return lists.map(({ _count, ...list }) => ({
    ...list,
    cardsCount: _count.cards,
  }));
}

export async function getList(listId: string) {
  const userId = await requireUserId();

  const list = await prisma.list.findFirst({
    where: { id: listId, userId },
    include: {
      user: { select: { name: true } },
      _count: { select: { cards: true } },
    },
  });

  if (!list) return null;

  const { _count, ...rest } = list;
  return { ...rest, cardsCount: _count.cards };
}

export async function createList(input: ListInput) {
  const userId = await requireUserId();
  const data = listSchema.parse(input);

  const list = await prisma.list.create({
    data: {
      title: data.title,
      description: data.description || null,
      tags: data.tags ?? [],
      icon: data.icon || "list",
      cardTemplate: data.cardTemplate || null,
      requireApproval: data.requireApproval ?? false,
      userId,
    },
  });

  revalidatePath("/lists");
  return list.id;
}

export async function updateList(listId: string, input: ListInput) {
  const userId = await requireUserId();
  const data = listSchema.parse(input);

  const list = await prisma.list.findFirst({ where: { id: listId, userId } });
  if (!list) throw new Error("List not found");

  await prisma.list.update({
    where: { id: listId },
    data: {
      title: data.title,
      description: data.description || null,
      tags: data.tags ?? [],
      icon: data.icon || "list",
      cardTemplate: data.cardTemplate || null,
      requireApproval: data.requireApproval ?? false,
    },
  });

  revalidatePath("/lists");
  revalidatePath(`/lists/${listId}`);
}

export async function deleteList(listId: string) {
  const userId = await requireUserId();

  const list = await prisma.list.findFirst({ where: { id: listId, userId } });
  if (!list) throw new Error("List not found");

  await prisma.list.delete({ where: { id: listId } });

  revalidatePath("/lists");
}
