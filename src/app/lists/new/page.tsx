import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ListForm } from "@/components/list/form";
import { createList } from "../actions";

export default async function NewListPage() {
  const translations = await getTranslations("list.page");

  return (
    <div className="container mx-auto px-6 py-12 max-w-lg">
      <div className="mb-8">
        <Link href="/lists" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          {translations("back")}
        </Link>
        <h1 className="text-3xl font-bold tracking-tight mt-4">{translations("new")}</h1>
      </div>

      <ListForm defaultValues={{ public: true }} action={createList} mode="create" />
    </div>
  );
}
