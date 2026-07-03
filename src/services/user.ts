import { NotFoundError, UnauthenticatedError } from "@/constants/errors";
import { Resource } from "@/constants/resources";
import { prisma } from "@/lib/prisma";
import { auth } from "@/services/auth";
import type { SocialLink } from "@/validations/user";
import type { User } from "../../generated/prisma/client";

/** With no id: resolve/create the signed-in session's own row. With an id: public lookup of any user. */
async function read(id?: string): Promise<User> {
  if (id) {
    const found = await prisma.user.findUnique({ where: { id } });
    if (!found) throw new NotFoundError(Resource.User);
    return found;
  }

  const session = await auth();
  if (!session?.user) throw new UnauthenticatedError();

  const { oid, email, name } = session.user;
  if (!oid || !email) throw new UnauthenticatedError("missing oid or email claim");

  return prisma.user.upsert({
    where: { oid },
    update: { email, name },
    create: { oid, email, name, username: email.split("@")[0] },
  });
}

/** Always updates the signed-in user's own profile — there is no "edit someone else" path. */
async function update(data: { bio?: string; socialLinks: SocialLink[] }): Promise<User> {
  const current = await read();
  return prisma.user.update({
    where: { id: current.id },
    data: { bio: data.bio || null, socialLinks: data.socialLinks },
  });
}

export const user = { read, update };
