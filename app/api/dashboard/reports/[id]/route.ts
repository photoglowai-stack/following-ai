import { NextResponse } from "next/server";
import { getReportDetail } from "@/lib/dashboard/repository";

export const runtime = "nodejs";

type ReportRouteProps = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: ReportRouteProps) {
  const { id } = await params;
  const detail = getReportDetail(id);
  if (!detail) {
    return NextResponse.json({ error: "Report not found." }, { status: 404 });
  }

  return NextResponse.json(detail);
}
