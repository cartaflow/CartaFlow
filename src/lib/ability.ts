import { AbilityBuilder, createMongoAbility, type MongoAbility } from "@casl/ability";
import type { Subjects } from "@casl/prisma";
import type { List } from "../../generated/prisma/client";

export type Actions = "create" | "read" | "update" | "delete";
export type AppSubjects = Subjects<{ List: List }>;
export type AppAbility = MongoAbility<[Actions, AppSubjects]>;

/** Lists are owned by a single user: anyone can create/read, only the owner can update/delete. */
export function defineAbilityFor(userId: string): AppAbility {
  const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

  can("create", "List");
  can("read", "List");
  can(["update", "delete"], "List", { userId });

  return build();
}
