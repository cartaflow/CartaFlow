import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { GitHubIcon, GoogleIcon, MicrosoftIcon } from "@/components/provider-icons";

export const PROVIDER_CONFIG = [
  {
    condition: () => process.env.AUTH_MICROSOFT_ENTRA_ID && process.env.AUTH_MICROSOFT_ENTRA_SECRET && process.env.AUTH_MICROSOFT_ENTRA_ISSUER,
    provider: () => MicrosoftEntraID({
      clientId: process.env.AUTH_MICROSOFT_ENTRA_ID!,
      clientSecret: process.env.AUTH_MICROSOFT_ENTRA_SECRET!,
      issuer: process.env.AUTH_MICROSOFT_ENTRA_ISSUER!,
      authorization: { params: { scope: "openid email profile" } },
    }),
    meta: { id: "microsoft-entra-id", name: process.env.AUTH_MICROSOFT_ENTRA_NAME || "Microsoft", icon: MicrosoftIcon },
  },
  {
    condition: () => process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET,
    provider: () => Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    meta: { id: "google", name: process.env.AUTH_GOOGLE_NAME || "Google", icon: GoogleIcon },
  },
  {
    condition: () => process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET,
    provider: () => GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),
    meta: { id: "github", name: process.env.AUTH_GITHUB_NAME || "GitHub", icon: GitHubIcon },
  },
];
