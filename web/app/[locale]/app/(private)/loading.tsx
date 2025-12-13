import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingApp() {
  return (
    <div className="flex min-h-screen flex-col bg-transparent text-text-dark">
      <nav className="sticky top-0 z-40 w-full">
        <div className="liquid-nav relative z-10 w-full overflow-visible">
          <div className="nav-section grid h-24 grid-cols-[auto_1fr_auto] items-center gap-x-3 sm:h-28 sm:gap-x-4 md:grid-cols-[1fr_auto_1fr]">
            <div className="flex items-center gap-3">
              <Skeleton className="h-14 w-14 rounded-2xl sm:h-16 sm:w-16 md:h-20 md:w-20" />
              <Skeleton className="hidden sm:block h-7 w-44 rounded-xl" />
            </div>
            <div className="hidden md:flex min-w-0 items-center justify-center px-6 md:col-start-2 md:col-end-3">
              <div className="mx-auto flex w-max items-center gap-2">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <Skeleton key={idx} className="h-11 w-28 rounded-xl" />
                ))}
              </div>
            </div>
            <div className="col-start-3 flex items-center justify-end gap-2 md:justify-self-end">
              <Skeleton className="hidden sm:inline-flex h-11 w-32 rounded-xl" />
              <Skeleton className="h-11 w-28 rounded-xl" />
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="panel p-4 ring-1 ring-border-light/70 backdrop-blur-sm sm:rounded-3xl sm:p-7 lg:p-8">
          <div className="space-y-4">
            <Skeleton className="h-7 w-56 rounded-xl" />
            <Skeleton className="h-4 w-full rounded-xl" />
            <Skeleton className="h-4 w-5/6 rounded-xl" />
            <Skeleton className="h-32 w-full rounded-2xl" />
            <div className="grid gap-3 sm:grid-cols-2">
              <Skeleton className="h-24 w-full rounded-2xl" />
              <Skeleton className="h-24 w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
