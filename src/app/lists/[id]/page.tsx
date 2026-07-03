import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ErrorPage } from "@/components/error";
import { list } from "@/services/list";

export default async function ListPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const translations = await getTranslations("list.page");

  const current = await list.read(id).catch((e: Error) => e);
  if (current instanceof Error) return <ErrorPage error={current} />;

  return (
    <div className="container mx-auto px-6 py-12 max-w-2xl">
      <div className="mb-8">
        <Link href="/lists" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          {translations("back")}
        </Link>
        <h1 className="text-3xl font-bold tracking-tight mt-4">{current.title}</h1>
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="px-6 py-5 grid gap-4">
          {current.description && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                {translations("columns.description")}
              </p>
              <p className="text-sm">{current.description}</p>
            </div>
          )}
          {current.tags.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                {translations("columns.tags")}
              </p>
              <p className="text-sm">{current.tags.join(", ")}</p>
            </div>
          )}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
              {translations("columns.requireApproval")}
            </p>
            <p className="text-sm">{current.requireApproval ? translations("yes") : translations("no")}</p>
          </div>
        </div>
        <div className="px-6 py-4 border-t flex gap-3">
          <Link
            href={`/lists/${current.id}/edit`}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/80 transition-colors"
          >
            {translations("edit")}
          </Link>
          <Link
            href="/lists"
            className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
          >
            {translations("backToList")}
          </Link>
        </div>
      </div>
    </div>
  );
}
