import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { CardsSection } from "@/components/card/section";
import { ErrorPage } from "@/components/error";
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
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">{current.title}</h1>
            {!current.public && (
              <span className="text-xs rounded-full bg-muted px-2 py-0.5 text-muted-foreground">
                {translations("private")}
              </span>
            )}
          </div>
          {isOwner && (
            <Link
              href={`/lists/${current.id}/edit`}
              className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
            >
              {translations("edit")}
            </Link>
          )}
        </div>
        <Link
          href={`/profile/${current.user.id}`}
          className="text-sm text-muted-foreground hover:underline mt-1 inline-block"
        >
          {translations("createdBy", { name: current.user.name })}
        </Link>
        {current.description && <p className="text-muted-foreground mt-2">{current.description}</p>}
        {current.tags.length > 0 && <p className="text-sm text-muted-foreground mt-1">{current.tags.join(", ")}</p>}
      </div>

      <CardsSection
        listId={current.id}
        listTitle={current.title}
        cards={cards}
        viewerId={viewer?.id}
        isSignedIn={!!viewer}
        canModerate={isOwner}
        cardTemplate={current.cardTemplate}
      />
    </div>
  );
}
