import { NextResponse } from "next/server";
import { GitHubClient } from "@/lib/github";

interface RouteParams {
  params: Promise<{ owner: string; repo: string }>;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function measureText(text: string, fontSize: number): number {
  return Math.ceil(text.length * fontSize * 0.62 + 16);
}

function buildFlat(label: string, value: string, color: string): string {
  const lw = measureText(label, 11);
  const vw = measureText(value, 11);
  const total = lw + vw;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${total}" height="20" role="img" aria-label="${escapeXml(label)}: ${escapeXml(value)}">
  <title>${escapeXml(label)}: ${escapeXml(value)}</title>
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <clipPath id="r"><rect width="${total}" height="20" rx="3" fill="#fff"/></clipPath>
  <g clip-path="url(#r)">
    <rect width="${lw}" height="20" fill="#555"/>
    <rect x="${lw}" width="${vw}" height="20" fill="${color}"/>
    <rect width="${total}" height="20" fill="url(#s)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="11">
    <text x="${lw / 2}" y="15" fill="#010101" fill-opacity=".3">${escapeXml(label)}</text>
    <text x="${lw / 2}" y="14">${escapeXml(label)}</text>
    <text x="${lw + vw / 2}" y="15" fill="#010101" fill-opacity=".3">${escapeXml(value)}</text>
    <text x="${lw + vw / 2}" y="14">${escapeXml(value)}</text>
  </g>
</svg>`;
}

function buildFlatSquare(label: string, value: string, color: string): string {
  const lw = measureText(label, 11);
  const vw = measureText(value, 11);
  const total = lw + vw;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${total}" height="20" role="img" aria-label="${escapeXml(label)}: ${escapeXml(value)}">
  <title>${escapeXml(label)}: ${escapeXml(value)}</title>
  <g>
    <rect width="${lw}" height="20" fill="#555"/>
    <rect x="${lw}" width="${vw}" height="20" fill="${color}"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="11">
    <text x="${lw / 2}" y="15" fill="#010101" fill-opacity=".3">${escapeXml(label)}</text>
    <text x="${lw / 2}" y="14">${escapeXml(label)}</text>
    <text x="${lw + vw / 2}" y="15" fill="#010101" fill-opacity=".3">${escapeXml(value)}</text>
    <text x="${lw + vw / 2}" y="14">${escapeXml(value)}</text>
  </g>
</svg>`;
}

function buildForTheBadge(label: string, value: string, color: string): string {
  const ul = label.toUpperCase();
  const uv = value.toUpperCase();
  const lw = measureText(ul, 11) + 10;
  const vw = measureText(uv, 11) + 10;
  const total = lw + vw;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${total}" height="28" role="img" aria-label="${escapeXml(label)}: ${escapeXml(value)}">
  <title>${escapeXml(label)}: ${escapeXml(value)}</title>
  <g>
    <rect width="${lw}" height="28" fill="#555"/>
    <rect x="${lw}" width="${vw}" height="28" fill="${color}"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="11" font-weight="bold" letter-spacing="1">
    <text x="${lw / 2}" y="19">${escapeXml(ul)}</text>
    <text x="${lw + vw / 2}" y="19">${escapeXml(uv)}</text>
  </g>
</svg>`;
}

export async function GET(request: Request, { params }: RouteParams) {
  const { owner, repo } = await params;
  const { searchParams } = new URL(request.url);
  const style = searchParams.get("style") ?? "flat";

  let commitCount = 0;
  let contributorCount = 0;

  try {
    const client = new GitHubClient(process.env.GITHUB_TOKEN);
    const story = await client.buildStory(owner, repo);
    commitCount = story.stats.total_commits;
    contributorCount = story.stats.total_contributors;
  } catch {
    // Return badge with fallback
  }

  const label = "commit story";
  const value =
    commitCount > 0
      ? `${commitCount.toLocaleString("en-US")} commits · ${contributorCount} contributors`
      : "not found";
  const color = commitCount > 0 ? "#22c55e" : "#ef4444";

  let svg: string;
  if (style === "flat-square") {
    svg = buildFlatSquare(label, value, color);
  } else if (style === "for-the-badge") {
    svg = buildForTheBadge(label, value, color);
  } else {
    svg = buildFlat(label, value, color);
  }

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
