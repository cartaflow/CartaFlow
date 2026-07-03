import NextAuth, { type Session } from "next-auth";
import { providers } from "@/constants/providers";

const decodeJWT = (token: string) => JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString());

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers,
  session: { strategy: "jwt" },
  pages: { signIn: "/signin", error: "/error" },
  callbacks: {
    authorized: async ({ auth }) => !!auth,

    jwt: async ({ token, account, user }) => {
      if (!account) return token;

      try {
        // Only true OIDC providers (Entra ID, Google, Apple, generic OIDC) issue an id_token;
        // plain OAuth2 providers (GitHub, GitLab, Facebook) don't, so idToken stays null for them.
        const idToken = account.id_token ? decodeJWT(account.id_token) : null;
        // providerAccountId is the one field every provider guarantees; namespaced to avoid
        // collisions between two providers that happen to reuse the same account id.
        const fallbackId = `${account.provider}:${account.providerAccountId}`;

        return {
          ...token,
          expires_at: account.expires_at as number,
          oid: idToken?.oid ?? fallbackId,
          tid: idToken?.tid,
          uniqueId: idToken?.uniqueid ?? fallbackId,
          email: idToken?.email ?? user?.email ?? token.email,
          picture: token.picture,
          groups: idToken?.groups ?? token.groups ?? [],
          name: idToken?.given_name ? `${idToken.given_name} ${idToken.family_name}` : (user?.name ?? token.name),
        };
      } catch (error) {
        console.error("Error processing tokens:", error);
        return { ...token, error: "TokenProcessingError" };
      }
    },

    session: async ({ session, token }): Promise<Session> => ({
      ...session,
      user: {
        email: token.email ?? session.user?.email,
        name: token.name,
        id: token.uniqueId,
        oid: token.oid,
        tid: token.tid,
        groups: token.groups ?? [],
      },
    }),
  },
});

export async function getUser() {
  const session = await auth();
  if (!session?.user) throw new Error("User not authenticated");
  return session.user;
}
