import { notFound } from "next/navigation";
import { getList } from "@/lib/actions/lists";
import ListDetailView from "@/components/lists/detail";

export default async function ListDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const list = await getList((await params).id);

  if (!list) notFound();

  return <ListDetailView list={list} />;
}
