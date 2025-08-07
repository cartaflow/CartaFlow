import { PROVIDER_CONFIG } from "@/app/constants/provider";
import NextAuth, { User } from "next-auth";

const providers = PROVIDER_CONFIG
  .filter(config => config.condition())
  .map(config => config.provider());

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers,
  session: { strategy: "jwt" },
  pages: { signIn: "/signin" },
  secret: process.env.AUTH_SECRET,
});

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
