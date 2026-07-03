import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ErrorPage } from "@/components/error";
import { ListForm } from "@/components/list/form";
import { list } from "@/services/list";
import { updateList } from "../../actions";

export default async function EditListPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const translations = await getTranslations("list.page");
  const current = await list.read(id).catch((e: Error) => e);
  if (current instanceof Error) return <ErrorPage error={current} />;

  return (
    <div className="container mx-auto px-6 py-12 max-w-lg">
      <div className="mb-8">
        <Link href="/lists" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          {translations("back")}
        </Link>
        <h1 className="text-3xl font-bold tracking-tight mt-4">{translations("edit")}</h1>
      </div>

      <ListForm
        defaultValues={{
          title: current.title,
          description: current.description ?? "",
          tags: current.tags.join(", "),
          icon: current.icon,
          cardTemplate: current.cardTemplate ?? "",
          requireApproval: current.requireApproval,
          public: current.public,
        }}
        action={updateList.bind(null, id)}
        mode="update"
      />
    </div>
  );
}
