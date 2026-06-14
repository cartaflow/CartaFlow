import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Layers, ListPlus, Sparkles, FolderKanban, FileText, Share2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { auth } from "@/services/auth";
import { getLists } from "@/lib/actions/lists";
import ListCard from "@/components/lists/card";

export default async function Home() {
  const t = await getTranslations("home");
  const session = await auth();
  const user = session?.user ?? null;

  const lists = user ? await getLists() : [];
  const recentLists = lists.slice(0, 6);
  const totalCards = lists.reduce((sum, list) => sum + (list.cardsCount ?? 0), 0);

  return (
    <div className="container mx-auto px-4 py-12">
      <section className="hero-surface mb-14 rounded-2xl border bg-card p-8 md:p-16">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl border bg-background">
            <Layers className="h-7 w-7 text-primary" />
          </div>
          <h1 className="mb-4 text-balance text-4xl font-semibold tracking-tight md:text-6xl">
            {user ? t("welcomeBack", { name: user.name ?? "" }) : t("title")}
          </h1>
          <p className="mb-8 max-w-xl text-balance text-lg leading-relaxed text-muted-foreground">{t("subtitle")}</p>
          <div className="flex flex-wrap justify-center gap-4">
            {user ? (
              <Button asChild size="lg" >
                <Link href="/lists">
                  <FolderKanban className="h-5 w-5" />
                  {t("goToLists")}
                </Link>
              </Button>
            ) : (
              <Button asChild size="lg" >
                <Link href="/signin">
                  <ListPlus className="h-5 w-5" />
                  {t("signInToStart")}
                </Link>
              </Button>
            )}
            <Button asChild size="lg" variant="outline" >
              <Link href="/lists">
                <Sparkles className="h-5 w-5" />
                {t("exploreLists")}
              </Link>
            </Button>
          </div>

          {user && (
            <div className="mt-10 flex gap-8">
              <Stat value={lists.length} label={t("statLists")} />
              <div className="w-px bg-border" />
              <Stat value={totalCards} label={t("statCards")} />
            </div>
          )}
        </div>
      </section>

      {user && recentLists.length > 0 ? (
        <section className="mb-16">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">{t("recentLists")}</h2>
            <Button variant="ghost" asChild>
              <Link href="/lists">
                {t("viewAll")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recentLists.map((list) => (
              <ListCard key={list.id} list={list} />
            ))}
          </div>
        </section>
      ) : user ? (
        <section className="mb-16">
          <Card>
            <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
              <Layers className="h-12 w-12 text-muted-foreground/60" />
              <p className="text-lg font-medium">{t("emptyTitle")}</p>
              <p className="text-muted-foreground">{t("emptyDescription")}</p>
              <Button asChild className="mt-2">
                <Link href="/lists">
                  <ListPlus className="h-4 w-4" />
                  {t("createNewList")}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      ) : null}

      <section className="mb-8">
        <h2 className="mb-8 text-center text-2xl font-bold md:text-3xl">{t("featuresTitle")}</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <Feature icon={FolderKanban} title={t("feature1Title")} description={t("feature1Desc")} />
          <Feature icon={FileText} title={t("feature2Title")} description={t("feature2Desc")} />
          <Feature icon={Share2} title={t("feature3Title")} description={t("feature3Desc")} />
        </div>
      </section>
    </div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center">
      <p className="text-3xl font-bold text-primary">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

function Feature({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) {
  return (
    <Card className="transition-colors hover:border-primary/40">
      <CardContent className="space-y-3 p-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
