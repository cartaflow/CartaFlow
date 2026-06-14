"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Plus, Search, ArrowUpDown, LayoutGrid, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Card as CardType, CardSort } from "@/types/card";
import CardItem from "./card-item";
import CardFormDialog from "./card-form";

interface CardsSectionProps {
  listId: string;
  cards: CardType[];
}

export default function CardsSection({ listId, cards }: CardsSectionProps) {
  const t = useTranslations("cards");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<CardSort>("newest");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    cards.forEach((card) => card.tags.forEach((tag) => set.add(tag)));
    return [...set].sort();
  }, [cards]);

  const visibleCards = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = cards.filter((card) => {
      const matchesTag = !activeTag || card.tags.includes(activeTag);
      const matchesQuery =
        !query ||
        card.title.toLowerCase().includes(query) ||
        (card.description?.toLowerCase().includes(query) ?? false);
      return matchesTag && matchesQuery;
    });

    return filtered.sort((a, b) => {
      if (sort === "title") return a.title.localeCompare(b.title);
      const diff = a.createdAt.getTime() - b.createdAt.getTime();
      return sort === "oldest" ? diff : -diff;
    });
  }, [cards, search, sort, activeTag]);

  const toggleTag = (tag: string) => setActiveTag((current) => (current === tag ? null : tag));

  const sortLabel: Record<CardSort, string> = {
    newest: t("sortNewest"),
    oldest: t("sortOldest"),
    title: t("sortTitle"),
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          <LayoutGrid className="h-5 w-5 text-primary" />
          {t("title")}
          <span className="text-sm font-normal text-muted-foreground">({cards.length})</span>
        </h2>
        <Button className="cursor-pointer" onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          {t("addCard")}
        </Button>
      </div>

      {cards.length > 0 && (
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[200px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("searchPlaceholder")} className="pl-9" />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="cursor-pointer">
                <ArrowUpDown className="h-4 w-4" />
                {sortLabel[sort]}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuRadioGroup value={sort} onValueChange={(value) => setSort(value as CardSort)}>
                <DropdownMenuRadioItem value="newest" className="cursor-pointer">{t("sortNewest")}</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="oldest" className="cursor-pointer">{t("sortOldest")}</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="title" className="cursor-pointer">{t("sortTitle")}</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {allTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          {allTags.map((tag) => (
            <Badge
              key={tag}
              variant={activeTag === tag ? "default" : "outline"}
              className="cursor-pointer rounded-full"
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </Badge>
          ))}
          {activeTag && (
            <Button variant="ghost" size="sm" className="h-6 cursor-pointer px-2 text-xs" onClick={() => setActiveTag(null)}>
              <X className="h-3 w-3" />
              {t("clearFilters")}
            </Button>
          )}
        </div>
      )}

      {cards.length === 0 ? (
        <div className="rounded-xl border border-dashed py-14 text-center">
          <LayoutGrid className="mx-auto mb-3 h-10 w-10 text-muted-foreground/60" />
          <p className="font-medium">{t("empty")}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t("emptyDescription")}</p>
          <Button className="mt-4 cursor-pointer" onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" />
            {t("addCard")}
          </Button>
        </div>
      ) : visibleCards.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted-foreground">{t("noResults")}</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visibleCards.map((card) => (
            <CardItem key={card.id} card={card} onTagClick={toggleTag} activeTag={activeTag} />
          ))}
        </div>
      )}

      <CardFormDialog listId={listId} open={createOpen} onOpenChange={setCreateOpen} />
    </section>
  );
}
