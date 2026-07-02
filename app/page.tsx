"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";

type ModalState = "closed" | "login";

type FormState = "empty" | "invalid" | "loading" | "success" | "error";

const mediaNames = ["Daily Mail", "The Sun", "VICE", "Forbes"];
const loadingSteps = ["Checking the public profile", "Reading public signals", "Preparing your preview"];
const previewProfiles = ["mika.studio", "noa.archive", "lena.daily"];
const assetPath = "/assets/recently-followed";
const userAvatars = [
  `${assetPath}/user-avatar-1.png`,
  `${assetPath}/user-avatar-2.png`,
  `${assetPath}/user-avatar-3.png`,
  `${assetPath}/user-avatar-4.png`,
];

const formFeatures = [
  ["🌍", "Public profiles only"],
  ["🔐", "No login required"],
  ["🤫", "Private search"],
  ["✨", "Clean preview"],
];

const popularSearches = [
  "Who did they recently follow?",
  "Can you see Instagram following order?",
  "Recently followed Instagram checker",
  "Instagram following activity preview",
];

const socialCards = [
  {
    tag: "Preview",
    number: "01",
    title: "See recent follows clearly",
    subtitle: "Clean public follow preview",
    body: "A simple report highlights recent public following activity without clutter or confusing screens.",
    visual: "preview",
  },
  {
    tag: "Privacy",
    number: "02",
    title: "Read masked results fast",
    subtitle: "Masked usernames, clear rows",
    body: "Partially hidden usernames and structured rows make the result easy to read while keeping the preview discreet.",
    visual: "privacy",
  },
  {
    tag: "Fast",
    number: "03",
    title: "Get a simple report in minutes",
    subtitle: "No noise, just the result",
    body: "Open the preview, review the public signals, and understand the result immediately. No messy dashboard, no extra steps.",
    visual: "fast",
  },
] as const;

const reviews = [
  {
    name: "Maya",
    text: "The preview is quick, clear, and easy to read. Exactly what I needed.",
  },
  {
    name: "Theo",
    text: "The flow is simple, no login is required, and the report feels polished.",
  },
  {
    name: "Nora",
    text: "The interface feels premium and the information is easy to scan.",
  },
];

const faqs = [
  {
    question: "Can I see who someone recently followed on Instagram?",
    answer: "You can generate a preview for public Instagram profiles. The page is designed around public following activity signals only.",
  },
  {
    question: "Can I check private Instagram accounts?",
    answer: "No. Recently Followed only supports public profiles. Private accounts and private data are not accessible.",
  },
  {
    question: "Do I need to log in?",
    answer: "No. The preview flow does not require your Instagram login or password.",
  },
  {
    question: "What does the preview show?",
    answer: "It shows a clean preview format for recent public following or follower activity, with locked rows after the first visible matches.",
  },
  {
    question: "Is this real-time?",
    answer: "The experience is built as a fast public preview. Availability depends on public profile signals and should not be treated as private account access.",
  },
  {
    question: "Is this affiliated with Instagram or Meta?",
    answer: "No. Recently Followed is not affiliated with Instagram, Meta, or any related brand.",
  },
];

export default function Home() {
  const [modal, setModal] = useState<ModalState>("closed");

  return (
    <main className="min-h-screen bg-white text-[#111111]">
      <SiteHeader onLoginClick={() => setModal("login")} />
      <div className="mx-auto w-full max-w-7xl px-5 pb-16 pt-6 lg:px-8">
        <HeroContent />
        <PopularSearches />
        <HowItWorks />
        <SocialProof />
        <Reviews />
        <Faq />
      </div>
      <Footer />
      {modal === "login" && <LoginModal onClose={() => setModal("closed")} />}
    </main>
  );
}

function LoginModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-5"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-[32px] border border-[#ffd1df] bg-white p-7 shadow-[0_40px_100px_rgba(255,0,92,0.18)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <span className="inline-grid h-14 w-14 place-items-center rounded-full bg-[#fff1f5] text-2xl">🔐</span>
          <h2 className="mt-4 text-2xl font-black text-[#111111]">Sign in</h2>
          <p className="mt-2 text-sm font-semibold text-[#706872]">
            Accounts are coming soon. All previews are currently available without a login.
          </p>
        </div>
        <div className="mt-6 grid gap-3">
          <div className="flex items-center gap-3 rounded-2xl border border-[#ffd1df] bg-[#fff7fa] px-4 py-3 text-sm font-black text-[#111111]">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-[#ff005c]">✓</span>
            No account needed for public previews
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-[#ffd1df] bg-[#fff7fa] px-4 py-3 text-sm font-black text-[#111111]">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-[#ff005c]">✓</span>
            Saved reports will require sign-in (coming soon)
          </div>
        </div>
        <button
          onClick={onClose}
          className="mt-6 h-12 w-full rounded-full bg-[#050505] text-sm font-black text-white transition hover:bg-[#1a1a1a]"
          type="button"
        >
          Got it, continue without login
        </button>
      </div>
    </div>
  );
}

function SiteHeader({ onLoginClick }: { onLoginClick: () => void }) {
  return (
    <header className="sticky top-0 z-40 border-b border-[#ffd1df] bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 lg:px-8">
        <Link href="/" className="group flex items-center gap-3" aria-label="recently-followed home">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-[#fff7fa] shadow-[0_18px_45px_rgba(255,0,92,0.12)]">
            <span className="h-4 w-4 rounded-full bg-[#ff005c] shadow-[0_0_0_8px_rgba(255,0,92,0.13)]" />
          </span>
          <span className="text-xl font-black uppercase tracking-normal text-[#111111]">Recently Followed</span>
        </Link>
        <nav className="flex items-center gap-3 text-sm font-black text-[#111111]">
          <a href="#faq" className="hidden rounded-full px-4 py-2 transition hover:bg-[#fff7fa] sm:inline-flex">
            FAQ
          </a>
          <button
            onClick={onLoginClick}
            className="rounded-full px-4 py-2 transition hover:bg-[#fff7fa]"
            type="button"
          >
            Login
          </button>
          <span className="rounded-2xl bg-[#050505] px-5 py-3 text-white shadow-sm cursor-default select-none">
            🌐 EN
          </span>
        </nav>
      </div>
    </header>
  );
}

function HeroContent() {
  return (
    <section className="relative overflow-hidden rounded-[30px] bg-[linear-gradient(135deg,#ff005c_0%,#ff2d2d_55%,#ff5a2a_100%)] px-5 py-8 text-white shadow-[0_34px_90px_rgba(255,0,92,0.18)] sm:rounded-[36px] sm:px-8 sm:py-12 lg:px-10 lg:py-14">
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <div className="rf-float absolute left-[8%] top-20 h-48 w-48 rounded-full border border-white/30" />
        <div className="rf-float-delayed absolute bottom-10 right-[18%] h-72 w-72 rounded-full border border-white/20" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(180deg,transparent,rgba(255,255,255,0.18))]" />
      </div>

      <div className="relative z-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(360px,460px)] lg:items-center">
        <div>
          <div className="w-fit rounded-full border border-white/[0.24] bg-white/[0.16] px-4 py-2 shadow-[0_20px_55px_rgba(89,0,30,0.14)] backdrop-blur">
            <div className="flex items-center gap-3 text-sm font-black uppercase leading-none tracking-[0.14em] text-white">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-white text-[#ff005c]">✓</span>
              <span>Public Instagram following preview</span>
            </div>
          </div>

          <h1 className="mt-7 max-w-4xl text-[clamp(2.55rem,6.5vw,6.8rem)] font-black leading-[0.94] tracking-normal text-white sm:mt-9">
            See recent Instagram follows in minutes
          </h1>

          <p className="mt-5 max-w-3xl text-lg font-semibold leading-[1.42] text-white/[0.92] md:mt-6 md:text-[1.75rem]">
            Enter a public Instagram username and generate a clean preview of recent public following activity. No login required.
          </p>

          <div className="mt-7 hidden rounded-[26px] border border-white/[0.18] bg-white/[0.10] p-4 backdrop-blur sm:block">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-white/70">As seen on</p>
            <div className="mt-3 flex flex-wrap items-center gap-x-8 gap-y-2">
              {mediaNames.map((name) => (
                <span key={name} className="text-2xl font-black italic text-white/[0.46] md:text-3xl">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:justify-self-end">
          <CheckerCard />
        </div>
      </div>
    </section>
  );
}

function PopularSearches() {
  return (
    <section className="mt-8 rounded-[32px] border border-[#ffd1df] bg-[#fff7fa] p-5 sm:p-6">
      <p className="text-sm font-black uppercase tracking-[0.18em] text-[#ff005c]">Popular searches</p>
      <div className="mt-4 flex flex-wrap gap-3">
        {popularSearches.map((search) => (
          <span key={search} className="rounded-full border border-[#ffd1df] bg-white px-4 py-3 text-sm font-black text-[#111111] shadow-[0_12px_30px_rgba(255,0,92,0.06)]">
            {search}
          </span>
        ))}
      </div>
    </section>
  );
}

function CheckerCard() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [formState, setFormState] = useState<FormState>("empty");
  const [activeStep, setActiveStep] = useState(0);

  const cleanUsername = useMemo(() => username.replace(/^@+/, "").trim(), [username]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const isValid = /^[a-zA-Z0-9._]{2,30}$/.test(cleanUsername);

    if (!isValid) {
      setFormState("invalid");
      setActiveStep(0);
      return;
    }

    setFormState("loading");
    setActiveStep(0);

    loadingSteps.forEach((_, index) => {
      window.setTimeout(() => setActiveStep(index), index * 240);
    });

    window.setTimeout(() => {
      router.push(`/analyze?username=${encodeURIComponent(cleanUsername)}&type=both`);
    }, 720);
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-[30px] border border-[#ffd1df] bg-white p-4 text-[#111111] shadow-[0_24px_70px_rgba(255,0,92,0.16)] sm:p-5"
    >
      <div className="text-center">
        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#ff005c]">Public preview</p>
        <h2 className="mt-2 text-[1.85rem] font-black leading-none tracking-normal text-[#111111] sm:text-[2.1rem]">Who do you want to check?</h2>
      </div>

      <label className="mt-5 block">
        <span className="mb-2 block text-sm font-black text-[#111111]">Instagram username</span>
        <span className="flex h-[3.25rem] items-center gap-3 rounded-2xl border border-[#ffd1df] bg-[#fff7fa] px-4 shadow-[0_12px_28px_rgba(255,0,92,0.05)] focus-within:border-[#ff005c]">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-white text-lg font-black text-[#ff005c] shadow-[0_8px_18px_rgba(255,0,92,0.06)]">@</span>
          <input
            value={username}
            onChange={(event) => {
              setUsername(event.target.value);
              if (formState !== "loading") {
                setFormState("empty");
              }
            }}
            placeholder="@username"
            className="h-full min-w-0 flex-1 border-0 bg-transparent text-base font-bold text-[#111111] outline-none placeholder:text-[#a6a0a4]"
            aria-invalid={formState === "invalid"}
          />
        </span>
      </label>

      <div className="mt-4 rounded-2xl border border-[#ffd1df] bg-[#fff7fa] px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-lg shadow-[0_8px_18px_rgba(255,0,92,0.08)]">🔎</span>
          <div>
            <p className="text-sm font-black text-[#111111]">Full account preview</p>
            <p className="mt-0.5 text-xs font-bold text-[#706872]">Checks public follower and following signals together.</p>
          </div>
        </div>
      </div>

      {formState === "invalid" && (
        <p className="mt-3 rounded-2xl border border-[#ffb0c4] bg-[#fff1f5] px-4 py-3 text-sm font-bold text-[#c1003d]">
          Use 2-30 letters, numbers, dots, or underscores.
        </p>
      )}

      <button
        type="submit"
        disabled={formState === "loading"}
        className="relative mt-5 flex h-16 w-full items-center justify-center gap-3 rounded-full bg-[#050505] px-6 text-[1.28rem] font-black leading-none text-white shadow-[0_18px_38px_rgba(5,5,5,0.22)] transition hover:-translate-y-0.5 hover:bg-[#1a1a1a] disabled:cursor-not-allowed disabled:opacity-70 sm:h-[4.1rem] sm:text-[1.45rem]"
      >
        {formState === "loading" ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Checking...
          </span>
        ) : (
          "Reveal recent follows →"
        )}
      </button>

      <p className="mt-2 text-center text-sm font-black text-[#777177]">Get your preview in a few seconds</p>
      <BenefitPills />

      <TrustMini />

      {(formState === "loading" || formState === "success" || formState === "error") && (
        <div className="mt-5 rounded-3xl border border-[#ffe0e8] bg-[#fff7f9] p-4">
          {formState === "loading" && <LoadingPanel activeStep={activeStep} />}
          {formState === "success" && <SuccessPanel username={cleanUsername} />}
          {formState === "error" && <ErrorPanel />}
        </div>
      )}

      <p className="mt-4 text-center text-xs font-bold text-[#8b858b]">Public profiles only. Not affiliated with Instagram or Meta.</p>
    </form>
  );
}

function BenefitPills() {
  return (
    <div className="mt-4 grid grid-cols-2 gap-2">
      {formFeatures.map(([icon, label]) => (
        <div key={label} className="flex items-center gap-2 rounded-2xl border border-[#ffd1df] bg-[#fff7fa] px-3 py-3 shadow-[0_12px_26px_rgba(255,0,92,0.05)]">
          <span className="text-lg leading-none">{icon}</span>
          <p className="text-[11px] font-black uppercase leading-tight tracking-normal text-[#111111]">{label}</p>
        </div>
      ))}
    </div>
  );
}

function TrustMini() {
  return (
    <div className="mt-4 rounded-[24px] border border-[#e8f5ef] bg-[linear-gradient(180deg,#ffffff,#fbfffd)] px-4 py-4 shadow-[0_14px_34px_rgba(17,17,17,0.06)]">
      <div className="flex items-center gap-4">
        <div className="shrink-0">
          <div className="flex -space-x-3">
            {userAvatars.map((avatar, index) => (
              <Image
                key={avatar}
                src={avatar}
                width={42}
                height={42}
                alt={`Fictional platform user ${index + 1}`}
                className="h-10 w-10 rounded-full border-2 border-white object-cover shadow-[0_8px_18px_rgba(17,17,17,0.12)]"
              />
            ))}
            <span className="grid h-10 w-10 place-items-center rounded-full border-2 border-white bg-[#111111] text-xs font-black text-white shadow-[0_8px_20px_rgba(17,17,17,0.14)]">
              1K+
            </span>
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <p className="text-base font-black text-[#111111]">Excellent</p>
            <span className="text-sm font-black text-[#111111]">
              <span className="text-[#00B67A]">4.8</span> out of 5
            </span>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className="grid h-6 w-6 place-items-center rounded-md bg-[#00B67A] text-xs font-black text-white shadow-[0_8px_18px_rgba(0,182,122,0.18)]">
                  ★
                </span>
              ))}
              <span className="ml-1 text-sm font-black text-[#00B67A]">★</span>
              <span className="text-sm font-black text-[#1f2130]">TrustScore</span>
          </div>
          <p className="mt-1 text-sm font-black text-[#111111]">Based on 1478+ reviews</p>
        </div>
      </div>
    </div>
  );
}

function LoadingPanel({ activeStep }: { activeStep: number }) {
  return (
    <div className="mt-4 grid gap-2">
      {loadingSteps.map((step, index) => (
        <div key={step} className="flex items-center gap-3 rounded-2xl bg-white px-3 py-3">
          <span className={`h-3 w-3 rounded-full ${index <= activeStep ? "bg-[#FF005C]" : "bg-[#ffd0dc]"}`} />
          <span className="text-sm font-bold text-[#3a3338]">{step}</span>
        </div>
      ))}
    </div>
  );
}

function SuccessPanel({ username }: { username: string }) {
  const router = useRouter();

  return (
    <div className="mt-4">
      <div className="mb-3 rounded-2xl bg-white px-4 py-3 text-sm font-black text-[#111111]">
        Preview ready for @{username || "username"}
      </div>
      <div className="grid gap-3">
        {previewProfiles.map((profile, index) => (
          <div key={profile} className="flex items-center gap-3 rounded-2xl bg-white p-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-[linear-gradient(135deg,#FF005C,#FF4B2B)] text-sm font-black text-white">
              {index + 1}
            </span>
            <div className="min-w-0 flex-1">
              <div className="h-3 w-28 rounded-full bg-[#111111]/20 blur-[1px]" />
              <div className="mt-2 h-2 w-40 max-w-full rounded-full bg-[#FF005C]/[0.16]" />
            </div>
            <span className="text-xs font-black text-[#FF005C]">{profile.slice(0, 2)}***</span>
          </div>
        ))}
      </div>
      <button
        className="mt-4 h-12 w-full rounded-full bg-[#FF005C] text-sm font-black text-white shadow-[0_18px_34px_rgba(255,0,92,0.28)] transition hover:-translate-y-0.5 hover:bg-[#d9004e]"
        type="button"
        onClick={() => router.push(`/preview?username=${encodeURIComponent(username)}&type=both`)}
      >
        View preview →
      </button>
    </div>
  );
}

function ErrorPanel() {
  return (
    <div className="mt-4 rounded-2xl border border-[#ffb0c4] bg-white px-4 py-4">
      <p className="text-sm font-black text-[#c1003d]">Preview unavailable</p>
      <p className="mt-1 text-sm font-bold text-[#777177]">Check the username or try another public profile.</p>
    </div>
  );
}

function SocialProof() {
  return (
    <section className="mt-8">
      <div>
        <div className="mb-8 grid gap-4 rounded-[30px] border border-[#ffd1df] bg-[#fff7fa] p-4 shadow-[0_22px_70px_rgba(255,0,92,0.08)] sm:grid-cols-2 xl:grid-cols-4">
          {[
            ["1 handle", "Start simple", "Start with a single public Instagram username."],
            ["Public only", "Clear limits", "The flow is limited to visible public-profile signals."],
            ["Masked rows", "Discreet output", "Partial usernames keep the preview discreet and easy to scan."],
            ["No login", "Low friction", "No Instagram password or account connection required."],
          ].map(([metric, title, copy]) => (
            <div key={title} className="rounded-[22px] bg-white p-5">
              <p className="text-3xl font-black text-[#ff005c]">{metric}</p>
              <h3 className="mt-3 text-lg font-black text-[#111111]">{title}</h3>
              <p className="mt-2 text-sm font-bold leading-6 text-[#706872]">{copy}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#ff005c]">Preview format</p>
            <h2 className="mt-3 max-w-2xl text-4xl font-black tracking-normal text-[#111111] md:text-5xl">A preview you can understand in seconds</h2>
          </div>
          <p className="max-w-md text-base font-semibold leading-7 text-[#706872]">
            See recent follows, masked rows, and simple status labels in a report that&apos;s easy to scan.
          </p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {socialCards.map((card) => (
            <article
              key={card.title}
              className="group overflow-hidden rounded-[28px] border border-[#ffd1df] bg-white shadow-[0_22px_70px_rgba(255,0,92,0.09)] transition duration-300 hover:-translate-y-1"
            >
              <div className="relative min-h-[280px] bg-[linear-gradient(135deg,#ff005c_0%,#ff3b45_56%,#ff7a4a_100%)] p-4 sm:min-h-[310px] sm:p-5">
                <div className="flex items-center justify-between">
                  <span className="rounded-full border border-white/20 bg-white/20 px-4 py-2 text-sm font-black text-white shadow-[0_14px_30px_rgba(99,0,30,0.12)] backdrop-blur">
                    {card.tag}
                  </span>
                  <span className="grid h-12 w-12 place-items-center rounded-full border border-white/55 bg-white/18 text-base font-black text-white backdrop-blur">
                    {card.number}
                  </span>
                </div>
                <ReportMockup visual={card.visual} />
              </div>

              <div className="p-5 sm:p-6">
                <p className="text-sm font-black uppercase tracking-[0.12em] text-[#ff005c]">{card.subtitle}</p>
                <h3 className="mt-3 text-xl font-black leading-tight tracking-normal text-[#111111] sm:text-2xl">{card.title}</h3>
                <p className="mt-3 text-sm font-semibold leading-6 text-[#706872]">{card.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ReportMockup({ visual }: { visual: (typeof socialCards)[number]["visual"] }) {
  if (visual === "privacy") {
    return (
      <div className="mt-4 rounded-[24px] border border-white/30 bg-white p-3 shadow-[0_24px_56px_rgba(75,0,24,0.18)] sm:mt-5 sm:rounded-[26px] sm:p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#ff005c]">Masked list</p>
            <p className="mt-1 text-xl font-black text-[#111111]">Public follow rows</p>
          </div>
          <span className="rounded-full bg-[#fff1f5] px-3 py-2 text-xs font-black text-[#ff005c]">Discreet</span>
        </div>
        <div className="mt-4 grid gap-2">
          {[
            ["@sa***_studio", "2m ago", "New follow"],
            ["@ma***_daily", "15m ago", "Public"],
            ["@tr***_way", "28m ago", "New follow"],
            ["@fi***_lena", "39m ago", "Public"],
          ].map(([handle, time, status], index) => (
            <div key={handle} className={`grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-[#ffe0e8] bg-[#fff9fb] px-3 py-3 ${index === 3 ? "hidden sm:grid" : "grid"}`}>
              <div className="min-w-0">
                <p className="truncate text-sm font-black text-[#111111]">{handle}</p>
                <p className="text-xs font-bold text-[#8a8289]">{time}</p>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-[11px] font-black text-[#ff005c] shadow-[0_8px_18px_rgba(255,0,92,0.08)]">{status}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (visual === "fast") {
    return (
      <div className="mt-4 rounded-[24px] border border-white/30 bg-white p-3 shadow-[0_24px_56px_rgba(75,0,24,0.18)] sm:mt-5 sm:rounded-[26px] sm:p-4">
        <div className="flex items-start gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#fff1f5] text-2xl">✓</span>
          <div className="min-w-0">
            <p className="text-xl font-black text-[#111111]">Preview ready</p>
            <p className="mt-1 text-sm font-bold text-[#7d747b]">Simple public activity report</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            ["Public", "Profile"],
            ["24", "Recent follows"],
            ["High", "Activity signal"],
          ].map(([value, label]) => (
            <div key={label} className="rounded-2xl border border-[#ffe0e8] bg-[#fff9fb] p-3 text-center">
              <p className="text-lg font-black text-[#ff005c]">{value}</p>
              <p className="mt-1 text-[10px] font-black uppercase leading-tight text-[#6f666d]">{label}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-2xl border border-[#ffe0e8] bg-white px-3 py-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-black text-[#111111]">Follow radar</p>
            <span className="rounded-full bg-[#eafff4] px-3 py-1 text-[11px] font-black text-[#009a63]">Ready</span>
          </div>
          <div className="mt-3 flex items-center gap-3 rounded-xl bg-[#fff7fa] px-3 py-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff005c] shadow-[0_0_0_7px_rgba(255,0,92,0.12)]" />
            <p className="text-xs font-black text-[#111111]">New public follow detected</p>
          </div>
        </div>
      </div>
    );
  }

  return (
      <div className="mt-4 rounded-[24px] border border-white/30 bg-white p-3 shadow-[0_24px_56px_rgba(75,0,24,0.18)] sm:mt-5 sm:rounded-[26px] sm:p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#ff005c]">Activity report</p>
          <p className="mt-1 text-xl font-black text-[#111111]">Recent public follows</p>
        </div>
        <span className="rounded-full bg-[#fff1f5] px-3 py-2 text-xs font-black text-[#ff005c]">Live preview</span>
      </div>
      <div className="mt-4 rounded-2xl border border-[#ffe0e8] bg-[#fff9fb] p-3">
        {[
          ["sarah.johns...", "2m ago"],
          ["martin.wilde...", "15m ago"],
          ["traveldiary_...", "28m ago"],
          ["fit.with.lena...", "39m ago"],
        ].map(([handle, time], index) => (
          <div key={handle} className={`items-center gap-3 border-b border-[#f4e4e9] py-3 last:border-b-0 ${index === 3 ? "hidden sm:flex" : "flex"}`}>
            <span className="h-9 w-9 shrink-0 rounded-full bg-[linear-gradient(135deg,#ffe0e9,#ff7a4a)]" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-black text-[#111111]">{handle}</p>
              <p className="text-xs font-bold text-[#8a8289]">{time}</p>
            </div>
            <span className="rounded-full bg-[#fff1f5] px-3 py-1 text-[11px] font-black text-[#ff005c]">New follow</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function HowItWorks() {
  const steps = [
    ["@", "Enter a public username", "Paste any public Instagram handle. No login, password, or account connection required."],
    ["⌁", "We scan public activity", "Our system checks available public signals and prepares a readable activity preview."],
    ["☰", "Preview the report", "See a clean summary with masked rows, recent follow signals, and clear status labels."],
    ["🔓", "Unlock the full report", "If the preview looks useful, unlock the full report to view the complete results."],
  ];

  return (
    <section className="mt-8 rounded-[32px] bg-[#fff7fa] p-5 sm:p-6">
      <div>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#ff005c]">Simple flow</p>
            <h2 className="mt-3 max-w-2xl text-4xl font-black tracking-normal text-[#111111] md:text-5xl">How it works</h2>
          </div>
          <p className="max-w-md text-base font-semibold leading-7 text-[#706872]">
            From a public username to a clean preview in just a few steps.
          </p>
        </div>

        <div className="relative mt-8 grid gap-5 md:grid-cols-4">
          <div className="pointer-events-none absolute left-[12%] right-[12%] top-12 hidden h-px bg-[linear-gradient(90deg,rgba(255,0,92,0),rgba(255,0,92,0.35),rgba(255,90,42,0.35),rgba(255,0,92,0))] md:block" />
          {steps.map(([icon, title, copy], index) => (
            <article
              key={title}
              className="group relative rounded-[24px] border border-[#ffd1df] bg-white p-5 shadow-[0_18px_50px_rgba(255,0,92,0.08)] transition duration-300 hover:-translate-y-1 hover:border-[#ff7a9f] hover:shadow-[0_26px_70px_rgba(255,0,92,0.14)]"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-[linear-gradient(135deg,#ff005c,#ff4b2b)] text-lg font-black text-white shadow-[0_16px_32px_rgba(255,0,92,0.22)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#fff1f5] text-xl font-black text-[#ff005c] transition group-hover:bg-[#111111] group-hover:text-white">
                  {icon}
                </span>
              </div>
              <h3 className="mt-7 text-xl font-black leading-tight text-[#111111]">{title}</h3>
              <p className="mt-3 text-sm font-semibold leading-6 text-[#706872]">{copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Reviews() {
  return (
    <section className="mt-8 rounded-[32px] bg-[#111111] p-5 text-white sm:p-6">
      <div>
        <div className="mb-8 grid gap-4 rounded-[28px] border border-white/10 bg-white/[0.06] p-4 md:grid-cols-[0.8fr_1.2fr] md:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#ff5a2a]">TrustScore</p>
            <p className="mt-2 text-5xl font-black text-white">4.8<span className="text-xl text-white/[0.45]">/5</span></p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
            <div className="flex -space-x-4">
              {userAvatars.map((avatar, index) => (
                <Image
                  key={avatar}
                  src={avatar}
                  width={56}
                  height={56}
                  alt={`Fictional reviewer ${index + 1}`}
                  className="h-12 w-12 rounded-full border-2 border-[#111111] object-cover"
                />
              ))}
              <span className="grid h-12 w-12 place-items-center rounded-full border-2 border-[#111111] bg-white text-xs font-black text-[#111111]">1K+</span>
            </div>
            <div>
              <p className="text-xl font-black text-white">1,478+ reviews</p>
              <p className="mt-1 text-sm font-bold text-white/[0.55]">Excellent rating from verified review signals.</p>
            </div>
          </div>
        </div>
        <h2 className="max-w-3xl text-4xl font-black tracking-normal md:text-5xl">Short reviews, clear expectations.</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {reviews.map((review) => (
            <article key={review.name} className="rounded-[28px] border border-white/10 bg-white/[0.06] p-7">
              <p className="text-lg font-black text-[#FF4B2B]">*****</p>
              <p className="mt-5 text-lg font-semibold leading-8 text-white/[0.86]">{review.text}</p>
              <p className="mt-6 text-sm font-black uppercase tracking-[0.16em] text-white/50">{review.name}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section id="faq" className="mt-8 rounded-[32px] border border-[#ffd1df] bg-white p-5 sm:p-6">
      <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#ff005c]">FAQ</p>
          <h2 className="mt-3 text-4xl font-black tracking-normal md:text-5xl">Clear answers.</h2>
        </div>
        <div className="grid gap-3">
          {faqs.map((item) => (
            <details key={item.question} className="group rounded-[24px] border border-[#ffd1df] bg-white p-5 shadow-[0_16px_42px_rgba(255,0,92,0.07)]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-lg font-black text-[#111111]">
                {item.question}
                <span className="faq-icon grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#fff1f5] text-[#FF005C]">+</span>
              </summary>
              <div className="faq-body">
                <p className="pt-4 text-base font-semibold leading-7 text-[#625b62]">{item.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[#ffd0dc] bg-[#fff7f9] px-5 py-10 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm font-bold text-[#625b62] md:flex-row md:items-center md:justify-between">
        <p className="text-lg font-black text-[#111111]">recently-followed</p>
        <p>Public profiles only. Not affiliated with Instagram or Meta.</p>
      </div>
    </footer>
  );
}
