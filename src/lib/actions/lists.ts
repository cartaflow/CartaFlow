"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/services/auth";
import { revalidatePath } from "next/cache";
import { createListSchema } from "@/types/list";

export async function getLists() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("User not authenticated");
  }

  return prisma.list.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function createList(formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("User not authenticated");
  }

  const rawData = {
    title: formData.get("title") as string,
    description: (formData.get("description") as string | null) || undefined,
  };

  const validatedData = createListSchema.parse(rawData);

  await prisma.list.create({
    data: {
      title: validatedData.title,
      description: validatedData.description || null,
      userId: session.user.id as string,
    },
  });

  revalidatePath("/lists");
  return;
}

export async function deleteList(listId: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("User not authenticated");
  }

  const list = await prisma.list.findUnique({
    where: {
      id: listId,
      userId: session.user.id,
    },
  });

  if (!list) {
    throw new Error("List not found");
  }

  await prisma.list.delete({
    where: { id: listId, userId: session.user.id },
  });

  revalidatePath("/lists");
}

export async function updateList(listId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("User not authenticated");
  }

  const rawData = {
    title: formData.get("title") as string,
    description: (formData.get("description") as string | null) || undefined,
  };

  const validatedData = createListSchema.parse(rawData);

  const list = await prisma.list.findUnique({
    where: {
      id: listId,
      userId: session.user.id,
    },
  });

  if (!list) {
    throw new Error("List not found");
  }

  await prisma.list.update({
    where: { id: listId, userId: session.user.id },
    data: {
      title: validatedData.title,
      description: validatedData.description || null,
    },
  });

  revalidatePath("/lists");
}
