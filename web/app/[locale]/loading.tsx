import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingLocale() {
  return (
    <div className="flex min-h-screen flex-col bg-transparent text-text-dark">
      <nav className="sticky top-0 z-40 w-full">
        <div className="liquid-nav relative z-10 w-full overflow-visible">
          <div className="nav-section grid h-24 grid-cols-[auto_1fr_auto] items-center gap-x-3 sm:h-28 sm:gap-x-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-16 w-16 rounded-2xl sm:h-20 sm:w-20 md:h-24 md:w-24" />
              <Skeleton className="hidden sm:block h-7 w-44 rounded-xl" />
            </div>
            <div className="col-start-3 flex items-center justify-end gap-2">
              <Skeleton className="hidden sm:inline-flex h-11 w-32 rounded-xl" />
              <Skeleton className="h-11 w-28 rounded-xl" />
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        <div className="page-section py-10 sm:py-14 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-12">
            <div className="space-y-5">
              <Skeleton className="h-8 w-56 rounded-2xl" />
              <Skeleton className="h-12 w-full rounded-2xl" />
              <Skeleton className="h-12 w-5/6 rounded-2xl" />
              <Skeleton className="h-5 w-full rounded-2xl" />
              <Skeleton className="h-5 w-4/5 rounded-2xl" />
              <div className="flex flex-col gap-3 sm:flex-row">
                <Skeleton className="h-12 w-full rounded-2xl sm:w-52" />
                <Skeleton className="h-12 w-full rounded-2xl sm:w-44" />
              </div>
            </div>
            <div className="premium-card p-6 sm:p-8">
              <div className="space-y-4">
                <Skeleton className="h-6 w-40 rounded-xl" />
                <Skeleton className="h-4 w-full rounded-xl" />
                <Skeleton className="h-4 w-5/6 rounded-xl" />
                <Skeleton className="h-40 w-full rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
