"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type ActivityType = "following" | "followers" | "both";
type CheckoutStep = "form" | "processing" | "success";

function normalizeUsername(value: string) {
  return value.replace(/^@+/, "").trim();
}

function isValidUsername(value: string) {
  return /^[a-zA-Z0-9._]{2,30}$/.test(normalizeUsername(value));
}

const trustBadges = [
  { icon: "🔒", label: "256-bit SSL encryption" },
  { icon: "✓", label: "Instant access after payment" },
  { icon: "🔄", label: "Satisfaction guarantee" },
  { icon: "🚫", label: "No subscription — one-time only" },
];

const reviewSnippets = [
  { name: "Maya R.", text: "Exactly what I needed, the preview was clear and immediate." },
  { name: "Théo L.", text: "Simple checkout, no surprises. Report was ready in seconds." },
  { name: "Nora K.", text: "Really clean interface. Worth every penny." },
];

export default function CheckoutExperience({
  initialUsername,
  initialType,
}: {
  initialUsername: string;
  initialType: ActivityType;
}) {
  const router = useRouter();
  const username = useMemo(() => normalizeUsername(initialUsername), [initialUsername]);
  const [step, setStep] = useState<CheckoutStep>("form");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isValidUsername(username)) {
      router.replace("/");
    }
  }, [router, username]);

  function formatCardNumber(value: string) {
    return value
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();
  }

  function formatExpiry(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)} / ${digits.slice(2)}`;
    return digits;
  }

  function validate() {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Name is required";
    if (!email.includes("@")) errs.email = "Valid email required";
    if (cardNumber.replace(/\s/g, "").length < 16) errs.card = "Enter a valid 16-digit card number";
    if (expiry.replace(/\s/g, "").replace("/", "").length < 4) errs.expiry = "Enter MM / YY";
    if (cvv.length < 3) errs.cvv = "CVV required";
    return errs;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setStep("processing");

    // Simulate payment processing (mock — no real Stripe call)
    setTimeout(() => {
      setStep("success");
    }, 2800);
  }

  if (step === "processing") {
    return <ProcessingScreen />;
  }

  if (step === "success") {
    return <SuccessScreen username={username} initialType={initialType} router={router} />;
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
          <div className="flex items-center gap-2 rounded-full border border-[#e8f5ef] bg-white px-4 py-2 text-xs font-black text-[#009a63]">
            <span>🔒</span>
            <span>Secure checkout</span>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-8 px-5 py-10 lg:grid-cols-[1fr_400px] lg:px-8">
        {/* Left — payment form */}
        <div>
          {/* Order recap */}
          <div className="mb-6 overflow-hidden rounded-[28px] border border-[#ffd1df] bg-white shadow-[0_18px_60px_rgba(255,0,92,0.08)]">
            <div className="bg-[linear-gradient(135deg,#ff005c,#ff4b2b)] px-6 py-5 text-white">
              <p className="text-sm font-black uppercase tracking-[0.14em] text-white/70">Your order</p>
              <h1 className="mt-1 text-2xl font-black">Full Instagram Preview Report</h1>
            </div>
            <div className="grid gap-3 p-5 sm:grid-cols-3">
              <div className="rounded-2xl border border-[#ffd1df] bg-[#fff7fa] p-4">
                <p className="text-xs font-black uppercase tracking-[0.1em] text-[#817781]">Username</p>
                <p className="mt-1 text-lg font-black text-[#ff005c]">@{username}</p>
              </div>
              <div className="rounded-2xl border border-[#ffd1df] bg-[#fff7fa] p-4">
                <p className="text-xs font-black uppercase tracking-[0.1em] text-[#817781]">Report type</p>
                <p className="mt-1 text-base font-black text-[#111111]">
                  {initialType === "both" ? "Full account" : initialType === "following" ? "Following" : "Followers"}
                </p>
              </div>
              <div className="rounded-2xl border border-[#ffd1df] bg-[#fff7fa] p-4">
                <p className="text-xs font-black uppercase tracking-[0.1em] text-[#817781]">Price</p>
                <div className="flex items-end gap-2">
                  <p className="mt-1 text-2xl font-black text-[#111111]">$9.99</p>
                  <p className="mb-0.5 text-sm font-semibold text-[#aaa] line-through">$19.99</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment form */}
          <form
            onSubmit={handleSubmit}
            className="rounded-[28px] border border-[#ffd1df] bg-white p-6 shadow-[0_18px_60px_rgba(255,0,92,0.08)]"
          >
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#ff005c]">Payment details</p>
            <h2 className="mt-2 text-2xl font-black text-[#111111]">Enter your card</h2>

            <div className="mt-6 grid gap-4">
              {/* Name */}
              <div>
                <label className="mb-1.5 block text-sm font-black text-[#111111]">Full name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Dupont"
                  className={`h-12 w-full rounded-2xl border px-4 text-base font-bold outline-none transition focus:border-[#ff005c] focus:ring-2 focus:ring-[#ff005c]/20 ${errors.name ? "border-red-400 bg-red-50" : "border-[#ffd1df] bg-[#fff7fa]"}`}
                />
                {errors.name && <p className="mt-1 text-xs font-bold text-red-500">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="mb-1.5 block text-sm font-black text-[#111111]">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@email.com"
                  className={`h-12 w-full rounded-2xl border px-4 text-base font-bold outline-none transition focus:border-[#ff005c] focus:ring-2 focus:ring-[#ff005c]/20 ${errors.email ? "border-red-400 bg-red-50" : "border-[#ffd1df] bg-[#fff7fa]"}`}
                />
                {errors.email && <p className="mt-1 text-xs font-bold text-red-500">{errors.email}</p>}
              </div>

              {/* Card number */}
              <div>
                <label className="mb-1.5 block text-sm font-black text-[#111111]">Card number</label>
                <div className={`flex h-12 items-center gap-3 rounded-2xl border px-4 transition focus-within:border-[#ff005c] focus-within:ring-2 focus-within:ring-[#ff005c]/20 ${errors.card ? "border-red-400 bg-red-50" : "border-[#ffd1df] bg-[#fff7fa]"}`}>
                  <span className="text-xl">💳</span>
                  <input
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    placeholder="1234 5678 9012 3456"
                    inputMode="numeric"
                    className="h-full flex-1 border-0 bg-transparent text-base font-bold outline-none placeholder:text-[#a6a0a4]"
                  />
                </div>
                {errors.card && <p className="mt-1 text-xs font-bold text-red-500">{errors.card}</p>}
              </div>

              {/* Expiry + CVV */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-black text-[#111111]">Expiry</label>
                  <input
                    value={expiry}
                    onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                    placeholder="MM / YY"
                    inputMode="numeric"
                    className={`h-12 w-full rounded-2xl border px-4 text-base font-bold outline-none transition focus:border-[#ff005c] focus:ring-2 focus:ring-[#ff005c]/20 ${errors.expiry ? "border-red-400 bg-red-50" : "border-[#ffd1df] bg-[#fff7fa]"}`}
                  />
                  {errors.expiry && <p className="mt-1 text-xs font-bold text-red-500">{errors.expiry}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-black text-[#111111]">CVV</label>
                  <input
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    placeholder="•••"
                    inputMode="numeric"
                    type="password"
                    className={`h-12 w-full rounded-2xl border px-4 text-base font-bold outline-none transition focus:border-[#ff005c] focus:ring-2 focus:ring-[#ff005c]/20 ${errors.cvv ? "border-red-400 bg-red-50" : "border-[#ffd1df] bg-[#fff7fa]"}`}
                  />
                  {errors.cvv && <p className="mt-1 text-xs font-bold text-red-500">{errors.cvv}</p>}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 flex h-16 w-full items-center justify-center gap-3 rounded-full bg-[#ff005c] text-xl font-black text-white shadow-[0_18px_38px_rgba(255,0,92,0.3)] transition hover:-translate-y-0.5 hover:bg-[#d9004e] active:scale-[0.98]"
            >
              🔓 Pay $9.99 — Unlock report
            </button>

            <p className="mt-3 text-center text-xs font-bold text-[#817781]">
              🔒 Payments are processed securely. This is a demo — no real charge is made.
            </p>
          </form>
        </div>

        {/* Right sidebar — trust + reviews */}
        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          {/* Trust badges */}
          <div className="rounded-[28px] border border-[#ffd1df] bg-white p-5 shadow-[0_18px_48px_rgba(255,0,92,0.07)]">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#ff005c]">Why it&apos;s safe</p>
            <div className="mt-4 grid gap-3">
              {trustBadges.map((badge) => (
                <div key={badge.label} className="flex items-center gap-3 rounded-2xl border border-[#ffd1df] bg-[#fff7fa] px-3 py-3 text-sm font-black text-[#111111]">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-base shadow-[0_4px_12px_rgba(255,0,92,0.08)]">
                    {badge.icon}
                  </span>
                  {badge.label}
                </div>
              ))}
            </div>
          </div>

          {/* Price summary */}
          <div className="rounded-[28px] bg-[#111111] p-5 text-white">
            <p className="text-sm font-black uppercase tracking-[0.14em] text-white/55">Order summary</p>
            <div className="mt-4 space-y-2 text-sm font-bold text-white/70">
              <div className="flex justify-between">
                <span>Full preview report</span>
                <span className="line-through">$19.99</span>
              </div>
              <div className="flex justify-between text-[#ff7a4a]">
                <span>🔥 Launch discount</span>
                <span>-$10.00</span>
              </div>
            </div>
            <div className="mt-4 flex justify-between border-t border-white/10 pt-4 text-xl font-black text-white">
              <span>Total</span>
              <span>$9.99</span>
            </div>
          </div>

          {/* Reviews */}
          <div className="rounded-[28px] border border-[#ffd1df] bg-white p-5 shadow-[0_18px_48px_rgba(255,0,92,0.07)]">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} className="text-[#00B67A]">★</span>
                ))}
              </div>
              <span className="text-sm font-black text-[#111111]">4.8 / 5 · 1,478 reviews</span>
            </div>
            <div className="mt-4 space-y-3">
              {reviewSnippets.map((r) => (
                <div key={r.name} className="rounded-2xl border border-[#ffd1df] bg-[#fff7fa] p-3">
                  <p className="text-sm font-semibold leading-5 text-[#3a3338]">&ldquo;{r.text}&rdquo;</p>
                  <p className="mt-2 text-xs font-black uppercase tracking-[0.1em] text-[#817781]">{r.name}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}

function ProcessingScreen() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,#ff005c,#ff4b2b)] px-5">
      <div className="w-full max-w-md rounded-[36px] border border-white/20 bg-white p-8 text-center shadow-[0_40px_100px_rgba(67,0,24,0.28)]">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#fff1f5]">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#ffd1df] border-t-[#ff005c]" />
        </div>
        <h2 className="mt-6 text-2xl font-black text-[#111111]">Processing payment…</h2>
        <p className="mt-2 text-sm font-semibold text-[#706872]">
          Please wait, we&apos;re verifying your payment and preparing your full report.
        </p>
        <div className="mt-6 overflow-hidden rounded-full bg-[#fff1f5]">
          <div className="rf-scan-bar h-2 rounded-full bg-[linear-gradient(90deg,#ff005c,#ffb000,#ff4b2b)]" style={{ width: "100%" }} />
        </div>
        <p className="mt-4 text-xs font-bold text-[#9a9299]">🔒 Your payment is secured with 256-bit SSL</p>
      </div>
    </main>
  );
}

function SuccessScreen({
  username,
  initialType,
  router,
}: {
  username: string;
  initialType: ActivityType;
  router: ReturnType<typeof useRouter>;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fff7fa] px-5">
      <div className="w-full max-w-lg rounded-[36px] border border-[#ffd1df] bg-white p-8 text-center shadow-[0_40px_100px_rgba(255,0,92,0.12)]">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[linear-gradient(135deg,#00B67A,#00d488)] text-3xl shadow-[0_18px_40px_rgba(0,182,122,0.24)]">
          ✓
        </div>
        <h1 className="mt-6 text-3xl font-black text-[#111111]">Payment confirmed!</h1>
        <p className="mt-3 text-base font-semibold leading-7 text-[#706872]">
          Your full report for <span className="font-black text-[#ff005c]">@{username}</span> is ready.
          We&apos;ve sent a copy to your email.
        </p>

        <div className="mt-6 grid gap-3 text-left">
          {[
            ["👤", "Profile", `@${username}`],
            ["📋", "Report type", initialType === "both" ? "Full account preview" : initialType === "following" ? "Following" : "Followers"],
            ["💳", "Amount paid", "$9.99"],
            ["✉️", "Delivery", "Email + instant access"],
          ].map(([icon, label, value]) => (
            <div key={label} className="flex items-center justify-between rounded-2xl border border-[#ffd1df] bg-[#fff7fa] px-4 py-3">
              <span className="flex items-center gap-2 text-sm font-black text-[#817781]">
                <span>{icon}</span>{label}
              </span>
              <span className="text-sm font-black text-[#111111]">{value}</span>
            </div>
          ))}
        </div>

        <button
          onClick={() => router.push(`/preview?username=${encodeURIComponent(username)}&type=${initialType}`)}
          className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#111111] text-base font-black text-white shadow-[0_18px_34px_rgba(17,17,17,0.2)] transition hover:-translate-y-0.5 hover:bg-[#242424]"
          type="button"
        >
          View full report →
        </button>
        <Link
          href="/"
          className="mt-3 block text-sm font-bold text-[#817781] underline underline-offset-2 hover:text-[#ff005c]"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
