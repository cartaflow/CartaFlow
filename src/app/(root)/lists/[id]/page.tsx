import { notFound } from "next/navigation";
import { getList } from "@/lib/actions/lists";
import { getCards } from "@/lib/actions/cards";
import ListDetailView from "@/components/lists/detail";

export default async function ListDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const list = await getList(id);

  if (!list) notFound();

  const cards = await getCards(id);

  return <ListDetailView list={list} cards={cards} />;
}
