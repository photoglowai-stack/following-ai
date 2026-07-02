export default function AnalyzeLoading() {
  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#ff005c_0%,#ff2d2d_55%,#ff5a2a_100%)]">
      <div className="border-b border-white/15 bg-white/10 px-5 py-4 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 animate-pulse rounded-full bg-white/30" />
            <div className="h-5 w-32 animate-pulse rounded-full bg-white/30" />
          </div>
          <div className="h-8 w-28 animate-pulse rounded-full bg-white/30" />
        </div>
      </div>
      <div className="flex min-h-[calc(100vh-73px)] items-center justify-center px-5">
        <div className="w-full max-w-3xl animate-pulse rounded-[36px] border border-white/20 bg-white p-8 shadow-[0_34px_100px_rgba(67,0,24,0.28)]">
          <div className="text-center">
            <div className="mx-auto h-10 w-64 rounded-full bg-[#ffe0e8]" />
            <div className="mx-auto mt-6 h-14 w-full max-w-lg rounded-2xl bg-[#ffe0e8]" />
            <div className="mx-auto mt-4 h-5 w-72 rounded-full bg-[#fff1f5]" />
          </div>
          <div className="mx-auto mt-8 h-72 w-72 rounded-full bg-[#fff1f5]" />
          <div className="mt-7 h-4 w-full rounded-full bg-[#fff1f5]" />
          <div className="mt-7 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-14 rounded-2xl bg-[#fff1f5]" />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
