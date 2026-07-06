import { LayoutGrid } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { PageContainer } from "@/components/layout/pagecontainer";
import { ListCard } from "@/components/list/card";
import { Button } from "@/components/ui/button";
import { list } from "@/services/list";
import { user } from "@/services/user";

export default async function Home() {
  const translations = await getTranslations("Home");
  const actions = await getTranslations("actions");
  const viewer = await user.read().catch(() => null);
  const lists = await list.list().catch(() => []);
  const preview = lists.slice(0, 6);

  return (
    <>
      <section className="border-b bg-gradient-to-b from-primary/5 to-transparent">
        <PageContainer size="wide" className="flex flex-col items-center gap-6 py-20 text-center">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <LayoutGrid className="size-7" />
          </span>
          <h1 className="font-heading text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            {translations("title")}
          </h1>
          <p className="max-w-xl text-pretty text-lg text-muted-foreground">{translations("description")}</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" render={<Link href="/lists" />}>
              {translations("cta")}
            </Button>
            {!viewer && (
              <Button size="lg" variant="outline" render={<Link href="/signin" />}>
                {actions("signin")}
              </Button>
            )}
          </div>
        </PageContainer>
      </section>

      {preview.length > 0 && (
        <PageContainer size="wide">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="font-heading text-xl font-semibold">{translations("previewTitle")}</h2>
            <Link href="/lists" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              {translations("previewCta")}
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {preview.map((l) => (
              <ListCard key={l.id} list={l} isOwner={viewer?.id === l.userId} />
            ))}
          </div>
        </PageContainer>
      )}
    </>
  );
}
