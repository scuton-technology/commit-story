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

interface LanguageBadgeStyle {
  background: string;
  color: string;
  border: string;
}

const LANGUAGE_BADGE_STYLES: Record<string, LanguageBadgeStyle> = {
  TypeScript: {
    background: "rgba(59,130,246,0.12)",
    color: "#93c5fd",
    border: "1px solid rgba(59,130,246,0.25)",
  },
  JavaScript: {
    background: "rgba(234,179,8,0.12)",
    color: "#fde047",
    border: "1px solid rgba(234,179,8,0.25)",
  },
  Python: {
    background: "rgba(34,197,94,0.12)",
    color: "#86efac",
    border: "1px solid rgba(34,197,94,0.25)",
  },
  Go: {
    background: "rgba(34,211,238,0.12)",
    color: "#67e8f9",
    border: "1px solid rgba(34,211,238,0.25)",
  },
  Rust: {
    background: "rgba(249,115,22,0.12)",
    color: "#fdba74",
    border: "1px solid rgba(249,115,22,0.25)",
  },
  C: {
    background: "rgba(148,163,184,0.1)",
    color: "#cbd5e1",
    border: "1px solid rgba(148,163,184,0.2)",
  },
};

const DEFAULT_LANGUAGE_STYLE: LanguageBadgeStyle = {
  background: "rgba(167,139,250,0.12)",
  color: "#c4b5fd",
  border: "1px solid rgba(167,139,250,0.25)",
};

export default function RepoHeader({ repo }: RepoHeaderProps) {
  const langStyle = LANGUAGE_BADGE_STYLES[repo.language] ?? DEFAULT_LANGUAGE_STYLE;

  return (
    <header
      className="glass rounded-2xl p-6"
      style={{
        background: "rgba(15,22,41,0.8)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(148,163,184,0.1)",
      }}
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-sm font-mono truncate"
              style={{ color: "#64748b" }}
            >
              {repo.full_name.split("/")[0]}
            </span>
            <span style={{ color: "#1e293b" }}>/</span>
            <h1 className="text-2xl font-bold truncate" style={{ color: "#f1f5f9" }}>
              {repo.name}
            </h1>
          </div>
          {repo.description && (
            <p
              className="text-sm mt-1 leading-relaxed max-w-2xl"
              style={{ color: "#94a3b8" }}
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
            border: "1px solid rgba(34,211,238,0.35)",
            color: "#22d3ee",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.background = "rgba(34,211,238,0.08)";
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
            background: langStyle.background,
            color: langStyle.color,
            border: langStyle.border,
          }}
        >
          <Code2 className="w-3 h-3" />
          {repo.language}
        </span>

        {/* Stars */}
        <span
          className="inline-flex items-center gap-1.5 text-xs"
          style={{ color: "#94a3b8" }}
        >
          <Star className="w-3.5 h-3.5" style={{ color: "#fbbf24" }} />
          <span className="font-mono font-medium" style={{ color: "#f1f5f9" }}>
            {formatCount(repo.stars)}
          </span>
          <span style={{ color: "#475569" }}>stars</span>
        </span>

        {/* Forks */}
        <span
          className="inline-flex items-center gap-1.5 text-xs"
          style={{ color: "#94a3b8" }}
        >
          <GitFork className="w-3.5 h-3.5" style={{ color: "#94a3b8" }} />
          <span className="font-mono font-medium" style={{ color: "#f1f5f9" }}>
            {formatCount(repo.forks)}
          </span>
          <span style={{ color: "#475569" }}>forks</span>
        </span>

        {/* Age */}
        {repo.created_at && (
          <span
            className="inline-flex items-center gap-1.5 text-xs"
            style={{ color: "#94a3b8" }}
          >
            <Calendar className="w-3.5 h-3.5" style={{ color: "#64748b" }} />
            <span>created {formatProjectAge(repo.created_at)} ago</span>
          </span>
        )}
      </div>
    </header>
  );
}
