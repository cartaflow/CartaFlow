import { z } from "zod";

export type ListSchemaMessages = {
  titleRequired: string;
  titleTooLong: string;
  descriptionTooLong: string;
  templateTooLong: string;
};

export function buildListSchema(msgs: ListSchemaMessages) {
  return z.object({
    title: z.string().min(1, msgs.titleRequired).max(100, msgs.titleTooLong),
    description: z.string().max(2000, msgs.descriptionTooLong).optional().or(z.literal("")),
    tags: z.string().optional().or(z.literal("")),
    icon: z.string().optional(),
    cardTemplate: z.string().max(2000, msgs.templateTooLong).optional().or(z.literal("")),
    requireApproval: z.boolean().optional(),
  });
}

// Server-side schema (English — defense-in-depth, client validates first)
export const listSchema = buildListSchema({
  titleRequired: "Required",
  titleTooLong: "Title is too long",
  descriptionTooLong: "Description is too long",
  templateTooLong: "Template is too long",
});

export type ListFormValues = z.infer<typeof listSchema>;
