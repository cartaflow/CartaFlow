"use client";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { createCard, importCards } from "@/app/lists/[id]/cards/actions";
import { CardForm } from "@/components/card/form";
import { CardItem } from "@/components/card/item";
import { cn } from "@/lib/utils";
import type { Card } from "../../../generated/prisma/client";

interface CardsSectionProps {
  listId: string;
  listTitle: string;
  cards: Card[];
  viewerId?: string;
  isSignedIn: boolean;
  canModerate: boolean;
  cardTemplate?: string | null;
}

type Sort = "newest" | "oldest" | "title";

export function CardsSection({
  listId,
  listTitle,
  cards,
  viewerId,
  isSignedIn,
  canModerate,
  cardTemplate,
}: CardsSectionProps) {
  const translations = useTranslations("card.section");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<Sort>("newest");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

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
        <div className="flex items-center gap-4">
          {canModerate && (
            <>
              <button type="button" onClick={handleExport} className="text-sm hover:underline">
                {translations("export")}
              </button>
              <label className="text-sm hover:underline cursor-pointer">
                {translations("import")}
                <input type="file" accept="application/json" className="hidden" onChange={handleImport} />
              </label>
            </>
          )}
          {isSignedIn && (
            <button
              type="button"
              onClick={() => setShowForm((v) => !v)}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/80"
            >
              {translations("addCard")}
            </button>
          )}
        </div>
      </div>

      {showForm && (
        <CardForm
          mode="create"
          defaultValues={{ description: cardTemplate ?? "" }}
          action={(data) => createCard(listId, data)}
          onDone={() => setShowForm(false)}
        />
      )}

      {cards.length > 0 && (
        <div className="flex flex-wrap items-center gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={translations("searchPlaceholder")}
            className="flex-1 min-w-[200px] rounded-md border bg-background px-3 py-2 text-sm"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="rounded-md border bg-background px-3 py-2 text-sm"
          >
            <option value="newest">{translations("sortNewest")}</option>
            <option value="oldest">{translations("sortOldest")}</option>
            <option value="title">{translations("sortTitle")}</option>
          </select>
        </div>
      )}

      {allTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setActiveTag((current) => (current === tag ? null : tag))}
              className={cn(
                "text-xs rounded-full border px-3 py-1",
                activeTag === tag ? "bg-primary text-primary-foreground" : "hover:bg-muted",
              )}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {visible.length === 0 ? (
        <p className="text-sm text-muted-foreground">{translations("empty")}</p>
      ) : (
        <div className="space-y-3">
          {visible.map((c) => (
            <CardItem
              key={c.id}
              card={c}
              listId={listId}
              canEdit={canModerate || c.userId === viewerId}
              canModerate={canModerate}
            />
          ))}
        </div>
      )}
    </section>
  );
}
