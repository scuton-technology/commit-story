import { NextResponse } from "next/server";
import { Octokit } from "@octokit/rest";

interface RouteParams {
  params: Promise<{ owner: string; repo: string; year: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { owner, repo, year } = await params;
  const yearNum = parseInt(year, 10);
  if (isNaN(yearNum) || yearNum < 2005 || yearNum > new Date().getFullYear()) {
    return NextResponse.json({ error: "Invalid year" }, { status: 400 });
  }

  try {
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

    // Get commits for the year using search API (counts + monthly breakdown)
    const since = `${yearNum}-01-01T00:00:00Z`;
    const until = `${yearNum}-12-31T23:59:59Z`;

    // Get total count for the year via search
    const searchRes = await octokit.rest.search.commits({
      q: `repo:${owner}/${repo} committer-date:${yearNum}-01-01..${yearNum}-12-31`,
      per_page: 1,
    });
    const totalCommits = searchRes.data.total_count;

    // Get sample commits to determine monthly breakdown
    // Fetch up to 100 commits per month (enough for bar chart)
    const monthlyCommits = new Array(12).fill(0);
    const authors = new Set<string>();

    // Fetch commits in batches to get monthly data
    let page = 1;
    let fetched = 0;
    const MAX_FETCH = 300;
    while (fetched < MAX_FETCH) {
      const res = await octokit.repos.listCommits({
        owner,
        repo,
        since,
        until,
        per_page: 100,
        page,
      });
      if (res.data.length === 0) break;
      for (const c of res.data) {
        const d = new Date(c.commit.author?.date ?? "");
        const month = d.getMonth();
        if (!isNaN(month)) monthlyCommits[month]++;
        const login = c.author?.login;
        if (login) authors.add(login);
      }
      fetched += res.data.length;
      if (res.data.length < 100) break;
      page++;
    }

    // Find most active month
    const maxMonth = monthlyCommits.indexOf(Math.max(...monthlyCommits));
    const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return NextResponse.json({
      year: yearNum,
      totalCommits,
      monthlyCommits,
      mostActiveMonth: MONTHS[maxMonth],
      uniqueContributors: authors.size,
      repoFullName: `${owner}/${repo}`,
    }, {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200" },
    });
  } catch (err) {
    const e = err as { status?: number };
    return NextResponse.json(
      { error: "Failed to fetch year data" },
      { status: e.status === 404 ? 404 : 500 }
    );
  }
}
