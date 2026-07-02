"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

type ActivityType = "following" | "followers" | "both";

const previewRows = [
  { account: "@le***studio", signal: "New follow", time: "2h ago", avatar: "LE" },
  { account: "@ma***journals", signal: "New follow", time: "5h ago", avatar: "MA" },
  { account: "@oc***diary", signal: "Public signal", time: "7h ago", avatar: "OC" },
  { account: "@de***kai", signal: "New follow", time: "10h ago", avatar: "DE" },
  { account: "@mi***mood", signal: "Public signal", time: "12h ago", avatar: "MI" },
];

// Locked rows shown below the visible ones (blurred, teasing more content)
const lockedRows = [
  { avatar: "NA", time: "14h ago" },
  { avatar: "SO", time: "18h ago" },
  { avatar: "JU", time: "21h ago" },
];

const summaryCards = [
  ["Public profile", "Available"],
  ["Recent follows", "24 signals"],
  ["Preview rows", "5 visible"],
  ["Full report", "Locked"],
];

function normalizeUsername(value: string) {
  return value.replace(/^@+/, "").trim();
}

function isValidUsername(value: string) {
  return /^[a-zA-Z0-9._]{2,30}$/.test(normalizeUsername(value));
}

export default function PreviewExperience({
  initialUsername,
  initialType,
}: {
  initialUsername: string;
  initialType: ActivityType;
}) {
  const router = useRouter();
  const username = useMemo(() => normalizeUsername(initialUsername), [initialUsername]);
  const activityCopy =
    initialType === "both"
      ? "recent public follower and following signals"
      : initialType === "following"
        ? "recent public following signals"
        : "recent public follower signals";

  useEffect(() => {
    if (!isValidUsername(username)) {
      router.replace("/");
    }
  }, [router, username]);

  function handleUnlockReport() {
    router.push(`/checkout?username=${encodeURIComponent(username)}&type=${initialType}`);
  }

  return (
    <main className="min-h-screen bg-[#fff7fa] text-[#111111]">
      <header className="sticky top-0 z-40 border-b border-[#ffd1df] bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-[#fff1f5]">
              <span className="h-4 w-4 rounded-full bg-[#ff005c] shadow-[0_0_0_8px_rgba(255,0,92,0.12)]" />
            </span>
            <span className="text-lg font-black uppercase tracking-normal">Recently Followed</span>
          </Link>
          <span className="rounded-full bg-[#111111] px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-white">
            Preview ready
          </span>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-8 lg:grid-cols-[minmax(0,1fr)_390px] lg:px-8">
        <div className="min-w-0">
          {/* Hero banner */}
          <div className="overflow-hidden rounded-[34px] bg-[linear-gradient(135deg,#ff005c_0%,#ff2d2d_54%,#ff5a2a_100%)] p-6 text-white shadow-[0_28px_90px_rgba(255,0,92,0.18)] sm:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-white px-4 py-2 text-sm font-black text-[#ff005c]">@{username || "username"}</span>
              <span className="rounded-full border border-white/25 bg-white/15 px-4 py-2 text-sm font-black text-white backdrop-blur">
                {initialType === "both" ? "Full account preview" : initialType === "following" ? "Recent following" : "Recent followers"}
              </span>
            </div>
            <h1 className="mt-7 max-w-3xl text-4xl font-black leading-tight tracking-normal sm:text-6xl">Your preview is ready</h1>
            <p className="mt-4 max-w-3xl text-lg font-semibold leading-8 text-white/90">
              We found {activityCopy} for @{username}. Unlock the full report to view complete rows.
            </p>
          </div>

          {/* Stats cards */}
          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {summaryCards.map(([label, value]) => (
              <div key={label} className="rounded-[24px] border border-[#ffd1df] bg-white p-5 shadow-[0_18px_48px_rgba(255,0,92,0.08)]">
                <p className="text-sm font-black uppercase tracking-[0.12em] text-[#817781]">{label}</p>
                <p className={`mt-3 text-2xl font-black ${label === "Full report" ? "text-[#ff005c]" : "text-[#111111]"}`}>{value}</p>
              </div>
            ))}
          </div>

          {/* Preview table */}
          <section className="mt-6 overflow-hidden rounded-[32px] border border-[#ffd1df] bg-white shadow-[0_24px_70px_rgba(255,0,92,0.1)]">
            <div className="flex flex-col gap-3 border-b border-[#ffe0e8] p-5 sm:flex-row sm:items-end sm:justify-between sm:p-6">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-[#ff005c]">Partial preview</p>
                <h2 className="mt-2 text-3xl font-black tracking-normal">Masked report rows</h2>
              </div>
              <span className="w-fit rounded-full bg-[#fff1f5] px-4 py-2 text-sm font-black text-[#ff005c]">
                Full usernames locked
              </span>
            </div>

            <div className="relative">
              {/* Table header */}
              <div className="hidden grid-cols-[minmax(0,1.4fr)_0.9fr_0.7fr_0.7fr] gap-4 border-b border-[#ffe0e8] bg-[#fff9fb] px-6 py-4 text-xs font-black uppercase tracking-[0.12em] text-[#817781] md:grid">
                <span>Account</span>
                <span>Signal</span>
                <span>Time</span>
                <span>Status</span>
              </div>

              {/* Visible rows */}
              <div className="divide-y divide-[#f5e5eb]">
                {previewRows.map((row, index) => (
                  <div key={row.account} className="grid gap-3 px-5 py-4 md:grid-cols-[minmax(0,1.4fr)_0.9fr_0.7fr_0.7fr] md:items-center md:px-6">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,#ffccd9,#ff7a4a)] text-xs font-black text-white">
                        {row.avatar}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-base font-black text-[#111111]">{row.account}</p>
                        <p className="text-xs font-bold text-[#817781]">Preview row {index + 1}</p>
                      </div>
                    </div>
                    <span className="w-fit rounded-full bg-[#fff1f5] px-3 py-2 text-sm font-black text-[#ff005c]">{row.signal}</span>
                    <span className="text-sm font-black text-[#706872]">{row.time}</span>
                    <span className="flex w-fit items-center gap-2 rounded-full bg-[#111111] px-3 py-2 text-sm font-black text-white">
                      <span aria-hidden="true">🔒</span>
                      Locked
                    </span>
                  </div>
                ))}
              </div>

              {/* Locked/blurred teaser rows */}
              <div className="relative">
                <div className="divide-y divide-[#f5e5eb] opacity-40 blur-[3px] select-none pointer-events-none">
                  {lockedRows.map((row) => (
                    <div key={row.avatar} className="grid gap-3 px-5 py-4 md:grid-cols-[minmax(0,1.4fr)_0.9fr_0.7fr_0.7fr] md:items-center md:px-6">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,#ffccd9,#ff7a4a)] text-xs font-black text-white">
                          {row.avatar}
                        </span>
                        <div className="min-w-0">
                          <p className="text-base font-black text-[#111111]">@**********</p>
                          <p className="text-xs font-bold text-[#817781]">Locked row</p>
                        </div>
                      </div>
                      <span className="w-fit rounded-full bg-[#fff1f5] px-3 py-2 text-sm font-black text-[#ff005c]">Hidden</span>
                      <span className="text-sm font-black text-[#706872]">{row.time}</span>
                      <span className="flex w-fit items-center gap-2 rounded-full bg-[#111111] px-3 py-2 text-sm font-black text-white">
                        <span aria-hidden="true">🔒</span>
                        Locked
                      </span>
                    </div>
                  ))}
                </div>
                {/* Fade gradient overlay */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 top-0 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.97)_100%)]" />
              </div>

              {/* CTA bar */}
              <div className="relative z-10 border-t border-[#ffe0e8] bg-white/95 px-5 py-5 text-center backdrop-blur">
                <p className="text-base font-black text-[#111111]">Full usernames and complete rows are locked.</p>
                <p className="mt-1 text-sm font-semibold text-[#706872]">
                  Unlock to view the complete public activity preview for @{username}.
                </p>
                <button
                  onClick={handleUnlockReport}
                  className="mt-4 inline-flex h-12 items-center gap-2 rounded-full bg-[#ff005c] px-8 text-sm font-black text-white shadow-[0_18px_34px_rgba(255,0,92,0.28)] transition hover:-translate-y-0.5 hover:bg-[#d9004e]"
                  type="button"
                >
                  🔓 Unlock full report — $9.99
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Sticky sidebar */}
        <aside className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-112px)] lg:self-start lg:overflow-y-auto">
          <div className="rounded-[32px] border border-[#ffd1df] bg-white p-5 shadow-[0_24px_70px_rgba(17,17,17,0.08)] sm:p-6">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#ff005c]">Full report</p>
            <h2 className="mt-3 text-3xl font-black leading-tight tracking-normal">Unlock the full report</h2>
            <p className="mt-3 text-sm font-semibold leading-6 text-[#706872]">
              Get the complete preview with full rows, timestamps, and clean activity summary.
            </p>

            <div className="mt-5 rounded-[24px] bg-[#111111] p-5 text-white">
              <p className="text-sm font-black uppercase tracking-[0.14em] text-white/55">One-time report</p>
              <div className="mt-2 flex items-end gap-2">
                <p className="text-5xl font-black">$9.99</p>
                <p className="mb-1 text-sm font-semibold text-white/50 line-through">$19.99</p>
              </div>
              <p className="mt-1 text-xs font-bold text-[#ff7a4a]">🔥 50% off — limited offer</p>
            </div>

            <button
              onClick={handleUnlockReport}
              className="mt-5 h-14 w-full rounded-2xl bg-[#ff005c] text-lg font-black text-white shadow-[0_18px_34px_rgba(255,0,92,0.28)] transition hover:-translate-y-0.5 hover:bg-[#d9004e]"
              type="button"
            >
              🔓 Unlock report
            </button>

            <div className="mt-5 grid gap-2">
              {["Secure checkout", "Instant access after payment", "One-time report", "Public profiles only"].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-[#ffe0e8] bg-[#fff9fb] px-3 py-3 text-sm font-black text-[#111111]">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-[#ff005c]">✓</span>
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-[22px] border border-[#e8f5ef] bg-white px-4 py-4 shadow-[0_14px_34px_rgba(17,17,17,0.06)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-lg font-black text-[#111111]">Excellent</p>
                  <p className="text-sm font-black text-[#111111]">
                    <span className="text-[#00B67A]">4.8</span> out of 5
                  </p>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className="grid h-7 w-7 place-items-center rounded-md bg-[#00B67A] text-xs font-black text-white">
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <p className="mt-3 text-sm font-black text-[#1f2130]">★ TrustScore</p>
              <p className="mt-1 text-sm font-black text-[#111111]">Based on 1478+ reviews</p>
            </div>

            <p className="mt-4 text-center text-xs font-bold text-[#817781]">Public profiles only. Not affiliated with Instagram or Meta.</p>
          </div>
        </aside>
      </section>
    </main>
  );
}
