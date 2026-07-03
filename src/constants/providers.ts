import type { Provider } from "next-auth/providers";
import Apple from "next-auth/providers/apple";
import Facebook from "next-auth/providers/facebook";
import GitHub from "next-auth/providers/github";
import GitLab from "next-auth/providers/gitlab";
import Google from "next-auth/providers/google";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";

interface ProviderDefinition {
  /** Env vars that must all be set for this provider to be enabled. */
  vars: string[];
  config: () => Provider;
}

const providerDefinitions: ProviderDefinition[] = [
  {
    vars: ["AUTH_ENTRAID_ID", "AUTH_ENTRAID_SECRET", "AUTH_ENTRAID_ISSUER"],
    config: () =>
      MicrosoftEntraID({
        clientId: process.env.AUTH_ENTRAID_ID,
        clientSecret: process.env.AUTH_ENTRAID_SECRET,
        issuer: process.env.AUTH_ENTRAID_ISSUER,
        authorization: {
          params: {
            scope: `openid email profile`,
          },
        },
      }),
  },
  {
    vars: ["AUTH_GITHUB_ID", "AUTH_GITHUB_SECRET"],
    config: () =>
      GitHub({
        clientId: process.env.AUTH_GITHUB_ID,
        clientSecret: process.env.AUTH_GITHUB_SECRET,
      }),
  },
  {
    vars: ["AUTH_GOOGLE_ID", "AUTH_GOOGLE_SECRET"],
    config: () =>
      Google({
        clientId: process.env.AUTH_GOOGLE_ID,
        clientSecret: process.env.AUTH_GOOGLE_SECRET,
      }),
  },
  {
    vars: ["AUTH_APPLE_ID", "AUTH_APPLE_SECRET"],
    config: () =>
      Apple({
        clientId: process.env.AUTH_APPLE_ID,
        clientSecret: process.env.AUTH_APPLE_SECRET,
      }),
  },
  {
    vars: ["AUTH_FACEBOOK_ID", "AUTH_FACEBOOK_SECRET"],
    config: () =>
      Facebook({
        clientId: process.env.AUTH_FACEBOOK_ID,
        clientSecret: process.env.AUTH_FACEBOOK_SECRET,
      }),
  },
  {
    vars: ["AUTH_GITLAB_ID", "AUTH_GITLAB_SECRET"],
    config: () =>
      GitLab({
        clientId: process.env.AUTH_GITLAB_ID,
        clientSecret: process.env.AUTH_GITLAB_SECRET,
      }),
  },
  {
    vars: ["AUTH_OIDC_ID", "AUTH_OIDC_SECRET", "AUTH_OIDC_ISSUER"],
    config: () => ({
      id: "oidc",
      name: process.env.AUTH_OIDC_NAME ?? "OIDC",
      type: "oidc",
      issuer: process.env.AUTH_OIDC_ISSUER,
      clientId: process.env.AUTH_OIDC_ID,
      clientSecret: process.env.AUTH_OIDC_SECRET,
    }),
  },
];

/** Only providers whose full set of env vars is present get enabled. */
export const providers: Provider[] = providerDefinitions
  .filter((provider) => provider.vars.every((key) => process.env[key]))
  .map((provider) => provider.config());
