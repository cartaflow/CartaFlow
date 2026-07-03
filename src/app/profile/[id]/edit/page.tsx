import { getTranslations } from "next-intl/server";
import { ErrorPage } from "@/components/error";
import { ProfileForm } from "@/components/profile/form";
import { ForbiddenError } from "@/constants/errors";
import { Resource } from "@/constants/resources";
import { user } from "@/services/user";
import type { SocialLink } from "@/validations/user";
import { updateProfile } from "../actions";

export default async function EditProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const translations = await getTranslations("profile.page");

  const profile = await user.read(id).catch((e: Error) => e);
  if (profile instanceof Error) return <ErrorPage error={profile} />;

  const viewer = await user.read().catch(() => null);
  if (viewer?.id !== profile.id) return <ErrorPage error={new ForbiddenError(Resource.User)} />;

  const socialLinks = (Array.isArray(profile.socialLinks) ? profile.socialLinks : []) as SocialLink[];

  return (
    <div className="container mx-auto px-6 py-12 max-w-lg">
      <h1 className="text-3xl font-bold tracking-tight mb-8">{translations("edit")}</h1>
      <ProfileForm defaultValues={{ bio: profile.bio ?? "", socialLinks }} action={updateProfile} />
    </div>
  );
}
