"use client";

import { useState } from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { Copy, Check } from "lucide-react";
import type { CommitData } from "@/lib/github";

interface StoryCardProps {
  commit: CommitData;
}

const COMMIT_TYPES: Record<string, { color: string; label: string }> = {
  feat:     { color: "#059669", label: "feat" },
  fix:      { color: "#dc2626", label: "fix" },
  refactor: { color: "#7c3aed", label: "refactor" },
  docs:     { color: "#2563eb", label: "docs" },
  chore:    { color: "#6b7280", label: "chore" },
  test:     { color: "#ea580c", label: "test" },
  ci:       { color: "#6b7280", label: "ci" },
  style:    { color: "#ec4899", label: "style" },
  perf:     { color: "#eab308", label: "perf" },
  build:    { color: "#6b7280", label: "build" },
  revert:   { color: "#dc2626", label: "revert" },
};

function parseCommitType(message: string) {
  const match = message.match(/^(\w+)(\(.+\))?!?:\s/);
  if (match?.[1]) return COMMIT_TYPES[match[1]] ?? null;
  return null;
}

const AVATAR_PLACEHOLDER_COLORS = [
  "#2563eb",
  "#7c3aed",
  "#059669",
  "#ea580c",
  "#eab308",
  "#ec4899",
];

function avatarColor(login: string): string {
  let hash = 0;
  for (let i = 0; i < login.length; i++) {
    hash = login.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_PLACEHOLDER_COLORS[Math.abs(hash) % AVATAR_PLACEHOLDER_COLORS.length] ?? "#2563eb";
}

export default function StoryCard({ commit }: StoryCardProps) {
  const [copied, setCopied] = useState(false);
  const [hovered, setHovered] = useState(false);

  const shortSha = commit.sha.slice(0, 7);
  const commitType = parseCommitType(commit.message);
  const [firstLine, ...restLines] = commit.message.split("\n");
  const body = restLines.filter(Boolean).join("\n").trim();

  const timeAgo = commit.date
    ? formatDistanceToNow(new Date(commit.date), { addSuffix: true })
    : "";

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(commit.sha);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available — silent fail
    }
  }

  const avatarSrc = commit.author.avatar_url || "";
  const placeholderColor = avatarColor(commit.author.login);

  return (
    <article
      className="rounded-xl p-4 transition-all"
      style={{
        background: "var(--card)",
        border: hovered
          ? "1px solid var(--accent)"
          : "1px solid var(--border)",
        boxShadow: hovered ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="shrink-0">
          {avatarSrc ? (
            <Image
              src={avatarSrc}
              alt={`${commit.author.login}'s avatar`}
              width={40}
              height={40}
              className="rounded-full"
              unoptimized
              style={{ background: "var(--bg-secondary)" }}
            />
          ) : (
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold"
              aria-hidden="true"
              style={{
                background: `${placeholderColor}15`,
                color: placeholderColor,
              }}
            >
              {commit.author.name.slice(0, 2).toUpperCase()}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header row */}
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mb-1.5">
            <span className="text-sm font-semibold" style={{ color: "var(--text)" }}>
              {commit.author.name}
            </span>
            <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
              @{commit.author.login}
            </span>
            <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
              {timeAgo}
            </span>
          </div>

          {/* Commit message */}
          <div className="flex flex-wrap items-start gap-2">
            {commitType && (
              <span
                className="shrink-0 text-xs font-medium px-1.5 py-0.5 rounded"
                style={{
                  color: commitType.color,
                  background: `${commitType.color}12`,
                }}
              >
                {commitType.label}
              </span>
            )}
            <p
              className="text-sm leading-snug font-medium break-words flex-1 min-w-0"
              style={{ color: "var(--text-secondary)" }}
            >
              {firstLine}
            </p>
          </div>
          {body && (
            <p
              className="text-xs mt-1 leading-relaxed whitespace-pre-wrap"
              style={{
                color: "var(--text-tertiary)",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {body}
            </p>
          )}

          {/* Footer */}
          <div className="flex flex-wrap items-center gap-3 mt-3">
            {/* SHA + copy */}
            <div className="flex items-center gap-1">
              <code
                className="text-xs px-2 py-0.5 rounded"
                style={{
                  background: "var(--code-bg)",
                  color: "var(--text-secondary)",
                }}
              >
                {shortSha}
              </code>
              <button
                type="button"
                onClick={handleCopy}
                aria-label={`Copy SHA: ${shortSha}`}
                className="p-0.5 rounded transition-colors"
                style={{ color: "var(--text-tertiary)" }}
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5" style={{ color: "var(--accent)" }} />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {/* Files count */}
            {commit.files.length > 0 && (
              <span
                className="text-xs"
                style={{ color: "var(--text-tertiary)" }}
              >
                {commit.files.length} {commit.files.length === 1 ? "file" : "files"}
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
