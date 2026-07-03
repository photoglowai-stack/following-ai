import { NextResponse } from "next/server";
import { createDashboardReport, getReports } from "@/lib/dashboard/repository";
import type { ReportType } from "@/lib/dashboard/types";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ reports: getReports() });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  const payload = body as { username?: unknown; reportType?: unknown };
  const username = typeof payload.username === "string" ? payload.username : "";
  const reportType = payload.reportType === "followers" || payload.reportType === "following" || payload.reportType === "both" ? (payload.reportType as ReportType) : "both";

  try {
    const detail = createDashboardReport({ username, reportType });
    return NextResponse.json(detail, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not create report." }, { status: 400 });
  }
}
