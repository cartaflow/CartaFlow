import { z } from "zod";
import type { Card as PrismaCard } from "@prisma/client";

export interface Card extends PrismaCard {
  user?: {
    name: string | null;
  };
}

export const cardSchema = z.object({
  title: z.string().min(1, "titleRequired").max(200),
  description: z.string().max(10000).optional().or(z.literal("")),
  url: z.string().url("invalidUrl").optional().or(z.literal("")),
  image: z.string().url().optional().or(z.literal("")),
  tags: z.array(z.string()).max(20).optional(),
});

export type CardInput = z.infer<typeof cardSchema>;

export type CardSort = "newest" | "oldest" | "title";
