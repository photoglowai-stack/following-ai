"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

type ActivityType = "following" | "followers" | "both";
type StepState = "pending" | "active" | "complete";

const analysisSteps = [
  "Checking public profile",
  "Finding recent follow signals",
  "Building clean preview",
  "Masking sensitive rows",
  "Preparing report",
];

function normalizeUsername(value: string) {
  return value.replace(/^@+/, "").trim();
}

function isValidUsername(value: string) {
  return /^[a-zA-Z0-9._]{2,30}$/.test(normalizeUsername(value));
}

export default function AnalyzeExperience({
  initialUsername,
  initialType,
}: {
  initialUsername: string;
  initialType: ActivityType;
}) {
  const router = useRouter();
  const username = useMemo(() => normalizeUsername(initialUsername), [initialUsername]);
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(6);
  const [isReady, setIsReady] = useState(false);

  // Use refs to avoid double-firing in React StrictMode
  const intervalRef = useRef<number | null>(null);
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    if (!isValidUsername(username)) {
      router.replace("/");
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const totalDuration = reducedMotion ? 1400 : 6200;
    const stepDuration = totalDuration / analysisSteps.length;

    // Clear any existing timers before starting
    if (intervalRef.current) clearInterval(intervalRef.current);
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    intervalRef.current = window.setInterval(() => {
      setProgress((current) => {
        if (current >= 99) {
          clearInterval(intervalRef.current!);
          return 99;
        }
        return current + (reducedMotion ? 12 : 2.5);
      });
    }, reducedMotion ? 120 : 180);

    const stepTimers = analysisSteps.map((_, index) =>
      window.setTimeout(() => {
        setActiveStep(index);
      }, index * stepDuration),
    );
    timersRef.current.push(...stepTimers);

    const doneTimer = window.setTimeout(() => {
      setActiveStep(analysisSteps.length - 1);
      setProgress(100);
      setIsReady(true);
      clearInterval(intervalRef.current!);
    }, totalDuration);
    timersRef.current.push(doneTimer);

    const redirectTimer = window.setTimeout(() => {
      router.push(`/preview?username=${encodeURIComponent(username)}&type=${initialType}`);
    }, totalDuration + 650);
    timersRef.current.push(redirectTimer);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, [initialType, router, username]);

  function getStepState(index: number): StepState {
    if (isReady || index < activeStep) return "complete";
    if (index === activeStep) return "active";
    return "pending";
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#ff005c_0%,#ff2d2d_55%,#ff5a2a_100%)] text-white">
      <header className="border-b border-white/15 bg-white/10 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-white text-[#ff005c]">
              <span className="h-4 w-4 rounded-full bg-[#ff005c]" />
            </span>
            <span className="text-lg font-black uppercase tracking-normal">Recently Followed</span>
          </Link>
          <span className="rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#111111]">
            Preview mode
          </span>
        </div>
      </header>

      <section className="mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl place-items-center px-5 py-8 lg:px-8">
        <div className="w-full max-w-3xl rounded-[36px] border border-white/20 bg-white p-5 text-[#111111] shadow-[0_34px_100px_rgba(67,0,24,0.28)] sm:p-8">
          <div className="text-center">
            <div className="mx-auto flex w-fit flex-wrap items-center justify-center gap-2 rounded-full border border-[#ffd1df] bg-[#fff7fa] px-4 py-2 text-sm font-black text-[#ff005c]">
              <span>@{username || "username"}</span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#ff9ab7]" />
              <span>{initialType === "both" ? "Full account preview" : initialType === "following" ? "Recent following" : "Recent followers"}</span>
            </div>
            <h1 className="mt-6 text-4xl font-black leading-tight tracking-normal sm:text-5xl">
              Preparing your public activity preview
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base font-semibold leading-7 text-[#706872] sm:text-lg">
              We&apos;re checking available public signals for @{username}. This usually takes less than a minute.
            </p>
          </div>

          <div className="mx-auto mt-8 grid max-w-[280px] place-items-center">
            <div className="relative grid aspect-square w-full place-items-center rounded-full border border-[#ffd1df] bg-[radial-gradient(circle,rgba(255,0,92,0.12),rgba(255,90,42,0.08)_42%,transparent_43%),repeating-radial-gradient(circle,rgba(255,0,92,0.18)_0_1px,transparent_1px_34px)]">
              {/* Radar only spins while not ready */}
              {!isReady && (
                <div className="rf-radar-sweep absolute left-1/2 top-1/2 h-1/2 w-1/2 origin-bottom-left rounded-br-full bg-[linear-gradient(45deg,rgba(255,0,92,0.35),transparent_62%)]" />
              )}
              {/* Static "done" tick when ready */}
              {isReady && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-[#ff005c]/20" />
                </div>
              )}
              <div className="relative z-10 grid h-36 w-36 place-items-center rounded-full border border-[#ffd1df] bg-white shadow-[0_24px_50px_rgba(255,0,92,0.14)]">
                <div className="text-center">
                  <p className="text-5xl font-black text-[#ff005c]">{Math.round(progress)}%</p>
                  <p className="mt-1 text-xs font-black uppercase tracking-[0.16em] text-[#817781]">
                    {isReady ? "Ready ✓" : "Scanning"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-7 overflow-hidden rounded-full bg-[#fff1f5]">
            <div
              className="h-3 rounded-full bg-[linear-gradient(90deg,#ff005c,#ffb000,#ff4b2b)] transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {["Public profile", "No login", "Preview mode"].map((chip) => (
              <span key={chip} className="rounded-full border border-[#ffd1df] bg-[#fff7fa] px-4 py-2 text-xs font-black text-[#111111]">
                {chip}
              </span>
            ))}
          </div>

          <div className="mt-7 grid gap-3">
            {analysisSteps.map((step, index) => {
              const state = getStepState(index);

              return (
                <div
                  key={step}
                  className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition-all duration-300 ${
                    state === "complete"
                      ? "border-[#ffd1df] bg-[#fff7fa]"
                      : state === "active"
                        ? "border-[#ff005c] bg-white shadow-[0_14px_30px_rgba(255,0,92,0.08)]"
                        : "border-[#eee5ee] bg-white opacity-50"
                  }`}
                >
                  <span
                    className={`grid h-9 w-9 place-items-center rounded-full text-sm font-black transition-all duration-300 ${
                      state === "complete"
                        ? "bg-[#111111] text-white"
                        : state === "active"
                          ? "bg-[linear-gradient(135deg,#ff005c,#ff4b2b)] text-white"
                          : "bg-[#f3eef3] text-[#817781]"
                    }`}
                  >
                    {state === "complete" ? "✓" : index + 1}
                  </span>
                  <span className="min-w-0 flex-1 text-sm font-black text-[#111111]">{step}</span>
                  <span className={`text-xs font-black uppercase tracking-[0.12em] ${
                    state === "complete" ? "text-[#00B67A]" : state === "active" ? "text-[#ff005c]" : "text-[#817781]"
                  }`}>
                    {state}
                  </span>
                </div>
              );
            })}
          </div>

          <p className="mt-6 text-center text-sm font-bold text-[#817781]">
            Only public profile information is used. Private accounts cannot be checked.
          </p>
          <p className="mt-2 text-center text-xs font-bold text-[#9a9299]">Public profiles only. Not affiliated with Instagram or Meta.</p>
        </div>
      </section>
    </main>
  );
}
