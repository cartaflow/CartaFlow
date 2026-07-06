import { PageContainer } from "@/components/layout/pagecontainer";
import { Skeleton } from "@/components/ui/skeleton";

export default function ListsLoading() {
  return (
    <PageContainer size="wide">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-8 w-24" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton rows, no stable identity
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    </PageContainer>
  );
}
