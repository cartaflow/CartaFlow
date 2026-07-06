import type { List as PrismaList } from "../../generated/prisma/client";

export interface ListData {
  title: string;
  description?: string;
  tags?: string[];
  icon?: string;
  cardTemplate?: string;
  requireApproval?: boolean;
  public?: boolean;
}

/** A list always has an owner. */
export interface List extends PrismaList {
  user: { id: string; name: string; username: string };
}
