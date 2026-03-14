"use client";

import { useState } from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { Copy, Check } from "lucide-react";
import type { CommitData } from "@/lib/github";

interface StoryCardProps {
  commit: CommitData;
}

const AVATAR_PLACEHOLDER_COLORS = [
  "#22d3ee",
  "#a78bfa",
  "#34d399",
  "#f97316",
  "#fbbf24",
  "#f472b6",
];

function avatarColor(login: string): string {
  let hash = 0;
  for (let i = 0; i < login.length; i++) {
    hash = login.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_PLACEHOLDER_COLORS[Math.abs(hash) % AVATAR_PLACEHOLDER_COLORS.length] ?? "#22d3ee";
}

export default function StoryCard({ commit }: StoryCardProps) {
  const [copied, setCopied] = useState(false);
  const [hovered, setHovered] = useState(false);

  const shortSha = commit.sha.slice(0, 7);
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
        background: "rgba(15,22,41,0.8)",
        border: hovered
          ? "1px solid rgba(34,211,238,0.25)"
          : "1px solid rgba(148,163,184,0.1)",
        backdropFilter: "blur(12px)",
        boxShadow: hovered ? "0 0 16px rgba(34,211,238,0.06)" : "none",
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
              style={{ background: "rgba(30,41,59,0.8)" }}
            />
          ) : (
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-mono font-bold"
              aria-hidden="true"
              style={{
                background: `${placeholderColor}18`,
                color: placeholderColor,
                border: `1px solid ${placeholderColor}30`,
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
            <span className="text-sm font-semibold" style={{ color: "#e2e8f0" }}>
              {commit.author.name}
            </span>
            <span className="text-xs font-mono" style={{ color: "#475569" }}>
              @{commit.author.login}
            </span>
            <span className="text-xs" style={{ color: "#334155" }}>
              {timeAgo}
            </span>
          </div>

          {/* Commit message */}
          <p
            className="text-sm leading-snug font-medium break-words"
            style={{ color: "#cbd5e1" }}
          >
            {firstLine}
          </p>
          {body && (
            <p
              className="text-xs mt-1 leading-relaxed whitespace-pre-wrap"
              style={{
                color: "#475569",
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
                className="text-xs font-mono px-2 py-0.5 rounded"
                style={{
                  background: "rgba(30,41,59,0.8)",
                  color: "#64748b",
                }}
              >
                {shortSha}
              </code>
              <button
                type="button"
                onClick={handleCopy}
                aria-label={`Copy SHA: ${shortSha}`}
                className="p-0.5 rounded transition-colors"
                style={{ color: "#475569" }}
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5" style={{ color: "#22d3ee" }} />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {/* Files count */}
            {commit.files.length > 0 && (
              <span
                className="text-xs font-mono"
                style={{ color: "#334155" }}
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
