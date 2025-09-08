import { List as ListIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { getLists } from "@/lib/actions/lists";
import { getTranslations } from "next-intl/server";
import ListCard from "@/components/lists/card";
import CreateListDialog from "@/components/lists/dialog/create";

export default async function ListsPage() {
  const lists = await getLists();
  const t = await getTranslations("lists");

  return (
    <div className="container mx-auto space-y-6 p-2 pt-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-3">
              <ListIcon className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
            </div>
            <p className="text-muted-foreground text-lg">
              {t("description")}
            </p>
          </div>
          <CreateListDialog />
        </div>
      </div>

      {lists.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-3">
              <ListIcon className="h-12 w-12 text-muted-foreground mx-auto" />
              <p className="text-muted-foreground">{t("noLists")}</p>
              <Link href="/lists/new">
                <Button className="cursor-pointer">
                  <Plus className="h-4 w-4" />
                  {t("createFirst")}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {lists.map((list) => (
            <ListCard key={list.id} list={list} />
          ))}
        </div>
      )}

    </div>
  );
}
