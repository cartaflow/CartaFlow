import { getTranslations } from "next-intl/server";
import { PageContainer } from "@/components/layout/pagecontainer";
import { PageHeader } from "@/components/layout/pageheader";
import { ListForm } from "@/components/list/form";
import { createList } from "../actions";

export default async function NewListPage() {
  const translations = await getTranslations("list.page");

  return (
    <PageContainer size="narrow">
      <PageHeader title={translations("new")} backHref="/lists" backLabel={translations("back")} />
      <ListForm defaultValues={{ public: true }} action={createList} mode="create" />
    </PageContainer>
  );
}
