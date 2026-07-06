import type { Card as PrismaCard } from "../../generated/prisma/client";

export interface CardData {
  title: string;
  description?: string;
  url?: string;
  image?: string;
  tags?: string[];
}

/** A card always has an author. */
export interface Card extends PrismaCard {
  user: { id: string; name: string };
}
