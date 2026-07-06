"use client";
import { Check, Copy, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { approveCard, deleteCard, duplicateCard, updateCard } from "@/app/lists/[id]/cards/actions";
import { CardForm } from "@/components/card/form";
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
import type { Card as CardModel } from "@/types/card";

interface CardItemProps {
  card: CardModel;
  listId: string;
  listOwnerId: string;
  canEdit: boolean;
  canModerate: boolean;
}

export function CardItem({ card, listId, listOwnerId, canEdit, canModerate }: CardItemProps) {
  const translations = useTranslations("card.item");
  const [isEditing, setIsEditing] = useState(false);
  const [imageError, setImageError] = useState(false);

  if (isEditing) {
    return (
      <Card>
        <CardContent>
          <CardForm
            mode="update"
            defaultValues={{
              title: card.title,
              description: card.description ?? "",
              url: card.url ?? "",
              image: card.image ?? "",
              tags: card.tags.join(", "),
            }}
            action={(data) => updateCard(card.id, listId, data)}
            onDone={() => setIsEditing(false)}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex h-full flex-col transition-shadow duration-200 ease-out hover:shadow-md">
      <CardContent className="flex h-full flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            {card.image && !imageError && (
              // biome-ignore lint/performance/noImgElement: image domains are arbitrary, user-submitted URLs
              <img
                src={card.image}
                alt=""
                loading="lazy"
                onError={() => setImageError(true)}
                className="size-8 shrink-0 rounded object-cover"
              />
            )}
            {card.url ? (
              <a
                href={card.url}
                target="_blank"
                rel="noopener noreferrer"
                className="min-w-0 truncate font-medium hover:underline"
              >
                {card.title}
              </a>
            ) : (
              <span className="min-w-0 truncate font-medium">{card.title}</span>
            )}
          </div>
          {card.status === "PENDING" && (
            <Badge variant="outline" className="shrink-0">
              {translations("pending")}
            </Badge>
          )}
        </div>

        {card.description && <p className="line-clamp-2 text-sm text-muted-foreground">{card.description}</p>}

        {card.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {[...new Set(card.tags)].map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="mt-auto flex items-center gap-1 pt-1">
          {canModerate && card.status === "PENDING" && (
            <form action={approveCard.bind(null, card.id, listId)}>
              <IconActionButton type="submit" icon={Check} label={translations("approve")} />
            </form>
          )}
          {canEdit && (
            <IconActionButton
              type="button"
              icon={Pencil}
              label={translations("edit")}
              onClick={() => setIsEditing(true)}
            />
          )}
          {canEdit && (
            <form action={duplicateCard.bind(null, card.id, listId)}>
              <IconActionButton type="submit" icon={Copy} label={translations("duplicate")} />
            </form>
          )}
          {canEdit && (
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
                  <AlertDialogDescription>{translations("deleteConfirmDescription")}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{translations("cancel")}</AlertDialogCancel>
                  <form action={deleteCard.bind(null, card.id, listId)} className="contents">
                    <AlertDialogAction type="submit" variant="destructive">
                      {translations("deleteConfirm")}
                    </AlertDialogAction>
                  </form>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          {card.userId !== listOwnerId && (
            <Link href={`/profile/${card.user.id}`} className="ml-auto text-xs text-muted-foreground hover:underline">
              {translations("addedBy", { name: card.user.name })}
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
