import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_IMAGE_HOSTS = [
  "fbcdn.net",
  "cdninstagram.com",
  "instagram.com",
];

function isAllowedInstagramImage(url: URL) {
  return ALLOWED_IMAGE_HOSTS.some((host) => url.hostname === host || url.hostname.endsWith(`.${host}`));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get("url");

  if (!imageUrl) {
    return NextResponse.json({ error: "Missing image url." }, { status: 400 });
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(imageUrl);
  } catch {
    return NextResponse.json({ error: "Invalid image url." }, { status: 400 });
  }

  if (!isAllowedInstagramImage(parsedUrl)) {
    return NextResponse.json({ error: "Image host is not allowed." }, { status: 400 });
  }

  const response = await fetch(parsedUrl, {
    headers: {
      "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      "Referer": "https://www.instagram.com/",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return NextResponse.json({ error: `Instagram image request failed with HTTP ${response.status}.` }, { status: response.status });
  }

  const contentType = response.headers.get("content-type") || "image/jpeg";
  const body = await response.arrayBuffer();

  return new NextResponse(body, {
    headers: {
      "Cache-Control": "public, max-age=300",
      "Content-Type": contentType,
    },
  });
}
