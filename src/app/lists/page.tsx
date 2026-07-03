import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ErrorPage } from "@/components/error";
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
        {viewer && (
          <Link
            href="/lists/new"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/80 transition-colors"
          >
            {translations("new")}
          </Link>
        )}
      </div>

      {lists.length === 0 ? (
        <div className="rounded-xl border bg-card p-12 text-center">
          <p className="text-muted-foreground">{translations("empty")}</p>
          {viewer && (
            <Link href="/lists/new" className="mt-4 inline-block text-sm text-primary hover:underline">
              {translations("emptyCta")}
            </Link>
          )}
        </div>
      ) : (
        <div className="rounded-xl border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground uppercase tracking-widest text-xs">
                  {translations("columns.title")}
                </th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground uppercase tracking-widest text-xs">
                  {translations("columns.tags")}
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {lists.map((l, i) => {
                const isOwner = viewer?.id === l.userId;
                return (
                  <tr key={l.id} className={i !== lists.length - 1 ? "border-b" : ""}>
                    <td className="px-4 py-3 font-medium">
                      <Link href={`/lists/${l.id}`} className="hover:underline">
                        {l.title}
                      </Link>
                      {!l.public && (
                        <span className="ml-2 text-xs rounded-full bg-muted px-2 py-0.5 text-muted-foreground">
                          {translations("private")}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{l.tags.join(", ")}</td>
                    <td className="px-4 py-3">
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
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
