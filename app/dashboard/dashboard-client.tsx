"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import type { DashboardReport, DashboardSnapshot, ReportType } from "@/lib/dashboard/types";

type DashboardClientProps = {
  initialSnapshot: DashboardSnapshot;
};

function statusLabel(report: DashboardReport) {
  if (report.profileStatus === "private") return "Private";
  if (report.status === "processing") return "Processing";
  if (report.status === "failed") return "Failed";
  return "Ready";
}

function formatCount(value: number | null) {
  if (typeof value !== "number") return "-";
  return new Intl.NumberFormat("en", { notation: value >= 10000 ? "compact" : "standard", maximumFractionDigits: 1 }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

export default function DashboardClient({ initialSnapshot }: DashboardClientProps) {
  const [snapshot, setSnapshot] = useState(initialSnapshot);
  const [username, setUsername] = useState("");
  const [reportType, setReportType] = useState<ReportType>("both");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");

  const latestReport = snapshot.reports[0];
  const reportGroups = useMemo(
    () => [
      { label: "Total reports", value: snapshot.metrics.totalReports },
      { label: "Ready previews", value: snapshot.metrics.readyReports },
      { label: "Private blocked", value: snapshot.metrics.privateBlocked },
      { label: "Credits", value: snapshot.metrics.credits },
    ],
    [snapshot.metrics],
  );

  async function refreshDashboard() {
    const response = await fetch("/api/dashboard/session", { cache: "no-store" });
    if (!response.ok) throw new Error("Could not refresh dashboard.");
    const nextSnapshot = (await response.json()) as DashboardSnapshot;
    setSnapshot(nextSnapshot);
  }

  async function createReport(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsCreating(true);

    try {
      const response = await fetch("/api/dashboard/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, reportType }),
      });
      const body = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(body.error || "Could not create report.");
      setUsername("");
      await refreshDashboard();
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "Something went wrong.");
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f7f8] text-[#111111]">
      <header className="border-b border-[#eadde3] bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-[#fff1f5]">
              <span className="h-4 w-4 rounded-full bg-[#ff005c] shadow-[0_0_0_8px_rgba(255,0,92,0.12)]" />
            </span>
            <span className="truncate text-lg font-black uppercase">Recently Followed</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden rounded-full bg-[#f0fff7] px-4 py-2 text-xs font-black uppercase text-[#009a63] sm:inline-flex">
              {snapshot.user.plan} plan
            </span>
            <span className="grid h-10 w-10 place-items-center rounded-full bg-[#111111] text-sm font-black text-white">
              {snapshot.user.name.slice(0, 1).toUpperCase()}
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-7xl gap-5 px-4 py-5 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-8 lg:py-8">
        <aside className="rounded-[22px] border border-[#eadde3] bg-white p-4 shadow-[0_18px_44px_rgba(17,17,17,0.04)] lg:sticky lg:top-5 lg:h-fit">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ff005c]">Dashboard</p>
          <nav className="mt-4 grid gap-2 text-sm font-black">
            <a className="rounded-2xl bg-[#111111] px-4 py-3 text-white" href="#overview">
              Overview
            </a>
            <a className="rounded-2xl px-4 py-3 text-[#6f6670] transition hover:bg-[#fff7fa] hover:text-[#111111]" href="#reports">
              Reports
            </a>
            <a className="rounded-2xl px-4 py-3 text-[#6f6670] transition hover:bg-[#fff7fa] hover:text-[#111111]" href="#activity">
              Activity
            </a>
          </nav>
          <div className="mt-5 rounded-[18px] border border-[#ffe0e8] bg-[#fff7fa] p-4">
            <p className="text-sm font-black">Provider status</p>
            <p className="mt-2 text-xs font-bold leading-5 text-[#706872]">
              Instagram scraping is not connected yet. Reports use stored previews and demo rows until credentials are added.
            </p>
          </div>
        </aside>

        <section className="min-w-0 space-y-5">
          <div id="overview" className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="overflow-hidden rounded-[26px] bg-[linear-gradient(135deg,#ff005c_0%,#ff2d55_52%,#ff7a2a_100%)] p-5 text-white shadow-[0_28px_70px_rgba(255,0,92,0.20)] sm:p-7">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-white/70">User workspace</p>
              <h1 className="mt-4 max-w-2xl text-4xl font-black leading-[0.98] sm:text-5xl">Manage Instagram activity previews.</h1>
              <p className="mt-4 max-w-2xl text-sm font-semibold leading-6 text-white/82 sm:text-base">
                Create, review, and unlock public profile previews from one place. The data layer is ready for the real Instagram provider when keys arrive.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {reportGroups.map((metric) => (
                  <div key={metric.label} className="rounded-[18px] border border-white/18 bg-white/14 px-4 py-3 backdrop-blur">
                    <p className="text-2xl font-black">{metric.value}</p>
                    <p className="mt-1 text-[11px] font-black uppercase leading-tight text-white/65">{metric.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={createReport} className="rounded-[26px] border border-[#eadde3] bg-white p-5 shadow-[0_18px_44px_rgba(17,17,17,0.04)] sm:p-6">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ff005c]">New report</p>
              <h2 className="mt-3 text-2xl font-black">Create a preview</h2>
              <label className="mt-5 block">
                <span className="text-sm font-black">Instagram username</span>
                <span className="mt-2 flex h-12 items-center gap-2 rounded-2xl border border-[#ffd1df] bg-[#fff7fa] px-3 focus-within:border-[#ff005c]">
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-white font-black text-[#ff005c]">@</span>
                  <input
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    placeholder="username"
                    className="h-full min-w-0 flex-1 border-0 bg-transparent text-sm font-bold outline-none placeholder:text-[#9f98a0]"
                  />
                </span>
              </label>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {(["both", "followers", "following"] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setReportType(type)}
                    className={`h-10 rounded-full text-xs font-black capitalize transition ${
                      reportType === type ? "bg-[#111111] text-white" : "bg-[#fff7fa] text-[#706872] hover:bg-[#ffe8f0]"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
              {error && <p className="mt-4 rounded-2xl bg-[#fff1f5] px-4 py-3 text-sm font-bold text-[#c1003d]">{error}</p>}
              <button
                disabled={isCreating}
                className="mt-5 h-12 w-full rounded-full bg-[#111111] text-sm font-black text-white shadow-[0_18px_34px_rgba(17,17,17,0.18)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-65"
                type="submit"
              >
                {isCreating ? "Creating..." : "Create preview"}
              </button>
            </form>
          </div>

          {latestReport && (
            <section className="grid gap-4 rounded-[26px] border border-[#eadde3] bg-white p-5 shadow-[0_18px_44px_rgba(17,17,17,0.04)] md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ff005c]">Latest report</p>
                <h2 className="mt-2 text-2xl font-black">@{latestReport.username}</h2>
                <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-[#706872]">{latestReport.summary}</p>
              </div>
              <Link href={`/dashboard/reports/${latestReport.id}`} className="inline-flex h-12 items-center justify-center rounded-full bg-[#111111] px-6 text-sm font-black text-white">
                Open report
              </Link>
            </section>
          )}

          <section id="reports" className="rounded-[26px] border border-[#eadde3] bg-white p-4 shadow-[0_18px_44px_rgba(17,17,17,0.04)] sm:p-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ff005c]">Reports</p>
                <h2 className="mt-2 text-2xl font-black">Saved previews</h2>
              </div>
              <p className="text-sm font-bold text-[#706872]">Stored in local SQLite for now.</p>
            </div>
            <div className="mt-5 grid gap-3">
              {snapshot.reports.map((report) => (
                <Link
                  key={report.id}
                  href={`/dashboard/reports/${report.id}`}
                  className="grid gap-3 rounded-[20px] border border-[#f0e3e8] bg-[#fffdfd] p-4 transition hover:border-[#ffb6cb] hover:bg-[#fff7fa] md:grid-cols-[minmax(0,1fr)_auto] md:items-center"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate text-lg font-black">@{report.username}</h3>
                      <span className={`rounded-full px-3 py-1 text-[11px] font-black uppercase ${report.profileStatus === "private" ? "bg-[#fff1f5] text-[#ff005c]" : "bg-[#eafff4] text-[#009a63]"}`}>
                        {statusLabel(report)}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-1 text-sm font-semibold text-[#706872]">{report.summary}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center md:w-72">
                    <span className="rounded-2xl bg-white px-3 py-2 text-xs font-black text-[#706872]">
                      <b className="block text-base text-[#111111]">{formatCount(report.followersCount)}</b>
                      followers
                    </span>
                    <span className="rounded-2xl bg-white px-3 py-2 text-xs font-black text-[#706872]">
                      <b className="block text-base text-[#111111]">{formatCount(report.followingCount)}</b>
                      following
                    </span>
                    <span className="rounded-2xl bg-white px-3 py-2 text-xs font-black text-[#706872]">
                      <b className="block text-base text-[#111111]">{report.score}</b>
                      score
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section id="activity" className="rounded-[26px] border border-[#eadde3] bg-white p-5 shadow-[0_18px_44px_rgba(17,17,17,0.04)]">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ff005c]">Activity</p>
            <h2 className="mt-2 text-2xl font-black">Recent events</h2>
            <div className="mt-5 grid gap-3">
              {snapshot.activities.map((activity) => (
                <div key={activity.id} className="rounded-[18px] border border-[#f0e3e8] bg-[#fffdfd] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-black">{activity.title}</p>
                    <time className="text-xs font-black text-[#817781]">{formatDate(activity.createdAt)}</time>
                  </div>
                  <p className="mt-1 text-sm font-semibold text-[#706872]">{activity.body}</p>
                </div>
              ))}
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
