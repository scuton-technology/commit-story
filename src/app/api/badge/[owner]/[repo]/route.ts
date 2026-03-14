import { NextResponse } from "next/server";
import { GitHubClient } from "@/lib/github";

interface RouteParams {
  params: Promise<{ owner: string; repo: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { owner, repo } = await params;

  let commitCount = 0;
  try {
    const client = new GitHubClient(process.env.GITHUB_TOKEN);
    const story = await client.buildStory(owner, repo);
    commitCount = story.stats.total_commits;
  } catch {
    // Return badge with error state
  }

  const label = "commit story";
  const value = commitCount > 0 ? `${commitCount} commits` : "not found";
  const labelWidth = 90;
  const valueWidth = value.length * 7 + 16;
  const totalWidth = labelWidth + valueWidth;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="20" role="img" aria-label="${label}: ${value}">
  <title>${label}: ${value}</title>
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <clipPath id="r">
    <rect width="${totalWidth}" height="20" rx="3" fill="#fff"/>
  </clipPath>
  <g clip-path="url(#r)">
    <rect width="${labelWidth}" height="20" fill="#555"/>
    <rect x="${labelWidth}" width="${valueWidth}" height="20" fill="#22c55e"/>
    <rect width="${totalWidth}" height="20" fill="url(#s)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="11">
    <text x="${labelWidth / 2}" y="15" fill="#010101" fill-opacity=".3">${label}</text>
    <text x="${labelWidth / 2}" y="14">${label}</text>
    <text x="${labelWidth + valueWidth / 2}" y="15" fill="#010101" fill-opacity=".3">${value}</text>
    <text x="${labelWidth + valueWidth / 2}" y="14">${value}</text>
  </g>
</svg>`;

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
