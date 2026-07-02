export default function Loading() {
  return (
    <main className="min-h-screen bg-white text-[#111111]">
      {/* Header skeleton */}
      <div className="border-b border-[#ffd1df] bg-white/90 px-5 py-5 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 animate-pulse rounded-full bg-[#ffe0e8]" />
            <div className="h-5 w-36 animate-pulse rounded-full bg-[#ffe0e8]" />
          </div>
          <div className="flex gap-3">
            <div className="h-9 w-16 animate-pulse rounded-full bg-[#ffe0e8]" />
            <div className="h-9 w-20 animate-pulse rounded-full bg-[#ffe0e8]" />
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-5 pb-16 pt-6 lg:px-8">
        {/* Hero skeleton */}
        <div className="rounded-[30px] bg-[#ffe0e8] p-8 sm:p-12">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-4">
              <div className="h-4 w-40 animate-pulse rounded-full bg-white/40" />
              <div className="h-16 w-full animate-pulse rounded-2xl bg-white/30" />
              <div className="h-8 w-3/4 animate-pulse rounded-full bg-white/30" />
            </div>
            <div className="h-80 animate-pulse rounded-[28px] bg-white/25" />
          </div>
        </div>

        {/* Content skeleton rows */}
        <div className="mt-8 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-[28px] bg-[#fff1f5]" />
          ))}
        </div>
      </div>
    </main>
  );
}
