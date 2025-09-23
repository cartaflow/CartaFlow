"use client";

import { ListIcon } from "lucide-react";
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
    <Link href={`/lists/${list.id}`}>
      <Card className="featured-card gap-0 hover:shadow-lg transition-shadow">
        <CardHeader className="pb-0">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 rounded-sm bg-primary/10 flex items-center justify-center">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{list.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {t("byAuthor", { author: list.user?.name || "" })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex justify-between">
          <div>
            {list.description && (
              <div className="mb-2">{list.description}</div>
            )}

            {list.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {list.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="rounded-full">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center justify-end">
              <span className="text-sm text-muted-foreground">
                {t("cardCount", { count: list.cardsCount || 0 })}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {t("created", { CreationDate: list.createdAt })}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
