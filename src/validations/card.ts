import { z } from "zod";

export type CardSchemaMessages = {
  titleRequired: string;
  titleTooLong: string;
  descriptionTooLong: string;
  invalidUrl: string;
};

export function buildCardSchema(msgs: CardSchemaMessages) {
  return z.object({
    title: z.string().min(1, msgs.titleRequired).max(200, msgs.titleTooLong),
    description: z.string().max(10000, msgs.descriptionTooLong).optional().or(z.literal("")),
    url: z.string().url(msgs.invalidUrl).optional().or(z.literal("")),
    image: z.string().url(msgs.invalidUrl).optional().or(z.literal("")),
    tags: z.string().optional().or(z.literal("")),
  });
}

// Server-side schema (English — defense-in-depth, client validates first)
export const cardSchema = buildCardSchema({
  titleRequired: "Required",
  titleTooLong: "Title is too long",
  descriptionTooLong: "Description is too long",
  invalidUrl: "Invalid URL",
});

export type CardFormValues = z.infer<typeof cardSchema>;
