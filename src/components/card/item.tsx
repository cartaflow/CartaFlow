"use client";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { approveCard, deleteCard, duplicateCard, updateCard } from "@/app/lists/[id]/cards/actions";
import { CardForm } from "@/components/card/form";
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
    <Card>
      <CardContent className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          {card.image && !imageError && (
            // biome-ignore lint/performance/noImgElement: image domains are arbitrary, user-submitted URLs
            <img
              src={card.image}
              alt=""
              loading="lazy"
              onError={() => setImageError(true)}
              className="h-12 w-12 shrink-0 rounded object-cover"
            />
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              {card.url ? (
                <a href={card.url} target="_blank" rel="noopener noreferrer" className="font-medium hover:underline">
                  {card.title}
                </a>
              ) : (
                <span className="font-medium">{card.title}</span>
              )}
              {card.status === "PENDING" && <Badge variant="outline">{translations("pending")}</Badge>}
            </div>
            {card.description && <p className="text-sm text-muted-foreground mt-1">{card.description}</p>}
            {card.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-1">
                {card.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 pt-1">
          {canModerate && card.status === "PENDING" && (
            <form action={approveCard.bind(null, card.id, listId)}>
              <Button type="submit" variant="ghost" size="sm">
                {translations("approve")}
              </Button>
            </form>
          )}
          {canEdit && (
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
              {translations("edit")}
            </Button>
          )}
          {canEdit && (
            <form action={duplicateCard.bind(null, card.id, listId)}>
              <Button type="submit" variant="ghost" size="sm">
                {translations("duplicate")}
              </Button>
            </form>
          )}
          {canEdit && (
            <form action={deleteCard.bind(null, card.id, listId)}>
              <Button type="submit" variant="ghost" size="sm" className="text-destructive">
                {translations("delete")}
              </Button>
            </form>
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
