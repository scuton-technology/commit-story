"use client";

import { Star, GitFork, ExternalLink, Calendar, Code2 } from "lucide-react";
import type { RepoStory } from "@/lib/github";

interface RepoHeaderProps {
  repo: RepoStory["repo"];
}

function formatProjectAge(createdAt: string): string {
  const days = Math.floor(
    (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24)
  );
  if (days < 30) return `${days} days`;
  if (days < 365) return `${Math.floor(days / 30)} months`;
  const years = Math.floor(days / 365);
  const months = Math.floor((days % 365) / 30);
  return months > 0 ? `${years}y ${months}mo` : `${years} years`;
}

function formatCount(count: number): string {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return count.toString();
}

export default function RepoHeader({ repo }: RepoHeaderProps) {
  return (
    <header
      className="rounded-2xl p-6"
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
      }}
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-sm truncate"
              style={{ color: "var(--text-secondary)" }}
            >
              {repo.full_name.split("/")[0]}
            </span>
            <span style={{ color: "var(--border)" }}>/</span>
            <h1 className="text-2xl font-bold truncate" style={{ color: "var(--text)" }}>
              {repo.name}
            </h1>
          </div>
          {repo.description && (
            <p
              className="text-sm mt-1 leading-relaxed max-w-2xl"
              style={{ color: "var(--text-secondary)" }}
            >
              {repo.description}
            </p>
          )}
        </div>

        <a
          href={`https://github.com/${repo.full_name}`}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl transition-all"
          style={{
            background: "transparent",
            border: "1px solid var(--accent)",
            color: "var(--accent)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.background = "var(--accent-light)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
          }}
          aria-label={`Open ${repo.full_name} on GitHub`}
        >
          <span>View on GitHub</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      <div className="flex flex-wrap items-center gap-3 mt-5">
        {/* Language badge */}
        <span
          className="inline-flex items-center gap-1.5 text-xs font-medium rounded-full px-3 py-1"
          style={{
            background: "var(--accent-light)",
            color: "var(--accent)",
          }}
        >
          <Code2 className="w-3 h-3" />
          {repo.language}
        </span>

        {/* Stars */}
        <span
          className="inline-flex items-center gap-1.5 text-xs"
          style={{ color: "var(--text-secondary)" }}
        >
          <Star className="w-3.5 h-3.5" style={{ color: "#eab308" }} />
          <span className="font-medium" style={{ color: "var(--text)" }}>
            {formatCount(repo.stars)}
          </span>
          <span style={{ color: "var(--text-tertiary)" }}>stars</span>
        </span>

        {/* Forks */}
        <span
          className="inline-flex items-center gap-1.5 text-xs"
          style={{ color: "var(--text-secondary)" }}
        >
          <GitFork className="w-3.5 h-3.5" style={{ color: "var(--text-tertiary)" }} />
          <span className="font-medium" style={{ color: "var(--text)" }}>
            {formatCount(repo.forks)}
          </span>
          <span style={{ color: "var(--text-tertiary)" }}>forks</span>
        </span>

        {/* Age */}
        {repo.created_at && (
          <span
            className="inline-flex items-center gap-1.5 text-xs"
            style={{ color: "var(--text-secondary)" }}
          >
            <Calendar className="w-3.5 h-3.5" style={{ color: "var(--text-tertiary)" }} />
            <span>created {formatProjectAge(repo.created_at)} ago</span>
          </span>
        )}
      </div>
    </header>
  );
}
