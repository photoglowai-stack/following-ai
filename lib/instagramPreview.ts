export type InstagramPreviewStatus = "success" | "private" | "not_found" | "auth_required" | "rate_limited" | "error";

export interface InstagramPreviewUser {
  id: string;
  username: string;
  fullName: string;
  profilePicUrl: string;
  isPrivate: boolean;
  isVerified: boolean;
  biography: string;
  followersCount: number | null;
  followingCount: number | null;
  postsCount: number | null;
  instagramUrl: string;
}

export interface InstagramListUser {
  id: string;
  username: string;
  fullName: string;
  profilePicUrl: string;
  isVerified: boolean;
  isPrivate: boolean;
}

export interface InstagramListPreview {
  status: InstagramPreviewStatus;
  items: InstagramListUser[];
  message: string;
}

export interface InstagramPreviewResponse {
  status: InstagramPreviewStatus;
  profile: InstagramPreviewUser | null;
  followers: InstagramListPreview;
  following: InstagramListPreview;
  warnings: string[];
  source: "instagram_web";
}

type JsonRecord = Record<string, unknown>;

const BLACKLISTED_SEGMENTS = new Set([
  "p",
  "reel",
  "reels",
  "stories",
  "tv",
  "explore",
  "direct",
  "developer",
  "about",
  "blog",
  "press",
  "api",
  "jobs",
  "privacy",
  "terms",
  "directory",
  "channels",
]);

const QUERY_HASH = {
  followers: "37479f2b8209594dde7facb0d904896a",
  following: "58712303d941c6855d4e888c5f0cd22f",
} as const;

const EDGE_NAME = {
  followers: "edge_followed_by",
  following: "edge_follow",
} as const;

export function normalizeInstagramUsername(input: string): string {
  if (!input) {
    throw new Error("Username input cannot be empty");
  }

  let cleaned = input.trim().replace(/^@+/, "");
  if (cleaned.includes("instagram.com")) {
    if (!/^https?:\/\//i.test(cleaned)) {
      cleaned = `https://${cleaned}`;
    }
    const url = new URL(cleaned);
    const firstSegment = url.pathname.split("/").filter(Boolean)[0]?.toLowerCase();
    if (!firstSegment || BLACKLISTED_SEGMENTS.has(firstSegment)) {
      throw new Error("Invalid Instagram profile URL.");
    }
    cleaned = firstSegment;
  }

  const username = cleaned.toLowerCase().replace(/\/+$/, "");
  if (!/^[a-z0-9._]{1,30}$/.test(username)) {
    throw new Error("Invalid Instagram username.");
  }
  return username;
}

function instagramHeaders(username: string): HeadersInit {
  const headers: Record<string, string> = {
    "Accept": "application/json,text/plain,*/*",
    "Referer": `https://www.instagram.com/${username}/`,
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
    "X-IG-App-ID": "936619743392459",
    "X-Requested-With": "XMLHttpRequest",
  };

  if (process.env.INSTAGRAM_SESSIONID) {
    headers.Cookie = `sessionid=${process.env.INSTAGRAM_SESSIONID}`;
  }

  return headers;
}

function emptyList(status: InstagramPreviewStatus, message: string): InstagramListPreview {
  return { status, items: [], message };
}

function mapStatus(status: number, text: string): InstagramPreviewStatus {
  const lower = text.toLowerCase();
  if (status === 404 || lower.includes("not found")) return "not_found";
  if (status === 401 || lower.includes("require_login") || lower.includes("login")) return "auth_required";
  if (status === 429 || lower.includes("please wait") || lower.includes("rate")) return "rate_limited";
  return "error";
}

function asRecord(value: unknown): JsonRecord {
  return value && typeof value === "object" ? (value as JsonRecord) : {};
}

function stringField(record: JsonRecord, key: string): string {
  const value = record[key];
  return typeof value === "string" ? value : "";
}

function booleanField(record: JsonRecord, key: string): boolean {
  return Boolean(record[key]);
}

function countField(record: JsonRecord, key: string): number | null {
  const nested = asRecord(record[key]);
  return typeof nested.count === "number" ? nested.count : null;
}

function parseProfile(userValue: unknown): InstagramPreviewUser {
  const user = asRecord(userValue);
  const username = stringField(user, "username");
  return {
    id: stringField(user, "id"),
    username,
    fullName: stringField(user, "full_name"),
    profilePicUrl: stringField(user, "profile_pic_url_hd") || stringField(user, "profile_pic_url"),
    isPrivate: booleanField(user, "is_private"),
    isVerified: booleanField(user, "is_verified"),
    biography: stringField(user, "biography"),
    followersCount: countField(user, "edge_followed_by"),
    followingCount: countField(user, "edge_follow"),
    postsCount: countField(user, "edge_owner_to_timeline_media"),
    instagramUrl: `https://www.instagram.com/${username}/`,
  };
}

function parseListNode(nodeValue: unknown): InstagramListUser {
  const node = asRecord(nodeValue);
  return {
    id: stringField(node, "id"),
    username: stringField(node, "username"),
    fullName: stringField(node, "full_name"),
    profilePicUrl: stringField(node, "profile_pic_url"),
    isVerified: booleanField(node, "is_verified"),
    isPrivate: booleanField(node, "is_private"),
  };
}

async function fetchProfile(username: string): Promise<{ profile: InstagramPreviewUser | null; status: InstagramPreviewStatus; warning?: string }> {
  const response = await fetch(`https://www.instagram.com/api/v1/users/web_profile_info/?username=${encodeURIComponent(username)}`, {
    headers: instagramHeaders(username),
    cache: "no-store",
  });
  const text = await response.text();

  if (!response.ok) {
    return {
      profile: null,
      status: mapStatus(response.status, text),
      warning: `Instagram profile request failed with HTTP ${response.status}.`,
    };
  }

  try {
    const payload = asRecord(JSON.parse(text));
    const user = asRecord(asRecord(payload.data).user);
    if (!user) {
      return { profile: null, status: "not_found", warning: "Instagram did not return a profile for this username." };
    }
    const profile = parseProfile(user);
    return { profile, status: profile.isPrivate ? "private" : "success" };
  } catch {
    return { profile: null, status: "error", warning: "Instagram returned a non-JSON profile response." };
  }
}

async function fetchList(username: string, profileId: string, listType: keyof typeof QUERY_HASH): Promise<InstagramListPreview> {
  const variables = encodeURIComponent(JSON.stringify({ id: profileId, first: 10, after: "" }));
  const response = await fetch(
    `https://www.instagram.com/graphql/query/?query_hash=${QUERY_HASH[listType]}&variables=${variables}`,
    {
      headers: instagramHeaders(username),
      cache: "no-store",
    },
  );
  const text = await response.text();

  if (!response.ok) {
    const status = mapStatus(response.status, text);
    const message =
      status === "auth_required"
        ? "Instagram requires an authenticated session before exposing this list."
        : status === "rate_limited"
          ? "Instagram rate-limited the list request. Try again later."
          : `Instagram list request failed with HTTP ${response.status}.`;
    return emptyList(status, message);
  }

  try {
    const payload = asRecord(JSON.parse(text));
    const edge = asRecord(asRecord(asRecord(payload.data).user)[EDGE_NAME[listType]]);
    const edges = Array.isArray(edge.edges) ? edge.edges : [];
    const items = edges
      .map((entry) => parseListNode(asRecord(entry).node))
      .filter((item) => item.username);
    return {
      status: "success",
      items: items.slice(0, 10),
      message: items.length > 0 ? `Showing the first ${Math.min(items.length, 10)} accounts returned by Instagram.` : "Instagram returned no accounts for this list.",
    };
  } catch {
    return emptyList("error", "Instagram returned a non-JSON list response.");
  }
}

export async function getInstagramPreview(input: string): Promise<InstagramPreviewResponse> {
  const warnings: string[] = [];
  const username = normalizeInstagramUsername(input);
  const profileResult = await fetchProfile(username);

  if (profileResult.warning) {
    warnings.push(profileResult.warning);
  }

  if (!profileResult.profile) {
    return {
      status: profileResult.status,
      profile: null,
      followers: emptyList(profileResult.status, "Profile data is not available."),
      following: emptyList(profileResult.status, "Profile data is not available."),
      warnings,
      source: "instagram_web",
    };
  }

  if (profileResult.profile.isPrivate) {
    return {
      status: "private",
      profile: profileResult.profile,
      followers: emptyList("private", "This Instagram account is private, so followers cannot be previewed."),
      following: emptyList("private", "This Instagram account is private, so following cannot be previewed."),
      warnings: ["Private Instagram accounts cannot be previewed unless the viewer is approved in Instagram."],
      source: "instagram_web",
    };
  }

  const [followers, following] = await Promise.all([
    fetchList(username, profileResult.profile.id, "followers"),
    fetchList(username, profileResult.profile.id, "following"),
  ]);

  for (const list of [followers, following]) {
    if (list.status !== "success") {
      warnings.push(list.message);
    }
  }

  return {
    status: "success",
    profile: profileResult.profile,
    followers,
    following,
    warnings: Array.from(new Set(warnings)),
    source: "instagram_web",
  };
}
