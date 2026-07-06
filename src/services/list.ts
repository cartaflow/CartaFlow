import { subject } from "@casl/ability";
import { ForbiddenError, NotFoundError } from "@/constants/errors";
import { Resource } from "@/constants/resources";
import { defineAbilityFor } from "@/lib/ability";
import { prisma } from "@/lib/prisma";
import type { List, ListData } from "@/types/list";
import { user } from "./user";

const RESOURCE = Resource.List;
const withAuthor = { user: { select: { id: true, name: true, username: true } } } as const;

export const list = {
  /** Public lists are visible to everyone; private ones only show up for their owner. */
  async list(): Promise<List[]> {
    const current = await user.read().catch(() => null);
    return prisma.list.findMany({
      where: current ? { OR: [{ public: true }, { userId: current.id }] } : { public: true },
      include: withAuthor,
      orderBy: { createdAt: "desc" },
    });
  },

  async read(id: string): Promise<List> {
    const found = await prisma.list.findUnique({ where: { id }, include: withAuthor });
    if (!found) throw new NotFoundError(RESOURCE);

    if (!found.public) {
      const current = await user.read().catch(() => null);
      if (current?.id !== found.userId) throw new ForbiddenError(RESOURCE);
    }

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
        public: data.public ?? true,
        userId: current.id,
      },
      include: withAuthor,
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
        public: data.public ?? true,
      },
      include: withAuthor,
    });
  },

  async remove(id: string): Promise<List> {
    const current = await user.read();
    const existing = await prisma.list.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError(RESOURCE);

    const ability = defineAbilityFor(current.id);
    if (ability.cannot("delete", subject("List", existing))) throw new ForbiddenError(RESOURCE);

    return prisma.list.delete({ where: { id }, include: withAuthor });
  },
};
