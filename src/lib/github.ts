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

export interface RepoStory {
  repo: {
    name: string;
    full_name: string;
    description: string;
    stars: number;
    forks: number;
    created_at: string;
    language: string;
  };
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
  total_commits: number;
  total_contributors: number;
  total_additions: number;
  total_deletions: number;
  most_active_day: string;
  most_active_author: string;
  avg_commits_per_week: number;
  project_age_days: number;
}

export class GitHubClient {
  private octokit: Octokit;

  constructor(token?: string) {
    this.octokit = new Octokit({
      auth: token || process.env.GITHUB_TOKEN,
    });
  }

  async getRepoInfo(owner: string, repo: string) {
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

  async getCommits(owner: string, repo: string, perPage = 100, page = 1): Promise<CommitData[]> {
    const { data } = await this.octokit.repos.listCommits({
      owner,
      repo,
      per_page: perPage,
      page,
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
      stats: {
        additions: 0,
        deletions: 0,
        total: 0,
      },
      files: [],
    }));
  }

  async getContributors(owner: string, repo: string): Promise<ContributorData[]> {
    const { data } = await this.octokit.repos.listContributors({
      owner,
      repo,
      per_page: 100,
    });

    return data.map((contributor) => ({
      login: contributor.login || "unknown",
      avatar_url: contributor.avatar_url || "",
      contributions: contributor.contributions,
      first_commit: "",
      last_commit: "",
    }));
  }

  async buildStory(owner: string, repo: string): Promise<RepoStory> {
    const [repoInfo, commits, contributors] = await Promise.all([
      this.getRepoInfo(owner, repo),
      this.getCommits(owner, repo),
      this.getContributors(owner, repo),
    ]);

    const milestones = this.detectMilestones(commits, contributors, repoInfo);
    const stats = this.calculateStats(commits, contributors, repoInfo);

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
    repo: { created_at: string }
  ): MilestoneData[] {
    const milestones: MilestoneData[] = [];

    // İlk commit
    if (commits.length > 0) {
      const firstCommit = commits[commits.length - 1];
      milestones.push({
        type: "first-commit",
        date: firstCommit.date,
        title: "İlk Commit",
        description: `${firstCommit.author.name} projeyi başlattı`,
        sha: firstCommit.sha,
      });
    }

    // 100 commit milestone
    if (commits.length >= 100) {
      milestones.push({
        type: "100-commits",
        date: commits[commits.length - 100].date,
        title: "100. Commit!",
        description: "Proje 100 commit'e ulaştı",
      });
    }

    // Release commit'leri tespit et
    commits.forEach((commit) => {
      if (
        commit.message.match(/^(v?\d+\.\d+\.\d+|release|bump version)/i)
      ) {
        milestones.push({
          type: "release",
          date: commit.date,
          title: commit.message.split("\n")[0].slice(0, 60),
          description: "Yeni versiyon yayınlandı",
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
    repo: { created_at: string }
  ): RepoStats {
    const projectAge = Math.floor(
      (Date.now() - new Date(repo.created_at).getTime()) / (1000 * 60 * 60 * 24)
    );

    // En aktif gün
    const dayCount: Record<string, number> = {};
    commits.forEach((c) => {
      const day = new Date(c.date).toLocaleDateString("en-US", { weekday: "long" });
      dayCount[day] = (dayCount[day] || 0) + 1;
    });
    const mostActiveDay = Object.entries(dayCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "Unknown";

    // En aktif yazar
    const authorCount: Record<string, number> = {};
    commits.forEach((c) => {
      authorCount[c.author.login] = (authorCount[c.author.login] || 0) + 1;
    });
    const mostActiveAuthor = Object.entries(authorCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "Unknown";

    return {
      total_commits: commits.length,
      total_contributors: contributors.length,
      total_additions: commits.reduce((sum, c) => sum + c.stats.additions, 0),
      total_deletions: commits.reduce((sum, c) => sum + c.stats.deletions, 0),
      most_active_day: mostActiveDay,
      most_active_author: mostActiveAuthor,
      avg_commits_per_week: projectAge > 0 ? Math.round((commits.length / projectAge) * 7) : commits.length,
      project_age_days: projectAge,
    };
  }
}
