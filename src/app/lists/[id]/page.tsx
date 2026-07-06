import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { CardsSection } from "@/components/card/section";
import { ErrorPage } from "@/components/error";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { card } from "@/services/card";
import { list } from "@/services/list";
import { user } from "@/services/user";

export default async function ListPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const translations = await getTranslations("list.page");

  const current = await list.read(id).catch((e: Error) => e);
  if (current instanceof Error) return <ErrorPage error={current} />;

  const cards = await card.list(id).catch((e: Error) => e);
  if (cards instanceof Error) return <ErrorPage error={cards} />;

  const viewer = await user.read().catch(() => null);
  const isOwner = viewer?.id === current.userId;

  return (
    <div className="container mx-auto px-6 py-12 max-w-4xl space-y-8">
      <div>
        <Link href="/lists" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          {translations("back")}
        </Link>

        <Card className="mt-4">
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold tracking-tight">{current.title}</h1>
                {!current.public && <Badge variant="outline">{translations("private")}</Badge>}
              </div>
              {isOwner && (
                <Button variant="outline" render={<Link href={`/lists/${current.id}/edit`} />}>
                  {translations("edit")}
                </Button>
              )}
            </div>
            <Link
              href={`/profile/${current.user.id}`}
              className="text-sm text-muted-foreground hover:underline mt-1 inline-block"
            >
              {translations("createdBy", { name: current.user.name })}
            </Link>
            {current.description && <p className="text-muted-foreground mt-2">{current.description}</p>}
            {current.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {current.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <CardsSection list={current} cards={cards} viewerId={viewer?.id} isSignedIn={!!viewer} canModerate={isOwner} />
    </div>
  );
}
