export type DashboardUser = {
  id: string;
  email: string;
  name: string;
  plan: string;
  credits: number;
  createdAt: string;
};

export type ReportStatus = "preview_ready" | "processing" | "blocked_private" | "failed";
export type ProfileStatus = "public" | "private" | "unknown";
export type ReportType = "followers" | "following" | "both";

export type DashboardReport = {
  id: string;
  username: string;
  reportType: ReportType;
  status: ReportStatus;
  profileStatus: ProfileStatus;
  score: number;
  followersCount: number | null;
  followingCount: number | null;
  postsCount: number | null;
  profilePicUrl: string | null;
  summary: string;
  createdAt: string;
  updatedAt: string;
};

export type ReportRow = {
  id: string;
  reportId: string;
  listType: "followers" | "following";
  username: string;
  displayName: string;
  avatarUrl: string | null;
  status: "new_signal" | "public" | "locked";
  observedAt: string;
  isLocked: boolean;
  sortOrder: number;
};

export type ActivityItem = {
  id: string;
  type: string;
  title: string;
  body: string;
  createdAt: string;
};

export type DashboardSnapshot = {
  user: DashboardUser;
  reports: DashboardReport[];
  activities: ActivityItem[];
  metrics: {
    totalReports: number;
    readyReports: number;
    privateBlocked: number;
    credits: number;
  };
};
