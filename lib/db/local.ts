import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

let db: Database.Database | null = null;

const demoUserId = "demo-user";

function createId(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
}

function getDatabasePath() {
  return process.env.LOCAL_SQLITE_PATH || path.join(process.cwd(), ".data", "facetrace.sqlite");
}

function readSchema() {
  return fs.readFileSync(path.join(process.cwd(), "lib", "db", "schema.sql"), "utf8");
}

function seed(database: Database.Database) {
  const existingUser = database.prepare("SELECT id FROM users WHERE id = ?").get(demoUserId);
  if (existingUser) return;

  const now = new Date();
  const iso = (minutesAgo: number) => new Date(now.getTime() - minutesAgo * 60_000).toISOString();

  database
    .prepare("INSERT INTO users (id, email, name, plan, credits) VALUES (?, ?, ?, ?, ?)")
    .run(demoUserId, "demo@recently-followed.local", "Lilian", "growth", 18);

  const reports = [
    {
      id: "report_instagram",
      username: "instagram",
      status: "preview_ready",
      profileStatus: "public",
      score: 92,
      followers: 694000000,
      following: 108,
      posts: 8178,
      summary: "Public profile available. Recent public follow signals are ready to review.",
      createdAt: iso(18),
    },
    {
      id: "report_natgeo",
      username: "natgeo",
      status: "preview_ready",
      profileStatus: "public",
      score: 87,
      followers: 283000000,
      following: 149,
      posts: 29800,
      summary: "Publisher profile with strong public metadata and clear activity rows.",
      createdAt: iso(63),
    },
    {
      id: "report_private_demo",
      username: "private.account",
      status: "blocked_private",
      profileStatus: "private",
      score: 0,
      followers: null,
      following: null,
      posts: null,
      summary: "This profile is private, so follower and following previews cannot be generated.",
      createdAt: iso(220),
    },
  ];

  const insertReport = database.prepare(
    `INSERT INTO reports (
      id, user_id, username, report_type, status, profile_status, score, followers_count,
      following_count, posts_count, summary, created_at, updated_at
    ) VALUES (?, ?, ?, 'both', ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );

  const insertRow = database.prepare(
    `INSERT INTO report_rows (
      id, report_id, list_type, username, display_name, status, observed_at, is_locked, sort_order
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );

  for (const report of reports) {
    insertReport.run(
      report.id,
      demoUserId,
      report.username,
      report.status,
      report.profileStatus,
      report.score,
      report.followers,
      report.following,
      report.posts,
      report.summary,
      report.createdAt,
      report.createdAt,
    );

    if (report.profileStatus === "public") {
      ["following", "followers"].forEach((listType) => {
        ["mika.studio", "noa.archive", "lena.daily", "sarah.creator", "brand.watch"].forEach((username, index) => {
          insertRow.run(
            createId("row"),
            report.id,
            listType,
            username,
            username
              .split(".")
              .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
              .join(" "),
            index === 0 ? "new_signal" : "public",
            iso(8 + index * 17),
            index > 1 ? 1 : 0,
            index,
          );
        });
      });
    }
  }

  const insertActivity = database.prepare("INSERT INTO activities (id, user_id, type, title, body, created_at) VALUES (?, ?, ?, ?, ?, ?)");
  [
    ["report_created", "Instagram preview ready", "Public preview generated for @instagram.", iso(18)],
    ["report_created", "NatGeo preview ready", "Public preview generated for @natgeo.", iso(63)],
    ["private_blocked", "Private account detected", "@private.account cannot be scanned because the profile is private.", iso(220)],
  ].forEach(([type, title, body, createdAt]) => {
    insertActivity.run(createId("activity"), demoUserId, type, title, body, createdAt);
  });
}

export function getLocalDb() {
  if (db) return db;

  const databasePath = getDatabasePath();
  fs.mkdirSync(path.dirname(databasePath), { recursive: true });

  db = new Database(databasePath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  db.exec(readSchema());
  seed(db);

  return db;
}

export { createId, demoUserId };
