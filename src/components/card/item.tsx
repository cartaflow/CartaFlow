"use client";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { approveCard, deleteCard, duplicateCard, updateCard } from "@/app/lists/[id]/cards/actions";
import { CardForm } from "@/components/card/form";
import type { Card } from "../../../generated/prisma/client";

interface CardItemProps {
  card: Card;
  listId: string;
  canEdit: boolean;
  canModerate: boolean;
}

export function CardItem({ card, listId, canEdit, canModerate }: CardItemProps) {
  const translations = useTranslations("card.item");
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
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
    );
  }

  return (
    <div className="rounded-lg border p-4 space-y-2">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {card.url ? (
              <a href={card.url} target="_blank" rel="noopener noreferrer" className="font-medium hover:underline">
                {card.title}
              </a>
            ) : (
              <span className="font-medium">{card.title}</span>
            )}
            {card.status === "PENDING" && (
              <span className="text-xs rounded-full bg-muted px-2 py-0.5 text-muted-foreground">
                {translations("pending")}
              </span>
            )}
          </div>
          {card.description && <p className="text-sm text-muted-foreground mt-1">{card.description}</p>}
          {card.tags.length > 0 && <p className="text-xs text-muted-foreground mt-1">{card.tags.join(", ")}</p>}
        </div>
      </div>

      <div className="flex items-center gap-3 pt-1">
        {canModerate && card.status === "PENDING" && (
          <form action={approveCard.bind(null, card.id, listId)}>
            <button type="submit" className="text-sm text-primary hover:underline">
              {translations("approve")}
            </button>
          </form>
        )}
        {canEdit && (
          <button type="button" onClick={() => setIsEditing(true)} className="text-sm hover:underline">
            {translations("edit")}
          </button>
        )}
        {canEdit && (
          <form action={duplicateCard.bind(null, card.id, listId)}>
            <button type="submit" className="text-sm hover:underline">
              {translations("duplicate")}
            </button>
          </form>
        )}
        {canEdit && (
          <form action={deleteCard.bind(null, card.id, listId)}>
            <button type="submit" className="text-sm text-destructive hover:underline">
              {translations("delete")}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
