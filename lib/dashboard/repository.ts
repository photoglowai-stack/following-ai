import { getLocalDb, createId, demoUserId } from "@/lib/db/local";
import type { ActivityItem, DashboardReport, DashboardSnapshot, DashboardUser, ReportRow, ReportType } from "@/lib/dashboard/types";

type UserRow = {
  id: string;
  email: string;
  name: string;
  plan: string;
  credits: number;
  created_at: string;
};

type ReportDbRow = {
  id: string;
  username: string;
  report_type: ReportType;
  status: DashboardReport["status"];
  profile_status: DashboardReport["profileStatus"];
  score: number;
  followers_count: number | null;
  following_count: number | null;
  posts_count: number | null;
  profile_pic_url: string | null;
  summary: string;
  created_at: string;
  updated_at: string;
};

type ReportRowDb = {
  id: string;
  report_id: string;
  list_type: "followers" | "following";
  username: string;
  display_name: string;
  avatar_url: string | null;
  status: ReportRow["status"];
  observed_at: string;
  is_locked: 0 | 1;
  sort_order: number;
};

type ActivityDbRow = {
  id: string;
  type: string;
  title: string;
  body: string;
  created_at: string;
};

function mapUser(row: UserRow): DashboardUser {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    plan: row.plan,
    credits: row.credits,
    createdAt: row.created_at,
  };
}

function mapReport(row: ReportDbRow): DashboardReport {
  return {
    id: row.id,
    username: row.username,
    reportType: row.report_type,
    status: row.status,
    profileStatus: row.profile_status,
    score: row.score,
    followersCount: row.followers_count,
    followingCount: row.following_count,
    postsCount: row.posts_count,
    profilePicUrl: row.profile_pic_url,
    summary: row.summary,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapReportRow(row: ReportRowDb): ReportRow {
  return {
    id: row.id,
    reportId: row.report_id,
    listType: row.list_type,
    username: row.username,
    displayName: row.display_name,
    avatarUrl: row.avatar_url,
    status: row.status,
    observedAt: row.observed_at,
    isLocked: Boolean(row.is_locked),
    sortOrder: row.sort_order,
  };
}

function mapActivity(row: ActivityDbRow): ActivityItem {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    body: row.body,
    createdAt: row.created_at,
  };
}

export function getDemoUserId() {
  return demoUserId;
}

export function getDashboardSnapshot(userId = demoUserId): DashboardSnapshot {
  const db = getLocalDb();
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId) as UserRow | undefined;
  if (!user) throw new Error("Dashboard user not found");

  const reports = (db
    .prepare("SELECT * FROM reports WHERE user_id = ? ORDER BY created_at DESC LIMIT 12")
    .all(userId) as ReportDbRow[]).map(mapReport);
  const activities = (db
    .prepare("SELECT * FROM activities WHERE user_id = ? ORDER BY created_at DESC LIMIT 8")
    .all(userId) as ActivityDbRow[]).map(mapActivity);

  return {
    user: mapUser(user),
    reports,
    activities,
    metrics: {
      totalReports: reports.length,
      readyReports: reports.filter((report) => report.status === "preview_ready").length,
      privateBlocked: reports.filter((report) => report.profileStatus === "private").length,
      credits: user.credits,
    },
  };
}

export function getReports(userId = demoUserId) {
  const db = getLocalDb();
  return (db.prepare("SELECT * FROM reports WHERE user_id = ? ORDER BY created_at DESC").all(userId) as ReportDbRow[]).map(mapReport);
}

export function getReportDetail(reportId: string, userId = demoUserId) {
  const db = getLocalDb();
  const report = db.prepare("SELECT * FROM reports WHERE id = ? AND user_id = ?").get(reportId, userId) as ReportDbRow | undefined;
  if (!report) return null;

  const rows = (db
    .prepare("SELECT * FROM report_rows WHERE report_id = ? ORDER BY list_type ASC, sort_order ASC")
    .all(reportId) as ReportRowDb[]).map(mapReportRow);

  return {
    report: mapReport(report),
    rows,
  };
}

export function createDashboardReport(input: { username: string; reportType?: ReportType; userId?: string }) {
  const db = getLocalDb();
  const userId = input.userId || demoUserId;
  const username = input.username.replace(/^@+/, "").trim().toLowerCase();
  if (!/^[a-z0-9._]{2,30}$/i.test(username)) {
    throw new Error("Use a valid Instagram username.");
  }

  const now = new Date().toISOString();
  const isPrivateHint = username.includes("private") || username.includes("locked");
  const reportId = createId("report");
  const status = isPrivateHint ? "blocked_private" : "preview_ready";
  const profileStatus = isPrivateHint ? "private" : "public";
  const score = isPrivateHint ? 0 : Math.min(98, 72 + username.length);
  const summary = isPrivateHint
    ? "This profile appears private. Public followers and following rows cannot be generated."
    : `Public preview is ready for @${username}. Connect the Instagram provider later to replace demo rows with live data.`;

  const transaction = db.transaction(() => {
    db.prepare(
      `INSERT INTO reports (
        id, user_id, username, report_type, status, profile_status, score, followers_count,
        following_count, posts_count, summary, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(
      reportId,
      userId,
      username,
      input.reportType || "both",
      status,
      profileStatus,
      score,
      isPrivateHint ? null : 1200 + username.length * 91,
      isPrivateHint ? null : 280 + username.length * 7,
      isPrivateHint ? null : 24,
      summary,
      now,
      now,
    );

    if (!isPrivateHint) {
      const insertRow = db.prepare(
        `INSERT INTO report_rows (
          id, report_id, list_type, username, display_name, status, observed_at, is_locked, sort_order
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      );
      ["following", "followers"].forEach((listType) => {
        ["mika.studio", "noa.archive", "lena.daily", "sarah.creator", "brand.watch"].forEach((rowUsername, index) => {
          insertRow.run(
            createId("row"),
            reportId,
            listType,
            rowUsername,
            rowUsername.replace(".", " "),
            index === 0 ? "new_signal" : "public",
            new Date(Date.now() - (index + 1) * 12 * 60_000).toISOString(),
            index > 1 ? 1 : 0,
            index,
          );
        });
      });
    }

    db.prepare("UPDATE users SET credits = MAX(credits - 1, 0) WHERE id = ?").run(userId);
    db.prepare("INSERT INTO activities (id, user_id, type, title, body, created_at) VALUES (?, ?, ?, ?, ?, ?)").run(
      createId("activity"),
      userId,
      status === "blocked_private" ? "private_blocked" : "report_created",
      status === "blocked_private" ? "Private account detected" : "New preview created",
      status === "blocked_private" ? `@${username} cannot be previewed because it is private.` : `A public preview was generated for @${username}.`,
      now,
    );
  });

  transaction();
  return getReportDetail(reportId, userId);
}
