import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { CardsSection } from "@/components/card/section";
import { ErrorPage } from "@/components/error";
import { IconActionButton } from "@/components/icon";
import { PageContainer } from "@/components/layout/pagecontainer";
import { BackLink } from "@/components/layout/pageheader";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { card } from "@/services/card";
import { list } from "@/services/list";
import { user } from "@/services/user";
import { deleteList } from "../actions";

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
    <PageContainer size="wide" className="space-y-8">
      <div>
        <BackLink href="/lists">{translations("back")}</BackLink>

        <Card className="mt-4">
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h1 className="font-heading text-3xl font-bold tracking-tight text-balance">{current.title}</h1>
                {!current.public && <Badge variant="outline">{translations("private")}</Badge>}
              </div>
              {isOwner && (
                <div className="flex items-center gap-1">
                  <IconActionButton
                    icon={Pencil}
                    label={translations("edit")}
                    render={<Link href={`/lists/${current.id}/edit`} />}
                  />
                  <AlertDialog>
                    <AlertDialogTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="text-destructive"
                          aria-label={translations("delete")}
                        />
                      }
                    >
                      <Trash2 />
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>{translations("deleteConfirmTitle")}</AlertDialogTitle>
                        <AlertDialogDescription>
                          {translations("deleteConfirmDescription", { title: current.title })}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{translations("cancel")}</AlertDialogCancel>
                        <form action={deleteList.bind(null, current.id)} className="contents">
                          <AlertDialogAction type="submit" variant="destructive">
                            {translations("deleteConfirm")}
                          </AlertDialogAction>
                        </form>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
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
                {[...new Set(current.tags)].map((tag) => (
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
    </PageContainer>
  );
}
