import { z } from "zod";
import type { List as PrismaList } from "@prisma/client";

export interface List extends PrismaList {
  user?: {
    name: string | null;
  };
  cardsCount?: number;
}

export const listSchema = z.object({
  title: z.string().min(1, "titleRequired").max(100),
  description: z.string().max(2000).optional().or(z.literal("")),
  tags: z.array(z.string()).max(20).optional(),
  icon: z.string().optional(),
  cardTemplate: z.string().max(2000).optional().or(z.literal("")),
  requireApproval: z.boolean().optional(),
});

// Kept as separate identifiers for clarity at call sites.
export const createListSchema = listSchema;
export const updateListSchema = listSchema;

export type ListInput = z.infer<typeof listSchema>;
export type CreateListData = ListInput;
export type UpdateListData = ListInput;
