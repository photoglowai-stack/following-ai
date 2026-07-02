export default function PreviewLoading() {
  return (
    <main className="min-h-screen bg-[#fff7fa]">
      <div className="border-b border-[#ffd1df] bg-white/90 px-5 py-4 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 animate-pulse rounded-full bg-[#ffe0e8]" />
            <div className="h-5 w-32 animate-pulse rounded-full bg-[#ffe0e8]" />
          </div>
          <div className="h-8 w-28 animate-pulse rounded-full bg-[#111111]/10" />
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-8 lg:grid-cols-[1fr_390px] lg:px-8">
        <div className="space-y-6">
          <div className="h-52 animate-pulse rounded-[34px] bg-[#ffe0e8]" />
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 animate-pulse rounded-[24px] bg-white shadow-[0_8px_24px_rgba(255,0,92,0.06)]" />
            ))}
          </div>
          <div className="h-96 animate-pulse rounded-[32px] bg-white shadow-[0_8px_24px_rgba(255,0,92,0.06)]" />
        </div>
        <div className="h-[500px] animate-pulse rounded-[32px] bg-white shadow-[0_8px_24px_rgba(17,17,17,0.06)]" />
      </div>
    </main>
  );
}
