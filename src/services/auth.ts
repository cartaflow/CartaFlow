import { PROVIDER_CONFIG } from "@/constants/provider";
import NextAuth, { User } from "next-auth";
import { TrackingPrismaAdapter } from "@/lib/auth-adapter";
import { prisma } from "@/lib/prisma";
import { ClientSession } from "@/types/auth";

const providers = PROVIDER_CONFIG
  .filter(config => config.condition())
  .map(config => config.provider());

export const authOptions = {
  adapter: TrackingPrismaAdapter(),
  providers,
  session: { strategy: "database" as const },
  pages: { signIn: "/signin" },
  secret: process.env.AUTH_SECRET,
};

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions);

export async function getUser(): Promise<User> {
  const session = await auth();
  if (!session?.user) throw new Error("User not authenticated");
  return session.user;
}

export function getAvailableProviders() {
  return PROVIDER_CONFIG
    .filter(config => config.condition())
    .map(config => config.meta);
}

export async function getSessions(): Promise<ClientSession[]> {
  const user = await getUser();

  const sessions = await prisma.session.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  if (!sessions) throw new Error("No sessions found for user");
  return sessions.map((session): ClientSession => ({
    token: session.sessionToken,
    ipAddress: session.ipAddress,
    device: session.device,
    browser: session.browser,
    os: session.os,
    updatedAt: session.updatedAt,
  }));
}
