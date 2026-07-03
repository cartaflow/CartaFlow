import { subject } from "@casl/ability";
import { ForbiddenError, NotFoundError } from "@/constants/errors";
import { Resource } from "@/constants/resources";
import { defineAbilityFor } from "@/lib/ability";
import { prisma } from "@/lib/prisma";
import type { Card, CardStatus } from "../../generated/prisma/client";
import { user } from "./user";

const RESOURCE = Resource.Card;

export interface CardData {
  title: string;
  description?: string;
  url?: string;
  image?: string;
  tags?: string[];
}

function nextStatus(isListOwner: boolean, requireApproval: boolean): CardStatus {
  return isListOwner || !requireApproval ? "PUBLISHED" : "PENDING";
}

export const card = {
  /** Published cards are visible to everyone; pending cards only to their author and the list owner. */
  async list(listId: string): Promise<Card[]> {
    const list = await prisma.list.findUnique({ where: { id: listId } });
    if (!list) throw new NotFoundError(Resource.List);

    const current = await user.read().catch(() => null);
    if (current && current.id === list.userId) {
      return prisma.card.findMany({ where: { listId }, orderBy: { createdAt: "desc" } });
    }

    return prisma.card.findMany({
      where: {
        listId,
        OR: [{ status: "PUBLISHED" }, ...(current ? [{ status: "PENDING" as const, userId: current.id }] : [])],
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async read(id: string): Promise<Card> {
    const found = await prisma.card.findUnique({ where: { id } });
    if (!found) throw new NotFoundError(RESOURCE);
    return found;
  },

  async create(listId: string, data: CardData): Promise<Card> {
    const current = await user.read();
    const ability = defineAbilityFor(current.id);
    if (ability.cannot("create", "Card")) throw new ForbiddenError(RESOURCE);

    const list = await prisma.list.findUnique({ where: { id: listId } });
    if (!list) throw new NotFoundError(Resource.List);

    return prisma.card.create({
      data: {
        title: data.title,
        description: data.description || null,
        url: data.url || null,
        image: data.image || null,
        tags: data.tags ?? [],
        status: nextStatus(list.userId === current.id, list.requireApproval),
        listId,
        userId: current.id,
      },
    });
  },

  async update(id: string, data: CardData): Promise<Card> {
    const current = await user.read();
    const existing = await prisma.card.findUnique({ where: { id }, include: { list: true } });
    if (!existing) throw new NotFoundError(RESOURCE);

    const ability = defineAbilityFor(current.id);
    if (ability.cannot("update", subject("Card", { ...existing, listOwnerId: existing.list.userId })))
      throw new ForbiddenError(RESOURCE);

    return prisma.card.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description || null,
        url: data.url || null,
        image: data.image || null,
        tags: data.tags ?? [],
        status: nextStatus(existing.list.userId === current.id, existing.list.requireApproval),
      },
    });
  },

  async remove(id: string): Promise<Card> {
    const current = await user.read();
    const existing = await prisma.card.findUnique({ where: { id }, include: { list: true } });
    if (!existing) throw new NotFoundError(RESOURCE);

    const ability = defineAbilityFor(current.id);
    if (ability.cannot("delete", subject("Card", { ...existing, listOwnerId: existing.list.userId })))
      throw new ForbiddenError(RESOURCE);

    return prisma.card.delete({ where: { id } });
  },

  /** Restricted to whoever can already edit the card (author or list owner). */
  async duplicate(id: string): Promise<Card> {
    const current = await user.read();
    const existing = await prisma.card.findUnique({ where: { id }, include: { list: true } });
    if (!existing) throw new NotFoundError(RESOURCE);

    const ability = defineAbilityFor(current.id);
    if (ability.cannot("update", subject("Card", { ...existing, listOwnerId: existing.list.userId })))
      throw new ForbiddenError(RESOURCE);

    return prisma.card.create({
      data: {
        title: `${existing.title} (copy)`,
        description: existing.description,
        url: existing.url,
        image: existing.image,
        tags: existing.tags,
        status: nextStatus(existing.list.userId === current.id, existing.list.requireApproval),
        listId: existing.listId,
        userId: current.id,
      },
    });
  },

  /** List-owner-only: publish a pending card. */
  async approve(id: string): Promise<Card> {
    const current = await user.read();
    const existing = await prisma.card.findUnique({ where: { id }, include: { list: true } });
    if (!existing) throw new NotFoundError(RESOURCE);
    if (existing.list.userId !== current.id) throw new ForbiddenError(RESOURCE);

    return prisma.card.update({ where: { id }, data: { status: "PUBLISHED" } });
  },
};
