import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ErrorPage } from "@/components/error";
import { PageContainer } from "@/components/layout/pagecontainer";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { badgeVariants } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { user } from "@/services/user";
import type { SocialLink } from "@/validations/user";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const translations = await getTranslations("profile.page");

  const profile = await user.read(id).catch((e: Error) => e);
  if (profile instanceof Error) return <ErrorPage error={profile} />;

  const viewer = await user.read().catch(() => null);
  const isSelf = viewer?.id === profile.id;
  const socialLinks = (Array.isArray(profile.socialLinks) ? profile.socialLinks : []) as SocialLink[];

  return (
    <PageContainer>
      <Card>
        <CardContent>
          <div className="mb-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar size="lg">
                <AvatarFallback>{initials(profile.name)}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="font-heading text-2xl font-bold tracking-tight">{profile.name}</h1>
                <p className="text-sm text-muted-foreground">@{profile.username}</p>
              </div>
            </div>
            {isSelf && (
              <Button variant="outline" render={<Link href={`/profile/${profile.id}/edit`} />}>
                {translations("edit")}
              </Button>
            )}
          </div>

          {profile.bio && <p className="text-muted-foreground mb-6 whitespace-pre-wrap">{profile.bio}</p>}

          {socialLinks.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {socialLinks.map((s) => (
                <a
                  key={`${s.type}-${s.link}`}
                  href={s.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(badgeVariants({ variant: "outline" }))}
                >
                  {s.type}
                </a>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </PageContainer>
  );
}
