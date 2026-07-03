"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import type { InstagramPreviewResponse } from "@/lib/instagramPreview";

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

const productImages = [
  {
    src: `${assetPath}/following-preview.png`,
    alt: "Recently Followed following preview screen",
    title: "Following preview",
  },
  {
    src: `${assetPath}/followers-preview.png`,
    alt: "Recently Followed followers preview screen",
    title: "Followers preview",
  },
  {
    src: `${assetPath}/privacy-preview.png`,
    alt: "Recently Followed privacy preview screen",
    title: "Privacy preview",
  },
  {
    src: `${assetPath}/social-dashboard.png`,
    alt: "Recently Followed social dashboard screen",
    title: "Social dashboard",
  },
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

const liveInstagramExamples = [
  { username: "instagram", label: "Official platform" },
  { username: "natgeo", label: "Publisher account" },
  { username: "nike", label: "Brand account" },
];

const reviews = [
  {
    handle: "@creator_ops",
    name: "Philip D.",
    source: "Trustpilot",
    sourceUrl: "https://www.trustpilot.com/review/recentfollow.com",
    date: "Apr 2026",
    text: "Gave me insights I could not get anywhere else and helped me keep track of trends.",
  },
  {
    handle: "@growth_lena",
    name: "SourceForge reviewer",
    source: "SourceForge",
    sourceUrl: "https://sourceforge.net/software/product/RecentFollow/",
    date: "May 2026",
    text: "The dashboard is simple, the process takes seconds, and the anonymous check is useful.",
  },
  {
    handle: "@agency_daily",
    name: "RecentFollow user",
    source: "Trustpilot",
    sourceUrl: "https://www.trustpilot.com/review/recentfollow.com",
    date: "Mar 2026",
    text: "Fast, accurate updates without needing logins or complex dashboards.",
  },
  {
    handle: "@social_research",
    name: "Slashdot reviewer",
    source: "Slashdot",
    sourceUrl: "https://slashdot.org/software/p/RecentFollow/",
    date: "May 2026",
    text: "Friendly and professional for tracking Instagram activity, with a simple flow.",
  },
  {
    handle: "@ugc_mika",
    name: "Trustpilot reviewer",
    source: "Trustpilot",
    sourceUrl: "https://www.trustpilot.com/review/recentfollow.com",
    date: "2026",
    text: "Clear enough to understand the result quickly, especially on public profile checks.",
  },
  {
    handle: "@brand_watch",
    name: "Public review",
    source: "Review site",
    sourceUrl: "https://www.trustpilot.com/review/recentfollow.com",
    date: "2026",
    text: "Useful for checking visible signals without handing over an Instagram password.",
  },
];

const ugcItems = [
  {
    image: `${assetPath}/user-avatar-1.png`,
    name: "Maya",
    role: "Creator manager",
    quote: "I use it before partnership checks so the first screen has to be readable on mobile.",
  },
  {
    image: `${assetPath}/user-avatar-2.png`,
    name: "Theo",
    role: "Social analyst",
    quote: "The masked rows make it easier to share a preview without exposing every detail.",
  },
  {
    image: `${assetPath}/user-avatar-3.png`,
    name: "Nora",
    role: "UGC lead",
    quote: "I mostly need quick public signals, not a heavy dashboard. This feels lighter.",
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
      <div className="mx-auto w-full max-w-7xl px-0 pb-12 pt-0 sm:px-5 sm:pb-16 sm:pt-6 lg:px-8">
        <HeroContent />
        <PopularSearches />
        <ProductGallery />
        <HowItWorks />
        <SocialProof />
        <Reviews />
        <UgcSection />
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
        <Link
          href="/dashboard"
          className="mt-3 flex h-12 w-full items-center justify-center rounded-full bg-[#ff005c] text-sm font-black text-white transition hover:bg-[#db0050]"
        >
          Open demo dashboard
        </Link>
      </div>
    </div>
  );
}

function SiteHeader({ onLoginClick }: { onLoginClick: () => void }) {
  return (
    <header className="absolute inset-x-0 top-0 z-40 border-transparent bg-transparent text-white sm:sticky sm:border-b sm:border-[#ffd1df] sm:bg-white/90 sm:text-[#111111] sm:backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-5 sm:py-5 lg:px-8">
        <Link href="/" className="group flex items-center gap-3" aria-label="recently-followed home">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-white/20 shadow-[0_18px_45px_rgba(99,0,30,0.14)] backdrop-blur sm:h-11 sm:w-11 sm:bg-[#fff7fa] sm:shadow-[0_18px_45px_rgba(255,0,92,0.12)]">
            <span className="h-4 w-4 rounded-full bg-white shadow-[0_0_0_7px_rgba(255,255,255,0.18)] sm:bg-[#ff005c] sm:shadow-[0_0_0_8px_rgba(255,0,92,0.13)]" />
          </span>
          <span className="max-w-[12rem] truncate text-base font-black uppercase tracking-normal text-white drop-shadow-[0_8px_22px_rgba(99,0,30,0.20)] sm:max-w-none sm:text-xl sm:text-[#111111] sm:drop-shadow-none">Recently Followed</span>
        </Link>
        <nav className="flex items-center gap-2 text-sm font-black text-white sm:gap-3 sm:text-[#111111]">
          <a href="#faq" className="hidden rounded-full px-4 py-2 transition hover:bg-[#fff7fa] sm:inline-flex">
            FAQ
          </a>
          <button
            onClick={onLoginClick}
            className="rounded-full bg-white/16 px-4 py-2 shadow-[0_12px_30px_rgba(99,0,30,0.12)] backdrop-blur transition hover:bg-white/24 sm:bg-transparent sm:shadow-none sm:backdrop-blur-none sm:hover:bg-[#fff7fa]"
            type="button"
          >
            Login
          </button>
          <span className="hidden rounded-2xl bg-[#050505] px-5 py-3 text-white shadow-sm cursor-default select-none sm:inline-flex">
            🌐 EN
          </span>
        </nav>
      </div>
    </header>
  );
}

function HeroContent() {
  return (
    <section className="relative w-full overflow-hidden rounded-none bg-[linear-gradient(135deg,#ff005c_0%,#ff2d2d_55%,#ff5a2a_100%)] px-3 pb-4 pt-[5rem] text-white shadow-[0_34px_90px_rgba(255,0,92,0.18)] sm:rounded-[30px] sm:px-8 sm:py-12 lg:px-10 lg:py-14">
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <div className="rf-float absolute left-[8%] top-20 h-48 w-48 rounded-full border border-white/30" />
        <div className="rf-float-delayed absolute bottom-10 right-[18%] h-72 w-72 rounded-full border border-white/20" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(180deg,transparent,rgba(255,255,255,0.18))]" />
      </div>

      <div className="relative z-10 grid min-w-0 gap-4 sm:gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(360px,460px)] lg:items-center">
        <div>
          <div className="w-fit max-w-full rounded-full border border-white/[0.24] bg-white/[0.16] px-2.5 py-1.5 shadow-[0_20px_55px_rgba(89,0,30,0.14)] backdrop-blur sm:px-4 sm:py-2">
            <div className="flex min-w-0 items-center gap-2 text-[9px] font-black uppercase leading-none tracking-[0.06em] text-white min-[390px]:text-[10px] sm:gap-3 sm:text-sm sm:tracking-[0.14em]">
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-white text-xs text-[#ff005c] sm:h-6 sm:w-6 sm:text-base">✓</span>
              <span className="min-w-0 truncate">Public Instagram following preview</span>
            </div>
          </div>

          <h1 className="mt-3 max-w-4xl text-[clamp(1.78rem,8.7vw,2.55rem)] font-black leading-[0.95] tracking-normal text-white min-[390px]:text-[clamp(1.95rem,9.4vw,2.85rem)] sm:mt-9 sm:text-[clamp(2.35rem,8vw,6.1rem)]">
            See recent Instagram follows in minutes
          </h1>

          <p className="mt-2.5 max-w-3xl text-[0.82rem] font-semibold leading-[1.28] text-white/[0.92] min-[390px]:text-[0.9rem] sm:mt-4 sm:text-lg md:mt-6 md:text-[1.75rem]">
            Enter a public Instagram username and generate a clean preview of recent public following activity. No login required.
          </p>

          <HeroMobileProof />

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

        <div className="min-w-0 lg:justify-self-end">
          <CheckerCard />
        </div>
      </div>
    </section>
  );
}

function PopularSearches() {
  return (
    <section className="mx-3 mt-8 rounded-[28px] border border-[#ffd1df] bg-[#fff7fa] p-4 sm:mx-0 sm:rounded-[32px] sm:p-6">
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

function HeroMobileProof() {
  return (
    <div className="mt-3 flex items-center justify-between gap-2 rounded-2xl border border-white/20 bg-white/14 px-3 py-2 shadow-[0_18px_40px_rgba(99,0,30,0.12)] backdrop-blur sm:hidden">
      <div className="flex min-w-0 items-center gap-2">
        <div className="flex -space-x-2">
          {userAvatars.slice(0, 3).map((avatar, index) => (
            <Image
              key={avatar}
              src={avatar}
              width={26}
              height={26}
              alt={`Reviewer ${index + 1}`}
              className="h-6 w-6 rounded-full border-2 border-white object-cover"
            />
          ))}
          <span className="grid h-6 w-6 place-items-center rounded-full border-2 border-white bg-[#111111] text-[8px] font-black text-white">
            1K+
          </span>
        </div>
        <p className="min-w-0 truncate text-[11px] font-black leading-tight text-white">
          4.8/5 from 1,478+ reviews
        </p>
      </div>
      <span className="shrink-0 rounded-full bg-white px-2 py-1 text-[10px] font-black text-[#ff005c]">No login</span>
    </div>
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
      className="w-full min-w-0 rounded-[22px] border border-[#ffd1df] bg-white p-3 text-[#111111] shadow-[0_24px_70px_rgba(255,0,92,0.16)] sm:rounded-[30px] sm:p-5"
    >
      <div className="text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#ff005c] sm:text-[11px] sm:tracking-[0.18em]">Public preview</p>
        <h2 className="mx-auto mt-1.5 max-w-[18rem] text-[clamp(1.25rem,6vw,1.62rem)] font-black leading-[1.02] tracking-normal text-[#111111] sm:mt-2 sm:max-w-none sm:text-[2.1rem]">Who do you want to check?</h2>
      </div>

      <label className="mt-3 block sm:mt-5">
        <span className="mb-2 flex items-center justify-between gap-3 text-sm font-black text-[#111111]">
          <span>Instagram username</span>
          <span className="rf-input-hint inline-flex items-center gap-1 rounded-full bg-[#fff1f5] px-3 py-1 text-xs font-black text-[#ff005c]">
            <span>Fill here</span>
            <span aria-hidden="true">👇</span>
          </span>
        </span>
        <span className="relative flex h-[3.05rem] items-center gap-3 rounded-2xl border border-[#ffd1df] bg-[#fff7fa] px-3 shadow-[0_12px_28px_rgba(255,0,92,0.05)] focus-within:border-[#ff005c] sm:h-[3.25rem] sm:px-4">
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
            className="h-full min-w-0 flex-1 border-0 bg-transparent pr-8 text-base font-bold text-[#111111] outline-none placeholder:text-[#a6a0a4] sm:pr-10"
            aria-invalid={formState === "invalid"}
          />
          {!username && (
            <span className="rf-input-finger pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-2xl drop-shadow-[0_8px_12px_rgba(255,0,92,0.18)]" aria-hidden="true">
              👈
            </span>
          )}
        </span>
      </label>

      <div className="mt-3 rounded-2xl border border-[#ffd1df] bg-[#fff7fa] px-3 py-2.5 sm:mt-4 sm:px-4 sm:py-3">
        <div className="flex items-center gap-3">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-base shadow-[0_8px_18px_rgba(255,0,92,0.08)] sm:h-9 sm:w-9 sm:text-lg">🔎</span>
          <div>
            <p className="text-sm font-black text-[#111111]">Full account preview</p>
            <p className="mt-0.5 text-[11px] font-bold leading-tight text-[#706872] sm:text-xs">Checks public follower and following signals together.</p>
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
        className="group relative mt-4 flex h-14 w-full items-center justify-center overflow-hidden rounded-full border-2 border-white bg-[linear-gradient(135deg,#ff005c_0%,#ff2d55_48%,#ff7a2a_100%)] px-4 text-[1rem] font-black leading-none text-white shadow-[0_18px_36px_rgba(255,0,92,0.34),0_0_0_5px_rgba(255,0,92,0.10)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_44px_rgba(255,0,92,0.42),0_0_0_7px_rgba(255,0,92,0.13)] disabled:cursor-not-allowed disabled:opacity-70 sm:mt-5 sm:h-[4.1rem] sm:px-5 sm:text-[1.38rem]"
      >
        <span className="pointer-events-none absolute inset-x-8 top-0 h-px bg-white/70" />
        <span className="pointer-events-none absolute -left-16 top-0 h-full w-16 -skew-x-12 bg-white/25 transition duration-700 group-hover:left-[115%]" />
        {formState === "loading" ? (
          <span className="relative z-10 flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Checking...
          </span>
        ) : (
          <span className="relative z-10 flex w-full items-center justify-center gap-3 sm:gap-4">
            <span className="flex min-w-0 items-center justify-center gap-2 sm:gap-3">
              <span className="truncate">Analyze profile now</span>
              <span aria-hidden="true" className="text-[1.35em] leading-none transition group-hover:translate-x-1">
                →
              </span>
            </span>
            <span className="rf-finger text-2xl leading-none drop-shadow-[0_6px_10px_rgba(255,196,0,0.24)] sm:text-3xl" aria-hidden="true">👉</span>
          </span>
        )}
      </button>

      <p className="mt-1.5 text-center text-[11px] font-black text-[#777177] sm:mt-2 sm:text-sm">Get your preview in a few seconds</p>
      <BenefitPills />

      <TrustMini />

      {(formState === "loading" || formState === "success" || formState === "error") && (
        <div className="mt-5 rounded-3xl border border-[#ffe0e8] bg-[#fff7f9] p-4">
          {formState === "loading" && <LoadingPanel activeStep={activeStep} />}
          {formState === "success" && <SuccessPanel username={cleanUsername} />}
          {formState === "error" && <ErrorPanel />}
        </div>
      )}

      <p className="mt-4 hidden text-center text-xs font-bold text-[#8b858b] sm:block">Public profiles only. Not affiliated with Instagram or Meta.</p>
    </form>
  );
}

function BenefitPills() {
  return (
    <div className="mt-4 hidden grid-cols-2 gap-2 sm:grid">
      {formFeatures.map(([icon, label]) => (
        <div key={label} className="flex items-center gap-2 rounded-2xl border border-[#ffd1df] bg-[#fff7fa] px-3 py-3 shadow-[0_12px_26px_rgba(255,0,92,0.05)]">
          <span className="text-lg leading-none">{icon}</span>
          <p className="text-[11px] font-black uppercase leading-tight tracking-normal text-[#111111]">{label}</p>
        </div>
      ))}
    </div>
  );
}

function ProductGallery() {
  return (
    <section className="mx-3 mt-8 overflow-hidden rounded-[24px] border border-[#ffd1df] bg-white p-4 shadow-[0_20px_60px_rgba(255,0,92,0.07)] sm:mx-0 sm:rounded-[30px] sm:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#ff005c]">Real screens</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-normal text-[#111111] sm:text-4xl md:text-5xl">Photos and previews, not empty promises.</h2>
        </div>
        <p className="max-w-md text-base font-semibold leading-7 text-[#706872]">
          Swipe with your finger or drag with the mouse to review the actual preview surfaces.
        </p>
      </div>

      <div className="rf-touch-scroll mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3">
        {productImages.map((image) => (
          <article
            key={image.src}
            className="min-w-[82%] snap-start overflow-hidden rounded-[22px] border border-[#ffe0e8] bg-[#fff7fa] sm:min-w-[44%] lg:min-w-[24rem]"
          >
            <div className="relative aspect-[4/3] bg-white">
              <Image src={image.src} alt={image.alt} fill sizes="(max-width: 640px) 82vw, (max-width: 1024px) 44vw, 384px" className="object-cover" />
            </div>
            <div className="flex items-center justify-between gap-3 p-4">
              <p className="text-base font-black text-[#111111]">{image.title}</p>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#ff005c]">Swipe</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function TrustMini() {
  return (
    <div className="mt-4 hidden rounded-[18px] border border-[#e8f5ef] bg-[linear-gradient(180deg,#ffffff,#fbfffd)] px-3 py-3 shadow-[0_12px_26px_rgba(17,17,17,0.05)] sm:block">
      <div className="flex items-center gap-3">
        <div className="shrink-0">
          <div className="flex -space-x-2">
            {userAvatars.map((avatar, index) => (
              <Image
                key={avatar}
                src={avatar}
                width={32}
                height={32}
                alt={`Fictional platform user ${index + 1}`}
                className="h-8 w-8 rounded-full border-2 border-white object-cover shadow-[0_7px_14px_rgba(17,17,17,0.10)]"
              />
            ))}
            <span className="grid h-8 w-8 place-items-center rounded-full border-2 border-white bg-[#111111] text-[10px] font-black text-white shadow-[0_7px_16px_rgba(17,17,17,0.12)]">
              1K+
            </span>
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
            <p className="text-sm font-black text-[#111111]">Excellent</p>
            <span className="text-xs font-black text-[#111111]">
              <span className="text-[#00B67A]">4.8</span> out of 5
            </span>
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className="grid h-4 w-4 place-items-center rounded bg-[#00B67A] text-[9px] font-black text-white shadow-[0_6px_14px_rgba(0,182,122,0.16)]">
                  ★
                </span>
              ))}
              <span className="ml-0.5 text-xs font-black text-[#1f2130]">TrustScore</span>
          </div>
          <p className="mt-1 truncate text-xs font-black text-[#111111]">Based on 1478+ reviews</p>
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
    <section className="mx-3 mt-8 sm:mx-0">
      <div>
        <div className="mb-7 grid gap-3 rounded-[24px] border border-[#ffd1df] bg-[#fff7fa] p-3 shadow-[0_18px_54px_rgba(255,0,92,0.07)] sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Live profiles", "Photos and public counters from Instagram."],
            ["Private aware", "Private accounts are labelled instead of faked."],
            ["No blur bait", "The preview shows clear rows and real status."],
            ["Mobile first", "Cards resize without giant cropped mockups."],
          ].map(([title, copy]) => (
            <div key={title} className="rounded-[18px] bg-white px-4 py-3">
              <h3 className="text-sm font-black text-[#111111]">{title}</h3>
              <p className="mt-1 text-xs font-bold leading-5 text-[#706872]">{copy}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#ff005c]">Live Instagram examples</p>
            <h2 className="mt-3 max-w-2xl text-[clamp(2.15rem,6vw,3.25rem)] font-black leading-[1.02] tracking-normal text-[#111111]">
              Real profiles, real photos, real public counters.
            </h2>
          </div>
          <p className="max-w-md text-base font-semibold leading-7 text-[#706872]">
            These examples use public Instagram profile data through the same preview endpoint as the app flow.
          </p>
        </div>

        <LiveInstagramExamples />
      </div>
    </section>
  );
}

function LiveInstagramExamples() {
  const [examples, setExamples] = useState<InstagramPreviewResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    Promise.all(
      liveInstagramExamples.map((item) =>
        fetch(`/api/instagram/preview?username=${encodeURIComponent(item.username)}`, { cache: "no-store" })
          .then((response) => response.json() as Promise<InstagramPreviewResponse>)
          .catch(() => null),
      ),
    ).then((items) => {
      if (!cancelled) {
        setExamples(items.filter((item): item is InstagramPreviewResponse => Boolean(item?.profile)));
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mt-7 grid gap-4 lg:grid-cols-3">
      {(loading ? liveInstagramExamples : examples).map((item, index) => {
        if ("username" in item) {
          return <InstagramExampleSkeleton key={item.username} username={item.username} label={item.label} />;
        }

        const meta = liveInstagramExamples.find((example) => example.username === item.profile?.username);
        return <InstagramExampleCard key={item.profile?.username || index} preview={item} label={meta?.label || "Public account"} />;
      })}
    </div>
  );
}

function InstagramExampleSkeleton({ username, label }: { username: string; label: string }) {
  return (
    <article className="rounded-[24px] border border-[#ffd1df] bg-white p-4 shadow-[0_18px_54px_rgba(255,0,92,0.08)]">
      <div className="flex items-center gap-3">
        <span className="h-16 w-16 shrink-0 animate-pulse rounded-[22px] bg-[#fff1f5]" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-black uppercase tracking-[0.12em] text-[#ff005c]">{label}</p>
          <p className="mt-1 truncate text-xl font-black text-[#111111]">@{username}</p>
          <p className="mt-1 text-xs font-bold text-[#817781]">Loading public profile...</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {[1, 2, 3].map((item) => (
          <span key={item} className="h-14 animate-pulse rounded-2xl bg-[#fff7fa]" />
        ))}
      </div>
    </article>
  );
}

function InstagramExampleCard({ preview, label }: { preview: InstagramPreviewResponse; label: string }) {
  const profile = preview.profile;
  if (!profile) return null;

  return (
    <article className="overflow-hidden rounded-[24px] border border-[#ffd1df] bg-white shadow-[0_18px_54px_rgba(255,0,92,0.08)]">
      <div className="bg-[linear-gradient(135deg,#fff7fa,#ffffff)] p-4">
        <div className="flex items-center gap-3">
          <span className="grid h-[4.45rem] w-[4.45rem] shrink-0 place-items-center rounded-[24px] bg-[conic-gradient(from_210deg,#feda75,#fa7e1e,#d62976,#962fbf,#4f5bd,#feda75)] p-[3px]">
            {profile.profilePicUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`/api/instagram/image?url=${encodeURIComponent(profile.profilePicUrl)}`}
                alt={`${profile.username} Instagram profile`}
                className="h-full w-full rounded-[21px] border-2 border-white object-cover"
              />
            ) : (
              <span className="grid h-full w-full place-items-center rounded-[21px] border-2 border-white bg-[#111111] text-sm font-black text-white">
                {profile.username.slice(0, 2).toUpperCase()}
              </span>
            )}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate text-xl font-black text-[#111111]">@{profile.username}</p>
              {profile.isVerified && <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#0095f6] text-[11px] font-black text-white">✓</span>}
            </div>
            <p className="mt-1 truncate text-sm font-black text-[#706872]">{profile.fullName || label}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="rounded-full bg-[#fff1f5] px-3 py-1 text-[11px] font-black uppercase text-[#ff005c]">{label}</span>
              <span className={`rounded-full px-3 py-1 text-[11px] font-black uppercase ${profile.isPrivate ? "bg-[#fff1f5] text-[#ff005c]" : "bg-[#eafff4] text-[#009a63]"}`}>
                {profile.isPrivate ? "Private" : "Public"}
              </span>
            </div>
          </div>
        </div>

        {profile.biography && <p className="mt-4 line-clamp-2 text-sm font-semibold leading-6 text-[#706872]">{profile.biography}</p>}
      </div>

      <div className="grid grid-cols-3 border-t border-[#ffe0e8] bg-white">
        <MiniMetric label="Followers" value={formatPublicCount(profile.followersCount)} />
        <MiniMetric label="Following" value={formatPublicCount(profile.followingCount)} />
        <MiniMetric label="Posts" value={formatPublicCount(profile.postsCount)} />
      </div>
    </article>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-r border-[#ffe0e8] px-3 py-3 text-center last:border-r-0">
      <p className="text-lg font-black text-[#111111]">{value}</p>
      <p className="mt-1 text-[10px] font-black uppercase leading-tight text-[#817781]">{label}</p>
    </div>
  );
}

function formatPublicCount(value: number | null) {
  if (typeof value !== "number") return "-";
  return new Intl.NumberFormat("en", { notation: value >= 10000 ? "compact" : "standard", maximumFractionDigits: 1 }).format(value);
}

function HowItWorks() {
  const steps = [
    ["@", "Enter a public username", "Paste any public Instagram handle. No login, password, or account connection required."],
    ["⌁", "We scan public activity", "Our system checks available public signals and prepares a readable activity preview."],
    ["☰", "Preview the report", "See a clean summary with masked rows, recent follow signals, and clear status labels."],
    ["🔓", "Unlock the full report", "If the preview looks useful, unlock the full report to view the complete results."],
  ];

  return (
    <section className="mx-3 mt-8 rounded-[28px] bg-[#fff7fa] p-4 sm:mx-0 sm:rounded-[32px] sm:p-6">
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
    <section className="mx-3 mt-8 rounded-[24px] bg-[#111111] p-4 text-white sm:mx-0 sm:rounded-[32px] sm:p-6">
      <div>
        <div className="mb-8 grid gap-4 rounded-[22px] border border-white/10 bg-white/[0.06] p-4 md:grid-cols-[0.8fr_1.2fr] md:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#ff5a2a]">Public review signals</p>
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
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#ff5a2a]">Social-style reviews</p>
            <h2 className="mt-3 max-w-3xl text-3xl font-black tracking-normal sm:text-4xl md:text-5xl">Swipe the public reviews.</h2>
          </div>
          <p className="max-w-md text-sm font-bold leading-6 text-white/55">
            Review-site excerpts formatted as swipeable social cards, with source labels kept visible.
          </p>
        </div>
        <div className="rf-touch-scroll mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3">
          {reviews.map((review) => (
            <article key={`${review.source}-${review.handle}`} className="min-w-[84%] snap-start rounded-[24px] border border-white/10 bg-white/[0.06] p-5 sm:min-w-[21rem] sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="truncate text-base font-black text-white">{review.handle}</p>
                  <p className="mt-1 text-xs font-black uppercase tracking-[0.14em] text-white/45">{review.source} · {review.date}</p>
                </div>
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-sm font-black text-[#111111]">X</span>
              </div>
              <p className="mt-5 text-lg font-semibold leading-8 text-white/[0.86]">{review.text}</p>
              <div className="mt-6 flex items-center justify-between gap-4 border-t border-white/10 pt-4">
                <p className="truncate text-sm font-black text-white/65">{review.name}</p>
                <a
                  href={review.sourceUrl}
                  className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-black text-[#111111] transition hover:bg-[#ffefe9]"
                  target="_blank"
                  rel="noreferrer"
                >
                  Source
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function UgcSection() {
  return (
    <section className="mx-3 mt-8 rounded-[24px] border border-[#d9efe7] bg-[#f7fffb] p-4 sm:mx-0 sm:rounded-[32px] sm:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#009a63]">UGC</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-normal text-[#111111] sm:text-4xl md:text-5xl">Creator-style proof that feels alive.</h2>
        </div>
        <p className="max-w-md text-base font-semibold leading-7 text-[#53635c]">
          Lightweight user cards, real faces from the asset set, and compact quotes that scan on mobile.
        </p>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
        <div className="overflow-hidden rounded-[22px] border border-[#cfe9df] bg-white">
          <div className="relative aspect-[4/3] min-h-[250px]">
            <Image
              src={`${assetPath}/fictitious-users-contact-sheet.png`}
              alt="Contact sheet of platform user avatars"
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
          </div>
        </div>
        <div className="grid gap-3">
          {ugcItems.map((item) => (
            <article key={item.name} className="flex gap-4 rounded-[22px] border border-[#cfe9df] bg-white p-4 shadow-[0_18px_42px_rgba(0,154,99,0.07)]">
              <Image src={item.image} width={56} height={56} alt={`${item.name} avatar`} className="h-14 w-14 shrink-0 rounded-2xl object-cover" />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <p className="font-black text-[#111111]">{item.name}</p>
                  <span className="rounded-full bg-[#eafff4] px-2 py-1 text-[11px] font-black uppercase text-[#009a63]">{item.role}</span>
                </div>
                <p className="mt-2 text-sm font-semibold leading-6 text-[#53635c]">{item.quote}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section id="faq" className="mx-3 mt-8 rounded-[28px] border border-[#ffd1df] bg-white p-4 sm:mx-0 sm:rounded-[32px] sm:p-6">
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
