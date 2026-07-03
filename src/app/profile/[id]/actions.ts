"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { user } from "@/services/user";
import { type ProfileFormValues, profileSchema } from "@/validations/user";

export type ActionResult = { errors: Record<string, string[]> } | undefined;

/** Always updates the caller's own profile — the id in the route is only used to render the page. */
export async function updateProfile(data: ProfileFormValues): Promise<ActionResult> {
  const result = profileSchema.safeParse(data);
  if (!result.success) {
    const { fieldErrors, formErrors } = z.flattenError(result.error);
    const errors = fieldErrors as Record<string, string[]>;
    if (formErrors.length) errors._form = formErrors;
    return { errors };
  }
  const updated = await user.update(result.data);
  revalidatePath(`/profile/${updated.id}`);
}
