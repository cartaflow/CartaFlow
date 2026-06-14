"use client";

import { useState } from "react";
import { ArrowLeft, Edit, Save, X, Plus, Settings, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { List } from "@/types/list";
import IconSelector from "./detail/icon-selector";
import TagEditor from "./detail/tag-editor";
import { updateList } from "@/lib/actions/lists";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useTranslations } from "next-intl";
import { deleteList } from "@/lib/actions/lists";
import { Label } from "../ui/label";

interface ListDetailViewProps {
  list: List;
}

export default function ListDetailView({ list }: ListDetailViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editData, setEditData] = useState({
    title: list.title,
    description: list.description || "",
    icon: list.icon,
    tags: list.tags,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const t = useTranslations("lists");

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

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      await updateList(list.id, {
        title: editData.title,
        description: editData.description,
        icon: editData.icon,
        tags: editData.tags,
      });
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      console.error("Failed to update list:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setEditData({
      title: list.title,
      description: list.description || "",
      icon: list.icon,
      tags: list.tags,
    });
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto space-y-6 p-2 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/lists">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">
            {isEditing ? "Edit List" : list.title}
          </h1>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" className="cursor-pointer" onClick={handleCancel} disabled={isSubmitting}>
                <X className="h-4 w-4" />
                {t("cancel")}
              </Button>
              <Button onClick={handleSave} className="cursor-pointer" disabled={isSubmitting}>
                <Save className="h-4 w-4" />
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="cursor-pointer">
              <Edit className="h-4 w-4" />
              Edit List
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                List Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-medium">
                      {t("fieldTitle")}
                    </Label>
                    <Input id="title" value={editData.title} onChange={(e) => setEditData((prev) => ({ ...prev, title: e.target.value }))} placeholder={t("titlePlaceholder")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-medium">
                      {t("fieldDescription")}
                    </Label>
                    <Textarea id="description" value={editData.description} onChange={(e) => setEditData((prev) => ({ ...prev, description: e.target.value }))} placeholder={t("descriptionPlaceholder")} rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Icon</Label>
                    <IconSelector selectedIcon={editData.icon} onIconChange={(icon) => setEditData((prev) => ({ ...prev, icon }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Tags</Label>
                    <TagEditor tags={editData.tags} onTagsChange={(tags) => setEditData((prev) => ({ ...prev, tags }))}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h3 className="font-semibold text-lg">{list.title}</h3>
                    <p className="text-muted-foreground">
                      {t("byAuthor", { author: list.user?.name || "" })}
                    </p>
                  </div>

                  {list.description && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Description</p>
                      <p>{list.description}</p>
                    </div>
                  )}

                  {list.tags.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Tags</p>
                      <div className="flex flex-wrap gap-2">
                        {list.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="rounded-full">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <Separator />

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{t("created", { CreationDate: list.createdAt })}</span>
                    <span>{t("lastUpdated", { UpdateDate: list.updatedAt })}</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Cards</CardTitle>
                <Button size="sm">
                  <Plus className="h-4 w-4" />
                  Add Card
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p>No cards yet. Start by adding your first card!</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Cards</span>
                <span className="font-semibold">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tags</span>
                <span className="font-semibold">{list.tags.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created</span>
                <span className="font-semibold">{list.createdAt.toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Plus className="h-4 w-4" />
                Add Card
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Export List
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Share List
              </Button>
              <div className="flex gap-1">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="w-full justify-start cursor-pointer text-destructive hover:text-destructive">
                      Delete List
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
                      <AlertDialogCancel className="cursor-pointer">{t("cancel")}</AlertDialogCancel>
                      <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="cursor-pointer"
                      >
                        {isDeleting ? t("deleting") : t("delete")}
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
