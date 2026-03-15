import { NextResponse } from "next/server";
import { Octokit } from "@octokit/rest";

interface RouteParams {
  params: Promise<{ owner: string; repo: string }>;
}

export interface WeekActivity {
  week: number;        // Unix timestamp of week start (Sunday)
  days: number[];      // [Sun, Mon, Tue, Wed, Thu, Fri, Sat] commit counts
  total: number;
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { owner, repo } = await params;

  try {
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

    // GitHub Stats API: returns 52 weeks of commit activity
    // May return 202 if stats are still computing — retry up to 3 times
    let data: WeekActivity[] | null = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      const res = await octokit.repos.getCommitActivityStats({ owner, repo });
      if (res.status === 200 && Array.isArray(res.data)) {
        data = res.data as WeekActivity[];
        break;
      }
      if (res.status === 202) {
        // GitHub is computing stats — wait 3s then retry
        await new Promise((r) => setTimeout(r, 3000));
      }
    }

    if (!data) {
      return NextResponse.json({ error: "Stats not ready" }, { status: 202 });
    }

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
      },
    });
  } catch (err) {
    const e = err as { status?: number };
    return NextResponse.json(
      { error: "Failed to fetch activity" },
      { status: e.status === 404 ? 404 : 500 }
    );
  }
}
