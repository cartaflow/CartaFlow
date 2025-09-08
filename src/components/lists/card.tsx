"use client";

import { Trash2 } from "lucide-react";
import { deleteList } from "@/lib/actions/lists";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { List } from "@/types/list";
import { useRouter } from "next/navigation";

interface ListCardProps {
  list: List;
}

export default function ListCard({ list }: ListCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const t = useTranslations("lists");
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteList(list.id);
      router.refresh();
    } catch (error) {
      console.error("Failed to delete list:", error);
      setIsDeleting(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div className="space-y-1">
          <CardTitle className="text-base">{list.title}</CardTitle>
          {list.description && (
            <CardDescription>{list.description}</CardDescription>
          )}
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 text-destructive hover:text-destructive cursor-pointer"
              disabled={isDeleting}
            >
              <Trash2 className="size-5" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("deleteConfirmTitle")}</AlertDialogTitle>
              <AlertDialogDescription>
                {t("deleteConfirmDescription")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
              <Button
                variant="destructive"
                className="cursor-pointer"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? t("deleting") : t("delete")}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {t("created", { CreationDate: list.createdAt })}
        </p>
      </CardContent>
    </Card>
  );
}
