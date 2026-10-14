import { Skeleton } from "@/components/ui/skeleton";

export function PageSkeleton() {
  return (
    <div role="status" aria-label="A carregar" className="flex flex-1 flex-col">
      <div className="flex h-14 items-center gap-3 border-b bg-card px-6">
        <Skeleton className="size-5 rounded-md" />
        <Skeleton className="h-4 w-40" />
      </div>
      <div className="space-y-6 p-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-24 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-80 rounded-xl" />
      </div>
      <span className="sr-only">A carregar…</span>
    </div>
  );
}
