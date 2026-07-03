import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ErrorPage } from "@/components/error";
import { user } from "@/services/user";
import type { SocialLink } from "@/validations/user";

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const translations = await getTranslations("profile.page");

  const profile = await user.read(id).catch((e: Error) => e);
  if (profile instanceof Error) return <ErrorPage error={profile} />;

  const viewer = await user.read().catch(() => null);
  const isSelf = viewer?.id === profile.id;
  const socialLinks = (Array.isArray(profile.socialLinks) ? profile.socialLinks : []) as SocialLink[];

  return (
    <div className="container mx-auto px-6 py-12 max-w-2xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{profile.name}</h1>
          <p className="text-sm text-muted-foreground">@{profile.username}</p>
        </div>
        {isSelf && (
          <Link
            href={`/profile/${profile.id}/edit`}
            className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
          >
            {translations("edit")}
          </Link>
        )}
      </div>

      {profile.bio && <p className="text-muted-foreground mb-6 whitespace-pre-wrap">{profile.bio}</p>}

      {socialLinks.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {socialLinks.map((s) => (
            <a
              key={`${s.type}-${s.link}`}
              href={s.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm rounded-full border px-3 py-1 hover:bg-muted transition-colors"
            >
              {s.type}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
