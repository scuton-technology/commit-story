import { NextResponse } from "next/server";
import { Octokit } from "@octokit/rest";

interface RouteParams {
  params: Promise<{ username: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { username } = await params;

  try {
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

    const [userRes, reposRes] = await Promise.all([
      octokit.users.getByUsername({ username }),
      octokit.repos.listForUser({ username, sort: "updated", per_page: 100, type: "owner" }),
    ]);

    const user = userRes.data;
    const repos = reposRes.data.filter((r) => !r.fork);

    // Language stats
    const langMap: Record<string, number> = {};
    repos.forEach((r) => {
      if (r.language) langMap[r.language] = (langMap[r.language] ?? 0) + 1;
    });
    const languages = Object.entries(langMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, count]) => ({ name, count }));

    // Top repos by stars
    const topRepos = [...repos]
      .sort((a, b) => (b.stargazers_count ?? 0) - (a.stargazers_count ?? 0))
      .slice(0, 5)
      .map((r) => ({
        name: r.name,
        full_name: r.full_name,
        stars: r.stargazers_count ?? 0,
        language: r.language ?? "Unknown",
        description: r.description ?? "",
      }));

    const totalStars = repos.reduce((sum, r) => sum + (r.stargazers_count ?? 0), 0);

    return NextResponse.json({
      user: {
        login: user.login,
        name: user.name ?? user.login,
        avatar_url: user.avatar_url,
        bio: user.bio ?? "",
        public_repos: user.public_repos,
        followers: user.followers,
        following: user.following,
        created_at: user.created_at,
      },
      totalStars,
      totalRepos: repos.length,
      languages,
      topRepos,
    }, {
      headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1200" },
    });
  } catch (err) {
    const e = err as { status?: number };
    return NextResponse.json(
      { error: "User not found" },
      { status: e.status === 404 ? 404 : 500 }
    );
  }
}
