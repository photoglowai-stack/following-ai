import DashboardClient from "./dashboard-client";
import { getDashboardSnapshot } from "@/lib/dashboard/repository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const snapshot = getDashboardSnapshot();
  return <DashboardClient initialSnapshot={snapshot} />;
}
