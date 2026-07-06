"use client";
import { List as ListIcon, Search } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { ListCard } from "@/components/list/card";
import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import type { List } from "@/types/list";

interface ListsGridProps {
  lists: List[];
  viewerId?: string;
  canCreate: boolean;
}

export function ListsGrid({ lists, viewerId, canCreate }: ListsGridProps) {
  const translations = useTranslations("list.page");
  const [search, setSearch] = useState("");

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return lists;
    return lists.filter(
      (l) =>
        l.title.toLowerCase().includes(query) ||
        (l.description?.toLowerCase().includes(query) ?? false) ||
        l.tags.some((tag) => tag.toLowerCase().includes(query)),
    );
  }, [lists, search]);

  if (lists.length === 0) {
    return (
      <Empty className="border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ListIcon />
          </EmptyMedia>
          <EmptyTitle>{translations("empty")}</EmptyTitle>
        </EmptyHeader>
        {canCreate && (
          <EmptyContent>
            <Button size="sm" render={<Link href="/lists/new" />}>
              {translations("emptyCta")}
            </Button>
          </EmptyContent>
        )}
      </Empty>
    );
  }

  return (
    <div className="space-y-6">
      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={translations("searchPlaceholder")}
          className="pl-8"
        />
      </div>

      {visible.length === 0 ? (
        <p className="text-sm text-muted-foreground">{translations("noResults")}</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((l) => (
            <ListCard key={l.id} list={l} isOwner={viewerId === l.userId} />
          ))}
        </div>
      )}
    </div>
  );
}
