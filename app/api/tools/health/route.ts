import { NextResponse } from "next/server";
import { buildToolHealth } from "@/lib/toolRegistry";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ tools: await buildToolHealth() });
}
