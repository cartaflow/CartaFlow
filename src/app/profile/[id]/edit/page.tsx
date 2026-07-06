import { getTranslations } from "next-intl/server";
import { ErrorPage } from "@/components/error";
import { PageContainer } from "@/components/layout/pagecontainer";
import { PageHeader } from "@/components/layout/pageheader";
import { ProfileForm } from "@/components/profile/form";
import { Card, CardContent } from "@/components/ui/card";
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
    <PageContainer size="narrow">
      <PageHeader title={translations("edit")} backHref={`/profile/${profile.id}`} backLabel={translations("back")} />
      <Card>
        <CardContent>
          <ProfileForm defaultValues={{ bio: profile.bio ?? "", socialLinks }} action={updateProfile} />
        </CardContent>
      </Card>
    </PageContainer>
  );
}
