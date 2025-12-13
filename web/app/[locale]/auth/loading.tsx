import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingAuth() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary px-0 sm:px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-soft ring-1 ring-primary/5">
        <div className="space-y-3">
          <Skeleton className="h-8 w-40 rounded-xl" />
          <Skeleton className="h-4 w-full rounded-xl" />
          <Skeleton className="h-4 w-5/6 rounded-xl" />
        </div>
        <div className="mt-6 space-y-3">
          <Skeleton className="h-11 w-full rounded-xl" />
          <Skeleton className="h-11 w-full rounded-xl" />
          <Skeleton className="h-4 w-2/3 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
