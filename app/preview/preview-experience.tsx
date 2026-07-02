"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { InstagramListPreview, InstagramListUser, InstagramPreviewResponse } from "@/lib/instagramPreview";

type ActivityType = "following" | "followers" | "both";

function normalizeUsername(value: string) {
  return value.replace(/^@+/, "").trim();
}

function isValidUsername(value: string) {
  return /^[a-zA-Z0-9._]{2,30}$/.test(normalizeUsername(value));
}

function formatNumber(value: number | null) {
  if (typeof value !== "number") return "Unavailable";
  return new Intl.NumberFormat("en", { notation: value >= 10000 ? "compact" : "standard", maximumFractionDigits: 1 }).format(value);
}

function statusLabel(status: InstagramPreviewResponse["status"]) {
  if (status === "success") return "Live public profile";
  if (status === "private") return "Private account";
  if (status === "not_found") return "Not found";
  if (status === "auth_required") return "Instagram auth required";
  if (status === "rate_limited") return "Instagram rate limited";
  return "Instagram unavailable";
}

function instagramImageUrl(src: string) {
  return src ? `/api/instagram/image?url=${encodeURIComponent(src)}` : "";
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
  const [preview, setPreview] = useState<InstagramPreviewResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isValidUsername(username)) {
      router.replace("/");
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    fetch(`/api/instagram/preview?username=${encodeURIComponent(username)}`, { cache: "no-store" })
      .then(async (response) => {
        const data = (await response.json()) as InstagramPreviewResponse;
        if (!response.ok && data.status !== "not_found") {
          throw new Error(data.warnings?.[0] || "Instagram preview failed.");
        }
        return data;
      })
      .then((data) => {
        if (!cancelled) setPreview(data);
      })
      .catch((fetchError: unknown) => {
        if (!cancelled) setError(fetchError instanceof Error ? fetchError.message : "Instagram preview failed.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [router, username]);

  const visibleFollowers = initialType === "followers" || initialType === "both";
  const visibleFollowing = initialType === "following" || initialType === "both";

  return (
    <main className="min-h-screen bg-[#fff7fa] text-[#111111]">
      <header className="sticky top-0 z-40 border-b border-[#ffd1df] bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-5 lg:px-8">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#fff1f5]">
              <span className="h-4 w-4 rounded-full bg-[#ff005c] shadow-[0_0_0_8px_rgba(255,0,92,0.12)]" />
            </span>
            <span className="truncate text-base font-black uppercase tracking-normal sm:text-lg">Recently Followed</span>
          </Link>
          <span className="rounded-full bg-[#111111] px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-white sm:px-4">
            Instagram preview
          </span>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-5 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-8 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0">
          <section className="overflow-hidden rounded-[24px] bg-[linear-gradient(135deg,#ff005c_0%,#ff2d2d_54%,#ff5a2a_100%)] p-5 text-white shadow-[0_28px_90px_rgba(255,0,92,0.18)] sm:rounded-[34px] sm:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-white px-4 py-2 text-sm font-black text-[#ff005c]">@{username || "username"}</span>
              <span className="rounded-full border border-white/25 bg-white/15 px-4 py-2 text-sm font-black text-white backdrop-blur">
                {isLoading ? "Checking Instagram" : statusLabel(preview?.status || "error")}
              </span>
            </div>
            <h1 className="mt-6 max-w-3xl text-[clamp(2.4rem,8vw,3.75rem)] font-black leading-tight tracking-normal">Instagram preview</h1>
            <p className="mt-4 max-w-3xl text-base font-semibold leading-7 text-white/90 sm:text-lg sm:leading-8">
              Live public data from Instagram when available. Private accounts and auth-blocked lists are shown honestly instead of mocked.
            </p>
          </section>

          {isLoading && <LoadingCard username={username} />}
          {!isLoading && error && <ErrorCard message={error} />}
          {!isLoading && preview && <ProfilePanel preview={preview} />}

          {!isLoading && preview && (
            <div className="mt-6 grid gap-5 xl:grid-cols-2">
              {visibleFollowers && <ListPanel title="First followers" list={preview.followers} emptyLabel="followers" />}
              {visibleFollowing && <ListPanel title="First following" list={preview.following} emptyLabel="following" />}
            </div>
          )}

          {!isLoading && preview?.warnings.length ? (
            <section className="mt-6 rounded-[24px] border border-[#ffd1df] bg-white p-5 shadow-[0_18px_48px_rgba(255,0,92,0.08)]">
              <p className="text-sm font-black uppercase tracking-[0.16em] text-[#ff005c]">Instagram response</p>
              <div className="mt-3 grid gap-2">
                {preview.warnings.map((warning) => (
                  <p key={warning} className="rounded-2xl bg-[#fff7fa] px-4 py-3 text-sm font-bold leading-6 text-[#706872]">
                    {warning}
                  </p>
                ))}
              </div>
            </section>
          ) : null}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[24px] border border-[#ffd1df] bg-white p-4 shadow-[0_20px_54px_rgba(17,17,17,0.07)] sm:rounded-[28px] sm:p-5">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#ff005c]">Integrated provider</p>
            <h2 className="mt-3 text-2xl font-black leading-tight tracking-normal">AI-FOLLOWING logic</h2>
            <p className="mt-3 text-sm font-semibold leading-6 text-[#706872]">
              Username normalization, status handling, public-only boundaries, and Instagram web requests are adapted from the SALPROFINDER/AI-FOLLOWING approach.
            </p>

            <div className="mt-5 grid gap-2">
              {[
                "Profile photo and public counters",
                "Private account detection",
                "Followers/following list attempt",
                "No fake rows when Instagram blocks access",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-[#ffe0e8] bg-[#fff9fb] px-3 py-3 text-sm font-black text-[#111111]">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white text-[#ff005c]">✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <p className="mt-5 rounded-[22px] border border-[#e8f5ef] bg-[#f7fffb] px-4 py-4 text-sm font-bold leading-6 text-[#53635c]">
              Pour afficher les 10 followers/following, Instagram doit accepter l&apos;appel GraphQL. En local, ajoute `INSTAGRAM_SESSIONID` dans `.env` si tu veux tester avec une session autorisée.
            </p>

            <Link
              href="/"
              className="mt-5 flex h-12 items-center justify-center rounded-2xl bg-[#111111] px-5 text-sm font-black text-white transition hover:bg-[#262626]"
            >
              Run another preview
            </Link>
          </div>
        </aside>
      </section>
    </main>
  );
}

function LoadingCard({ username }: { username: string }) {
  return (
    <section className="mt-6 rounded-[24px] border border-[#ffd1df] bg-white p-6 shadow-[0_18px_48px_rgba(255,0,92,0.08)]">
      <div className="flex items-center gap-4">
        <span className="h-14 w-14 animate-pulse rounded-full bg-[#fff1f5]" />
        <div className="min-w-0">
          <p className="truncate text-lg font-black text-[#111111] sm:text-xl">Checking @{username}</p>
          <p className="mt-1 text-sm font-bold text-[#706872]">Fetching public Instagram profile data...</p>
        </div>
      </div>
    </section>
  );
}

function ErrorCard({ message }: { message: string }) {
  return (
    <section className="mt-6 rounded-[24px] border border-[#ffb0c4] bg-white p-6 shadow-[0_18px_48px_rgba(255,0,92,0.08)]">
      <p className="text-xl font-black text-[#c1003d]">Preview unavailable</p>
      <p className="mt-2 text-sm font-bold leading-6 text-[#706872]">{message}</p>
    </section>
  );
}

function ProfilePanel({ preview }: { preview: InstagramPreviewResponse }) {
  const profile = preview.profile;

  if (!profile) {
    return (
      <section className="mt-6 rounded-[24px] border border-[#ffd1df] bg-white p-6 shadow-[0_18px_48px_rgba(255,0,92,0.08)]">
        <p className="text-xl font-black text-[#111111]">Profile not found</p>
        <p className="mt-2 text-sm font-bold text-[#706872]">Instagram did not return a profile for this username.</p>
      </section>
    );
  }

  return (
    <section className="mt-6 overflow-hidden rounded-[24px] border border-[#ffd1df] bg-white shadow-[0_18px_48px_rgba(255,0,92,0.08)] sm:rounded-[32px]">
      <div className="grid gap-5 p-5 sm:grid-cols-[auto_minmax(0,1fr)] sm:p-6">
        <InstagramAvatar
          src={profile.profilePicUrl}
          username={profile.username}
          alt={`${profile.username} Instagram profile`}
          className="h-24 w-24 rounded-[26px] sm:h-28 sm:w-28 sm:rounded-[28px]"
        />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="min-w-0 break-words text-[clamp(1.75rem,6vw,2.5rem)] font-black leading-tight tracking-normal text-[#111111]">@{profile.username}</h2>
            {profile.isVerified && <span className="rounded-full bg-[#e9f4ff] px-3 py-1 text-xs font-black text-[#0077c8]">Verified</span>}
            {profile.isPrivate && <span className="rounded-full bg-[#fff1f5] px-3 py-1 text-xs font-black text-[#ff005c]">Private</span>}
          </div>
          {profile.fullName && <p className="mt-1 text-lg font-black text-[#706872]">{profile.fullName}</p>}
          {profile.biography && <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-[#706872]">{profile.biography}</p>}
          <a href={profile.instagramUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex rounded-full bg-[#111111] px-5 py-3 text-sm font-black text-white">
            Open on Instagram
          </a>
        </div>
      </div>

      <div className="grid border-t border-[#ffe0e8] bg-[#fff9fb] min-[520px]:grid-cols-3">
        <Metric label="Followers" value={formatNumber(profile.followersCount)} />
        <Metric label="Following" value={formatNumber(profile.followingCount)} />
        <Metric label="Posts" value={formatNumber(profile.postsCount)} />
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-[#ffe0e8] p-4 last:border-b-0 min-[520px]:border-b-0 min-[520px]:border-r min-[520px]:last:border-r-0 sm:p-5">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-[#817781] sm:text-sm">{label}</p>
      <p className="mt-2 text-2xl font-black text-[#111111] sm:text-3xl">{value}</p>
    </div>
  );
}

function ListPanel({ title, list, emptyLabel }: { title: string; list: InstagramListPreview; emptyLabel: string }) {
  const ok = list.status === "success" && list.items.length > 0;

  return (
    <section className="overflow-hidden rounded-[24px] border border-[#ffd1df] bg-white shadow-[0_18px_48px_rgba(255,0,92,0.08)]">
      <div className="border-b border-[#ffe0e8] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-[#ff005c]">{title}</p>
            <h3 className="mt-2 text-2xl font-black text-[#111111]">{ok ? `${list.items.length} accounts` : "Not available"}</h3>
          </div>
          <span className={`rounded-full px-3 py-2 text-xs font-black uppercase ${ok ? "bg-[#eafff4] text-[#009a63]" : "bg-[#fff1f5] text-[#ff005c]"}`}>
            {list.status}
          </span>
        </div>
        <p className="mt-3 text-sm font-bold leading-6 text-[#706872]">{list.message}</p>
      </div>

      {ok ? (
        <div className="divide-y divide-[#f5e5eb]">
          {list.items.map((item) => (
            <AccountRow key={`${emptyLabel}-${item.id || item.username}`} item={item} />
          ))}
        </div>
      ) : (
        <div className="p-5">
          <p className="rounded-2xl bg-[#fff7fa] px-4 py-4 text-sm font-bold leading-6 text-[#706872]">
            Impossible d&apos;afficher les 10 premiers {emptyLabel} pour ce compte avec la réponse actuelle d&apos;Instagram.
          </p>
        </div>
      )}
    </section>
  );
}

function AccountRow({ item }: { item: InstagramListUser }) {
  return (
    <a
      href={`https://www.instagram.com/${item.username}/`}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-3 px-5 py-4 transition hover:bg-[#fff9fb]"
    >
      <InstagramAvatar
        src={item.profilePicUrl}
        username={item.username}
        alt={`${item.username} profile`}
        className="h-12 w-12 rounded-full"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-base font-black text-[#111111]">@{item.username}</p>
          {item.isVerified && <span className="shrink-0 text-[#0077c8]">✓</span>}
        </div>
        <p className="truncate text-sm font-bold text-[#817781]">{item.fullName || (item.isPrivate ? "Private profile" : "Instagram profile")}</p>
      </div>
      <span className="shrink-0 text-sm font-black text-[#ff005c]">Open</span>
    </a>
  );
}

function InstagramAvatar({
  src,
  username,
  alt,
  className,
}: {
  src: string;
  username: string;
  alt: string;
  className: string;
}) {
  const [failed, setFailed] = useState(false);
  const initials = username.slice(0, 2).toUpperCase() || "IG";

  if (!src || failed) {
    return (
      <span
        className={`grid shrink-0 place-items-center border border-[#ffe0e8] bg-[linear-gradient(135deg,#feda75,#fa7e1e,#d62976,#962fbf,#4f5bd)] text-sm font-black text-white shadow-[0_18px_42px_rgba(17,17,17,0.12)] ${className}`}
        aria-label={alt}
      >
        {initials}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={instagramImageUrl(src)}
      alt={alt}
      onError={() => setFailed(true)}
      className={`shrink-0 border border-[#ffe0e8] object-cover shadow-[0_18px_42px_rgba(17,17,17,0.12)] ${className}`}
    />
  );
}
