"use client";

import { ListIcon, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { List } from "@/types/list";
import Link from "next/link";
import { iconMap } from "@/lib/icons";

interface ListCardProps {
  list: List;
}

export default function ListCard({ list }: ListCardProps) {
  const t = useTranslations("lists");
  const Icon = iconMap[list.icon] || ListIcon;

  return (
    <Link href={`/lists/${list.id}`} className="group block h-full">
      <Card className="card-interactive flex h-full flex-col gap-0 overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="truncate text-xl group-hover:text-primary">{list.title}</CardTitle>
              <p className="truncate text-sm text-muted-foreground">
                {t("byAuthor", { author: list.user?.name || "" })}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex flex-1 flex-col gap-3 pt-2">
          {list.description && (
            <p className="line-clamp-2 text-sm text-muted-foreground">{list.description}</p>
          )}

          {list.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {list.tags.slice(0, 4).map((tag) => (
                <Badge key={tag} variant="secondary" className="rounded-full">{tag}</Badge>
              ))}
              {list.tags.length > 4 && (
                <Badge variant="outline" className="rounded-full">+{list.tags.length - 4}</Badge>
              )}
            </div>
          )}

          <div className="mt-auto flex items-center justify-between pt-2 text-sm text-muted-foreground">
            <span>{t("cardCount", { count: list.cardsCount || 0 })}</span>
            <span className="flex items-center gap-1 text-primary opacity-0 transition-opacity group-hover:opacity-100">
              {t("viewCollection")}
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
