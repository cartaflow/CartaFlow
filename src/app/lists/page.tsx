import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ErrorPage } from "@/components/error";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { list } from "@/services/list";
import { user } from "@/services/user";
import { deleteList } from "./actions";

export default async function ListsPage() {
  const translations = await getTranslations("list.page");
  const lists = await list.list().catch((e: Error) => e);
  if (lists instanceof Error) return <ErrorPage error={lists} />;

  const viewer = await user.read().catch(() => null);

  return (
    <div className="container mx-auto px-6 py-12 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{translations("title")}</h1>
          <p className="text-muted-foreground mt-1">{translations("subtitle")}</p>
        </div>
        {viewer && <Button render={<Link href="/lists/new" />}>{translations("new")}</Button>}
      </div>

      {lists.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">{translations("empty")}</p>
            {viewer && (
              <Link href="/lists/new" className="mt-4 inline-block text-sm text-primary hover:underline">
                {translations("emptyCta")}
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{translations("columns.title")}</TableHead>
                <TableHead>{translations("columns.tags")}</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {lists.map((l) => {
                const isOwner = viewer?.id === l.userId;
                return (
                  <TableRow key={l.id}>
                    <TableCell className="font-medium">
                      <Link href={`/lists/${l.id}`} className="hover:underline">
                        {l.title}
                      </Link>
                      {!l.public && (
                        <Badge variant="outline" className="ml-2">
                          {translations("private")}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{l.tags.join(", ")}</TableCell>
                    <TableCell>
                      {isOwner && (
                        <div className="flex items-center justify-end gap-3">
                          <Link
                            href={`/lists/${l.id}/edit`}
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {translations("edit")}
                          </Link>
                          <form action={deleteList.bind(null, l.id)}>
                            <button
                              type="submit"
                              className="text-sm text-destructive hover:text-destructive/80 transition-colors"
                            >
                              {translations("delete")}
                            </button>
                          </form>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
