import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ErrorPage } from "@/components/error";
import { PageContainer } from "@/components/layout/pagecontainer";
import { PageHeader } from "@/components/layout/pageheader";
import { ListsGrid } from "@/components/list/grid";
import { Button } from "@/components/ui/button";
import { list } from "@/services/list";
import { user } from "@/services/user";

export default async function ListsPage() {
  const translations = await getTranslations("list.page");
  const lists = await list.list().catch((e: Error) => e);
  if (lists instanceof Error) return <ErrorPage error={lists} />;

  const viewer = await user.read().catch(() => null);

  return (
    <PageContainer size="wide">
      <PageHeader
        title={translations("title")}
        subtitle={translations("subtitle")}
        action={viewer && <Button render={<Link href="/lists/new" />}>{translations("new")}</Button>}
      />

      <ListsGrid lists={lists} viewerId={viewer?.id} canCreate={!!viewer} />
    </PageContainer>
  );
}
