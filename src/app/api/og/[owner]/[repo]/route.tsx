import { ImageResponse } from "next/og";
import { GitHubClient } from "@/lib/github";

interface RouteParams {
  params: Promise<{ owner: string; repo: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { owner, repo } = await params;

  let totalCommits = 0;
  let contributors = 0;
  let description = "";

  try {
    const client = new GitHubClient(process.env.GITHUB_TOKEN);
    const story = await client.buildStory(owner, repo);
    totalCommits = story.stats.total_commits;
    contributors = story.stats.total_contributors;
    description = story.repo.description;
  } catch {
    // render fallback OG
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "64px 80px",
          backgroundColor: "#0a0e1a",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top label */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 32,
            fontSize: 16,
            color: "#22d3ee",
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          commitstory.dev
        </div>

        {/* Repo name */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: "#f1f5f9",
            lineHeight: 1.1,
            marginBottom: 16,
          }}
        >
          {owner}/
          <span style={{ color: "#22d3ee" }}>{repo}</span>
        </div>

        {/* Description */}
        {description && (
          <div
            style={{
              fontSize: 28,
              color: "#64748b",
              marginBottom: 48,
              maxWidth: 900,
            }}
          >
            {description.slice(0, 100)}
          </div>
        )}

        {/* Stats row */}
        <div style={{ display: "flex", gap: 48, marginTop: "auto" }}>
          {totalCommits > 0 && (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 48, fontWeight: 700, color: "#22d3ee" }}>
                {totalCommits.toLocaleString()}
              </span>
              <span style={{ fontSize: 18, color: "#475569", marginTop: 4 }}>
                commits
              </span>
            </div>
          )}
          {contributors > 0 && (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 48, fontWeight: 700, color: "#a78bfa" }}>
                {contributors}
              </span>
              <span style={{ fontSize: 18, color: "#475569", marginTop: 4 }}>
                contributors
              </span>
            </div>
          )}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
