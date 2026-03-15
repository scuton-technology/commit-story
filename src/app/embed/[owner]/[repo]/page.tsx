import { GitHubClient } from "@/lib/github";

interface PageProps {
  params: Promise<{ owner: string; repo: string }>;
}

export default async function EmbedPage({ params }: PageProps) {
  const { owner, repo } = await params;

  let data: {
    commits: number;
    contributors: number;
    ageDays: number;
    language: string;
    description: string;
  } | null = null;

  try {
    const client = new GitHubClient(process.env.GITHUB_TOKEN);
    const [repoInfo, totalCommits, contributors] = await Promise.all([
      client.getRepoInfo(owner, repo),
      client.getTotalCommitCount(owner, repo),
      client.getAllContributors(owner, repo),
    ]);
    const ageDays = Math.max(
      1,
      Math.floor(
        (Date.now() - new Date(repoInfo.created_at).getTime()) / (1000 * 60 * 60 * 24)
      )
    );
    data = {
      commits: totalCommits,
      contributors: contributors.length,
      ageDays,
      language: repoInfo.language,
      description: repoInfo.description,
    };
  } catch {
    // render fallback
  }

  const storyUrl = `https://commitstory.dev/story/${owner}/${repo}`;

  function fmtNum(n: number): string {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
    return n.toLocaleString("en-US");
  }

  function fmtAge(days: number): string {
    if (days < 30) return `${days}d`;
    if (days < 365) return `${Math.floor(days / 30)}mo`;
    const y = Math.floor(days / 365);
    const m = Math.floor((days % 365) / 30);
    return m > 0 ? `${y}y ${m}mo` : `${y}y`;
  }

  return (
    <div
      style={{
        width: 300,
        height: 160,
        background: "rgba(15,22,41,0.98)",
        border: "1px solid rgba(148,163,184,0.15)",
        borderRadius: 12,
        padding: "14px 16px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        fontFamily: "system-ui, -apple-system, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span
            style={{
              fontSize: 10,
              color: "#22d3ee",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="6" y1="3" x2="6" y2="15" />
              <circle cx="18" cy="6" r="3" />
              <circle cx="6" cy="18" r="3" />
              <path d="M18 9a9 9 0 0 1-9 9" />
            </svg>
            commit-story
          </span>
          {data?.language && (
            <span style={{ fontSize: 9, color: "#334155", fontFamily: "monospace" }}>
              {data.language}
            </span>
          )}
        </div>
        <div style={{ marginTop: 6 }}>
          <div style={{ fontSize: 10, color: "#475569", fontFamily: "monospace" }}>{owner}</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9", fontFamily: "monospace" }}>
            /{repo}
          </div>
          {data?.description && (
            <div
              style={{
                fontSize: 10,
                color: "#475569",
                marginTop: 2,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: 268,
              }}
            >
              {data.description}
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      {data ? (
        <>
          <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 16, fontWeight: 700, fontFamily: "monospace", color: "#22d3ee" }}>
                {fmtNum(data.commits)}
              </span>
              <span style={{ fontSize: 9, color: "#475569", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                commits
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 16, fontWeight: 700, fontFamily: "monospace", color: "#a78bfa" }}>
                {fmtNum(data.contributors)}
              </span>
              <span style={{ fontSize: 9, color: "#475569", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                contributors
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 16, fontWeight: 700, fontFamily: "monospace", color: "#94a3b8" }}>
                {fmtAge(data.ageDays)}
              </span>
              <span style={{ fontSize: 9, color: "#475569", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                age
              </span>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <a
              href={storyUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: 9,
                color: "#22d3ee",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: 3,
              }}
            >
              View full story
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          </div>
        </>
      ) : (
        <div style={{ color: "#475569", fontSize: 11, marginTop: 12 }}>
          Could not load repository data.
        </div>
      )}
    </div>
  );
}
