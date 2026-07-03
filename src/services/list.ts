import { subject } from "@casl/ability";
import { ForbiddenError, NotFoundError } from "@/constants/errors";
import { Resource } from "@/constants/resources";
import { defineAbilityFor } from "@/lib/ability";
import { prisma } from "@/lib/prisma";
import type { List } from "../../generated/prisma/client";
import { user } from "./user";

const RESOURCE = Resource.List;

export interface ListData {
  title: string;
  description?: string;
  tags?: string[];
  icon?: string;
  cardTemplate?: string;
  requireApproval?: boolean;
}

export const list = {
  /** The current user's own lists. */
  async list(): Promise<List[]> {
    const current = await user.read();
    return prisma.list.findMany({ where: { userId: current.id }, orderBy: { createdAt: "desc" } });
  },

  /** Lists are public: no ownership check on read. */
  async read(id: string): Promise<List> {
    const found = await prisma.list.findUnique({ where: { id } });
    if (!found) throw new NotFoundError(RESOURCE);
    return found;
  },

  async create(data: ListData): Promise<List> {
    const current = await user.read();
    const ability = defineAbilityFor(current.id);
    if (ability.cannot("create", "List")) throw new ForbiddenError(RESOURCE);

    return prisma.list.create({
      data: {
        title: data.title,
        description: data.description || null,
        tags: data.tags ?? [],
        icon: data.icon || "list",
        cardTemplate: data.cardTemplate || null,
        requireApproval: data.requireApproval ?? false,
        userId: current.id,
      },
    });
  },

  async update(id: string, data: ListData): Promise<List> {
    const current = await user.read();
    const existing = await prisma.list.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError(RESOURCE);

    const ability = defineAbilityFor(current.id);
    if (ability.cannot("update", subject("List", existing))) throw new ForbiddenError(RESOURCE);

    return prisma.list.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description || null,
        tags: data.tags ?? [],
        icon: data.icon || "list",
        cardTemplate: data.cardTemplate || null,
        requireApproval: data.requireApproval ?? false,
      },
    });
  },

  async remove(id: string): Promise<List> {
    const current = await user.read();
    const existing = await prisma.list.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError(RESOURCE);

    const ability = defineAbilityFor(current.id);
    if (ability.cannot("delete", subject("List", existing))) throw new ForbiddenError(RESOURCE);

    return prisma.list.delete({ where: { id } });
  },
};
