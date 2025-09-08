import { z } from "zod";

export interface List {
  id: string;
  title: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export const createListSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().optional(),
});

export type CreateListData = z.infer<typeof createListSchema>;
