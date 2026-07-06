import { getTranslations } from "next-intl/server";
import { ErrorPage } from "@/components/error";
import { PageContainer } from "@/components/layout/pagecontainer";
import { PageHeader } from "@/components/layout/pageheader";
import { ListForm } from "@/components/list/form";
import { list } from "@/services/list";
import { updateList } from "../../actions";

export default async function EditListPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const translations = await getTranslations("list.page");
  const current = await list.read(id).catch((e: Error) => e);
  if (current instanceof Error) return <ErrorPage error={current} />;

  return (
    <PageContainer size="narrow">
      <PageHeader title={translations("edit")} backHref="/lists" backLabel={translations("back")} />
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
    </PageContainer>
  );
}
