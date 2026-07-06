"use client";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { deleteList } from "@/app/lists/actions";
import { IconActionButton } from "@/components/icon";
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
import { getListIcon } from "@/constants/icons";
import type { List } from "@/types/list";

interface ListCardProps {
  list: List;
  isOwner?: boolean;
}

export function ListCard({ list: item, isOwner }: ListCardProps) {
  const translations = useTranslations("list.page");
  const Icon = getListIcon(item.icon);
  const tags = [...new Set(item.tags)];

  return (
    <Card className="flex h-full flex-col transition-shadow duration-200 ease-out hover:shadow-md">
      <CardContent className="flex h-full flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/lists/${item.id}`} className="flex min-w-0 items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="size-5" />
            </span>
            <span className="min-w-0 truncate font-heading font-semibold hover:underline">{item.title}</span>
          </Link>
          {isOwner && (
            <div className="flex shrink-0 items-center gap-1">
              <IconActionButton
                icon={Pencil}
                label={translations("edit")}
                render={<Link href={`/lists/${item.id}/edit`} />}
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
                      {translations("deleteConfirmDescription", { title: item.title })}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{translations("cancel")}</AlertDialogCancel>
                    <form action={deleteList.bind(null, item.id)} className="contents">
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

        {!item.public && (
          <Badge variant="outline" className="w-fit">
            {translations("private")}
          </Badge>
        )}

        {item.description && <p className="line-clamp-2 text-sm text-muted-foreground">{item.description}</p>}

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.slice(0, 4).map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
            {tags.length > 4 && <Badge variant="secondary">+{tags.length - 4}</Badge>}
          </div>
        )}

        <p className="mt-auto pt-1 text-xs text-muted-foreground">
          {translations("createdBy", { name: item.user.name })}
        </p>
      </CardContent>
    </Card>
  );
}
