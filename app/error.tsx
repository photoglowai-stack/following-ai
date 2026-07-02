"use client";

import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fff7fa] px-5">
      <div className="w-full max-w-md rounded-[36px] border border-[#ffd1df] bg-white p-8 text-center shadow-[0_40px_100px_rgba(255,0,92,0.10)]">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[#fff1f5] text-3xl shadow-[0_18px_40px_rgba(255,0,92,0.12)]">
          ⚠️
        </div>
        <h1 className="mt-6 text-2xl font-black text-[#111111]">Something went wrong</h1>
        <p className="mt-3 text-sm font-semibold leading-7 text-[#706872]">
          An unexpected error occurred. Please try again or return to the home page.
        </p>

        {error.digest && (
          <p className="mt-3 rounded-2xl border border-[#ffd1df] bg-[#fff7fa] px-4 py-2 text-xs font-bold text-[#817781]">
            Error ID: {error.digest}
          </p>
        )}

        <div className="mt-6 grid gap-3">
          <button
            onClick={reset}
            className="h-12 w-full rounded-full bg-[#ff005c] text-sm font-black text-white shadow-[0_18px_34px_rgba(255,0,92,0.22)] transition hover:-translate-y-0.5 hover:bg-[#d9004e]"
            type="button"
          >
            Try again
          </button>
          <Link
            href="/"
            className="flex h-12 items-center justify-center rounded-full border border-[#ffd1df] bg-white text-sm font-black text-[#111111] transition hover:bg-[#fff7fa]"
          >
            Back to home
          </Link>
        </div>

        <p className="mt-6 text-xs font-bold text-[#9a9299]">
          Public profiles only. Not affiliated with Instagram or Meta.
        </p>
      </div>
    </main>
  );
}
