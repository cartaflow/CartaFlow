import { z } from "zod";

export type ProfileSchemaMessages = {
  bioTooLong: string;
  linkTypeRequired: string;
  invalidUrl: string;
};

export function buildProfileSchema(msgs: ProfileSchemaMessages) {
  return z.object({
    bio: z.string().max(2000, msgs.bioTooLong).optional().or(z.literal("")),
    socialLinks: z
      .array(
        z.object({
          type: z.string().min(1, msgs.linkTypeRequired),
          link: z.string().url(msgs.invalidUrl),
        }),
      )
      .max(20),
  });
}

// Server-side schema (English — defense-in-depth, client validates first)
export const profileSchema = buildProfileSchema({
  bioTooLong: "Bio is too long",
  linkTypeRequired: "Required",
  invalidUrl: "Invalid URL",
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
export type SocialLink = ProfileFormValues["socialLinks"][number];
