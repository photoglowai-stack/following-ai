import Link from "next/link";
import { notFound } from "next/navigation";
import { getReportDetail } from "@/lib/dashboard/repository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ReportDetailPageProps = {
  params: Promise<{ id: string }>;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export default async function ReportDetailPage({ params }: ReportDetailPageProps) {
  const { id } = await params;
  const detail = getReportDetail(id);
  if (!detail) notFound();

  const visibleRows = detail.rows.slice(0, 10);

  return (
    <main className="min-h-screen bg-[#f7f7f8] text-[#111111]">
      <div className="mx-auto w-full max-w-5xl px-4 py-5 lg:px-8 lg:py-8">
        <Link href="/dashboard" className="inline-flex h-11 items-center rounded-full bg-white px-5 text-sm font-black shadow-[0_14px_34px_rgba(17,17,17,0.06)]">
          Back to dashboard
        </Link>

        <section className="mt-5 overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#ff005c,#ff2d55_54%,#ff7a2a)] p-5 text-white shadow-[0_28px_70px_rgba(255,0,92,0.20)] sm:p-7">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-white/70">Report detail</p>
          <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-4xl font-black">@{detail.report.username}</h1>
              <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-white/82">{detail.report.summary}</p>
            </div>
            <span className="w-fit rounded-full bg-white px-4 py-2 text-sm font-black text-[#ff005c]">
              {detail.report.profileStatus === "private" ? "Private" : "Public"}
            </span>
          </div>
        </section>

        <section className="mt-5 grid gap-4 md:grid-cols-4">
          {[
            ["Score", detail.report.score],
            ["Followers", detail.report.followersCount ?? "-"],
            ["Following", detail.report.followingCount ?? "-"],
            ["Created", formatDate(detail.report.createdAt)],
          ].map(([label, value]) => (
            <div key={label} className="rounded-[22px] border border-[#eadde3] bg-white p-4 shadow-[0_18px_44px_rgba(17,17,17,0.04)]">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#817781]">{label}</p>
              <p className="mt-2 text-xl font-black">{value}</p>
            </div>
          ))}
        </section>

        <section className="mt-5 rounded-[26px] border border-[#eadde3] bg-white p-5 shadow-[0_18px_44px_rgba(17,17,17,0.04)]">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ff005c]">Rows</p>
              <h2 className="mt-2 text-2xl font-black">First preview rows</h2>
            </div>
            <p className="text-sm font-bold text-[#706872]">Locked rows will unlock after checkout.</p>
          </div>

          <div className="mt-5 grid gap-3">
            {visibleRows.length === 0 ? (
              <div className="rounded-[20px] border border-[#ffe0e8] bg-[#fff7fa] p-5 text-sm font-bold text-[#706872]">
                No public rows are available for this profile.
              </div>
            ) : (
              visibleRows.map((row) => (
                <div key={row.id} className="grid gap-3 rounded-[20px] border border-[#f0e3e8] bg-[#fffdfd] p-4 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#fff1f5] text-sm font-black text-[#ff005c]">
                    {row.username.slice(0, 2).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <p className={`truncate font-black ${row.isLocked ? "blur-[2px]" : ""}`}>@{row.username}</p>
                    <p className="text-sm font-semibold text-[#706872]">
                      {row.listType} · {formatDate(row.observedAt)}
                    </p>
                  </div>
                  <span className={`w-fit rounded-full px-3 py-1 text-xs font-black uppercase ${row.isLocked ? "bg-[#fff1f5] text-[#ff005c]" : "bg-[#eafff4] text-[#009a63]"}`}>
                    {row.isLocked ? "Locked" : row.status.replace("_", " ")}
                  </span>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
