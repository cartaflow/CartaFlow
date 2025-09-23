import { z } from "zod";
import type { List as PrismaList } from "@prisma/client";

export interface List extends PrismaList {
  user?: {
    name: string | null;
  };
  cardsCount?: number;
}

export const createListSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  icon: z.string().optional(),
});

export const updateListSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  icon: z.string().optional(),
});

export type CreateListData = z.infer<typeof createListSchema>;
export type UpdateListData = z.infer<typeof updateListSchema>;
