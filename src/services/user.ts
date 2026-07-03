import { UnauthenticatedError } from "@/constants/errors";
import { prisma } from "@/lib/prisma";
import { auth } from "@/services/auth";
import type { User } from "../../generated/prisma/client";

/** Resolve the Prisma User row for the signed-in session, creating it on first login. */
async function read(): Promise<User> {
  const session = await auth();
  if (!session?.user) throw new UnauthenticatedError();

  const { oid, email, name } = session.user;

  return prisma.user.upsert({
    where: { oid },
    update: { email, name },
    create: { oid, email, name, username: email.split("@")[0] },
  });
}

export const user = { read };
