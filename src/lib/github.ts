import { Octokit } from "@octokit/rest";

export interface CommitData {
  sha: string;
  message: string;
  author: {
    name: string;
    email: string;
    avatar_url: string;
    login: string;
  };
  date: string;
  stats: {
    additions: number;
    deletions: number;
    total: number;
  };
  files: string[];
}

export interface RepoInfo {
  name: string;
  full_name: string;
  description: string;
  stars: number;
  forks: number;
  created_at: string;
  language: string;
}

export interface RepoStory {
  repo: RepoInfo;
  commits: CommitData[];
  contributors: ContributorData[];
  milestones: MilestoneData[];
  stats: RepoStats;
}

export interface ContributorData {
  login: string;
  avatar_url: string;
  contributions: number;
  first_commit: string;
  last_commit: string;
}

export interface MilestoneData {
  type: "first-commit" | "release" | "big-refactor" | "contributor-joined" | "100-commits" | "1000-stars";
  date: string;
  title: string;
  description: string;
  sha?: string;
}

export interface RepoStats {
  total_commits: number;       // Real total (from pagination header)
  commits_shown: number;       // How many are in the commits[] array
  total_contributors: number;  // Real total (paginated)
  total_additions: number;
  total_deletions: number;
  most_active_day: string;
  most_active_author: string;
  avg_commits_per_week: number;
  project_age_days: number;
}

// Bot detection — GitHub marks official bots with [bot] suffix
const BOT_PATTERNS = [
  "[bot]",
  "dependabot",
  "renovate",
  "github-actions",
  "codecov",
  "greenkeeper",
  "snyk-bot",
  "allcontributors",
  "semantic-release",
  "imgbot",
  "netlify",
  "vercel",
  "stale",
];

function isBot(login: string): boolean {
  const lower = login.toLowerCase();
  return BOT_PATTERNS.some((p) => lower.includes(p));
}

export class GitHubClient {
  private octokit: Octokit;

  constructor(token?: string) {
    this.octokit = new Octokit({
      auth: token || process.env.GITHUB_TOKEN,
    });
  }

  async getRepoInfo(owner: string, repo: string): Promise<RepoInfo> {
    const { data } = await this.octokit.repos.get({ owner, repo });
    return {
      name: data.name,
      full_name: data.full_name,
      description: data.description || "",
      stars: data.stargazers_count,
      forks: data.forks_count,
      created_at: data.created_at || "",
      language: data.language || "Unknown",
    };
  }

  /**
   * Get real total commit count using pagination header trick.
   * Requests 1 commit and reads the `Link` header's last page number.
   */
  async getTotalCommitCount(owner: string, repo: string): Promise<number> {
    try {
      const response = await this.octokit.repos.listCommits({
        owner,
        repo,
        per_page: 1,
      });
      const link = (response.headers as Record<string, string>)["link"] ?? "";
      const match = link.match(/[?&]page=(\d+)>; rel="last"/);
      if (match?.[1]) return parseInt(match[1], 10);
      // No pagination link = only 1 page of results
      return response.data.length;
    } catch {
      return 0;
    }
  }

  /**
   * Get latest 100 commits for timeline/display.
   */
  async getCommits(owner: string, repo: string): Promise<CommitData[]> {
    const { data } = await this.octokit.repos.listCommits({
      owner,
      repo,
      per_page: 100,
      page: 1,
    });

    return data.map((commit) => ({
      sha: commit.sha,
      message: commit.commit.message,
      author: {
        name: commit.commit.author?.name || "Unknown",
        email: commit.commit.author?.email || "",
        avatar_url: commit.author?.avatar_url || "",
        login: commit.author?.login || "unknown",
      },
      date: commit.commit.author?.date || "",
      stats: { additions: 0, deletions: 0, total: 0 },
      files: [],
    }));
  }

  /**
   * Get all contributors with pagination (up to 500).
   * Filters out bots.
   */
  async getAllContributors(owner: string, repo: string): Promise<ContributorData[]> {
    const all: ContributorData[] = [];
    const PER_PAGE = 100;
    const MAX_PAGES = 5;

    for (let page = 1; page <= MAX_PAGES; page++) {
      const { data } = await this.octokit.repos.listContributors({
        owner,
        repo,
        per_page: PER_PAGE,
        page,
      });

      if (data.length === 0) break;

      for (const c of data) {
        const login = c.login ?? "unknown";
        if (!isBot(login)) {
          all.push({
            login,
            avatar_url: c.avatar_url ?? "",
            contributions: c.contributions,
            first_commit: "",
            last_commit: "",
          });
        }
      }

      if (data.length < PER_PAGE) break;
    }

    return all;
  }

  async buildStory(owner: string, repo: string): Promise<RepoStory> {
    // Run repo info + commits + contributors + total count in parallel
    const [repoInfo, commits, contributors, totalCommits] = await Promise.all([
      this.getRepoInfo(owner, repo),
      this.getCommits(owner, repo),
      this.getAllContributors(owner, repo),
      this.getTotalCommitCount(owner, repo),
    ]);

    const realTotal = Math.max(totalCommits, commits.length);
    const milestones = this.detectMilestones(commits, contributors, repoInfo, realTotal);
    const stats = this.calculateStats(commits, contributors, repoInfo, realTotal);

    return {
      repo: repoInfo,
      commits,
      contributors,
      milestones,
      stats,
    };
  }

  private detectMilestones(
    commits: CommitData[],
    contributors: ContributorData[],
    repo: RepoInfo,
    totalCommits: number
  ): MilestoneData[] {
    const milestones: MilestoneData[] = [];

    // First commit in the displayed window
    if (commits.length > 0) {
      const firstCommit = commits[commits.length - 1];
      milestones.push({
        type: "first-commit",
        date: firstCommit.date,
        title: "First Commit",
        description: `${firstCommit.author.name} started the project`,
        sha: firstCommit.sha,
      });
    }

    // 100-commits milestone
    if (totalCommits >= 100) {
      // Use the oldest commit in our window as proxy date
      const proxy = commits[commits.length - 1];
      if (proxy) {
        milestones.push({
          type: "100-commits",
          date: proxy.date,
          title: "100 Commits!",
          description: "Project reached 100 commits",
        });
      }
    }

    // Release commits detection
    commits.forEach((commit) => {
      if (commit.message.match(/^(v?\d+\.\d+\.\d+|release|bump version)/i)) {
        milestones.push({
          type: "release",
          date: commit.date,
          title: commit.message.split("\n")[0].slice(0, 60),
          description: "New version released",
          sha: commit.sha,
        });
      }
    });

    return milestones.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }

  private calculateStats(
    commits: CommitData[],
    contributors: ContributorData[],
    repo: RepoInfo,
    totalCommits: number
  ): RepoStats {
    const projectAgeDays = Math.max(
      1,
      Math.floor((Date.now() - new Date(repo.created_at).getTime()) / (1000 * 60 * 60 * 24))
    );

    // Most active day of week (from latest 100 commits sample)
    const dayCount: Record<string, number> = {};
    commits.forEach((c) => {
      const day = new Date(c.date).toLocaleDateString("en-US", { weekday: "long" });
      dayCount[day] = (dayCount[day] || 0) + 1;
    });
    const mostActiveDay =
      Object.entries(dayCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "Unknown";

    // Most active human author from contributors list (already bot-filtered)
    const mostActiveAuthor = contributors[0]?.login || "Unknown";

    // Weekly average using real total
    const avgPerWeek = parseFloat(((totalCommits / projectAgeDays) * 7).toFixed(1));

    return {
      total_commits: totalCommits,
      commits_shown: commits.length,
      total_contributors: contributors.length,
      total_additions: commits.reduce((sum, c) => sum + c.stats.additions, 0),
      total_deletions: commits.reduce((sum, c) => sum + c.stats.deletions, 0),
      most_active_day: mostActiveDay,
      most_active_author: mostActiveAuthor,
      avg_commits_per_week: avgPerWeek,
      project_age_days: projectAgeDays,
    };
  }
}
