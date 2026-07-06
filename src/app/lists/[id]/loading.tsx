import { PageContainer } from "@/components/layout/pagecontainer";
import { Skeleton } from "@/components/ui/skeleton";

export default function ListDetailLoading() {
  return (
    <PageContainer size="wide" className="space-y-8">
      <div className="space-y-4">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-28 w-full" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-6 w-24" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton rows, no stable identity
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
