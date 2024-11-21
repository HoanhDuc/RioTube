import { NextRequest, NextResponse } from "next/server";

const YOUTUBE_API_URL = "https://www.googleapis.com/youtube/v3";
const API_KEY = "AIzaSyDJfBTk_t7Csg3RdKX4rq9QxT54BSbL9j8";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const youtubeParams = new URLSearchParams(searchParams);
    youtubeParams.append("key", API_KEY);

    if (!youtubeParams.has("part")) {
      youtubeParams.append("part", "snippet");
    }

    if (!youtubeParams.has("type")) {
      youtubeParams.append("type", "video");
    }
    if (!youtubeParams.has("maxResults")) {
      youtubeParams.append("maxResults", "20");
    }

    const response = await fetch(
      `${YOUTUBE_API_URL}/activities?${youtubeParams.toString()}`
    );

    if (!response.ok) {
      throw new Error(`YouTube API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
