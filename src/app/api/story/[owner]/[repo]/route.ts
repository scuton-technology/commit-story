import { NextResponse } from "next/server";
import { GitHubClient } from "@/lib/github";

interface RouteParams {
  params: Promise<{ owner: string; repo: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { owner, repo } = await params;

  try {
    const client = new GitHubClient(process.env.GITHUB_TOKEN);
    const story = await client.buildStory(owner, repo);
    return NextResponse.json(story, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (err) {
    const error = err as { status?: number; message?: string };
    const status = error.status === 404 ? 404 : error.status === 403 ? 429 : 500;
    return NextResponse.json(
      { error: error.message ?? "Failed to fetch story" },
      { status }
    );
  }
}
