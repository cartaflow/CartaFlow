"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ExternalLink, MoreVertical, Pencil, Copy, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteCard, duplicateCard } from "@/lib/actions/cards";
import type { Card as CardType } from "@/types/card";
import CardFormDialog from "./card-form";

interface CardItemProps {
  card: CardType;
  onTagClick?: (tag: string) => void;
  activeTag?: string | null;
}

export default function CardItem({ card, onTagClick, activeTag }: CardItemProps) {
  const t = useTranslations("cards");
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleDuplicate = async () => {
    setBusy(true);
    try {
      await duplicateCard(card.id);
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    setBusy(true);
    try {
      await deleteCard(card.id);
      setDeleteOpen(false);
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Card className="group overflow-hidden p-0 gap-0 transition-all hover:shadow-lg hover:border-primary/40">
        {card.image && (
          <a href={card.url ?? undefined} target={card.url ? "_blank" : undefined} rel="noreferrer" className="relative block aspect-[16/9] overflow-hidden bg-muted">
            <Image src={card.image} alt={card.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
          </a>
        )}
        <CardContent className="flex flex-col gap-3 p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold leading-tight line-clamp-2">
              {card.url ? (
                <a href={card.url} target="_blank" rel="noreferrer" className="hover:text-primary inline-flex items-start gap-1">
                  {card.title}
                  <ExternalLink className="h-3.5 w-3.5 shrink-0 translate-y-0.5 opacity-60" />
                </a>
              ) : (
                card.title
              )}
            </h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0 cursor-pointer opacity-60 hover:opacity-100">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="cursor-pointer" onClick={() => setEditOpen(true)}>
                  <Pencil className="h-4 w-4" />
                  {t("edit")}
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={handleDuplicate} disabled={busy}>
                  <Copy className="h-4 w-4" />
                  {t("duplicate")}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive" onClick={() => setDeleteOpen(true)}>
                  <Trash2 className="h-4 w-4" />
                  {t("delete")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {card.description && (
            <p className="text-sm text-muted-foreground line-clamp-3 whitespace-pre-wrap">{card.description}</p>
          )}

          {card.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {card.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant={activeTag === tag ? "default" : "secondary"}
                  className="cursor-pointer rounded-full"
                  onClick={() => onTagClick?.(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <p className="mt-auto pt-1 text-xs text-muted-foreground">
            {t("addedOn", { date: card.createdAt })}
          </p>
        </CardContent>
      </Card>

      <CardFormDialog listId={card.listId} card={card} open={editOpen} onOpenChange={setEditOpen} />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteConfirmTitle")}</AlertDialogTitle>
            <AlertDialogDescription>{t("deleteConfirmDescription")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">{t("cancel")}</AlertDialogCancel>
            <Button variant="destructive" className="cursor-pointer" onClick={handleDelete} disabled={busy}>
              {busy ? t("deleting") : t("delete")}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
