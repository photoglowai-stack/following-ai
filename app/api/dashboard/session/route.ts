import { NextResponse } from "next/server";
import { getDashboardSnapshot } from "@/lib/dashboard/repository";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(getDashboardSnapshot());
}
