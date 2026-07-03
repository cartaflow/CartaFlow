import { AbilityBuilder, createMongoAbility, type MongoAbility } from "@casl/ability";
import type { Subjects } from "@casl/prisma";
import type { Card, List } from "../../generated/prisma/client";

/** `listOwnerId` is denormalized onto the subject at check time so the list owner's override can be expressed as a plain condition. */
type CardSubject = Card & { listOwnerId?: string };

export type Actions = "create" | "read" | "update" | "delete";
export type AppSubjects = Subjects<{ List: List; Card: CardSubject }>;
export type AppAbility = MongoAbility<[Actions, AppSubjects]>;

/**
 * Lists are owned by a single user: anyone can create/read, only the owner can update/delete.
 * Cards can be updated/deleted by their author OR by the owner of the list they belong to.
 */
export function defineAbilityFor(userId: string): AppAbility {
  const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

  can("create", "List");
  can("read", "List");
  can(["update", "delete"], "List", { userId });

  can("create", "Card");
  can("read", "Card");
  can(["update", "delete"], "Card", { userId });
  can(["update", "delete"], "Card", { listOwnerId: userId });

  return build();
}
