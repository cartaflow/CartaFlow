"use client";
import { LayoutGrid } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { createCard, importCards } from "@/app/lists/[id]/cards/actions";
import { CardForm } from "@/components/card/form";
import { CardItem } from "@/components/card/item";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { Card } from "@/types/card";
import type { List } from "@/types/list";

interface CardsSectionProps {
  list: List;
  cards: Card[];
  viewerId?: string;
  isSignedIn: boolean;
  canModerate: boolean;
}

type Sort = "newest" | "oldest" | "title";

export function CardsSection({ list, cards, viewerId, isSignedIn, canModerate }: CardsSectionProps) {
  const listId = list.id;
  const listTitle = list.title;
  const listOwnerId = list.userId;
  const cardTemplate = list.cardTemplate;
  const translations = useTranslations("card.section");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<Sort>("newest");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    for (const c of cards) for (const tag of c.tags) set.add(tag);
    return [...set].sort();
  }, [cards]);

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = cards.filter((c) => {
      const matchesTag = !activeTag || c.tags.includes(activeTag);
      const matchesQuery =
        !query || c.title.toLowerCase().includes(query) || (c.description?.toLowerCase().includes(query) ?? false);
      return matchesTag && matchesQuery;
    });
    return [...filtered].sort((a, b) => {
      if (sort === "title") return a.title.localeCompare(b.title);
      const diff = a.createdAt.getTime() - b.createdAt.getTime();
      return sort === "oldest" ? diff : -diff;
    });
  }, [cards, search, sort, activeTag]);

  function handleExport() {
    const payload = {
      title: listTitle,
      cards: cards.map((c) => ({
        title: c.title,
        description: c.description,
        url: c.url,
        image: c.image,
        tags: c.tags,
      })),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${listTitle.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    file.text().then(async (text) => {
      try {
        const parsed = JSON.parse(text);
        const entries = Array.isArray(parsed) ? parsed : parsed.cards;
        if (Array.isArray(entries)) await importCards(listId, entries);
      } catch {
        // ignore malformed import files
      }
    });
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">
          {translations("title")} <span className="text-sm font-normal text-muted-foreground">({cards.length})</span>
        </h2>
        <div className="flex items-center gap-3">
          {canModerate && (
            <>
              <Button type="button" variant="ghost" size="sm" onClick={handleExport}>
                {translations("export")}
              </Button>
              <label className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "cursor-pointer")}>
                {translations("import")}
                <input type="file" accept="application/json" className="hidden" onChange={handleImport} />
              </label>
            </>
          )}
          {isSignedIn && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger render={<Button type="button" />}>{translations("addCard")}</DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{translations("addCard")}</DialogTitle>
                </DialogHeader>
                <CardForm
                  mode="create"
                  defaultValues={{ description: cardTemplate ?? "" }}
                  action={(data) => createCard(listId, data)}
                  onDone={() => setDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {cards.length > 0 && (
        <div className="flex flex-wrap items-center gap-3">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={translations("searchPlaceholder")}
            className="flex-1 min-w-[200px]"
          />
          <Select value={sort} onValueChange={(value) => setSort(value as Sort)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">{translations("sortNewest")}</SelectItem>
              <SelectItem value="oldest">{translations("sortOldest")}</SelectItem>
              <SelectItem value="title">{translations("sortTitle")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {allTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {allTags.map((tag) => (
            <Badge
              key={tag}
              variant={activeTag === tag ? "default" : "outline"}
              render={
                <button
                  type="button"
                  aria-pressed={activeTag === tag}
                  onClick={() => setActiveTag((current) => (current === tag ? null : tag))}
                />
              }
            >
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {visible.length === 0 ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <LayoutGrid />
            </EmptyMedia>
            <EmptyTitle>{translations("empty")}</EmptyTitle>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((c) => (
            <CardItem
              key={c.id}
              card={c}
              listId={listId}
              listOwnerId={listOwnerId}
              canEdit={canModerate || c.userId === viewerId}
              canModerate={canModerate}
            />
          ))}
        </div>
      )}
    </section>
  );
}
