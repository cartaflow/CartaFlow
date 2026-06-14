"use client";

import { useState } from "react";
import { ArrowLeft, Pencil, Save, X, Settings, Trash2, Download, Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { List } from "@/types/list";
import type { Card as CardType } from "@/types/card";
import IconSelector from "./detail/icon-selector";
import TagEditor from "./detail/tag-editor";
import { updateList, deleteList } from "@/lib/actions/lists";
import { iconMap } from "@/lib/icons";
import CardsSection from "@/components/cards/cards-section";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useTranslations } from "next-intl";
import { Label } from "../ui/label";

interface ListDetailViewProps {
  list: List;
  cards: CardType[];
}

export default function ListDetailView({ list, cards }: ListDetailViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [editData, setEditData] = useState({
    title: list.title,
    description: list.description || "",
    icon: list.icon,
    tags: list.tags,
  });
  const router = useRouter();
  const t = useTranslations("lists");

  const ListIcon = iconMap[list.icon] || Settings;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteList(list.id);
      router.push("/lists");
    } catch {
      setIsDeleting(false);
    }
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      await updateList(list.id, editData);
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      console.error("Failed to update list:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setEditData({ title: list.title, description: list.description || "", icon: list.icon, tags: list.tags });
    setIsEditing(false);
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore clipboard errors */
    }
  };

  const handleExport = () => {
    const payload = {
      title: list.title,
      description: list.description,
      tags: list.tags,
      cards: cards.map((c) => ({ title: c.title, description: c.description, url: c.url, image: c.image, tags: c.tags })),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${list.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto space-y-6 p-2 pt-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Button variant="ghost" size="icon" className="cursor-pointer" asChild>
            <Link href="/lists" aria-label={t("backToLists")}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <ListIcon className="h-5 w-5 text-primary" />
          </div>
          <h1 className="truncate text-2xl font-bold">{isEditing ? t("editTitle") : list.title}</h1>
        </div>
        <div className="flex shrink-0 gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" className="cursor-pointer" onClick={handleCancel} disabled={isSubmitting}>
                <X className="h-4 w-4" />
                {t("cancel")}
              </Button>
              <Button onClick={handleSave} className="cursor-pointer" disabled={isSubmitting}>
                <Save className="h-4 w-4" />
                {isSubmitting ? t("saving") : t("saveChanges")}
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="cursor-pointer">
              <Pencil className="h-4 w-4" />
              {t("edit")}
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                {t("listDetails")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="title">{t("fieldTitle")}</Label>
                    <Input id="title" value={editData.title} onChange={(e) => setEditData((p) => ({ ...p, title: e.target.value }))} placeholder={t("titlePlaceholder")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">{t("fieldDescription")}</Label>
                    <Textarea id="description" value={editData.description} onChange={(e) => setEditData((p) => ({ ...p, description: e.target.value }))} placeholder={t("descriptionPlaceholder")} rows={3} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("fieldTags")}</Label>
                    <TagEditor tags={editData.tags} onTagsChange={(tags) => setEditData((p) => ({ ...p, tags }))} placeholder={t("tagPlaceholder")} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("fieldIcon")}</Label>
                    <IconSelector selectedIcon={editData.icon} onIconChange={(icon) => setEditData((p) => ({ ...p, icon }))} />
                  </div>
                </>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">{t("byAuthor", { author: list.user?.name || "" })}</p>

                  {list.description && (
                    <div>
                      <p className="mb-1 text-sm text-muted-foreground">{t("descriptionLabel")}</p>
                      <p className="whitespace-pre-wrap">{list.description}</p>
                    </div>
                  )}

                  {list.tags.length > 0 && (
                    <div>
                      <p className="mb-2 text-sm text-muted-foreground">{t("tagsLabel")}</p>
                      <div className="flex flex-wrap gap-2">
                        {list.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="rounded-full">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <Separator />

                  <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
                    <span>{t("created", { CreationDate: list.createdAt })}</span>
                    <span>{t("lastUpdated", { UpdateDate: list.updatedAt })}</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <CardsSection listId={list.id} cards={cards} />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("statistics")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("totalCards")}</span>
                <span className="font-semibold">{cards.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("tagsCount")}</span>
                <span className="font-semibold">{list.tags.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("createdLabel")}</span>
                <span className="font-semibold">{new Date(list.createdAt).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("quickActions")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full cursor-pointer justify-start" onClick={handleExport}>
                <Download className="h-4 w-4" />
                {t("exportList")}
              </Button>
              <Button variant="outline" className="w-full cursor-pointer justify-start" onClick={handleShare}>
                {copied ? <Check className="h-4 w-4 text-success" /> : <Share2 className="h-4 w-4" />}
                {copied ? t("linkCopied") : t("shareList")}
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="w-full cursor-pointer justify-start text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                    {t("deleteListBtn")}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t("deleteConfirmTitle")}</AlertDialogTitle>
                    <AlertDialogDescription>{t("deleteConfirmDescription")}</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="cursor-pointer">{t("cancel")}</AlertDialogCancel>
                    <Button variant="destructive" onClick={handleDelete} disabled={isDeleting} className="cursor-pointer">
                      {isDeleting ? t("deleting") : t("delete")}
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
