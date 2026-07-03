import NextAuth, { type Session } from "next-auth";
import { providers } from "@/constants/providers";

const decodeJWT = (token: string) => JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString());

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers,
  session: { strategy: "jwt" },
  pages: { signIn: "/signin", error: "/error" },
  callbacks: {
    authorized: async ({ auth }) => !!auth,

    jwt: async ({ token, account }) => {
      try {
        if (account?.access_token && account?.id_token) {
          const accessToken = decodeJWT(account.access_token);
          const idToken = decodeJWT(account.id_token);

          return {
            ...token,
            expires_at: account.expires_at as number,
            oid: idToken.oid,
            tid: accessToken.tid,
            email: idToken.email,
            picture: token.picture,
            uniqueId: idToken.uniqueid,
            groups: idToken.groups || [],
            name: `${idToken.given_name} ${idToken.family_name}`,
          };
        }

        return token;
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
