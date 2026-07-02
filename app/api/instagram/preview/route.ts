import { NextResponse } from "next/server";
import { getInstagramPreview } from "@/lib/instagramPreview";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username") || "";

  try {
    const preview = await getInstagramPreview(username);
    const status = preview.status === "not_found" ? 404 : 200;
    return NextResponse.json(preview, { status });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to fetch Instagram preview.";
    return NextResponse.json(
      {
        status: "error",
        profile: null,
        followers: { status: "error", items: [], message },
        following: { status: "error", items: [], message },
        warnings: [message],
        source: "instagram_web",
      },
      { status: 400 },
    );
  }
}
